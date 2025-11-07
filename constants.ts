// FIX: Changed import from './types' to './types' to break circular dependency after swapping file contents.
import { EntityType, Holiday } from './types';

export const COLORS: Record<EntityType, string> = {
  [EntityType.Project]: 'bg-indigo-500',
  [EntityType.What]: 'bg-pink-500',
  [EntityType.When]: 'bg-amber-500',
  [EntityType.Who]: 'bg-emerald-500',
  [EntityType.Where]: 'bg-sky-500',
};

export const PROJECT_COLOR_CLASSES: Record<string, string> = {
    blue: 'border-blue-500 bg-blue-500/10',
    green: 'border-green-500 bg-green-500/10',
    pink: 'border-pink-500 bg-pink-500/10',
    purple: 'border-purple-500 bg-purple-500/10',
    orange: 'border-orange-500 bg-orange-500/10',
    yellow: 'border-yellow-500 bg-yellow-500/10',
};

export const PROJECT_CATEGORIES: string[] = [
    'Work',
    'Health',
    'Finance',
    'Home',
    'Personal',
    'Education',
    'Travel',
];

export const HOLIDAY_CATEGORIES = [
    { id: 'US', labelKey: 'usHolidays' as const },
    { id: 'Canada', labelKey: 'canadaHolidays' as const },
    { id: 'UK', labelKey: 'ukHolidays' as const },
    { id: 'Christian', labelKey: 'christianHolidays' as const },
    { id: 'Jewish', labelKey: 'jewishHolidays' as const },
];

// Simplified Holiday Data for 2025
export const HOLIDAY_DATA: Record<string, Holiday[]> = {
    'US': [
        { name: 'New Year\'s Day', date: new Date('2025-01-01T12:00:00Z'), category: 'US' },
        { name: 'Martin Luther King Jr. Day', date: new Date('2025-01-20T12:00:00Z'), category: 'US' },
        { name: 'Presidents\' Day', date: new Date('2025-02-17T12:00:00Z'), category: 'US' },
        { name: 'Memorial Day', date: new Date('2025-05-26T12:00:00Z'), category: 'US' },
        { name: 'Juneteenth', date: new Date('2025-06-19T12:00:00Z'), category: 'US' },
        { name: 'Independence Day', date: new Date('2025-07-04T12:00:00Z'), category: 'US' },
        { name: 'Labor Day', date: new Date('2025-09-01T12:00:00Z'), category: 'US' },
        { name: 'Thanksgiving Day', date: new Date('2025-11-27T12:00:00Z'), category: 'US' },
        { name: 'Christmas Day', date: new Date('2025-12-25T12:00:00Z'), category: 'US' },
    ],
    'Christian': [
        { name: 'Good Friday', date: new Date('2025-04-18T12:00:00Z'), category: 'Christian' },
        { name: 'Easter', date: new Date('2025-04-20T12:00:00Z'), category: 'Christian' },
    ],
    'Jewish': [
        { name: 'Rosh Hashanah', date: new Date('2025-09-22T12:00:00Z'), category: 'Jewish' },
        { name: 'Yom Kippur', date: new Date('2025-10-01T12:00:00Z'), category: 'Jewish' },
    ]
};
