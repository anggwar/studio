
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { SettingsPanel } from "@/components/settings-panel";
import { AppLogo } from "@/components/icons";
import { getTimezoneInfo, type TimezoneInfo } from '@/lib/timezone-details';

export type SettingsType = {
  locations: string[];
  currentLocation: string;
  fontClass: string;
  fontColor: string;
  wallpaper: string | null;
  fontSize: number;
  title: string;
  stopOnZero: boolean;
  companyName: string;
  companyLogo: string | null;
};

const defaultSettings: SettingsType = {
  locations: ['America/New_York', 'Europe/London', 'Asia/Tokyo'],
  currentLocation: 'America/New_York',
  fontClass: 'font-headline',
  fontColor: '#D4A274',
  wallpaper: null,
  fontSize: 96,
  title: 'Until the New Year',
  stopOnZero: true,
  companyName: 'Global Countdown',
  companyLogo: null,
};

export default function Home() {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [isClient, setIsClient] = useState(false);
  const [timezoneDetails, setTimezoneDetails] = useState<Record<string, TimezoneInfo>>({});

  useEffect(() => {
    setIsClient(true);
    try {
      const savedSettings = localStorage.getItem('newYearCountdownSettings');
      if (savedSettings) {
        setSettings(prevSettings => ({ ...prevSettings, ...JSON.parse(savedSettings) }));
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

  const backgroundStyle = settings.wallpaper
    ? { backgroundImage: `url(${settings.wallpaper})` }
    : {};
  
  if (!isClient) {
    return <div className="fixed inset-0 bg-background" />;
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <main 
        className="relative z-10 flex flex-col h-screen p-4 sm:p-6 md:p-8 bg-cover bg-center transition-all duration-500"
        style={backgroundStyle}
      >
        <header className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            {settings.companyLogo ? (
              <img src={settings.companyLogo} alt="Company Logo" className="h-8 w-auto" />
            ) : (
              <AppLogo className="h-8 w-8 text-primary" />
            )}
            <h1 className="text-xl font-headline tracking-wider hidden sm:block">{settings.companyName}</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-6 w-6" />
                <span className="sr-only">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[320px] sm:w-[400px] bg-background/95 backdrop-blur-sm">
               <SettingsPanel settings={settings} setSettings={setSettings} />
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-grow flex flex-col items-center justify-center text-center">
            <Countdown
              key={settings.currentLocation}
              location={settings.currentLocation}
              fontClassName={settings.fontClass}
              fontColor={settings.fontColor}
              fontSize={settings.fontSize}
              title={settings.title}
              stopOnZero={settings.stopOnZero}
            />
        </div>

        <footer className="w-full flex justify-center items-center pt-8">
            <Tabs value={settings.currentLocation} onValueChange={handleLocationChange} className="w-full max-w-2xl">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto">
                    {settings.locations.slice(0, 5).map((loc) => {
                        const info = timezoneDetails[loc];
                        return (
                            <TabsTrigger key={loc} value={loc} className="flex-col gap-1 py-2 text-xs h-full">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{info?.flag}</span>
                                    <Globe className="h-4 w-4" />
                                </div>
                                <span className="truncate">{loc.split('/').pop()?.replace('_', ' ')}</span>
                                <span className="text-muted-foreground text-[10px]">{info?.gmt}</span>
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
