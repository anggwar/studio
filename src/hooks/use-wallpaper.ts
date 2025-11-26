
"use client";

import { useMemo } from 'react';

export function useWallpaper(
  customWallpaperUrl: string | null
): React.CSSProperties {
  const backgroundImageUrl = useMemo(() => {
    if (customWallpaperUrl) {
      return `url(${customWallpaperUrl})`;
    } 
    return 'none';
  }, [customWallpaperUrl]);

  return { backgroundImage: backgroundImageUrl };
}
