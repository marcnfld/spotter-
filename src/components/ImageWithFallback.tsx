import React, { useState } from 'react';
import { Camera, ShieldAlert } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Spotted Vehicle',
  fallbackTitle,
  fallbackSubtitle,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-[#141418] to-zinc-950 p-6 text-center select-none ${className}`}>
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '16px 16px'
          }}
        />
        
        {/* Viewfinder corner crosshairs */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-zinc-600/60 pointer-events-none" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-zinc-600/60 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-zinc-600/60 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-zinc-600/60 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 mb-2">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-zinc-200 tracking-wide uppercase font-mono">
            {fallbackTitle || 'Vehicle Image'}
          </span>
          {fallbackSubtitle && (
            <span className="text-[11px] text-zinc-500 mt-0.5">
              {fallbackSubtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loader shimmer before image renders */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};
