import { EventNode, EntityType, Project, Contact } from './types';

export const COLORS: { [key in EntityType]: string } = {
  [EntityType.Who]: 'bg-who-pink',
  [EntityType.Where]: 'bg-where-green',
  [EntityType.What]: 'bg-wha-blue',
  [EntityType.When]: 'bg-wha-blue',
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Dental Implant Treatment',
    description: 'Complete treatment plan for a molar implant with Dr. Smith.',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Startup Fundraising (Series A)',
    description: 'Secure Series A funding for the whowhe2wha concept.',
    status: 'Active',
  },
  {
    id: 3,
    name: '2025 Tax Preparation',
    description: 'Organize and file annual taxes.',
    status: 'On Hold',
  },
  {
    id: 4,
    name: 'Town Errands',
    description: 'Miscellaneous tasks to run in the downtown area.',
    status: 'Completed',
  }
];

export const MOCK_EVENTS: EventNode[] = [
  {
    id: 1,
    projectId: 1,
    what: { id: 'what-1', name: 'Initial Consultation & Scan', description: 'Discuss implant procedure and get 3D scan.', type: EntityType.What },
    when: { id: 'when-1', timestamp: '2025-11-15T15:00:00Z', display: 'Nov 15, 2025, 3:00 PM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    where: { id: 'where-1', name: 'Springfield Clinic', type: EntityType.Where, latitude: 39.7837, longitude: -89.6502 },
  },
  {
    id: 2,
    projectId: 2,
    what: { id: 'what-2', name: 'VC Pitch Practice', description: 'Dry run of the Series A funding pitch.', type: EntityType.What },
    when: { id: 'when-2', timestamp: '2025-11-20T10:00:00Z', display: 'Nov 20, 2025, 10:00 AM', type: EntityType.When },
    who: [
        { id: 'who-2', name: 'Sarah (Founder)', type: EntityType.Who },
        { id: 'who-3', name: 'VC Firm Mentors', type: EntityType.Who }
    ],
    where: { id: 'where-2', name: 'Zoom Room', type: EntityType.Where },
  },
  {
    id: 3,
    projectId: 1,
    what: { id: 'what-3', name: 'Implant Surgery', description: 'Placement of the titanium implant.', type: EntityType.What },
    when: { id: 'when-3', timestamp: '2025-11-29T11:30:00Z', display: 'Nov 29, 2025, 11:30 AM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    where: { id: 'where-1', name: 'Springfield Clinic', type: EntityType.Where, latitude: 39.7837, longitude: -89.6502 },
  },
  {
    id: 4,
    projectId: 3,
    what: { id: 'what-4', name: 'Gather Tax Documents', description: 'Collect all W2s, 1099s, and receipts.', type: EntityType.What },
    when: { id: 'when-4', timestamp: '2025-12-05T09:00:00Z', display: 'Dec 5, 2025, 9:00 AM', type: EntityType.When },
    who: [{ id: 'who-4', name: 'Accountant', type: EntityType.Who }],
    where: { id: 'where-3', name: 'Home Office', type: EntityType.Where, latitude: 39.7480, longitude: -89.6050 },
  },
   {
    id: 5,
    projectId: 4,
    what: { id: 'what-5', name: 'Pick up library books', description: 'Reserved books are ready.', type: EntityType.What },
    when: { id: 'when-5', timestamp: '2025-11-15T16:30:00Z', display: 'Nov 15, 2025, 4:30 PM', type: EntityType.When },
    who: [],
    where: { id: 'where-4', name: 'Downtown Library', type: EntityType.Where, latitude: 39.7984, longitude: -89.6449 },
  },
  {
    id: 6,
    projectId: 1,
    what: { id: 'what-6', name: 'Post-Op Check-up', description: 'Follow-up to ensure healing is on track.', type: EntityType.What },
    when: { id: 'when-6', timestamp: '2025-12-13T10:00:00Z', display: 'Dec 13, 2025, 10:00 AM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    where: { id: 'where-1', name: 'Springfield Clinic', type: EntityType.Where, latitude: 39.7837, longitude: -89.6502 },
  }
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 'contact-1', name: 'Dr. Smith', role: 'Lead Dentist', locationName: 'Springfield Clinic' },
    { id: 'contact-2', name: 'Clinic Reception', role: 'Administration', locationName: 'Springfield Clinic' },
    { id: 'contact-3', name: 'Accountant', role: 'Tax Advisor', locationName: 'Home Office' },
    { id: 'contact-4', name: 'Head Librarian', role: 'Staff', locationName: 'Downtown Library' }
];
