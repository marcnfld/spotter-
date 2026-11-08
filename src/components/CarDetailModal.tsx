import React, { useState, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Heart, Bookmark, 
  MapPin, Calendar, User, Gauge, Shield, Plus, 
  Share2, Trash2, Check, Sparkles, Crop 
} from 'lucide-react';
import { CarSpot } from '../types/spotter';
import { RARITY_CONFIG } from '../data/carCatalog';
import { ImageWithFallback } from './ImageWithFallback';
import { PhotoCropModal } from './PhotoCropModal';

interface CarDetailModalProps {
  spot: CarSpot | null;
  onClose: () => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onAddPhotoToSpot: (spotId: string, newPhotoUrls: string[]) => void;
  onDeleteSpot: (spotId: string) => void;
  onUpdateSpotPhoto?: (spotId: string, photoIndex: number, newUrl: string) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  spot,
  onClose,
  onToggleLike,
  onToggleSave,
  onAddPhotoToSpot,
  onDeleteSpot,
  onUpdateSpotPhoto
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCroppingCurrent, setIsCroppingCurrent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const addPhotoInputRef = useRef<HTMLInputElement>(null);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  if (!spot) return null;

  const rarityInfo = RARITY_CONFIG[spot.rarity];
  const totalPhotos = spot.photos.length;

  const handleNext = () => {
    setActivePhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  };

  // Touch handlers for mobile swipe while allowing smooth vertical scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (totalPhotos <= 1) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    isHorizontalSwipeRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || totalPhotos <= 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 7 || Math.abs(deltaY) > 7) {
        if (Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
          isHorizontalSwipeRef.current = true;
          setIsDragging(true);
        } else {
          isHorizontalSwipeRef.current = false;
        }
      }
    }

    if (isHorizontalSwipeRef.current) {
      let offset = deltaX;
      if ((activePhotoIndex === 0 && deltaX > 0) || (activePhotoIndex === totalPhotos - 1 && deltaX < 0)) {
        offset = deltaX * 0.35;
      }
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || totalPhotos <= 1) {
      touchStartRef.current = null;
      isHorizontalSwipeRef.current = null;
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const deltaX = dragOffset;
    const elapsed = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(deltaX) / (elapsed || 1);

    if (isHorizontalSwipeRef.current && (Math.abs(deltaX) > 35 || velocity > 0.25)) {
      if (deltaX < 0) {
        setActivePhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
      } else {
        setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
      }
    }

    touchStartRef.current = null;
    isHorizontalSwipeRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const urls: string[] = [];
    let processed = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          urls.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          onAddPhotoToSpot(spot.id, urls);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Spotted: ${spot.make} ${spot.model}`,
        text: `Check out this ${spot.rarity.toUpperCase()} spot: ${spot.make} ${spot.model} in ${spot.location}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formattedDate = new Date(spot.spottedAt).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="relative w-full max-w-4xl bg-[#121216] border border-zinc-800 rounded-t-3xl sm:rounded-2xl max-h-[94vh] sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS sheet handle for mobile */}
        <div className="sm:hidden w-10 h-1 bg-zinc-700 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wider uppercase border ${rarityInfo.badge} ${rarityInfo.glow}`}>
              {rarityInfo.label}
            </span>
            <span className="text-xs font-mono text-zinc-400">
              ENTRY #{spot.id.replace('spot-', '')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share spot"
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={(e) => onToggleSave(spot.id, e)}
              title="Save vehicle"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                spot.isSaved ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${spot.isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content: Scrollable */}
        <div className="overflow-y-auto flex-1">
          {/* Main Visual Display with Swipeable sliding track */}
          <div 
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black select-none overflow-hidden touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            {/* Sliding Track */}
            <div 
              className="flex h-full w-full will-change-transform"
              style={{
                transform: `translateX(calc(-${activePhotoIndex * 100}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {spot.photos.map((photoUrl, idx) => (
                <div key={idx} className="w-full h-full shrink-0 relative">
                  <ImageWithFallback
                    src={photoUrl}
                    alt={`${spot.make} ${spot.model} angle ${idx + 1}`}
                    fallbackTitle={`${spot.make} ${spot.model}`}
                    fallbackSubtitle={spot.variant || spot.location}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Photo Navigation Arrows */}
            {totalPhotos > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center backdrop-blur-sm transition-all cursor-pointer z-10"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center backdrop-blur-sm transition-all cursor-pointer z-10"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-xs font-mono text-zinc-300 border border-white/10 pointer-events-none">
                  {activePhotoIndex + 1} / {totalPhotos} Angles
                </div>
              </>
            )}
          </div>

          {/* Thumbnails Bar & Add Photo Button */}
          <div className="p-4 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto">
            {spot.photos.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                  activePhotoIndex === idx
                    ? 'border-white ring-2 ring-white/30 scale-105'
                    : 'border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}

            {/* Crop / Re-center active photo button */}
            <button
              onClick={() => setIsCroppingCurrent(true)}
              title="Crop & Center Vehicle"
              className="h-12 px-3 rounded-lg border border-zinc-700/80 hover:border-amber-400 bg-zinc-900/60 flex items-center gap-1.5 text-zinc-300 hover:text-white shrink-0 transition-colors cursor-pointer text-xs font-mono"
            >
              <Crop className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Center Photo</span>
              <span className="sm:hidden">Center</span>
            </button>

            {/* Add More Photos input */}
            <button
              onClick={() => addPhotoInputRef.current?.click()}
              className="w-16 h-12 rounded-lg border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 flex flex-col items-center justify-center text-zinc-400 hover:text-white shrink-0 transition-colors cursor-pointer text-[10px]"
            >
              <Plus className="w-4 h-4 mb-0.5" />
              <span>Add</span>
            </button>
            <input
              ref={addPhotoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddPhotos}
            />
          </div>

          {/* Dossier Details */}
          <div className="p-5 sm:p-7 space-y-6">
            
            {/* Title & Make */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                {spot.make}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                {spot.model}
              </h1>
              {spot.variant && (
                <p className="text-sm sm:text-base font-medium text-amber-300 mt-1">
                  {spot.variant}
                </p>
              )}
            </div>

            {/* Zero-Pill Unboxed Location & Spotter Bar */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-400 py-3 border-y border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-zinc-200">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span>{spot.location}</span>
              </div>
              <span className="text-zinc-600">·</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span className="font-mono">{formattedDate}</span>
              </div>
              <span className="text-zinc-600">·</span>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-500" />
                <span>Spotted by <strong className="text-zinc-200">{spot.spotter}</strong></span>
              </div>
            </div>

            {/* Rarity Dossier Card */}
            <div className={`p-4 rounded-xl border ${rarityInfo.bg} ${rarityInfo.border}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className={`w-4 h-4 ${rarityInfo.text}`} />
                <h3 className={`text-xs font-mono font-bold tracking-wider uppercase ${rarityInfo.text}`}>
                  {rarityInfo.label} Classification Rationale
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {spot.rarityReason}
              </p>
            </div>

            {/* Performance & Valuation Grid */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Output Power
                  </span>
                  <span className="text-lg font-bold text-white font-mono tabular-nums">
                    {spot.specs.hp ? `${spot.specs.hp} HP` : 'N/A'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    0-60 MPH Acceleration
                  </span>
                  <span className="text-lg font-bold text-white font-mono tabular-nums">
                    {spot.specs.zeroToSixtySec ? `${spot.specs.zeroToSixtySec}s` : 'N/A'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Top Speed
                  </span>
                  <span className="text-lg font-bold text-white font-mono tabular-nums">
                    {spot.specs.topSpeedMph ? `${spot.specs.topSpeedMph} MPH` : 'N/A'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Powertrain
                  </span>
                  <span className="text-xs font-medium text-zinc-200 truncate block">
                    {spot.specs.engine || 'Bespoke Engine'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Estimated Valuation
                  </span>
                  <span className="text-sm font-bold text-amber-300 font-mono">
                    {spot.specs.estValue || 'Market Valuation'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    Exclusivity Volume
                  </span>
                  <span className="text-xs font-medium text-zinc-200 truncate block">
                    {spot.specs.productionUnits || 'Limited Allocation'}
                  </span>
                </div>
              </div>
            </div>

            {/* Field Notes if present */}
            {spot.notes && (
              <div>
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Spotter Field Notes
                </h3>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "{spot.notes}"
                </div>
              </div>
            )}

            {/* Bottom Actions: Like, Delete */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between pb-safe">
              <button
                onClick={(e) => onToggleLike(spot.id, e)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{spot.likes} Spotters Upvoted</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Remove this spot for ${spot.make} ${spot.model}?`)) {
                    onDeleteSpot(spot.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Spot</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Photo Crop & Reposition Screen */}
      <PhotoCropModal
        isOpen={isCroppingCurrent && activePhotoIndex < spot.photos.length}
        imageUrl={activePhotoIndex < spot.photos.length ? spot.photos[activePhotoIndex] : null}
        onClose={() => setIsCroppingCurrent(false)}
        onSaveCrop={(croppedUrl) => {
          if (onUpdateSpotPhoto) {
            onUpdateSpotPhoto(spot.id, activePhotoIndex, croppedUrl);
          }
          setIsCroppingCurrent(false);
        }}
      />
    </div>
  );
};
