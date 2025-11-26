
"use client";

import React, { useState, useEffect } from 'react';
import { Countdown } from "@/components/countdown";
import { AppLogo } from "@/components/icons";
import { getTimezoneInfo, type TimezoneInfo } from '@/lib/timezone-details';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SettingsPanel } from '@/components/settings-panel';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { timezones } from '@/lib/timezones';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Sheet } from '@/components/ui/sheet';

export type SettingsType = {
  fontClass: string;
  fontColor: string;
  wallpaper: string | null;
  fontSize: number;
  title: string;
  stopOnZero: boolean;
  companyName: string;
  companyLogo: string | null;
  displayMode: 'single' | 'multi';
  locations: string[];
};

const defaultSettings: SettingsType = {
  fontClass: 'font-headline',
  fontColor: '#FFFFFF',
  wallpaper: null,
  fontSize: 96,
  title: 'Until the New Year',
  stopOnZero: true,
  companyName: 'Global Countdown',
  companyLogo: null,
  displayMode: 'single',
  locations: ['Asia/Jakarta', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'],
};

export default function Home() {
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [isClient, setIsClient] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [timezoneDetails, setTimezoneDetails] = useState<TimezoneInfo[]>([]);

  useEffect(() => {
    setIsClient(true);
    const storedSettings = localStorage.getItem('countdownSettings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        // Ensure all keys from defaultSettings are present
        const validatedSettings = { ...defaultSettings, ...parsedSettings };
        setSettings(validatedSettings);
      } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('countdownSettings', JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
    }
  }, [settings, isClient]);

  useEffect(() => {
    if (settings.locations.length > 0) {
      const details = settings.locations.map(getTimezoneInfo);
      setTimezoneDetails(details);
    }
    // Reset carousel to first slide when locations change
    if (api) {
      api.scrollTo(0);
      setCurrent(0);
    }
  }, [settings.locations, api]);


  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])


  const backgroundStyle = settings.wallpaper
    ? { backgroundImage: `url(${settings.wallpaper})` }
    : {};

  if (!isClient) {
    return <div className="fixed inset-0 bg-background" />;
  }
  
  const renderSingleView = () => (
    <div className="flex-grow flex flex-col items-center justify-center text-center w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {settings.locations.map((location) => (
            <CarouselItem key={location}>
               <Countdown
                    key={location}
                    location={location}
                    fontClassName={settings.fontClass}
                    fontColor={settings.fontColor}
                    fontSize={settings.fontSize}
                    title={settings.title}
                    stopOnZero={settings.stopOnZero}
                />
            </CarouselItem>
          ))}
        </CarouselContent>
        {settings.locations.length > 1 && (
            <>
              <CarouselPrevious className="hidden lg:flex" />
              <CarouselNext className="hidden lg:flex" />
            </>
          )}
      </Carousel>
    </div>
  );

  const renderMultiView = () => (
    <div className="flex-grow flex items-center justify-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 w-full max-w-7xl">
        {settings.locations.slice(0, 4).map((location) => (
            <Countdown
                key={location}
                location={location}
                fontClassName={settings.fontClass}
                fontColor={settings.fontColor}
                fontSize={Math.max(24, Math.floor(settings.fontSize / (settings.locations.length > 2 ? 2.5 : 2)))}
                title={location.replace(/_/g, ' ').split('/').pop() || ''}
                stopOnZero={settings.stopOnZero}
                isMultiView={true}
            />
        ))}
      </div>
    </div>
  );


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
          <div className="bg-black/20 p-1 rounded-lg backdrop-blur-sm">
            <Button variant="ghost" onClick={() => setIsSettingsOpen(true)} className={cn("gap-2 hover:bg-white/20", settings.fontClass)} style={{color: settings.fontColor}}>
                <Settings className="h-6 w-6" />
                <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </header>

        {settings.displayMode === 'single' ? renderSingleView() : renderMultiView()}

        {settings.displayMode === 'single' && settings.locations.length > 0 && (
          <footer className="w-full flex justify-center items-center py-4">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2 border border-white/10 flex items-center justify-center gap-4">
                {settings.locations.map((location, index) => {
                  const detail = timezoneDetails[index];
                  if (!detail) return null;
                  return (
                    <button 
                      key={location}
                      onClick={() => api?.scrollTo(index)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300",
                        index === current ? "bg-white/20" : "hover:bg-white/10"
                      )}
                    >
                      {detail?.flag && (
                        <Image src={detail.flag} alt={`${location} flag`} width={30} height={20} className="rounded-sm" />
                      )}
                      <div className="text-left">
                         <p className={cn("text-sm font-medium", settings.fontClass)} style={{color: '#FFFFFF'}}>{location.split('/')[1]?.replace('_', ' ')}</p>
                         <p className="text-xs text-white/80">{detail?.gmt}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
          </footer>
        )}
      </main>
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        allTimezones={timezones}
      />
    </div>
  );
}

    