import { EventNode, Project, Location } from '../types';

/**
 * Folds a long line according to iCalendar spec (75 octet limit).
 * @param line The line to fold.
 * @returns The folded line with CRLF and a space for continuation.
 */
function foldLine(line: string): string {
    const maxLen = 75;
    if (line.length <= maxLen) {
        return line;
    }
    let result = line.substring(0, maxLen);
    let rest = line.substring(maxLen);
    while (rest.length > 0) {
        result += '\r\n ' + rest.substring(0, maxLen - 1);
        rest = rest.substring(maxLen - 1);
    }
    return result;
}

/**
 * Formats a Date object into an iCalendar UTC datetime string (YYYYMMDDTHHMMSSZ).
 * @param date The date to format.
 * @returns The formatted date string.
 */
function formatICSDate(date: Date): string {
    return date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
}

/**
 * Generates an iCalendar (.ics) file content string from application data.
 * @param events Array of EventNode objects.
 * @param projects Array of Project objects.
 * @param locations Array of Location objects.
 * @returns A string representing the content of an .ics file.
 */
export function generateICS(events: EventNode[], projects: Project[], locations: Location[]): string {
    const projectMap = new Map(projects.map(p => [p.id, p.name]));
    const locationMap = new Map(locations.map(l => [l.id, l.alias || l.name]));

    let icsString = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//whowhe2wha//Unified Context Engine//EN',
    ];

    for (const event of events) {
        if (!event.when) continue;

        const projectName = projectMap.get(event.projectId) || 'Uncategorized';
        const locationName = locationMap.get(event.whereId) || '';

        let description = `Project: ${projectName}\r\n`;
        if (event.what.description) {
            description += `Notes: ${event.what.description.replace(/\n/g, '\\n')}\r\n`;
        }
        if (event.who.length > 0) {
            description += `Attendees: ${event.who.map(w => w.name).join(', ')}\r\n`;
        }

        icsString.push('BEGIN:VEVENT');
        icsString.push(foldLine(`UID:${event.id}@whowhe2wha.com`));
        icsString.push(foldLine(`DTSTAMP:${formatICSDate(new Date())}`));
        icsString.push(foldLine(`DTSTART:${formatICSDate(new Date(event.when.timestamp))}`));
        if (event.endWhen) {
            icsString.push(foldLine(`DTEND:${formatICSDate(new Date(event.endWhen.timestamp))}`));
        }
        icsString.push(foldLine(`SUMMARY:${event.what.name}`));
        if (description.trim()) {
            icsString.push(foldLine(`DESCRIPTION:${description}`));
        }
        if (locationName) {
            icsString.push(foldLine(`LOCATION:${locationName}`));
        }
        icsString.push('END:VEVENT');
    }

    icsString.push('END:VCALENDAR');

    return icsString.join('\r\n');
}