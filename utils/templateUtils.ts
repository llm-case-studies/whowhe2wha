// utils/templateUtils.ts

export interface DurationInfo {
  startOffsetDays: number;
  durationDays: number;
}

/**
 * Parses a template event title to find duration-related keywords.
 * @param title The title of the template event, e.g., "Week 1-4: Build Base Mileage".
 * @returns A DurationInfo object if a pattern is matched, otherwise null.
 */
export function parseTemplateEventDuration(title: string): DurationInfo | null {
  // Try to match "Week X-Y"
  const weekRangeMatch = title.match(/Week (\d+)-(\d+)/i);
  if (weekRangeMatch) {
    const startWeek = parseInt(weekRangeMatch[1], 10);
    const endWeek = parseInt(weekRangeMatch[2], 10);
    if (!isNaN(startWeek) && !isNaN(endWeek) && endWeek >= startWeek) {
      return {
        startOffsetDays: (startWeek - 1) * 7,
        durationDays: (endWeek - startWeek + 1) * 7,
      };
    }
  }

  // Try to match "Week X"
  const singleWeekMatch = title.match(/Week (\d+)/i);
  if (singleWeekMatch) {
    const week = parseInt(singleWeekMatch[1], 10);
    if (!isNaN(week)) {
      return {
        startOffsetDays: (week - 1) * 7,
        durationDays: 7,
      };
    }
  }
  
  // Try to match "Day X"
  const dayMatch = title.match(/Day (\d+)/i);
  if (dayMatch) {
    const day = parseInt(dayMatch[1], 10);
    if (!isNaN(day)) {
        return {
            startOffsetDays: day - 1,
            durationDays: 1,
        }
    }
  }
  
  return null; // No parsable duration found
}