
export type TimezoneInfo = {
    flag: string;
    gmt: string;
};

// This is not exhaustive, but covers the list in timezones.ts
// It's a simple mapping, a more robust solution might use a library
// or a more comprehensive data source.
const timezoneDetails: Record<string, { flag: string, offset: number }> = {
    'UTC': { flag: '🌐', offset: 0 },
    'America/New_York': { flag: '🇺🇸', offset: -5 }, // EST
    'America/Chicago': { flag: '🇺🇸', offset: -6 }, // CST
    'America/Denver': { flag: '🇺🇸', offset: -7 }, // MST
    'America/Los_Angeles': { flag: '🇺🇸', offset: -8 }, // PST
    'Europe/London': { flag: '🇬🇧', offset: 0 }, // GMT
    'Europe/Paris': { flag: '🇫🇷', offset: 1 }, // CET
    'Europe/Moscow': { flag: '🇷🇺', offset: 3 },
    'Asia/Tokyo': { flag: '🇯🇵', offset: 9 },
    'Asia/Dubai': { flag: '🇦🇪', offset: 4 },
    'Asia/Kolkata': { flag: '🇮🇳', offset: 5.5 },
    'Asia/Shanghai': { flag: '🇨🇳', offset: 8 },
    'Australia/Sydney': { flag: '🇦🇺', offset: 11 }, // AEDT (can be +10)
    'Pacific/Auckland': { flag: '🇳🇿', offset: 13 }, // NZDT (can be +12)
    'Africa/Cairo': { flag: '🇪🇬', offset: 2 },
    'America/Sao_Paulo': { flag: '🇧🇷', offset: -3 },
    'Africa/Johannesburg': { flag: '🇿🇦', offset: 2 },
    'America/Argentina/Buenos_Aires': { flag: '🇦🇷', offset: -3 },
    'Asia/Bangkok': { flag: '🇹🇭', offset: 7 },
    'Asia/Hong_Kong': { flag: '🇭🇰', offset: 8 },
    'Asia/Jakarta': { flag: '🇮🇩', offset: 7 },
    'Asia/Seoul': { flag: '🇰🇷', offset: 9 },
    'Asia/Singapore': { flag: '🇸🇬', offset: 8 },
    'Canada/Eastern': { flag: '🇨🇦', offset: -5 },
    'Canada/Central': { flag: '🇨🇦', offset: -6 },
    'Canada/Mountain': { flag: '🇨🇦', offset: -7 },
    'Canada/Pacific': { flag: '🇨🇦', offset: -8 },
    'Europe/Berlin': { flag: '🇩🇪', offset: 1 },
    'Europe/Helsinki': { flag: '🇫🇮', offset: 2 },
    'Europe/Istanbul': { flag: '🇹🇷', offset: 3 },
    'Europe/Madrid': { flag: '🇪🇸', offset: 1 },
    'Europe/Rome': { flag: '🇮🇹', offset: 1 },
    'Mexico/General': { flag: '🇲🇽', offset: -6 },
    'Pacific/Honolulu': { flag: '🇺🇸', offset: -10 }
};

export function getTimezoneInfo(timezone: string): TimezoneInfo {
    const details = timezoneDetails[timezone];
    if (!details) {
        return { flag: '🏳️', gmt: 'GMT' }; // Default/fallback
    }

    const { offset } = details;
    const sign = offset > 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset));
    const minutes = (Math.abs(offset) * 60) % 60;
    const gmtString = `GMT${sign}${hours}${minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : ''}`;
    
    return {
        flag: details.flag,
        gmt: gmtString,
    };
}
