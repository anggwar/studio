
"use client";

import { useMemo } from 'react';
import { defaultImages } from '@/lib/location-images';

export function useWallpaper(
  wallpaperType: 'default' | 'custom',
  customWallpaperUrl: string | null,
  currentLocation: string
): string {
  const backgroundImageUrl = useMemo(() => {
    if (wallpaperType === 'custom' && customWallpaperUrl) {
      return customWallpaperUrl;
    } 
    
    return defaultImages[currentLocation] || defaultImages['default'] || '';

  }, [wallpaperType, customWallpaperUrl, currentLocation]);

  return backgroundImageUrl;
}
