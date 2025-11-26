
"use client";

import { useState, useEffect } from 'react';

interface CountdownProps {
  location: string;
  fontClassName: string;
  fontColor: string;
  fontSize: number;
  title: string;
  stopOnZero: boolean;
}

const calculateTimeRemaining = (location: string) => {
  try {
    const now = new Date();
    // Get current time in the target timezone to correctly determine the current year there
    const nowInTimezone = new Date(now.toLocaleString('en-US', { timeZone: location }));
    const nextYear = nowInTimezone.getFullYear() + 1;
    
    // Create a string for the target date and time.
    // Important: Don't let JS parse this directly as it will use the browser's timezone.
    const targetDateString = `${nextYear}-01-01T00:00:00`;

    // Get the target date interpreted in the target timezone
    const targetDate = new Date(new Date(targetDateString).toLocaleString("en-US", { timeZone: location }));
    const targetTimeInTargetZone = new Date(
      targetDate.toLocaleString('en-US', { timeZone: 'UTC' })
    );

    // Get the current date interpreted in the target timezone.
    const currentTimeInTargetZone = new Date(
      now.toLocaleString('en-US', { timeZone: location })
    );
    
    const difference = new Date(targetDateString).getTime() - currentTimeInTargetZone.getTime();

    if (difference <= 0) {
      return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { total: difference, days, hours, minutes, seconds };
  } catch (error) {
    console.error("Invalid timezone provided:", location);
    // Return a zeroed-out object if the timezone is invalid
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};


export function Countdown({ location, fontClassName, fontColor, fontSize, title, stopOnZero }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(() => calculateTimeRemaining(location));
  const [isNewYear, setIsNewYear] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const remaining = calculateTimeRemaining(location);
      if (remaining.total <= 0) {
        setIsNewYear(true);
        if (!stopOnZero) {
          setTimeRemaining(remaining);
        }
      } else {
        setIsNewYear(false);
        setTimeRemaining(remaining);
      }
    };

    checkTime(); // Initial check

    const timer = setInterval(checkTime, 1000);

    return () => clearInterval(timer);
  }, [location, stopOnZero]);

  if (isNewYear && stopOnZero) {
    return (
        <div className={`flex flex-col items-center justify-center p-4 md:p-8 bg-black/20 rounded-lg backdrop-blur-sm ${fontClassName}`} style={{ color: fontColor }}>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter animate-pulse">
                Happy New Year!
            </h2>
            <p className="text-xl sm:text-2xl mt-4 font-body">{location.replace('_', ' ')}</p>
        </div>
    );
  }

  const timeToShow = isNewYear ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : timeRemaining;

  const timeUnits = [
    { label: 'Days', value: timeToShow.days },
    { label: 'Hours', value: timeToShow.hours },
    { label: 'Minutes', value: timeToShow.minutes },
    { label: 'Seconds', value: timeToShow.seconds },
  ];

  return (
    <div className="flex flex-col items-center bg-black/20 p-4 md:p-8 rounded-lg backdrop-blur-sm">
        {title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-body mb-4 md:mb-8" style={{ color: fontColor }}>{title}</h2>}
        <div className="flex justify-center gap-2 sm:gap-4 md:gap-8">
            {timeUnits.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
                <div 
                    className={`font-bold tracking-tighter ${fontClassName}`}
                    style={{ color: fontColor, fontSize: `${fontSize}px`, lineHeight: 1 }}
                >
                    {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-foreground/70 font-body uppercase tracking-widest mt-1">
                    {unit.label}
                </div>
            </div>
            ))}
        </div>
        {isNewYear && !stopOnZero && (
            <div className={`mt-8 text-2xl animate-pulse ${fontClassName}`} style={{ color: fontColor }}>
                Happy New Year!
            </div>
        )}
    </div>
  );
}
