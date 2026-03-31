// components/USTimeZones.tsx
import React, { useState, useEffect, useMemo } from 'react';
import useStore from '../Store/Store'; // adjust path

// types.ts
export interface StateInfo {
    timezone: string;
    city: string;
    fullName: string;
}

export const isValidIANATimezone = (tz: string): boolean =>
    !!(tz && tz.includes('/') && !tz.startsWith('UTC'));

export const getFormattedTime = (timezone: string, hourFormat: '12hr' | '24hr') => {
    const now = new Date();
    try {
        const time = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: hourFormat === '12hr',
        }).format(now);
        const date = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }).format(now);
        return { time, date };
    } catch {
        return { time: '', date: '' };
    }
};



interface USTimeZonesProps {
    stateInfo: Record<string, StateInfo>;
}

type TimeZoneKey = 'pacific' | 'mountain' | 'central' | 'eastern';

// Map timezone strings to the header color style (matches TimeCard)
// const getZoneStyle = (timezone: string) => {
//     if (timezone.includes('Los_Angeles')) return { bg: 'bg-purple-600', text: 'text-white' };
//     if (timezone.includes('Denver')) return { bg: 'bg-amber-600', text: 'text-white' };
//     if (timezone.includes('Chicago')) return { bg: 'bg-green-600', text: 'text-white' };
//     if (timezone.includes('New_York')) return { bg: 'bg-blue-600', text: 'text-white' };
//     // default fallback
//     return { bg: 'bg-[#324358]', text: 'text-white' };
// };

// Replace your existing getZoneStyle function with this:
const getZoneStyle = (timezone: string) => {
    // Pacific time zone
    if (timezone.includes('Los_Angeles') || timezone.includes('Pacific')) {
        return { bg: 'bg-[#38384F]', text: 'text-white' };
    }
    // Mountain time zone
    if (timezone.includes('Denver') || timezone.includes('Mountain')) {
        return { bg: 'bg-[#FD887C]', text: 'text-white' };
    }
    // Central time zone
    if (timezone.includes('Chicago') || timezone.includes('Central')) {
        return { bg: 'bg-[#EDC563]', text: 'text-white' };
    }
    // Eastern time zone
    if (timezone.includes('New_York') || timezone.includes('Eastern')) {
        return { bg: 'bg-[#35BAAE]', text: 'text-white' };
    }
    // default fallback
    return { bg: 'bg-[#324358]', text: 'text-white' };
};

const USTimeZones: React.FC<USTimeZonesProps> = ({ stateInfo }) => {
    const { user } = useStore();
    const hourFormat = user.timeformat;
    const isDark = user.mode !== 'light';

    // List of all state names
    const stateNames = useMemo(() => Object.keys(stateInfo), [stateInfo]);

    // Store current times
    const [stateTimes, setStateTimes] = useState<Record<string, { time: string; date: string }>>({});

    // Number of visible states (initially 12)
    const [visibleCount, setVisibleCount] = useState(12);

    // Update times every second
    useEffect(() => {
        const updateTimes = () => {
            const newTimes: Record<string, { time: string; date: string }> = {};
            for (const name of stateNames) {
                const tz = stateInfo[name]?.timezone;
                if (tz) {
                    newTimes[name] = getFormattedTime(tz, hourFormat);
                }
            }
            setStateTimes(newTimes);
        };
        updateTimes();
        const interval = setInterval(updateTimes, 1000);
        return () => clearInterval(interval);
    }, [stateNames, stateInfo, hourFormat]);

    const visibleStates = stateNames.slice(0, visibleCount);
    const hasMore = visibleCount < stateNames.length;

    const handleShowMore = () => setVisibleCount(stateNames.length);

    return (
        <div className="mt-8 print:invisible">
            <h2 className={`font-display text-5xl text-center pt-8 text-gray-900 dark:text-white 
                ${user.mode !== "light" ? "text-white" : ""}
                `}>US time now</h2>
            <p className={`text-center mb-8 text-gray-600 dark:text-gray-300 ${user.mode !== "light" ? "text-white/80" : ""}`}>
                Current times across the US.
            </p>

            {/* <div className="flex flex-wrap justify-center gap-4 mx-auto max-w-7xl px-4"> */}
            <div className="flex flex-row flex-wrap gap-2 mt-8 pb-8 mx-auto justify-center w-7xl">

                {visibleStates.map((stateName) => {
                    const info = stateInfo[stateName];
                    const times = stateTimes[stateName] || { time: '', date: '' };
                    const timeParts = times.time.split(' ');
                    const timeNum = timeParts[0] || '';
                    const timeAmPm = timeParts[1] || '';
                    const zoneStyle = getZoneStyle(info.timezone);

                    return (
                        <a
                            key={stateName}
                            className="group relative flex flex-col items-center rounded-xl border shadow-sm hover:shadow-md transition-all hover:scale-[1.1] w-48 overflow-hidden no-underline bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                            {/* Header */}
                            <div className={`w-full py-1 flex justify-center items-center relative z-10 ${zoneStyle.bg}`}>
                                <span className={`font-bold text-[14px] ${zoneStyle.text}`}>{stateName}</span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col items-center pt-4 pb-1 px-4 relative z-10">
                                <div className="flex items-start px-2 rounded-md">
                                    <span className="text-[3rem] leading-[0.8] tracking-tight text-gray-900 dark:text-white">
                                        {timeNum}
                                    </span>
                                    {timeAmPm && (
                                        <span className="text-xl ml-1 -mt-1 text-gray-900 dark:text-white">
                                            {timeAmPm}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-2 text-xl uppercase tracking-wide m-0 text-gray-900 dark:text-white">
                                    {times.date}
                                </p>
                                <span className="text-sm transition-all duration-200 opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 text-gray-600 dark:text-gray-300">
                                    state details
                                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                                </span>
                            </div>
                        </a>
                    );
                })}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleShowMore}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        Show More
                    </button>
                </div>
            )}
        </div>
    );
};

export default USTimeZones;