import React, { useState, useEffect, useRef } from 'react';
import { useLiteMode } from '../../context/LiteModeContext';
import { 
  Zap, 
  Image as ImageIcon, 
  Eye, 
  Sparkles, 
  AlertCircle,
  Building2
} from 'lucide-react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean; // If true, eager load without lazy
  fallbackSrc?: string;
  showHdBadge?: boolean;
  aspectRatio?: string; // e.g. 'aspect-video' or 'aspect-square'
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  width,
  height,
  priority = false,
  fallbackSrc,
  showHdBadge = false,
  aspectRatio,
  ...restProps
}) => {
  const { isLiteMode, imageQuality, getOptimizedUrl, trackImageSaved } = useLiteMode();
  
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [forceHd, setForceHd] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(priority);

  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy loading observer
  useEffect(() => {
    if (priority || isInView) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '180px 0px', // Pre-fetch 180px before entering viewport for smooth scrolling
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Determine current effective URL
  const effectiveUrl = React.useMemo(() => {
    if (!src) return '';
    if (forceHd) return src;
    if (isLiteMode) {
      return getOptimizedUrl(src, width, height);
    }
    return src;
  }, [src, isLiteMode, forceHd, width, height, getOptimizedUrl]);

  // Reset states on src change
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setForceHd(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    // Track rough data saving if in lite mode and not forced HD
    if (isLiteMode && !forceHd && src && src.includes('unsplash.com')) {
      const estimatedOriginal = 320000; // ~320 KB
      const estimatedCompressed = 38000; // ~38 KB
      trackImageSaved(estimatedOriginal, estimatedCompressed);
    }
  };

  const handleImageError = () => {
    if (fallbackSrc && effectiveUrl !== fallbackSrc) {
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-100 ${aspectRatio || ''} ${containerClassName}`}
    >
      {/* Skeleton / Low-overhead shimmer while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
          <ImageIcon className="w-6 h-6 opacity-30 animate-bounce" />
        </div>
      )}

      {/* Fallback Display on Connection Error */}
      {hasError ? (
        <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-500 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
          <Building2 className="w-7 h-7 text-emerald-600/60" />
          <p className="text-xs font-semibold text-slate-700">{alt || 'Dokumentasi Desa Brabo'}</p>
          <span className="text-[10px] text-slate-400">Gambar dihemat atau sinyal internet lambat</span>
        </div>
      ) : (
        isInView && (
          <img
            src={effectiveUrl}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            {...restProps}
          />
        )
      )}

      {/* Lite Mode Badge & HD switch button if requested */}
      {isLiteMode && isLoaded && !hasError && showHdBadge && (
        <div className="absolute bottom-2 right-2 z-10">
          {!forceHd ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setForceHd(true);
              }}
              title="Ketuk untuk memuat gambar kualitas tinggi (HD)"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-semibold text-emerald-300 border border-emerald-500/40 shadow-sm hover:bg-slate-950 transition-colors"
            >
              <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>Lite (Hemat)</span>
              <span className="text-slate-400 hover:text-white underline ml-0.5">HD</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/85 text-[10px] font-bold text-white border border-slate-700 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
              <span>HD Aktif</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
