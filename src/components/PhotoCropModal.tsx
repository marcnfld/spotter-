import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Check, RotateCw, ZoomIn, ZoomOut, Maximize2, 
  RefreshCcw, Move, Sliders, Crop, Compass 
} from 'lucide-react';

interface PhotoCropModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onSaveCrop: (croppedDataUrl: string) => void;
}

export const PhotoCropModal: React.FC<PhotoCropModalProps> = ({
  isOpen,
  imageUrl,
  onClose,
  onSaveCrop
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1);

  // Reset transforms whenever a new image opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Touch and mouse drag handlers for repositioning the car
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    initialOffsetRef.current = { ...offset };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    setOffset({
      x: initialOffsetRef.current.x + dx,
      y: initialOffsetRef.current.y + dy
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Mobile pinch-to-zoom handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && initialPinchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / initialPinchDistRef.current;
      const newZoom = Math.min(Math.max(initialZoomRef.current * scale, 1), 3.5);
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    initialPinchDistRef.current = null;
    handlePointerUp();
  };

  // Center & Reset
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Rotate 90 degrees
  const handleRotate90 = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Crop & Export to Canvas
  const handleApplyCrop = () => {
    if (!imageUrl || !containerRef.current || !imageRef.current) return;

    const img = imageRef.current;
    const cropContainer = containerRef.current.getBoundingClientRect();

    // Determine target canvas size (e.g. 1200x675 for 16:9, ~75KB optimal payload)
    let targetWidth = 1200;
    let targetHeight = 675;
    if (aspectRatio === '4:3') {
      targetWidth = 1200;
      targetHeight = 900;
    } else if (aspectRatio === '1:1') {
      targetWidth = 1000;
      targetHeight = 1000;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // High quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Background fill (deep carbon neutral)
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Calculate scale factor between UI viewport and target canvas
    const scaleFactor = targetWidth / cropContainer.width;

    ctx.save();
    // Move to center of canvas
    ctx.translate(targetWidth / 2, targetHeight / 2);

    // Apply User Offsets, Rotation, and Zoom
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate image render dimensions maintaining aspect ratio inside crop container
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = cropContainer.width / cropContainer.height;

    let drawWidth: number;
    let drawHeight: number;

    if (imgAspect > containerAspect) {
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgAspect;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgAspect;
    }

    // Draw centered image
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Export optimized data URL
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.85);
    onSaveCrop(croppedUrl);
    onClose();
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200">
      
      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 pt-safe text-white border-b border-zinc-800/80 bg-black/70">
        <button
          onClick={onClose}
          className="h-9 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-200">
            Center & Frame Car
          </span>
        </div>

        <button
          onClick={handleApplyCrop}
          className="h-9 px-4 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Check className="w-4 h-4 text-zinc-950" />
          <span>Save Crop</span>
        </button>
      </div>

      {/* Main Viewport & Crop Framing Area */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden touch-none">
        
        {/* Aspect Ratio Framing Container */}
        <div
          ref={containerRef}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{
            aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '4:3' ? '4/3' : '1/1'
          }}
          className="relative w-full max-w-2xl max-h-[60vh] bg-zinc-950 border-2 border-amber-400/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing"
        >
          {/* Transforming Image */}
          <div
            className="w-full h-full flex items-center justify-center will-change-transform"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 100ms ease-out'
            }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop target"
              crossOrigin="anonymous"
              draggable={false}
              className="max-w-none w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Viewfinder Overlays & Reticles (Only visual, pointer-events none) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark vignette border shadow */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />

            {/* Viewfinder corner brackets in signature amber gold */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-400" />

            {/* Rule of Thirds Grid for centering vehicle */}
            {showGrid && (
              <>
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />

                {/* Center alignment reticle for hood/grill/badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-400/80" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-amber-400/80" />
                  <div className="w-full h-full rounded-full border border-amber-400/60" />
                </div>
              </>
            )}

            {/* Drag helper hint */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
              <Move className="w-3 h-3 text-amber-400" />
              <span>Drag to center · Pinch to zoom</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Toolset: Zoom, Rotation, Aspect Ratio & Leveling */}
      <div className="relative z-20 pb-safe p-4 sm:p-5 bg-gradient-to-t from-black via-zinc-950 to-transparent border-t border-zinc-800/80 space-y-3.5">
        
        {/* Controls Row 1: Aspect Ratio Tabs & Reset */}
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                  aspectRatio === ratio
                    ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          {/* Grid Toggle & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              title="Toggle Alignment Grid"
              className={`h-8 px-2.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                showGrid
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <span>Grid</span>
            </button>
            <button
              onClick={handleRotate90}
              title="Rotate 90°"
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              title="Reset Position"
              className="h-8 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Controls Row 2: Zoom Slider */}
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => setZoom((prev) => Math.max(1, prev - 0.1))}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer shrink-0"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0">
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-mono text-zinc-300 w-10 text-right tabular-nums shrink-0">
              {zoom.toFixed(1)}x
            </span>
          </div>

          <button
            onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer shrink-0"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Controls Row 3: Rotation Leveling Slider (Straighten tilted car shots) */}
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0 flex items-center gap-1">
              <Compass className="w-3 h-3 text-zinc-400" />
              <span>Level</span>
            </span>
            <input
              type="range"
              min={-45}
              max={45}
              step={0.5}
              value={rotation}
              onChange={(e) => setRotation(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-mono text-zinc-300 w-10 text-right tabular-nums shrink-0">
              {rotation > 0 ? `+${rotation}°` : `${rotation}°`}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
