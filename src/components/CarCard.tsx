import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Bookmark, MapPin } from 'lucide-react';
import { CarSpot } from '../types/spotter';
import { RARITY_CONFIG } from '../data/carCatalog';
import { ImageWithFallback } from './ImageWithFallback';

interface CarCardProps {
  spot: CarSpot;
  onSelect: (spot: CarSpot) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  spot,
  onSelect,
  onToggleLike,
  onToggleSave
}) => {
  const [photoIndex, setPhotoIndex] = useState(spot.coverPhotoIndex || 0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const justSwipedRef = useRef<boolean>(false);

  const rarityInfo = RARITY_CONFIG[spot.rarity];
  const totalPhotos = spot.photos.length;

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  };

  // Touch handlers for mobile swipe while preserving vertical page scrolling
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

    // Detect gesture axis once movement threshold passed
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 7 || Math.abs(deltaY) > 7) {
        if (Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
          // Dominant horizontal movement -> user is swiping photos
          isHorizontalSwipeRef.current = true;
          setIsDragging(true);
        } else {
          // Dominant vertical movement -> allow browser vertical scroll
          isHorizontalSwipeRef.current = false;
        }
      }
    }

    if (isHorizontalSwipeRef.current) {
      // Rubber-band resistance on edge boundaries
      let offset = deltaX;
      if ((photoIndex === 0 && deltaX > 0) || (photoIndex === totalPhotos - 1 && deltaX < 0)) {
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
      justSwipedRef.current = true;
      setTimeout(() => {
        justSwipedRef.current = false;
      }, 120);

      if (deltaX < 0) {
        // Swiped Left -> Next Photo
        setPhotoIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
      } else {
        // Swiped Right -> Prev Photo
        setPhotoIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
      }
    }

    touchStartRef.current = null;
    isHorizontalSwipeRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  // Format date cleanly
  const formattedDate = new Date(spot.spottedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      onClick={() => {
        if (!justSwipedRef.current) {
          onSelect(spot);
        }
      }}
      className="group relative bg-[#121216] rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col cursor-pointer"
    >
      {/* Visual media container with swipeable large photo gallery */}
      <div 
        className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-zinc-950 overflow-hidden select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Horizontal sliding track for smooth photo transitions */}
        <div 
          className="flex h-full w-full will-change-transform"
          style={{
            transform: `translateX(calc(-${photoIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {spot.photos.map((photoUrl, idx) => (
            <div key={idx} className="w-full h-full shrink-0 relative">
              <ImageWithFallback
                src={photoUrl}
                alt={`${spot.make} ${spot.model} photo ${idx + 1}`}
                fallbackTitle={`${spot.make} ${spot.model}`}
                fallbackSubtitle={spot.variant || spot.location}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>

        {/* Ambient dark gradient overlay for typography readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-black/40 pointer-events-none" />

        {/* Top bar over photo: Rarity & Quick Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Rarity label - modern dark styling */}
          <div className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase border backdrop-blur-md flex items-center gap-1.5 ${rarityInfo.badge} ${rarityInfo.glow}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${rarityInfo.dot}`} />
            <span>{rarityInfo.label}</span>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => onToggleSave(spot.id, e)}
              aria-label="Save vehicle"
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center border transition-all cursor-pointer ${
                spot.isSaved
                  ? 'bg-amber-400 text-zinc-950 border-amber-400'
                  : 'bg-black/40 text-zinc-300 border-white/10 hover:bg-black/60 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${spot.isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => onToggleLike(spot.id, e)}
              aria-label="Like spot"
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-zinc-300 hover:text-rose-400 hover:bg-black/60 transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-photo controls if > 1 photo */}
        {totalPhotos > 1 && (
          <>
            {/* Desktop / Clickable Arrows */}
            <button
              onClick={handlePrevPhoto}
              aria-label="Previous photo"
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPhoto}
              aria-label="Next photo"
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Photo count indicator */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 tracking-wider border border-white/10 pointer-events-none">
              {photoIndex + 1} / {totalPhotos}
            </div>

            {/* Thumbnail dots indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 pointer-events-none">
              {spot.photos.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    idx === photoIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Make & Model Heading */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 font-semibold">
              {spot.make}
            </span>
            {spot.year && (
              <span className="text-xs font-mono text-zinc-500 tabular-nums">
                {spot.year}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
            {spot.model}
          </h3>

          {/* Special Variant if present */}
          {spot.variant ? (
            <p className="text-xs text-amber-300/90 font-medium tracking-wide mt-0.5 line-clamp-1">
              {spot.variant}
            </p>
          ) : (
            <p className="text-xs text-zinc-500 mt-0.5">&nbsp;</p>
          )}

          {/* Unboxed Metadata Strip (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-800/80">
            <div className="flex items-center gap-1 truncate text-zinc-300">
              <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{spot.location}</span>
            </div>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500 font-mono shrink-0">{formattedDate}</span>
          </div>
        </div>

        {/* Specs footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-3">
            {spot.specs.hp && (
              <span className="text-zinc-300 font-semibold tabular-nums">
                {spot.specs.hp} <span className="text-zinc-500 font-normal">HP</span>
              </span>
            )}
            {spot.specs.zeroToSixtySec && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-300 tabular-nums">
                  {spot.specs.zeroToSixtySec}s <span className="text-zinc-500 font-normal">0-60</span>
                </span>
              </>
            )}
          </div>

          {spot.specs.estValue && (
            <span className="text-zinc-400 text-[11px] font-mono tracking-tight">
              {spot.specs.estValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
