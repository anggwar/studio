
"use client";

import { useState, useEffect } from 'react';

interface CountdownProps {
  location: string;
  fontClassName: string;
  fontColor: string;
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


export function Countdown({ location, fontClassName, fontColor }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(() => calculateTimeRemaining(location));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(location));
    }, 1000);

    return () => clearInterval(timer);
  }, [location]);

  if (timeRemaining.total <= 0) {
    return (
        <div className={`flex flex-col items-center justify-center ${fontClassName}`} style={{ color: fontColor }}>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter animate-pulse">
                Happy New Year!
            </h2>
            <p className="text-xl sm:text-2xl mt-4 font-body">{location.replace('_', ' ')}</p>
        </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeRemaining.days },
    { label: 'Hours', value: timeRemaining.hours },
    { label: 'Minutes', value: timeRemaining.minutes },
    { label: 'Seconds', value: timeRemaining.seconds },
  ];

  return (
    <div className="flex flex-col items-center">
        <div className="flex justify-center gap-2 sm:gap-4 md:gap-8">
            {timeUnits.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
                <div 
                    className={`text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter ${fontClassName}`}
                    style={{ color: fontColor }}
                >
                    {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-foreground/70 font-body uppercase tracking-widest mt-1">
                    {unit.label}
                </div>
            </div>
            ))}
        </div>
    </div>
  );
}

    