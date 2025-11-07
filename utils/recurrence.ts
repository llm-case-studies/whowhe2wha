import { EventNode } from '../types';

/**
 * Expands recurring events into individual instances within a given date range.
 * @param baseEvents The array of all event nodes, including master recurring events.
 * @param viewStartDate The start date of the window to generate events for.
 * @param viewEndDate The end date of the window.
 * @returns A new array of events with recurring instances expanded.
 */
export function expandRecurringEvents(baseEvents: EventNode[], viewStartDate: Date, viewEndDate: Date): EventNode[] {
    const expandedEvents: EventNode[] = [];

    for (const event of baseEvents) {
        if (!event.recurrence || !event.when) {
            // Not a recurring event or has no start date, add it as is if it falls in the view window
            const eventDate = event.when ? new Date(event.when.timestamp) : null;
            if (!eventDate || (eventDate >= viewStartDate && eventDate <= viewEndDate)) {
                 expandedEvents.push(event);
            }
            continue;
        }

        const recurrence = event.recurrence;
        const startDate = new Date(event.when.timestamp);
        const recurrenceEndDate = recurrence.endDate ? new Date(recurrence.endDate) : viewEndDate;
        
        // Clamp the end date to the view window's end date
        const finalEndDate = recurrenceEndDate < viewEndDate ? recurrenceEndDate : viewEndDate;
        
        let currentDate = new Date(startDate);
        
        // If the event starts after the final end date, we can skip it.
        if(currentDate > finalEndDate) {
            continue;
        }

        while (currentDate <= finalEndDate) {
            // Only add instances that are within the view window
            if (currentDate >= viewStartDate) {
                const durationMs = event.endWhen ? new Date(event.endWhen.timestamp).getTime() - new Date(event.when.timestamp).getTime() : 0;
                
                const newWhen: EventNode['when'] = {
                    ...event.when,
                    timestamp: currentDate.toISOString(),
                    display: currentDate.toLocaleString(),
                };

                const newEndWhen: EventNode['endWhen'] = event.endWhen ? {
                    ...event.endWhen,
                    timestamp: new Date(currentDate.getTime() + durationMs).toISOString(),
                    display: new Date(currentDate.getTime() + durationMs).toLocaleString(),
                } : undefined;

                expandedEvents.push({
                    ...event,
                    when: newWhen,
                    endWhen: newEndWhen,
                });
            }

            // Move to the next occurrence
            switch (recurrence.frequency) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
            }
        }
    }

    return expandedEvents;
}