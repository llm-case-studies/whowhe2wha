import { ParsedEvent } from '../types';

/**
 * Parses an iCalendar date string into a JavaScript Date object.
 * Supports 'YYYYMMDDTHHMMSSZ' (UTC) and 'YYYYMMDD' formats.
 * @param dateStr The date string from the ICS file.
 * @returns A Date object.
 */
function parseICSDate(dateStr: string): Date {
    // T...Z indicates UTC
    if (dateStr.includes('T') && dateStr.endsWith('Z')) {
        const year = parseInt(dateStr.substring(0, 4), 10);
        const month = parseInt(dateStr.substring(4, 6), 10) - 1;
        const day = parseInt(dateStr.substring(6, 8), 10);
        const hour = parseInt(dateStr.substring(9, 11), 10);
        const minute = parseInt(dateStr.substring(11, 13), 10);
        const second = parseInt(dateStr.substring(13, 15), 10);
        return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    // Just date (all-day event)
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    return new Date(year, month, day);
}

/**
 * Parses the content of an .ics file into an array of event objects.
 * This is a simplified parser and may not support all iCalendar features.
 * @param icsContent The raw string content of the .ics file.
 * @returns An array of ParsedEvent objects.
 */
export function parseICS(icsContent: string): ParsedEvent[] {
    const events: ParsedEvent[] = [];
    
    // Unfold multi-line properties (lines starting with a space are continuations)
    const unfoldedContent = icsContent.replace(/\r\n /g, '');

    // Split the content into individual VEVENT blocks
    const eventBlocks = unfoldedContent.split('BEGIN:VEVENT').slice(1);

    for (const block of eventBlocks) {
        const lines = block.split(/\r?\n/);
        const eventData: Partial<ParsedEvent> & { summary?: string } = {};

        for (const line of lines) {
            const separatorIndex = line.indexOf(':');
            if (separatorIndex === -1) continue;
            
            const key = line.substring(0, separatorIndex);
            const value = line.substring(separatorIndex + 1);

            switch (key.split(';')[0]) { // Handle params like DTSTART;TZID=...
                case 'SUMMARY':
                    eventData.summary = value;
                    break;
                case 'DTSTART':
                    eventData.startDate = parseICSDate(value);
                    break;
                case 'DTEND':
                    eventData.endDate = parseICSDate(value);
                    break;
                case 'LOCATION':
                    eventData.location = value;
                    break;
                case 'DESCRIPTION':
                    eventData.description = value.replace(/\\n/g, '\n');
                    break;
            }
        }
        
        // Ensure the essential parts of the event were found
        if (eventData.summary && eventData.startDate) {
             events.push({
                summary: eventData.summary,
                startDate: eventData.startDate,
                endDate: eventData.endDate,
                location: eventData.location,
                description: eventData.description,
             });
        }
    }
    return events;
}
