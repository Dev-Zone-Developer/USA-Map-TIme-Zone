// Homepage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import Togglemode from '../../Components/Buttons/Toggle';
import MapwithState from '../../Components/Map/MapwithState';
import MapwithStateabbr from '../../Components/Map/MapwithStateabbr';
import MapwithStateBlank from '../../Components/Map/MapwithStateBlank';
import useStore from '../../Components/Store/Store';
import USTimeZones from '../../Components/USTimeZones/USTimeZones';
import Footer from '../../Components/Footer/Footer';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimeZoneProps {
    zone: string;
    time: string;
    link: string;
    userName?: string;
    customStyles?: {
        bgColor?: string;
        headerBg?: string;
        headerTextColor?: string;
        textColor?: string;
        border?: string;
        flagUrl?: string;
        useFlag?: boolean;
    };
    dynamicTime?: string;
    dynamicDate?: string;
}

type TimeZoneKey = 'pk' | 'eastern' | 'central' | 'mountain' | 'pacific';

interface ZoneStyles {
    headerBg: string;
    headerText: string;
    borderColor: string;
    bgColor: string;
}

interface CountryItem {
    name: string;
    timezone: string;
    flag: string;
}

// State name → { timezone, abbreviation label }
interface StateInfo {
    timezone: string;
    city: string;        // representative city shown in popup
    fullName: string;    // full "City, State" label
}

// ─── Fallback static data (used if API fails) ─────────────────────────────────

const DEFAULT_STATE_INFO: Record<string, StateInfo> = {
    Alabama: { timezone: 'America/Chicago', city: 'Montgomery', fullName: 'Montgomery, Alabama' },
    Alaska: { timezone: 'America/Anchorage', city: 'Juneau', fullName: 'Juneau, Alaska' },
    Arizona: { timezone: 'America/Phoenix', city: 'Phoenix', fullName: 'Phoenix, Arizona' },
    Arkansas: { timezone: 'America/Chicago', city: 'Little Rock', fullName: 'Little Rock, Arkansas' },
    California: { timezone: 'America/Los_Angeles', city: 'Sacramento', fullName: 'Sacramento, California' },
    Colorado: { timezone: 'America/Denver', city: 'Denver', fullName: 'Denver, Colorado' },
    Connecticut: { timezone: 'America/New_York', city: 'Hartford', fullName: 'Hartford, Connecticut' },
    Delaware: { timezone: 'America/New_York', city: 'Dover', fullName: 'Dover, Delaware' },
    Florida: { timezone: 'America/New_York', city: 'Tallahassee', fullName: 'Tallahassee, Florida' },
    Georgia: { timezone: 'America/New_York', city: 'Atlanta', fullName: 'Atlanta, Georgia' },
    Hawaii: { timezone: 'Pacific/Honolulu', city: 'Honolulu', fullName: 'Honolulu, Hawaii' },
    Idaho: { timezone: 'America/Boise', city: 'Boise', fullName: 'Boise, Idaho' },
    Illinois: { timezone: 'America/Chicago', city: 'Chicago', fullName: 'Chicago, Illinois' },
    Indiana: { timezone: 'America/Indiana/Indianapolis', city: 'Indianapolis', fullName: 'Indianapolis, Indiana' },
    Iowa: { timezone: 'America/Chicago', city: 'Des Moines', fullName: 'Des Moines, Iowa' },
    Kansas: { timezone: 'America/Chicago', city: 'Topeka', fullName: 'Topeka, Kansas' },
    Kentucky: { timezone: 'America/New_York', city: 'Frankfort', fullName: 'Frankfort, Kentucky' },
    Louisiana: { timezone: 'America/Chicago', city: 'Baton Rouge', fullName: 'Baton Rouge, Louisiana' },
    Maine: { timezone: 'America/New_York', city: 'Augusta', fullName: 'Augusta, Maine' },
    Maryland: { timezone: 'America/New_York', city: 'Annapolis', fullName: 'Annapolis, Maryland' },
    Massachusetts: { timezone: 'America/New_York', city: 'Boston', fullName: 'Boston, Massachusetts' },
    Michigan: { timezone: 'America/Detroit', city: 'Lansing', fullName: 'Lansing, Michigan' },
    Minnesota: { timezone: 'America/Chicago', city: 'Saint Paul', fullName: 'Saint Paul, Minnesota' },
    Mississippi: { timezone: 'America/Chicago', city: 'Jackson', fullName: 'Jackson, Mississippi' },
    Missouri: { timezone: 'America/Chicago', city: 'Jefferson City', fullName: 'Jefferson City, Missouri' },
    Montana: { timezone: 'America/Denver', city: 'Helena', fullName: 'Helena, Montana' },
    Nebraska: { timezone: 'America/Chicago', city: 'Lincoln', fullName: 'Lincoln, Nebraska' },
    Nevada: { timezone: 'America/Los_Angeles', city: 'Carson City', fullName: 'Carson City, Nevada' },
    'New Hampshire': { timezone: 'America/New_York', city: 'Concord', fullName: 'Concord, New Hampshire' },
    'New Jersey': { timezone: 'America/New_York', city: 'Trenton', fullName: 'Trenton, New Jersey' },
    'New Mexico': { timezone: 'America/Denver', city: 'Santa Fe', fullName: 'Santa Fe, New Mexico' },
    'New York': { timezone: 'America/New_York', city: 'Albany', fullName: 'Albany, New York' },
    'North Carolina': { timezone: 'America/New_York', city: 'Raleigh', fullName: 'Raleigh, North Carolina' },
    'North Dakota': { timezone: 'America/Chicago', city: 'Bismarck', fullName: 'Bismarck, North Dakota' },
    Ohio: { timezone: 'America/New_York', city: 'Columbus', fullName: 'Columbus, Ohio' },
    Oklahoma: { timezone: 'America/Chicago', city: 'Oklahoma City', fullName: 'Oklahoma City, Oklahoma' },
    Oregon: { timezone: 'America/Los_Angeles', city: 'Salem', fullName: 'Salem, Oregon' },
    Pennsylvania: { timezone: 'America/New_York', city: 'Harrisburg', fullName: 'Harrisburg, Pennsylvania' },
    'Rhode Island': { timezone: 'America/New_York', city: 'Providence', fullName: 'Providence, Rhode Island' },
    'South Carolina': { timezone: 'America/New_York', city: 'Columbia', fullName: 'Columbia, South Carolina' },
    'South Dakota': { timezone: 'America/Chicago', city: 'Pierre', fullName: 'Pierre, South Dakota' },
    Tennessee: { timezone: 'America/Chicago', city: 'Nashville', fullName: 'Nashville, Tennessee' },
    Texas: { timezone: 'America/Chicago', city: 'Austin', fullName: 'Austin, Texas' },
    Utah: { timezone: 'America/Denver', city: 'Salt Lake City', fullName: 'Salt Lake City, Utah' },
    Vermont: { timezone: 'America/New_York', city: 'Montpelier', fullName: 'Montpelier, Vermont' },
    Virginia: { timezone: 'America/New_York', city: 'Richmond', fullName: 'Richmond, Virginia' },
    Washington: { timezone: 'America/Los_Angeles', city: 'Olympia', fullName: 'Olympia, Washington' },
    'West Virginia': { timezone: 'America/New_York', city: 'Charleston', fullName: 'Charleston, West Virginia' },
    Wisconsin: { timezone: 'America/Chicago', city: 'Madison', fullName: 'Madison, Wisconsin' },
    Wyoming: { timezone: 'America/Denver', city: 'Cheyenne', fullName: 'Cheyenne, Wyoming' },
    'District of Columbia': { timezone: 'America/New_York', city: 'Washington DC', fullName: 'Washington, D.C.' },
    // Major cities
    'New York City': { timezone: 'America/New_York', city: 'New York City', fullName: 'New York City, New York' },
    'Los Angeles': { timezone: 'America/Los_Angeles', city: 'Los Angeles', fullName: 'Los Angeles, California' },
    Chicago: { timezone: 'America/Chicago', city: 'Chicago', fullName: 'Chicago, Illinois' },
    Houston: { timezone: 'America/Chicago', city: 'Houston', fullName: 'Houston, Texas' },
    Phoenix: { timezone: 'America/Phoenix', city: 'Phoenix', fullName: 'Phoenix, Arizona' },
    Philadelphia: { timezone: 'America/New_York', city: 'Philadelphia', fullName: 'Philadelphia, Pennsylvania' },
    'San Antonio': { timezone: 'America/Chicago', city: 'San Antonio', fullName: 'San Antonio, Texas' },
    'San Diego': { timezone: 'America/Los_Angeles', city: 'San Diego', fullName: 'San Diego, California' },
    Dallas: { timezone: 'America/Chicago', city: 'Dallas', fullName: 'Dallas, Texas' },
    Austin: { timezone: 'America/Chicago', city: 'Austin', fullName: 'Austin, Texas' },
    'San Jose': { timezone: 'America/Los_Angeles', city: 'San Jose', fullName: 'San Jose, California' },
    'Fort Worth': { timezone: 'America/Chicago', city: 'Fort Worth', fullName: 'Fort Worth, Texas' },
    Jacksonville: { timezone: 'America/New_York', city: 'Jacksonville', fullName: 'Jacksonville, Florida' },
    Columbus: { timezone: 'America/New_York', city: 'Columbus', fullName: 'Columbus, Ohio' },
    Charlotte: { timezone: 'America/New_York', city: 'Charlotte', fullName: 'Charlotte, North Carolina' },
    Indianapolis: { timezone: 'America/Indiana/Indianapolis', city: 'Indianapolis', fullName: 'Indianapolis, Indiana' },
    Seattle: { timezone: 'America/Los_Angeles', city: 'Seattle', fullName: 'Seattle, Washington' },
    Denver: { timezone: 'America/Denver', city: 'Denver', fullName: 'Denver, Colorado' },
    Boston: { timezone: 'America/New_York', city: 'Boston', fullName: 'Boston, Massachusetts' },
    Nashville: { timezone: 'America/Chicago', city: 'Nashville', fullName: 'Nashville, Tennessee' },
    Baltimore: { timezone: 'America/New_York', city: 'Baltimore', fullName: 'Baltimore, Maryland' },
    'Oklahoma City': { timezone: 'America/Chicago', city: 'Oklahoma City', fullName: 'Oklahoma City, Oklahoma' },
    Portland: { timezone: 'America/Los_Angeles', city: 'Portland', fullName: 'Portland, Oregon' },
    'Las Vegas': { timezone: 'America/Los_Angeles', city: 'Las Vegas', fullName: 'Las Vegas, Nevada' },
    Detroit: { timezone: 'America/Detroit', city: 'Detroit', fullName: 'Detroit, Michigan' },
    Memphis: { timezone: 'America/Chicago', city: 'Memphis', fullName: 'Memphis, Tennessee' },
    Atlanta: { timezone: 'America/New_York', city: 'Atlanta', fullName: 'Atlanta, Georgia' },
    // ─── Tennessee (split: Central & Eastern) ───
    'Tennessee (Central)': {
        timezone: 'America/Chicago',
        city: 'Nashville',
        fullName: 'Nashville, Tennessee (Central)'
    },
    'Tennessee (Eastern)': {
        timezone: 'America/New_York',
        city: 'Knoxville',
        fullName: 'Knoxville, Tennessee (Eastern)'
    },
    // Keep individual cities for direct search
    Knoxville: { timezone: 'America/New_York', city: 'Knoxville', fullName: 'Knoxville, Tennessee' },
    Chattanooga: { timezone: 'America/New_York', city: 'Chattanooga', fullName: 'Chattanooga, Tennessee' },

    // ─── Florida (mostly Eastern, but panhandle is Central) ───
    'Florida (Eastern)': {
        timezone: 'America/New_York',
        city: 'Tallahassee',
        fullName: 'Tallahassee, Florida (Eastern)'
    },
    'Florida (Central)': {
        timezone: 'America/Chicago',
        city: 'Pensacola',
        fullName: 'Pensacola, Florida (Central)'
    },
    // Individual cities
    Tallahassee: { timezone: 'America/New_York', city: 'Tallahassee', fullName: 'Tallahassee, Florida' },
    Miami: { timezone: 'America/New_York', city: 'Miami', fullName: 'Miami, Florida' },
    Pensacola: { timezone: 'America/Chicago', city: 'Pensacola', fullName: 'Pensacola, Florida' },

    // ─── Kentucky (split: Eastern & Central) ───
    'Kentucky (Eastern)': {
        timezone: 'America/New_York',
        city: 'Lexington',
        fullName: 'Lexington, Kentucky (Eastern)'
    },
    'Kentucky (Central)': {
        timezone: 'America/Chicago',
        city: 'Louisville',
        fullName: 'Louisville, Kentucky (Central)'
    },
    // Individual cities
    Frankfort: { timezone: 'America/New_York', city: 'Frankfort', fullName: 'Frankfort, Kentucky' },
    Louisville: { timezone: 'America/Chicago', city: 'Louisville', fullName: 'Louisville, Kentucky' },
    Lexington: { timezone: 'America/New_York', city: 'Lexington', fullName: 'Lexington, Kentucky' },

    // ─── Indiana (split: Eastern & Central) ───
    'Indiana (Eastern)': {
        timezone: 'America/New_York',
        city: 'Indianapolis',
        fullName: 'Indianapolis, Indiana (Eastern)'
    },
    'Indiana (Central)': {
        timezone: 'America/Chicago',
        city: 'Gary',
        fullName: 'Gary, Indiana (Central)'
    },
    // Individual cities
    Gary: { timezone: 'America/Chicago', city: 'Gary', fullName: 'Gary, Indiana' },

    // ─── Oregon (split: Pacific & Mountain) ───
    'Oregon (Pacific)': {
        timezone: 'America/Los_Angeles',
        city: 'Portland',
        fullName: 'Portland, Oregon (Pacific)'
    },
    'Oregon (Mountain)': {
        timezone: 'America/Denver',
        city: 'Ontario',
        fullName: 'Ontario, Oregon (Mountain)'
    },
    // Individual cities
    Salem: { timezone: 'America/Los_Angeles', city: 'Salem', fullName: 'Salem, Oregon' },
    Ontario: { timezone: 'America/Denver', city: 'Ontario', fullName: 'Ontario, Oregon' },

    // ─── Washington (Pacific, but a small part is Mountain) ───
    'Washington (Pacific)': {
        timezone: 'America/Los_Angeles',
        city: 'Olympia',
        fullName: 'Olympia, Washington (Pacific)'
    },
    'Washington (Mountain)': {
        timezone: 'America/Denver',
        city: 'Spokane',
        fullName: 'Spokane, Washington (Mountain)'
    },
    // Individual cities
    Olympia: { timezone: 'America/Los_Angeles', city: 'Olympia', fullName: 'Olympia, Washington' },
    Spokane: { timezone: 'America/Denver', city: 'Spokane', fullName: 'Spokane, Washington' },

    // ─── Texas (split: Central & Mountain) ───
    'Texas (Central)': {
        timezone: 'America/Chicago',
        city: 'Austin',
        fullName: 'Austin, Texas (Central)'
    },
    'Texas (Mountain)': {
        timezone: 'America/Denver',
        city: 'El Paso',
        fullName: 'El Paso, Texas (Mountain)'
    },
    // Individual cities

    'El Paso': { timezone: 'America/Denver', city: 'El Paso', fullName: 'El Paso, Texas' },

    // ─── South Dakota (split: Central & Mountain) ───
    'South Dakota (Central)': {
        timezone: 'America/Chicago',
        city: 'Pierre',
        fullName: 'Pierre, South Dakota (Central)'
    },
    'South Dakota (Mountain)': {
        timezone: 'America/Denver',
        city: 'Rapid City',
        fullName: 'Rapid City, South Dakota (Mountain)'
    },
    // Individual cities
    Pierre: { timezone: 'America/Chicago', city: 'Pierre', fullName: 'Pierre, South Dakota' },
    'Sioux Falls': { timezone: 'America/Chicago', city: 'Sioux Falls', fullName: 'Sioux Falls, South Dakota' },
    'Rapid City': { timezone: 'America/Denver', city: 'Rapid City', fullName: 'Rapid City, South Dakota' },

    // ─── North Dakota (split: Central & Mountain) ───
    'North Dakota (Central)': {
        timezone: 'America/Chicago',
        city: 'Bismarck',
        fullName: 'Bismarck, North Dakota (Central)'
    },
    'North Dakota (Mountain)': {
        timezone: 'America/Denver',
        city: 'Dickinson',
        fullName: 'Dickinson, North Dakota (Mountain)'
    },
    // Individual cities
    Bismarck: { timezone: 'America/Chicago', city: 'Bismarck', fullName: 'Bismarck, North Dakota' },
    Fargo: { timezone: 'America/Chicago', city: 'Fargo', fullName: 'Fargo, North Dakota' },
    Dickinson: { timezone: 'America/Denver', city: 'Dickinson', fullName: 'Dickinson, North Dakota' },

    // ─── Nebraska (split: Central & Mountain) ───
    'Nebraska (Central)': {
        timezone: 'America/Chicago',
        city: 'Lincoln',
        fullName: 'Lincoln, Nebraska (Central)'
    },
    'Nebraska (Mountain)': {
        timezone: 'America/Denver',
        city: 'North Platte',
        fullName: 'North Platte, Nebraska (Mountain)'
    },
    // Individual cities
    Lincoln: { timezone: 'America/Chicago', city: 'Lincoln', fullName: 'Lincoln, Nebraska' },
    Omaha: { timezone: 'America/Chicago', city: 'Omaha', fullName: 'Omaha, Nebraska' },
    'North Platte': { timezone: 'America/Denver', city: 'North Platte', fullName: 'North Platte, Nebraska' },

    // ─── Kansas (split: Central & Mountain) ───
    'Kansas (Central)': {
        timezone: 'America/Chicago',
        city: 'Topeka',
        fullName: 'Topeka, Kansas (Central)'
    },
    'Kansas (Mountain)': {
        timezone: 'America/Denver',
        city: 'Goodland',
        fullName: 'Goodland, Kansas (Mountain)'
    },
    // Individual cities
    Topeka: { timezone: 'America/Chicago', city: 'Topeka', fullName: 'Topeka, Kansas' },
    Wichita: { timezone: 'America/Chicago', city: 'Wichita', fullName: 'Wichita, Kansas' },
    Goodland: { timezone: 'America/Denver', city: 'Goodland', fullName: 'Goodland, Kansas' },

    // ─── Idaho (split: Mountain & Pacific) ───
    'Idaho (Mountain)': {
        timezone: 'America/Boise',
        city: 'Boise',
        fullName: 'Boise, Idaho (Mountain)'
    },
    'Idaho (Pacific)': {
        timezone: 'America/Los_Angeles',
        city: 'Coeur d’Alene',
        fullName: 'Coeur d’Alene, Idaho (Pacific)'
    },
    // Individual cities
    Boise: { timezone: 'America/Boise', city: 'Boise', fullName: 'Boise, Idaho' },
    'Coeur d’Alene': { timezone: 'America/Los_Angeles', city: 'Coeur d’Alene', fullName: 'Coeur d’Alene, Idaho' },
    'Idaho Falls': { timezone: 'America/Boise', city: 'Idaho Falls', fullName: 'Idaho Falls, Idaho' },

    // ─── Nevada (Pacific, but some border towns use Mountain) ───
    'Nevada (Pacific)': {
        timezone: 'America/Los_Angeles',
        city: 'Carson City',
        fullName: 'Carson City, Nevada (Pacific)'
    },
    'Nevada (Mountain)': {
        timezone: 'America/Denver',
        city: 'West Wendover',
        fullName: 'West Wendover, Nevada (Mountain)'
    },
    // Individual cities
    'Carson City': { timezone: 'America/Los_Angeles', city: 'Carson City', fullName: 'Carson City, Nevada' },
    'West Wendover': { timezone: 'America/Denver', city: 'West Wendover', fullName: 'West Wendover, Nevada' },

    // ─── Michigan (Eastern, but 4 counties in Central) ───
    'Michigan (Eastern)': {
        timezone: 'America/Detroit',
        city: 'Lansing',
        fullName: 'Lansing, Michigan (Eastern)'
    },
    'Michigan (Central)': {
        timezone: 'America/Menominee',
        city: 'Iron Mountain',
        fullName: 'Iron Mountain, Michigan (Central)'
    },
    // Individual cities
    Lansing: { timezone: 'America/Detroit', city: 'Lansing', fullName: 'Lansing, Michigan' },
    Menominee: { timezone: 'America/Menominee', city: 'Menominee', fullName: 'Menominee, Michigan' },
    'Iron Mountain': { timezone: 'America/Menominee', city: 'Iron Mountain', fullName: 'Iron Mountain, Michigan' }
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const isValidIANATimezone = (tz: string): boolean =>
    !!(tz && tz.includes('/') && !tz.startsWith('UTC'));

const getFormattedTime = (timezone: string, hourFormat: '12hr' | '24hr') => {
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

/** Get short timezone abbreviation e.g. "CDT", "PST" */
const getTimezoneAbbr = (timezone: string): string => {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'short',
        }).formatToParts(new Date());
        return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    } catch {
        return '';
    }
};

/** WCAG relative luminance → black or white */
const getContrastColor = (hex: string): string => {
    const clean = hex.replace('#', '');
    if (clean.length < 6) return '#111827';
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    const toLinear = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    return L > 0.35 ? '#111827' : '#ffffff';
};

const FLAG_OVERLAY_TEXT = '#ffffff';
const TEXT_SHADOW = '0 1px 4px rgba(0,0,0,0.55), 0 0px 2px rgba(0,0,0,0.4)';

// Timezone → badge color
const TZ_BADGE_COLORS: Record<string, string> = {
    'America/New_York': '#3b82f6', // blue
    'America/Chicago': '#10b981', // green
    'America/Denver': '#f59e0b', // amber
    'America/Los_Angeles': '#8b5cf6', // purple
    'America/Phoenix': '#ef4444', // red
    'America/Anchorage': '#06b6d4', // cyan
    'Pacific/Honolulu': '#ec4899', // pink
    'America/Detroit': '#3b82f6',
    'America/Boise': '#f59e0b',
    'America/Indiana/Indianapolis': '#3b82f6',
};
const getTzBadgeColor = (tz: string) => TZ_BADGE_COLORS[tz] ?? '#64748b';

// ─── State Time Popup (now accepts stateInfo) ─────────────────────────────────

interface StateTimePopupProps {
    stateName: string;
    hourFormat: '12hr' | '24hr';
    onClose: () => void;
    stateInfo: Record<string, StateInfo>; // new prop
}

const StateTimePopup = ({ stateName, hourFormat, onClose, stateInfo }: StateTimePopupProps) => {
    const info = stateInfo[stateName];
    const [liveTime, setLiveTime] = useState('');
    const [liveDate, setLiveDate] = useState('');

    useEffect(() => {
        if (!info) return;
        const update = () => {
            const { time, date } = getFormattedTime(info.timezone, hourFormat);
            setLiveTime(time);
            setLiveDate(date);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [info, hourFormat]);

    if (!info) return null;

    const abbr = getTimezoneAbbr(info.timezone);
    const badgeColor = getTzBadgeColor(info.timezone);

    // Split time into number + AM/PM for 12hr, or just number for 24hr
    const timeParts = liveTime.split(' ');
    const timeNum = timeParts[0] ?? '';
    const timeAmPm = timeParts[1] ?? '';

    return (
        <div
            className="inline-flex flex-col p-3 rounded-xl bg-white flex-start text-gray-800 w-75"
            style={{
                boxShadow:
                    'rgba(60,78,102,0) 0px 267px 75px 0px, rgba(60,78,102,0.01) 0px 171px 68px 0px, rgba(60,78,102,0.05) 0px 96px 58px 0px, rgba(60,78,102,0.09) 0px 43px 43px 0px, rgba(60,78,102,0.1) 0px 11px 24px 0px',
            }}
        >
            <div className="flex flex-col gap-0 text-[#454057]">
                {/* City header block */}
                <div className="flex flex-col p-2 px-3 items-start justify-start bg-[#F5F6FA] rounded-lg mb-2">
                    <div className="flex flex-row justify-between mb-0.5 w-full">
                        <div>
                            <p className="font-sans text-xs text-gray-400 uppercase tracking-widest m-0 mb-0.5">
                                City
                            </p>
                            <h3 className="font-bold text-xl font-display tracking-wide m-0 leading-tight">
                                {info.fullName}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Time block */}
                <div className="px-2 pt-1">
                    <span className="text-sm px-1 uppercase text-gray-500 block mb-0.5">
                        {liveDate}
                    </span>
                    <div className="flex flex-row items-center justify-start px-1">
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-3xl font-bold font-display m-0 uppercase tracking-tight">
                                {timeNum}
                                {timeAmPm && (
                                    <span className="text-lg ml-1 font-semibold text-gray-500">
                                        {timeAmPm}
                                    </span>
                                )}
                            </p>
                            {abbr && (
                                <div
                                    className="text-white font-bold px-2 py-1 rounded-md text-sm"
                                    style={{ backgroundColor: badgeColor }}
                                >
                                    {abbr}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Close button */}
                <div className="pt-2 pb-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="hover:cursor-pointer bg-[#F5F6FA] hover:bg-gray-200 w-10 h-10 flex items-center justify-center rounded-md transition-colors"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Zone card styles ─────────────────────────────────────────────────────────

const zoneStyles: Record<TimeZoneKey, ZoneStyles> = {
    pk: { headerBg: 'bg-white', headerText: 'text-green-600', borderColor: '#a7f3d0', bgColor: '#16a34a' },
    eastern: { headerBg: 'bg-[#35BAAE]', headerText: 'text-white', borderColor: '#bfdbfe', bgColor: '#FFFFFF' },
    central: { headerBg: 'bg-[#EDC563]', headerText: 'text-white', borderColor: '#bbf7d0', bgColor: '#FFFFFF' },
    mountain: { headerBg: 'bg-[#FD887C]', headerText: 'text-white', borderColor: '#fde68a', bgColor: '#FFFFFF' },
    pacific: { headerBg: 'bg-[#38384F]', headerText: 'text-white', borderColor: '#e9d5ff', bgColor: '#FFFFFF' },
};

const defaultStyles: ZoneStyles = {
    headerBg: 'bg-[#324358]', headerText: 'text-white', borderColor: '#e2e8f0', bgColor: '#ffffff',
};

// ─── TimeCard ────────────────────────────────────────────────────────────────

const TimeCard = ({ zone, time, link, userName, customStyles, dynamicTime, dynamicDate }: TimeZoneProps) => {
    const styles = zoneStyles[time as TimeZoneKey] || defaultStyles;
    const useFlag = !!(customStyles?.useFlag && customStyles?.flagUrl);
    const isCustom = !!customStyles;

    const resolvedTextColor: string = (() => {
        if (customStyles?.textColor) return customStyles.textColor;
        if (useFlag) return FLAG_OVERLAY_TEXT;
        const bg = customStyles?.bgColor ?? styles.bgColor;
        if (bg?.startsWith('#')) return getContrastColor(bg);
        return '#111827';
    })();

    const borderColor = customStyles?.border ?? styles.borderColor;

    const cardStyle: React.CSSProperties = useFlag
        ? { backgroundImage: `url(${customStyles!.flagUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderColor }
        : { backgroundColor: customStyles?.bgColor ?? styles.bgColor, borderColor };

    const headerBgColor = customStyles?.headerBg;

    const resolvedHeaderTextColor: string = (() => {
        if (customStyles?.headerTextColor) return customStyles.headerTextColor;
        if (useFlag) return FLAG_OVERLAY_TEXT;
        if (headerBgColor?.startsWith('#')) return getContrastColor(headerBgColor);
        return undefined as unknown as string;
    })();

    const shadowStyle = isCustom ? { textShadow: TEXT_SHADOW } : {};
    const bodyText: React.CSSProperties = { color: resolvedTextColor, ...shadowStyle };

    return (
        <Link
            to={link}
            className="group relative flex flex-col items-center rounded-xl border shadow-sm hover:shadow-md transition-all hover:scale-[1.1] w-48 overflow-hidden no-underline"
            style={cardStyle}
        >
            {useFlag && <div className="absolute inset-0 bg-black/40 rounded-xl pointer-events-none" />}

            <div
                className={`w-full py-1 flex justify-center items-center relative z-10 ${!headerBgColor ? styles.headerBg : ''}`}
            // style={headerBgColor ? { backgroundColor: headerBgColor } : undefined}
            >
                <span
                    className={`font-bold text-[14px] ${!resolvedHeaderTextColor ? styles.headerText : ''}`}
                    style={resolvedHeaderTextColor ? { color: resolvedHeaderTextColor, ...shadowStyle } : undefined}
                >
                    {zone}
                </span>
            </div>

            <div className="flex flex-col items-center pt-4 pb-1 px-4 relative z-10">
                {/* {isCustom && userName && (
                    <span
                        className="text-[11px] font-semibold uppercase tracking-widest mb-1 px-2 py-0.5 rounded-full"
                        style={{ color: resolvedTextColor, backgroundColor: 'rgba(0,0,0,0.25)', textShadow: TEXT_SHADOW }}
                    >
                        {userName}
                    </span>
                )} */}
                <div className="flex items-start px-2 rounded-md">
                    <span className="text-[3rem] leading-[0.8] tracking-tight" style={bodyText}>
                        {dynamicTime ? dynamicTime.split(' ')[0] : '12:45'}
                    </span>
                    <span className="text-xl ml-1 -mt-1" style={bodyText}>
                        {dynamicTime ? dynamicTime.split(' ')[1] : 'PM'}
                    </span>
                </div>
                <p className="mt-2 text-xl uppercase tracking-wide m-0" style={bodyText}>
                    {dynamicDate || 'Sat Mar 28'}
                </p>
                <span className="text-sm transition-all duration-200 opacity-0 group-hover:opacity-100 inline-flex items-center gap-1" style={bodyText}>
                    zone details
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
            </div>
        </Link>
    );
};

// ─── Country Search Dropdown ──────────────────────────────────────────────────

interface CountrySearchProps {
    value: string;
    countries: CountryItem[];
    onChange: (country: CountryItem) => void;
}

const CountrySearch = ({ value, countries, onChange }: CountrySearchProps) => {
    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => { setQuery(value); }, [value]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = query.trim().length === 0
        ? countries.slice(0, 8)
        : countries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

    const handleSelect = (c: CountryItem) => { setQuery(c.name); setOpen(false); onChange(c); };

    return (
        <div ref={ref} className="relative w-full mb-4">
            <input
                type="text" value={query} autoComplete="off"
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start typing a country…"
            />
            {open && filtered.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-52 overflow-y-auto">
                    {filtered.map((c) => (
                        <li key={c.name} onMouseDown={() => handleSelect(c)} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm">
                            <img src={c.flag} alt={c.name} className="w-6 h-4 object-cover rounded-sm shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            <span>{c.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// ─── USA Timezone config ──────────────────────────────────────────────────────

const USA_ZONES: { key: TimeZoneKey; label: string; timezone: string }[] = [
    { key: 'pacific', label: 'Pacific time', timezone: 'America/Los_Angeles' },
    { key: 'mountain', label: 'Mountain time', timezone: 'America/Denver' },
    { key: 'central', label: 'Central time', timezone: 'America/Chicago' },
    { key: 'eastern', label: 'Eastern time', timezone: 'America/New_York' },
];

// ─── Fallback countries ───────────────────────────────────────────────────────

const FALLBACK_COUNTRIES: CountryItem[] = [
    { name: 'United States', timezone: 'America/New_York', flag: 'https://flagcdn.com/us.svg' },
    { name: 'Canada', timezone: 'America/Toronto', flag: 'https://flagcdn.com/ca.svg' },
    { name: 'United Kingdom', timezone: 'Europe/London', flag: 'https://flagcdn.com/gb.svg' },
    { name: 'Germany', timezone: 'Europe/Berlin', flag: 'https://flagcdn.com/de.svg' },
    { name: 'France', timezone: 'Europe/Paris', flag: 'https://flagcdn.com/fr.svg' },
    { name: 'Italy', timezone: 'Europe/Rome', flag: 'https://flagcdn.com/it.svg' },
    { name: 'Spain', timezone: 'Europe/Madrid', flag: 'https://flagcdn.com/es.svg' },
    { name: 'Netherlands', timezone: 'Europe/Amsterdam', flag: 'https://flagcdn.com/nl.svg' },
    { name: 'Switzerland', timezone: 'Europe/Zurich', flag: 'https://flagcdn.com/ch.svg' },
    { name: 'Australia', timezone: 'Australia/Sydney', flag: 'https://flagcdn.com/au.svg' },
    { name: 'New Zealand', timezone: 'Pacific/Auckland', flag: 'https://flagcdn.com/nz.svg' },
    { name: 'Japan', timezone: 'Asia/Tokyo', flag: 'https://flagcdn.com/jp.svg' },
    { name: 'China', timezone: 'Asia/Shanghai', flag: 'https://flagcdn.com/cn.svg' },
    { name: 'India', timezone: 'Asia/Kolkata', flag: 'https://flagcdn.com/in.svg' },
    { name: 'Pakistan', timezone: 'Asia/Karachi', flag: 'https://flagcdn.com/pk.svg' },
    { name: 'United Arab Emirates', timezone: 'Asia/Dubai', flag: 'https://flagcdn.com/ae.svg' },
    { name: 'Saudi Arabia', timezone: 'Asia/Riyadh', flag: 'https://flagcdn.com/sa.svg' },
    { name: 'South Africa', timezone: 'Africa/Johannesburg', flag: 'https://flagcdn.com/za.svg' },
    { name: 'Brazil', timezone: 'America/Sao_Paulo', flag: 'https://flagcdn.com/br.svg' },
    { name: 'Mexico', timezone: 'America/Mexico_City', flag: 'https://flagcdn.com/mx.svg' },
    { name: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', flag: 'https://flagcdn.com/ar.svg' },
    { name: 'Turkey', timezone: 'Europe/Istanbul', flag: 'https://flagcdn.com/tr.svg' },
    { name: 'Egypt', timezone: 'Africa/Cairo', flag: 'https://flagcdn.com/eg.svg' },
    { name: 'Russia', timezone: 'Europe/Moscow', flag: 'https://flagcdn.com/ru.svg' },
    { name: 'Singapore', timezone: 'Asia/Singapore', flag: 'https://flagcdn.com/sg.svg' },
    { name: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', flag: 'https://flagcdn.com/my.svg' },
    { name: 'Indonesia', timezone: 'Asia/Jakarta', flag: 'https://flagcdn.com/id.svg' },
    { name: 'Thailand', timezone: 'Asia/Bangkok', flag: 'https://flagcdn.com/th.svg' },
    { name: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', flag: 'https://flagcdn.com/vn.svg' },
    { name: 'South Korea', timezone: 'Asia/Seoul', flag: 'https://flagcdn.com/kr.svg' },
];

// ─── Homepage ─────────────────────────────────────────────────────────────────

const Homepage = () => {
    const { user, updateUser } = useStore();

    // ── Local UI state (not persisted) ──
    // const [showModal, setShowModal] = useState(false);
    const { showModal, setShowModal } = useStore();
    const [countriesList, setCountriesList] = useState<CountryItem[]>(FALLBACK_COUNTRIES);

    // Temporary modal state – initialized from store when modal opens
    const [tempUserName, setTempUserName] = useState(user.userName);
    const [tempSelectedCountry, setTempSelectedCountry] = useState(user.selectedCountry);
    const [tempCustomBgColor, setTempCustomBgColor] = useState(user.customBgColor);
    const [tempUseFlag, setTempUseFlag] = useState(user.useFlag);
    const [tempTruckAnimate, setTempTruckAnimate] = useState(user.truckAnimate);

    // ── State popup ──
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [popupAnchor, setPopupAnchor] = useState<{ x: number; y: number } | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const stateInputRef = useRef<HTMLInputElement>(null);

    // ── Dynamic state data ──
    const [stateInfo, setStateInfo] = useState<Record<string, StateInfo>>(DEFAULT_STATE_INFO);
    const [statesLoading, setStatesLoading] = useState(true);

    // ── Custom card live time (derived from store) ──
    const [customTime, setCustomTime] = useState('');
    const [customDate, setCustomDate] = useState('');

    // ── USA clocks live time (derived from store) ──
    const [usaTimes, setUsaTimes] = useState<Record<string, { time: string; date: string }>>({});
    const activeAccent = '#4EFFC5';

    // ── Fetch state data from API ──
    // useEffect(() => {
    //     const fetchStateData = async () => {
    //         try {
    //             // Replace with your actual API URL
    //             const response = await fetch('https://your-api.com/us-states.json');
    //             if (!response.ok) throw new Error('Failed to fetch');
    //             const data = await response.json();
    //             setStateInfo(data);
    //         } catch (error) {
    //             console.warn('Using fallback state data:', error);
    //             // Keep DEFAULT_STATE_INFO
    //         } finally {
    //             setStatesLoading(false);
    //         }
    //     };
    //     fetchStateData();
    // }, []);

    React.useEffect(() => {
        // Select all <g> elements that have an id attribute
        const stateGroups = document.querySelectorAll('g[id]');

        const handleMouseEnter = (event: Event) => {
            const element = event.currentTarget as SVGGElement;
            const groupId = element?.getAttribute('id');
            console.log(`Hovered over: ${groupId}`);
        };

        // Attach event listeners
        stateGroups.forEach((group) => {
            group.addEventListener('mouseover', handleMouseEnter);
        });

        // Cleanup: remove event listeners when component unmounts
        return () => {
            stateGroups.forEach((group) => {
                group.removeEventListener('mouseover', handleMouseEnter);
            });
        };
    }, []);

    // Sync temporary state when modal opens
    useEffect(() => {
        if (showModal) {
            setTempUserName(user.userName);
            setTempSelectedCountry(user.selectedCountry);
            setTempCustomBgColor(user.customBgColor);
            setTempUseFlag(user.useFlag);
            setTempTruckAnimate(user.truckAnimate);
        }
    }, [showModal, user]);

    // Fetch countries list
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,timezones,flags')
            .then((res) => res.json())
            .then((data) => {
                const countries: CountryItem[] = data
                    .map((c: any) => ({ name: c.name.common, timezone: c.timezones?.[0] || null, flag: c.flags?.png || c.flags?.svg || null }))
                    .filter((c: CountryItem) => c.timezone && isValidIANATimezone(c.timezone) && c.flag)
                    .sort((a: CountryItem, b: CountryItem) => a.name.localeCompare(b.name));
                if (countries.length > 0) setCountriesList(countries);
            })
            .catch(console.error);
    }, []);

    // Live tick for custom card
    useEffect(() => {
        if (!user.selectedCountry.timezone || !isValidIANATimezone(user.selectedCountry.timezone)) return;
        const update = () => {
            const { time, date } = getFormattedTime(user.selectedCountry.timezone, user.timeformat);
            if (time) setCustomTime(time);
            if (date) setCustomDate(date);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [user.selectedCountry.timezone, user.timeformat]);

    // Live tick for USA clocks
    useEffect(() => {
        const update = () => {
            const newTimes = USA_ZONES.reduce((acc, z) => {
                const { time, date } = getFormattedTime(z.timezone, user.timeformat);
                acc[z.key] = { time, date };
                return acc;
            }, {} as Record<string, { time: string; date: string }>);
            setUsaTimes(newTimes);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [user.timeformat]);

    // Handle state selection from the input
    const handleStateSelect = useCallback((value: string, inputEl: HTMLInputElement) => {
        const match = stateInfo[value];
        if (!match) return;
        const rect = inputEl.getBoundingClientRect();
        setSelectedState(value);
        setPopupAnchor({ x: rect.left, y: rect.bottom + window.scrollY + 8 });
    }, [stateInfo]);

    // Close popup on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                if (stateInputRef.current && stateInputRef.current.contains(e.target as Node)) return;
                setSelectedState(null);
                setPopupAnchor(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Handlers for direct store updates
    const handleDisplayModeChange = (mode: 'name' | 'abbr' | 'blank') => {
        updateUser({ mapstatename: mode });
    };

    const handleHourFormatChange = (fmt: '12hr' | '24hr') => {
        updateUser({ timeformat: fmt });
    };

    const handleModalApply = () => {
        updateUser({
            userName: tempUserName,
            selectedCountry: tempSelectedCountry,
            customBgColor: tempCustomBgColor,
            useFlag: tempUseFlag,
            truckAnimate: tempTruckAnimate,
        });
        setShowModal(false);
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    // Get current values from store
    const { userName, selectedCountry, customBgColor, useFlag, timeformat, mapstatename } = user;

    // Preview text color for modal (just for preview, not used in main card)
    const previewTextColor: string = (() => {
        if (tempUseFlag && tempSelectedCountry.flag) return FLAG_OVERLAY_TEXT;
        return tempCustomBgColor.startsWith('#') ? getContrastColor(tempCustomBgColor) : '#111827';
    })();

    const printMap = (svgElementId: string): void => {
        const originalSvg = document.getElementById(svgElementId);
        if (!originalSvg) return;

        // Clone the SVG
        const clonedSvg = originalSvg.cloneNode(true) as SVGSVGElement;

        // ✅ Inline computed styles from original elements onto cloned elements
        const originalElements = originalSvg.querySelectorAll('*');
        const clonedElements = clonedSvg.querySelectorAll('*');

        originalElements.forEach((originalEl, index) => {
            const clonedEl = clonedElements[index] as SVGElement;
            if (!clonedEl) return;

            const computedStyle = window.getComputedStyle(originalEl);

            // Only copy relevant SVG style properties
            const svgStyleProps = [
                'fill', 'stroke', 'stroke-width', 'opacity',
                'fill-opacity', 'stroke-opacity', 'display',
                'visibility', 'color', 'stop-color', 'stop-opacity'
            ];

            svgStyleProps.forEach(prop => {
                const value = computedStyle.getPropertyValue(prop);
                if (value) {
                    clonedEl.style.setProperty(prop, value);
                }
            });
        });

        // Build print HTML with inlined SVG (no Tailwind needed)
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow!.document;
        iframeDoc.open();
        iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print US Map</title>
            <style>
              * {
                print-color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              body {
                margin: 0;
                padding: 20px;
                background: white;
              }
              svg {
                width: 100%;
                height: auto;
                max-width: 1300px;
              }
            </style>
          </head>
          <body>${clonedSvg.outerHTML}</body>
        </html>
    `);
        iframeDoc.close();

        // ✅ Wait for iframe to fully render before printing
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.print();
                document.body.removeChild(iframe);
            }, 100);
        };
    };

    return (
        <>
            <Header />
            <main className={`p-4 mt-2 md:p-8 min-h-screen ${user.mode == "light" ? "bg-[#F5F6FA]" : "bg-[#1B1B1F]"}`}>
                <div className="flex flex-col md:flex-row justify-center md:justify-around items-center gap-6 md:gap-0">
                    <div onClick={() => setShowModal(true)} className="cursor-pointer">
                        <TimeCard
                            zone={selectedCountry.name}
                            time="pk"
                            link="/"
                            userName={userName}
                            customStyles={{
                                bgColor: customBgColor,
                                headerBg: customBgColor,
                                headerTextColor: undefined, // auto-contrast
                                textColor: undefined,
                                flagUrl: selectedCountry.flag,
                                useFlag: useFlag && !!selectedCountry.flag,
                            }}
                            dynamicTime={customTime}
                            dynamicDate={customDate}
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {USA_ZONES.map((z) => (
                            <TimeCard
                                key={z.key}
                                zone={z.label}
                                time={z.key}
                                link="/"
                                dynamicTime={usaTimes[z.key]?.time}
                                dynamicDate={usaTimes[z.key]?.date}
                            />
                        ))}
                    </div>
                </div>

                {/* Controls bar */}
                <div className="w-4/5 bg-white p-5 py-2 my-8 mx-auto rounded-2xl flex flex-wrap justify-between items-center gap-3 shadow-md">
                    {(['name', 'abbr', 'blank'] as const).map((mode) => (
                        <div
                            key={mode}
                            onClick={() => handleDisplayModeChange(mode)}
                            className={`py-2 select-none px-3 text-sm sm:text-base rounded-md cursor-pointer transition-colors capitalize ${mapstatename === mode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            style={mapstatename === mode ? { background: activeAccent, color: '#0a0a0f' } : {}}

                        >
                            {mode}
                        </div>
                    ))}

                    {(['12hr', '24hr'] as const).map((fmt) => (
                        <div
                            key={fmt}
                            onClick={() => handleHourFormatChange(fmt)}
                            className={`py-2 px-3 select-none text-sm sm:text-base rounded-md cursor-pointer transition-all duration-200 ease-out flex items-center gap-1 ${timeformat === fmt ? 'bg-green-500 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {timeformat === fmt && (
                                <img
                                    className="w-5 filter brightness-0 invert"
                                    src={`/${fmt === '12hr' ? '12' : '24'}hour.png`}
                                    alt={fmt}
                                />
                            )}
                            {fmt.toUpperCase()}
                            {timeformat === fmt && <span className="ml-1 text-white text-xs">⏰</span>}
                        </div>
                    ))}

                    {/* State search — popup trigger */}
                    <div className="relative">
                        <input
                            ref={stateInputRef}
                            type="text"
                            list="usstates"
                            placeholder="Find State or City"
                            className="py-2 px-3 text-sm sm:text-base w-full sm:w-48 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                                const val = e.target.value.trim();
                                if (stateInfo[val]) {
                                    handleStateSelect(val, e.target);
                                } else {
                                    setSelectedState(null);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (stateInfo[val]) handleStateSelect(val, e.target as HTMLInputElement);
                                }
                            }}
                            onFocus={(e) => {
                                const val = e.target.value.trim();
                                if (stateInfo[val] && selectedState === null) {
                                    handleStateSelect(val, e.target);
                                }
                            }}
                        />
                        <datalist id="usstates">
                            {Object.keys(stateInfo).map((s) => (
                                <option key={s} value={s} />
                            ))}
                        </datalist>
                        {/* {statesLoading && (
                            <div className="absolute right-2 top-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            </div>
                        )} */}
                    </div>

                    <img onClick={() => printMap('us-map-svg')} className="w-7 cursor-pointer" src="/printer.png" alt="printer" draggable={false} />
                    <Togglemode />
                </div>

                {/* State time popup — passes stateInfo */}
                {selectedState && stateInfo[selectedState] && (
                    <div
                        ref={popupRef}
                        className="fixed z-50 animate-fadeIn"
                        style={{
                            left: Math.min(popupAnchor?.x ?? 100, window.innerWidth - 320),
                            top: popupAnchor?.y ?? 120,
                        }}
                    >
                        <StateTimePopup
                            stateName={selectedState}
                            hourFormat={timeformat}
                            onClose={() => {
                                setSelectedState(null);
                                setPopupAnchor(null);
                                if (stateInputRef.current) stateInputRef.current.value = '';
                            }}
                            stateInfo={stateInfo}
                        />
                    </div>
                )}

                {mapstatename === 'name' && <MapwithState />}
                {mapstatename === 'abbr' && <MapwithStateabbr />}
                {mapstatename === 'blank' && <MapwithStateBlank />}

                <USTimeZones stateInfo={stateInfo} />

            </main>

            {/* Customization modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Customize Card</h2>

                        <label className="block mb-1 font-medium">Enter Your Good Name</label>
                        <input
                            type="text"
                            value={tempUserName}
                            onChange={(e) => setTempUserName(e.target.value)}
                            placeholder="Dispatcher"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <label className="block mb-2 font-medium">Country / Timezone</label>
                        <CountrySearch
                            value={tempSelectedCountry.name}
                            countries={countriesList}
                            onChange={(c) => {
                                if (isValidIANATimezone(c.timezone)) setTempSelectedCountry(c);
                            }}
                        />

                        <div className="mb-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="truckanimation"
                                checked={tempTruckAnimate}
                                onChange={(e) => setTempTruckAnimate(e.target.checked)}
                                className="w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="truckanimation" className="font-medium cursor-pointer select-none">
                                Show Vehicle Animation
                            </label>
                        </div>

                        <div className="mb-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="useFlag"
                                checked={tempUseFlag && !!tempSelectedCountry.flag}
                                onChange={(e) => setTempUseFlag(e.target.checked)}
                                className="w-4 h-4 cursor-pointer"
                                disabled={!tempSelectedCountry.flag}
                            />
                            <label htmlFor="useFlag" className="font-medium cursor-pointer select-none">
                                Show country flag as background
                            </label>
                        </div>

                        {!(tempUseFlag && tempSelectedCountry.flag) && (
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Background Color</label>
                                <input
                                    type="color"
                                    value={tempCustomBgColor}
                                    onChange={(e) => setTempCustomBgColor(e.target.value)}
                                    className="w-full h-10 border rounded-md cursor-pointer"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={handleModalCancel}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModalApply}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default Homepage;