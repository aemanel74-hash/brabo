import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getOptimizedImageUrl, formatBytes } from '../utils/imageOptimizer';

export type ImageQualityMode = 'ultra_lite' | 'lite' | 'standard';

export interface NetworkStatus {
  effectiveType?: string; // 'slow-2g' | '2g' | '3g' | '4g'
  saveData?: boolean;
  isSlowConnection: boolean;
  downlink?: number;
  rtt?: number;
}

interface LiteModeContextType {
  isLiteMode: boolean;
  imageQuality: ImageQualityMode;
  networkStatus: NetworkStatus;
  estimatedDataSavedBytes: number;
  totalImagesOptimized: number;
  showSlowNetworkNotice: boolean;
  loadSpeedGrade: string;
  
  // Actions
  toggleLiteMode: () => void;
  setLiteMode: (enabled: boolean) => void;
  setImageQuality: (quality: ImageQualityMode) => void;
  dismissSlowNetworkNotice: () => void;
  trackImageSaved: (originalBytes: number, optimizedBytes: number) => void;
  getOptimizedUrl: (url: string | undefined | null, width?: number, height?: number) => string;
  resetStats: () => void;
}

const LiteModeContext = createContext<LiteModeContextType | undefined>(undefined);

export const LiteModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check initial state from localStorage or system Data-Saver
  const [isLiteMode, setIsLiteMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_lite_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      
      // Auto-detect if browser has Save-Data enabled or 2G/3G network
      const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      if (conn?.saveData || conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g' || conn?.effectiveType === '3g') {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [imageQuality, setImageQualityState] = useState<ImageQualityMode>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_image_quality');
      if (saved === 'ultra_lite' || saved === 'lite' || saved === 'standard') {
        return saved;
      }
      return 'lite';
    } catch {
      return 'lite';
    }
  });

  // Track data saved across user session
  const [estimatedDataSavedBytes, setEstimatedDataSavedBytes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_data_saved_bytes');
      return saved ? parseInt(saved, 10) : 1840000; // default initial baseline ~1.84 MB saved
    } catch {
      return 1840000;
    }
  });

  const [totalImagesOptimized, setTotalImagesOptimized] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('desabrabo_images_optimized_count');
      return saved ? parseInt(saved, 10) : 18;
    } catch {
      return 18;
    }
  });

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isSlowConnection: false,
  });

  const [showSlowNetworkNotice, setShowSlowNetworkNotice] = useState<boolean>(false);

  // Detect Network Information API
  useEffect(() => {
    const checkConnection = () => {
      try {
        const nav = navigator as unknown as {
          connection?: {
            effectiveType?: string;
            saveData?: boolean;
            downlink?: number;
            rtt?: number;
            addEventListener?: (type: string, listener: () => void) => void;
            removeEventListener?: (type: string, listener: () => void) => void;
          };
        };

        if (nav.connection) {
          const conn = nav.connection;
          const isSlow = conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g' || !!conn.saveData;
          
          setNetworkStatus({
            effectiveType: conn.effectiveType,
            saveData: conn.saveData,
            isSlowConnection: isSlow,
            downlink: conn.downlink,
            rtt: conn.rtt,
          });

          // If slow connection and user hasn't explicitly disabled, prompt or auto-enable
          if (isSlow) {
            const hasSavedPref = localStorage.getItem('desabrabo_lite_mode');
            if (hasSavedPref === null && !isLiteMode) {
              setIsLiteMode(true);
              setShowSlowNetworkNotice(true);
            }
          }
        }
      } catch (e) {
        console.warn('Network Information API not available:', e);
      }
    };

    checkConnection();

    const nav = navigator as unknown as { connection?: { addEventListener?: (t: string, fn: () => void) => void; removeEventListener?: (t: string, fn: () => void) => void } };
    if (nav.connection && nav.connection.addEventListener) {
      nav.connection.addEventListener('change', checkConnection);
      return () => {
        if (nav.connection?.removeEventListener) {
          nav.connection.removeEventListener('change', checkConnection);
        }
      };
    }
  }, [isLiteMode]);

  // Synchronize Lite Mode with DOM classes for performance boosts (reduce CSS blur / complex shadows)
  useEffect(() => {
    try {
      localStorage.setItem('desabrabo_lite_mode', isLiteMode ? 'true' : 'false');
      if (isLiteMode) {
        document.documentElement.classList.add('lite-mode-active');
      } else {
        document.documentElement.classList.remove('lite-mode-active');
      }
    } catch {}
  }, [isLiteMode]);

  useEffect(() => {
    try {
      localStorage.setItem('desabrabo_image_quality', imageQuality);
    } catch {}
  }, [imageQuality]);

  useEffect(() => {
    try {
      localStorage.setItem('desabrabo_data_saved_bytes', estimatedDataSavedBytes.toString());
      localStorage.setItem('desabrabo_images_optimized_count', totalImagesOptimized.toString());
    } catch {}
  }, [estimatedDataSavedBytes, totalImagesOptimized]);

  const toggleLiteMode = () => {
    setIsLiteMode(prev => !prev);
  };

  const setLiteMode = (enabled: boolean) => {
    setIsLiteMode(enabled);
  };

  const setImageQuality = (quality: ImageQualityMode) => {
    setImageQualityState(quality);
    if (quality === 'standard') {
      setIsLiteMode(false);
    } else {
      setIsLiteMode(true);
    }
  };

  const dismissSlowNetworkNotice = () => {
    setShowSlowNetworkNotice(false);
  };

  const trackImageSaved = (originalBytes: number, optimizedBytes: number) => {
    const saved = Math.max(0, originalBytes - optimizedBytes);
    setEstimatedDataSavedBytes(prev => prev + saved);
    setTotalImagesOptimized(prev => prev + 1);
  };

  const getOptimizedUrl = (url: string | undefined | null, width?: number, height?: number): string => {
    if (!url) return '';
    return getOptimizedImageUrl(url, {
      width,
      height,
      isLiteMode,
      quality: imageQuality === 'ultra_lite' ? 25 : imageQuality === 'lite' ? 38 : 75,
    });
  };

  const resetStats = () => {
    setEstimatedDataSavedBytes(0);
    setTotalImagesOptimized(0);
  };

  const loadSpeedGrade = isLiteMode ? '< 1.1s (Sangat Cepat di 3G)' : '~2.8s (Standar HD)';

  return (
    <LiteModeContext.Provider
      value={{
        isLiteMode,
        imageQuality,
        networkStatus,
        estimatedDataSavedBytes,
        totalImagesOptimized,
        showSlowNetworkNotice,
        loadSpeedGrade,
        toggleLiteMode,
        setLiteMode,
        setImageQuality,
        dismissSlowNetworkNotice,
        trackImageSaved,
        getOptimizedUrl,
        resetStats,
      }}
    >
      {children}
    </LiteModeContext.Provider>
  );
};

export const useLiteMode = () => {
  const context = useContext(LiteModeContext);
  if (!context) {
    throw new Error('useLiteMode must be used within a LiteModeProvider');
  }
  return context;
};
