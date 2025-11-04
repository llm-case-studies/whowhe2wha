import { EventNode } from '../types';

export const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
};

export const getMonthGrid = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(date);
    const grid: (Date|null)[] = Array(firstDay).fill(null);
    return grid.concat(daysInMonth);
};

export const getWeekDays = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });
};

export const getMonthsForQuarter = (date: Date): Date[] => {
    const quarter = Math.floor(date.getMonth() / 3);
    const year = date.getFullYear();
    return Array.from({ length: 3 }, (_, i) => new Date(year, quarter * 3 + i, 1));
};

export const getMonthsForYear = (date: Date): Date[] => {
    const year = date.getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

export type TimeOfDay = 'morning' | 'midday' | 'afternoon';

export const getTimeOfDay = (date: Date): TimeOfDay => {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'midday';
    return 'afternoon';
};

export const getEventsForDay = (events: EventNode[], day: Date): EventNode[] => {
    return events
        .filter(e => isSameDay(new Date(e.when.timestamp), day))
        .sort((a, b) => new Date(a.when.timestamp).getTime() - new Date(b.when.timestamp).getTime());
};

export const getEventsForMonth = (events: EventNode[], month: Date): EventNode[] => {
    return events.filter(e => {
        const eventDate = new Date(e.when.timestamp);
        return eventDate.getFullYear() === month.getFullYear() && eventDate.getMonth() === month.getMonth();
    });
};