import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Sliders } from 'lucide-react';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [flashAnimation, setFlashAnimation] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      return;
    }

    let activeStream: MediaStream | null = null;

    async function startCamera() {
      setCameraError(null);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });

        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        console.warn('Direct camera stream failed:', err);
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera permission denied. You can still use the native iPhone camera button.'
            : 'Unable to access live camera feed on this device. Please use the camera upload button.'
        );
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Trigger visual flash
    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 200);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCapture(dataUrl);
      onClose();
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between">
      {/* Visual Flash effect */}
      {flashAnimation && (
        <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-200 pointer-events-none" />
      )}

      {/* Top HUD Controls */}
      <div className="relative z-20 flex items-center justify-between p-4 pt-safe text-white bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-mono tracking-widest text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>SPOTTER LIVE HUD</span>
        </div>

        <button
          onClick={toggleFacingMode}
          className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Viewfinder Canvas Area */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="p-6 text-center max-w-sm mx-auto text-zinc-300">
            <Camera className="w-12 h-12 mx-auto text-zinc-500 mb-3" />
            <p className="text-sm font-medium mb-4">{cameraError}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
            >
              Back to Form
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />

            {/* Viewfinder Framing Grid & Reticles */}
            <div className="absolute inset-8 pointer-events-none border border-white/20 rounded-xl">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

              {/* Center Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-40">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
              </div>

              {/* Rule of Thirds subtle lines */}
              <div className="absolute top-1/3 left-0 right-0 h-px border-t border-dashed border-white/15" />
              <div className="absolute top-2/3 left-0 right-0 h-px border-t border-dashed border-white/15" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px border-l border-dashed border-white/15" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px border-l border-dashed border-white/15" />
            </div>
          </>
        )}
      </div>

      {/* Bottom Shutter Zone */}
      <div className="relative z-20 pb-safe p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex items-center justify-around">
        <div className="w-12 text-center text-[10px] font-mono text-zinc-400">
          RAW · 4K
        </div>

        {/* Shutter Button */}
        <button
          onClick={handleCapture}
          disabled={!!cameraError}
          className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-90 transition-transform cursor-pointer disabled:opacity-30"
          aria-label="Capture photo"
        >
          <div className="w-full h-full rounded-full bg-white hover:bg-zinc-200 transition-colors shadow-lg" />
        </button>

        <div className="w-12 text-center text-[10px] font-mono text-zinc-400">
          HDR
        </div>
      </div>
    </div>
  );
};
