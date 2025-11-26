
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { SettingsPanel } from "@/components/settings-panel";
import { AppLogo } from "@/components/icons";
import { getTimezoneInfo, type TimezoneInfo } from '@/lib/timezone-details';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useWallpaper } from '@/hooks/use-wallpaper';

export type SettingsType = {
  locations: string[];
  currentLocation: string;
  fontClass: string;
  fontColor: string;
  wallpaper: string | null;
  wallpaperType: 'default' | 'custom';
  fontSize: number;
  title: string;
  stopOnZero: boolean;
  companyName: string;
  companyLogo: string | null;
  displayMode: 'single' | 'multi';
};

const defaultSettings: SettingsType = {
  locations: ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Asia/Shanghai'],
  currentLocation: 'America/New_York',
  fontClass: 'font-headline',
  fontColor: '#D4A274',
  wallpaper: null,
  wallpaperType: 'default',
  fontSize: 96,
  title: 'Until the New Year',
  stopOnZero: true,
  companyName: 'Global Countdown',
  companyLogo: null,
  displayMode: 'single',
};

export default function Home() {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [isClient, setIsClient] = useState(false);
  const [timezoneDetails, setTimezoneDetails] = useState<Record<string, TimezoneInfo>>({});
  
  const { backgroundStyle } = useWallpaper(settings.wallpaperType, settings.wallpaper, settings.currentLocation);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedSettings = localStorage.getItem('newYearCountdownSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Ensure wallpaperType exists for older saved settings
        if (!parsedSettings.wallpaperType) {
          parsedSettings.wallpaperType = parsedSettings.wallpaper ? 'custom' : 'default';
        }
        setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
      } else {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (userTimezone && !defaultSettings.locations.includes(userTimezone)) {
          setSettings(s => ({
            ...s,
            locations: [userTimezone, ...s.locations.slice(0, 4)],
            currentLocation: userTimezone,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('newYearCountdownSettings', JSON.stringify(settings));
        
        const details: Record<string, TimezoneInfo> = {};
        settings.locations.forEach(loc => {
          details[loc] = getTimezoneInfo(loc);
        });
        setTimezoneDetails(details);

      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
    }
  }, [settings, isClient]);

  const handleLocationChange = (value: string) => {
    setSettings(s => ({ ...s, currentLocation: value }));
  };
  
  if (!isClient) {
    return <div className="fixed inset-0 bg-background" />;
  }

  const isMultiView = settings.displayMode === 'multi';
  const multiViewFontSize = Math.max(24, Math.floor(settings.fontSize / (settings.locations.length > 2 ? 2.5 : 2)));

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <main 
        className="relative z-10 flex flex-col h-screen p-4 sm:p-6 md:p-8 bg-cover bg-center transition-all duration-500"
        style={backgroundStyle}
      >
        <header className="w-full flex justify-between items-start">
          <div className="bg-black/20 p-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
            {settings.companyLogo ? (
              <img src={settings.companyLogo} alt="Company Logo" className="h-8 w-auto" />
            ) : (
              <AppLogo className="h-8 w-8 text-primary" />
            )}
            <h1 className={cn("text-xl tracking-wider hidden sm:block", settings.fontClass)} style={{color: settings.fontColor}}>{settings.companyName}</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="bg-black/20 p-2 rounded-lg backdrop-blur-sm h-auto">
                <Settings className="h-7 w-7" />
                <span className={cn("ml-2 hidden sm:inline", settings.fontClass)} style={{color: settings.fontColor}}>Settings</span>
                <span className="sr-only sm:hidden">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[320px] sm:w-[400px] bg-background/95 backdrop-blur-sm">
               <SettingsPanel settings={settings} setSettings={setSettings} />
            </SheetContent>
          </Sheet>
        </header>

        <div className={cn(
            "flex-grow flex flex-col items-center justify-center text-center",
            isMultiView && "w-full"
        )}>
           {isMultiView ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-7xl mx-auto">
                    {settings.locations.map(loc => (
                        <Countdown
                            key={loc}
                            location={loc}
                            fontClassName={settings.fontClass}
                            fontColor={settings.fontColor}
                            fontSize={multiViewFontSize}
                            title={loc.split('/').pop()?.replace('_', ' ') || ''}
                            stopOnZero={settings.stopOnZero}
                            isMultiView={true}
                        />
                    ))}
                </div>
            ) : (
                <Countdown
                    key={settings.currentLocation}
                    location={settings.currentLocation}
                    fontClassName={settings.fontClass}
                    fontColor={settings.fontColor}
                    fontSize={settings.fontSize}
                    title={settings.title}
                    stopOnZero={settings.stopOnZero}
                />
            )}
        </div>

        <footer className={cn(
            "w-full flex justify-center items-center pt-8",
            isMultiView && "hidden"
        )}>
            <Tabs value={settings.currentLocation} onValueChange={handleLocationChange} className="w-full max-w-2xl">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto bg-black/20 backdrop-blur-sm rounded-xl p-2 border border-white/10 gap-1">
                    {settings.locations.slice(0, 5).map((loc) => {
                        const info = timezoneDetails[loc];
                        const isActive = loc === settings.currentLocation;
                        return (
                            <TabsTrigger 
                                key={loc} 
                                value={loc} 
                                className="flex-col gap-1 py-2 text-xs h-full rounded-lg data-[state=active]:bg-white/10"
                                style={{
                                    color: settings.fontColor,
                                    opacity: isActive ? 1 : 0.7
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {info?.flag && <Image src={info.flag} alt="" width={24} height={18} className="rounded-sm" />}
                                    <span className="truncate hidden sm:inline">{loc.split('/').pop()?.replace('_', ' ')}</span>
                                </div>
                                <span className="truncate sm:hidden">{loc.split('/').pop()?.replace('_', ' ')}</span>
                                <span className="text-[10px]" style={{ opacity: isActive ? 0.8 : 0.6 }}>{info?.gmt}</span>
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
            </Tabs>
        </footer>
      </main>
    </div>
  );
}
