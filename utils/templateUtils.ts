import { ProjectTemplate, EventNode, EntityType, WhatType } from '../types';

/**
 * Generates an array of EventNode objects from a project template and a start date.
 * @param template The project template to use.
 * @param projectId The ID of the new project these events will belong to.
 * @param projectStartDate The starting date for the project.
 * @returns An array of new EventNode objects.
 */
export function generateEventsFromTemplate(
    template: ProjectTemplate,
    projectId: number,
    projectStartDate: Date,
): EventNode[] {
    let cumulativeOffset = 0;
    
    return template.events
        .sort((a, b) => a.sequence - b.sequence)
        .map(templateEvent => {
            const eventStartDate = new Date(projectStartDate);
            eventStartDate.setDate(projectStartDate.getDate() + cumulativeOffset);

            const eventEndDate = new Date(eventStartDate);
            const duration = Math.max(1, templateEvent.durationDays);
            eventEndDate.setDate(eventStartDate.getDate() + duration - 1);
            
            cumulativeOffset += duration;

            return {
                id: Date.now() + Math.random(),
                projectId: projectId,
                what: {
                    id: `what-${Date.now() + Math.random()}`,
                    name: templateEvent.whatName,
                    description: templateEvent.description,
                    type: EntityType.What,
                    whatType: templateEvent.whatType,
                },
                when: {
                    id: `when-${Date.now() + Math.random()}`,
                    name: eventStartDate.toISOString(),
                    timestamp: eventStartDate.toISOString(),
                    display: eventStartDate.toLocaleString(),
                    type: EntityType.When,
                },
                endWhen: duration > 1 ? {
                    id: `endwhen-${Date.now() + Math.random()}`,
                    name: eventEndDate.toISOString(),
                    timestamp: eventEndDate.toISOString(),
                    display: eventEndDate.toLocaleString(),
                    type: EntityType.When,
                } : undefined,
                who: [],
                whereId: '', // Needs to be assigned by user later
            };
        });
}