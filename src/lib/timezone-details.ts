

export type TimezoneInfo = {
    flag: string;
    gmt: string;
};

// This is not exhaustive, but covers the list in timezones.ts
// It's a simple mapping, a more robust solution might use a library
// or a more comprehensive data source.
const timezoneDetails: Record<string, { countryCode: string, offset: number }> = {
    'UTC': { countryCode: 'un', offset: 0 }, // Using UN for global
    'America/New_York': { countryCode: 'us', offset: -5 }, // EST
    'America/Chicago': { countryCode: 'us', offset: -6 }, // CST
    'America/Denver': { countryCode: 'us', offset: -7 }, // MST
    'America/Los_Angeles': { countryCode: 'us', offset: -8 }, // PST
    'Europe/London': { countryCode: 'gb', offset: 0 }, // GMT
    'Europe/Paris': { countryCode: 'fr', offset: 1 }, // CET
    'Europe/Moscow': { countryCode: 'ru', offset: 3 },
    'Asia/Tokyo': { countryCode: 'jp', offset: 9 },
    'Asia/Dubai': { countryCode: 'ae', offset: 4 },
    'Asia/Kolkata': { countryCode: 'in', offset: 5.5 },
    'Asia/Shanghai': { countryCode: 'cn', offset: 8 },
    'Australia/Sydney': { countryCode: 'au', offset: 11 }, // AEDT (can be +10)
    'Pacific/Auckland': { countryCode: 'nz', offset: 13 }, // NZDT (can be +12)
    'Africa/Cairo': { countryCode: 'eg', offset: 2 },
    'America/Sao_Paulo': { countryCode: 'br', offset: -3 },
    'Africa/Johannesburg': { countryCode: 'za', offset: 2 },
    'America/Argentina/Buenos_Aires': { countryCode: 'ar', offset: -3 },
    'Asia/Bangkok': { countryCode: 'th', offset: 7 },
    'Asia/Hong_Kong': { countryCode: 'hk', offset: 8 },
    'Asia/Jakarta': { countryCode: 'id', offset: 7 },
    'Asia/Seoul': { countryCode: 'kr', offset: 9 },
    'Asia/Singapore': { countryCode: 'sg', offset: 8 },
    'Canada/Eastern': { countryCode: 'ca', offset: -5 },
    'Canada/Central': { countryCode: 'ca', offset: -6 },
    'Canada/Mountain': { countryCode: 'ca', offset: -7 },
    'Canada/Pacific': { countryCode: 'ca', offset: -8 },
    'Europe/Berlin': { countryCode: 'de', offset: 1 },
    'Europe/Helsinki': { countryCode: 'fi', offset: 2 },
    'Europe/Istanbul': { countryCode: 'tr', offset: 3 },
    'Europe/Madrid': { countryCode: 'es', offset: 1 },
    'Europe/Rome': { countryCode: 'it', offset: 1 },
    'Mexico/General': { countryCode: 'mx', offset: -6 },
    'Pacific/Honolulu': { countryCode: 'us', offset: -10 }
};

function getCountryFlagUrl(countryCode: string): string {
    // Using a public CDN for SVG flags
    return `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${countryCode.toLowerCase()}.svg`;
}


export function getTimezoneInfo(timezone: string): TimezoneInfo {
    const details = timezoneDetails[timezone];
    if (!details) {
        return { flag: '', gmt: 'GMT' }; // Default/fallback
    }

    const { offset, countryCode } = details;
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset));
    const minutes = (Math.abs(offset) * 60) % 60;
    const gmtString = `GMT${sign}${hours}${minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : ''}`;
    
    return {
        flag: getCountryFlagUrl(countryCode),
        gmt: gmtString,
    };
}
