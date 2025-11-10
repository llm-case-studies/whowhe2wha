import { TimelineScale } from '../types';

export const TIMELINE_SCALE_ORDER: TimelineScale[] = ['week', 'month', 'quarter', 'year'];
const MS_IN_DAY = 24 * 60 * 60 * 1000;

export const MIN_TIMELINE_DURATION_MS = 3 * MS_IN_DAY; // 3 days
export const MAX_TIMELINE_DURATION_MS = 730 * MS_IN_DAY; // ~2 years

export const getTimelineDurationMs = (scale: TimelineScale, referenceDate: Date): number => {
    switch (scale) {
        case 'week':
            return 7 * MS_IN_DAY;
        case 'month': {
            const daysInMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0).getDate();
            return daysInMonth * MS_IN_DAY;
        }
        case 'quarter':
            return Math.round(91.25 * MS_IN_DAY);
        case 'year': {
            const isLeap = new Date(referenceDate.getFullYear(), 1, 29).getDate() === 29;
            return (isLeap ? 366 : 365) * MS_IN_DAY;
        }
        default:
            return 30 * MS_IN_DAY;
    }
};

export const getNearestTimelineScale = (durationMs: number, referenceDate: Date): TimelineScale => {
    let closestScale: TimelineScale = TIMELINE_SCALE_ORDER[0];
    let closestDiff = Number.POSITIVE_INFINITY;
    TIMELINE_SCALE_ORDER.forEach(scale => {
        const baseDuration = getTimelineDurationMs(scale, referenceDate);
        const diff = Math.abs(Math.log(durationMs) - Math.log(baseDuration));
        if (diff < closestDiff) {
            closestScale = scale;
            closestDiff = diff;
        }
    });
    return closestScale;
};
