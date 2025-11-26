
"use client";

import { useMemo } from 'react';
import { defaultImages } from '@/lib/location-images';

export function useWallpaper(
  wallpaperType: 'default' | 'custom',
  customWallpaperUrl: string | null,
  currentLocation: string
): React.CSSProperties {
  const backgroundImageUrl = useMemo(() => {
    if (wallpaperType === 'custom' && customWallpaperUrl) {
      return `url(${customWallpaperUrl})`;
    } 
    
    const defaultUrl = defaultImages[currentLocation] || defaultImages['default'] || '';
    return `url(${defaultUrl})`;

  }, [wallpaperType, customWallpaperUrl, currentLocation]);

  return { backgroundImage: backgroundImageUrl };
}
