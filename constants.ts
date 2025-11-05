
import { EntityType, Project, EventNode, WhatType, Contact } from './types';

export const COLORS: Record<EntityType, string> = {
  [EntityType.Who]: 'bg-who-pink',
  [EntityType.Where]: 'bg-where-green',
  [EntityType.When]: 'bg-when-orange',
  [EntityType.What]: 'bg-what-purple',
  [EntityType.Project]: 'bg-wha-blue',
};

export const MOCK_PROJECTS: Project[] = [
    { id: 1, name: 'Dental Implant Treatment', description: 'Complete implant process for tooth #19', status: 'Active' },
    { id: 2, name: 'Q3 2024 Taxation', description: 'Prepare and file quarterly business taxes', status: 'Active' },
    { id: 3, name: 'Household Errands', description: 'Weekly tasks and appointments', status: 'On Hold' },
];

export const MOCK_EVENTS: EventNode[] = [
    {
        id: 1,
        projectId: 1,
        what: { id: 'w1', name: 'Initial Consultation', description: 'Discuss treatment plan and costs.', type: EntityType.What, whatType: WhatType.Appointment },
        when: { id: 't1', name: '2024-08-15 10:00', timestamp: '2024-08-15T10:00:00.000Z', display: 'Aug 15 2024 10:00 AM', type: EntityType.When },
        who: [{ id: 'p1', name: 'Dr. Smith', type: EntityType.Who }],
        where: { id: 'l1', name: 'Springfield Dental Clinic, 123 Main St, Springfield, USA', latitude: 37.7749, longitude: -122.4194, type: EntityType.Where },
    },
    {
        id: 2,
        projectId: 1,
        what: { id: 'w2', name: 'Implant Surgery', description: 'Placement of the titanium implant.', type: EntityType.What, whatType: WhatType.Appointment },
        when: { id: 't2', name: '2024-09-01 14:00', timestamp: '2024-09-01T14:00:00.000Z', display: 'Sep 1 2024 2:00 PM', type: EntityType.When },
        who: [{ id: 'p1', name: 'Dr. Smith', type: EntityType.Who }],
        where: { id: 'l1', name: 'Springfield Dental Clinic, 123 Main St, Springfield, USA', latitude: 37.7749, longitude: -122.4194, type: EntityType.Where },
    },
    {
        id: 3,
        projectId: 2,
        what: { id: 'w3', name: 'Gather Financials', description: 'Collect all P&L statements and receipts.', type: EntityType.What, whatType: WhatType.Milestone },
        when: { id: 't3', name: '2024-09-10', timestamp: '2024-09-10T23:59:59.000Z', display: 'Sep 10 2024', type: EntityType.When },
        who: [{ id: 'p2', name: 'Accountant', type: EntityType.Who }],
        where: { id: 'l2', name: 'Home Office', type: EntityType.Where },
    },
    {
        id: 4,
        projectId: 2,
        what: { id: 'w4', name: 'File Taxes', description: 'Submit final tax forms online.', type: EntityType.What, whatType: WhatType.Deadline },
        when: { id: 't4', name: '2024-09-15', timestamp: '2024-09-15T23:59:59.000Z', display: 'Sep 15 2024', type: EntityType.When },
        who: [{ id: 'p2', name: 'Accountant', type: EntityType.Who }],
        where: { id: 'l2', name: 'Home Office', type: EntityType.Where },
    },
    {
        id: 5,
        projectId: 3,
        what: { id: 'w5', name: 'Grocery Shopping', description: 'Buy weekly groceries.', type: EntityType.What, whatType: WhatType.Checkpoint },
        when: { id: 't5', name: '2024-08-17 11:00', timestamp: '2024-08-17T11:00:00.000Z', display: 'Aug 17 2024 11:00 AM', type: EntityType.When },
        who: [],
        where: { id: 'l3', name: 'Downtown Market', type: EntityType.Where, latitude: 37.773, longitude: -122.42 },
    },
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 1, name: 'Dr. Evelyn Smith', role: 'Lead Dentist', locationName: 'Springfield Dental Clinic, 123 Main St, Springfield, USA' },
    { id: 2, name: 'John Doe', role: 'Office Manager', locationName: 'Springfield Dental Clinic, 123 Main St, Springfield, USA' },
];
