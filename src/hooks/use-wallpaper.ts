
"use client";

import { useMemo } from 'react';
import { defaultImages } from '@/lib/location-images';

export function useWallpaper(
  wallpaperType: 'default' | 'custom',
  customWallpaperUrl: string | null,
  currentLocation: string
) {
  const backgroundStyle = useMemo(() => {
    let backgroundImage = '';

    if (wallpaperType === 'custom' && customWallpaperUrl) {
      backgroundImage = `url(${customWallpaperUrl})`;
    } else if (wallpaperType === 'default') {
      const defaultImageUrl = defaultImages[currentLocation] || defaultImages['default'];
      backgroundImage = defaultImageUrl ? `url(${defaultImageUrl})` : '';
    }

    if (!backgroundImage) {
      return {};
    }

    return { 
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
  }, [wallpaperType, customWallpaperUrl, currentLocation]);

  return { backgroundStyle };
}
