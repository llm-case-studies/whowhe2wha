
import { EventNode, EntityType, Project, Contact, Holiday, WhatType } from './types';

export const COLORS: { [key in EntityType]: string } = {
  [EntityType.Who]: 'bg-who-pink',
  [EntityType.Where]: 'bg-where-green',
  [EntityType.What]: 'bg-wha-blue',
  [EntityType.When]: 'bg-wha-blue',
};

export const HOLIDAY_CATEGORIES = [
  { id: 'US', label: 'United States' },
  { id: 'Canada', label: 'Canada' },
  { id: 'Mexico', label: 'Mexico' },
  { id: 'UK', label: 'United Kingdom' },
  { id: 'EU', label: 'European Union' },
  { id: 'China', label: 'China' },
  { id: 'India', label: 'India' },
  { id: 'Christian', label: 'Christian' },
  { id: 'Jewish', label: 'Jewish' },
  { id: 'Muslim', label: 'Muslim' },
  { id: 'Hindu', label: 'Hindu' },
];

export const PROJECT_CATEGORIES = ['Work', 'Health', 'Finance', 'Home', 'Personal'];

export const HOLIDAY_DATA: Record<string, Holiday[]> = {
  US: [
    { name: "New Year's Day", date: new Date('2025-01-01T12:00:00Z'), type: 'civil', category: 'US' },
    { name: 'MLK Day', date: new Date('2025-01-20T12:00:00Z'), type: 'civil', category: 'US' },
    { name: "Presidents' Day", date: new Date('2025-02-17T12:00:00Z'), type: 'civil', category: 'US' },
    { name: 'Memorial Day', date: new Date('2025-05-26T12:00:00Z'), type: 'civil', category: 'US' },
    { name: 'Juneteenth', date: new Date('2025-06-19T12:00:00Z'), type: 'civil', category: 'US' },
    { name: 'Independence Day', date: new Date('2025-07-04T12:00:00Z'), type: 'civil', category: 'US' },
    { name: 'Labor Day', date: new Date('2025-09-01T12:00:00Z'), type: 'civil', category: 'US' },
    { name: 'Veterans Day', date: new Date('2025-11-11T12:00:00Z'), type: 'civil', category: 'US' },
    { name: 'Thanksgiving', date: new Date('2025-11-27T12:00:00Z'), type: 'civil', category: 'US' },
    { name: 'Christmas Day', date: new Date('2025-12-25T12:00:00Z'), type: 'civil', category: 'US' },
  ],
  Canada: [
    { name: "New Year's Day", date: new Date('2025-01-01T12:00:00Z'), type: 'civil', category: 'Canada' },
    { name: 'Victoria Day', date: new Date('2025-05-19T12:00:00Z'), type: 'civil', category: 'Canada' },
    { name: 'Canada Day', date: new Date('2025-07-01T12:00:00Z'), type: 'civil', category: 'Canada' },
    { name: 'Labour Day', date: new Date('2025-09-01T12:00:00Z'), type: 'civil', category: 'Canada' },
    { name: 'Thanksgiving', date: new Date('2025-10-13T12:00:00Z'), type: 'civil', category: 'Canada' },
    { name: 'Remembrance Day', date: new Date('2025-11-11T12:00:00Z'), type: 'civil', category: 'Canada' },
  ],
  Mexico: [
    { name: "New Year's Day", date: new Date('2025-01-01T12:00:00Z'), type: 'civil', category: 'Mexico' },
    { name: 'Constitution Day', date: new Date('2025-02-05T12:00:00Z'), type: 'civil', category: 'Mexico' },
    { name: 'Benito Juárez\'s B-day', date: new Date('2025-03-21T12:00:00Z'), type: 'civil', category: 'Mexico' },
    { name: 'Labor Day', date: new Date('2025-05-01T12:00:00Z'), type: 'civil', category: 'Mexico' },
    { name: 'Independence Day', date: new Date('2025-09-16T12:00:00Z'), type: 'civil', category: 'Mexico' },
    { name: 'Revolution Day', date: new Date('2025-11-20T12:00:00Z'), type: 'civil', category: 'Mexico' },
  ],
  UK: [
    { name: "New Year's Day", date: new Date('2025-01-01T12:00:00Z'), type: 'civil', category: 'UK' },
    { name: 'Good Friday', date: new Date('2025-04-18T12:00:00Z'), type: 'civil', category: 'UK' },
    { name: 'Easter Monday', date: new Date('2025-04-21T12:00:00Z'), type: 'civil', category: 'UK' },
    { name: 'Early May Bank Holiday', date: new Date('2025-05-05T12:00:00Z'), type: 'civil', category: 'UK' },
    { name: 'Spring Bank Holiday', date: new Date('2025-05-26T12:00:00Z'), type: 'civil', category: 'UK' },
    { name: 'Summer Bank Holiday', date: new Date('2025-08-25T12:00:00Z'), type: 'civil', category: 'UK' },
    { name: 'Christmas Day', date: new Date('2025-12-25T12:00:00Z'), type: 'civil', category: 'UK' },
    { name: 'Boxing Day', date: new Date('2025-12-26T12:00:00Z'), type: 'civil', category: 'UK' },
  ],
  EU: [
    { name: "New Year's Day", date: new Date('2025-01-01T12:00:00Z'), type: 'civil', category: 'EU' },
    { name: 'Labour Day', date: new Date('2025-05-01T12:00:00Z'), type: 'civil', category: 'EU' },
    { name: 'Europe Day', date: new Date('2025-05-09T12:00:00Z'), type: 'civil', category: 'EU' },
    { name: 'Ascension Day', date: new Date('2025-05-29T12:00:00Z'), type: 'civil', category: 'EU' },
// FIX: Corrected a typo in the date definition for 'Assumption of Mary'.
    { name: 'Assumption of Mary', date: new Date('2025-08-15T12:00:00Z'), type: 'civil', category: 'EU' },
    { name: "All Saints' Day", date: new Date('2025-11-01T12:00:00Z'), type: 'civil', category: 'EU' },
  ],
  China: [
    { name: 'Chinese New Year', date: new Date('2025-01-29T12:00:00Z'), type: 'civil', category: 'China' },
    { name: 'Qingming Festival', date: new Date('2025-04-05T12:00:00Z'), type: 'civil', category: 'China' },
    { name: 'Labor Day', date: new Date('2025-05-01T12:00:00Z'), type: 'civil', category: 'China' },
    { name: 'Dragon Boat Festival', date: new Date('2025-05-31T12:00:00Z'), type: 'civil', category: 'China' },
    { name: 'Mid-Autumn Festival', date: new Date('2025-10-06T12:00:00Z'), type: 'civil', category: 'China' },
    { name: 'National Day', date: new Date('2025-10-01T12:00:00Z'), type: 'civil', category: 'China' },
  ],
  India: [
    { name: 'Republic Day', date: new Date('2025-01-26T12:00:00Z'), type: 'civil', category: 'India' },
    { name: 'Holi', date: new Date('2025-03-14T12:00:00Z'), type: 'civil', category: 'India' },
    { name: 'Independence Day', date: new Date('2025-08-15T12:00:00Z'), type: 'civil', category: 'India' },
    { name: 'Gandhi Jayanti', date: new Date('2025-10-02T12:00:00Z'), type: 'civil', category: 'India' },
    { name: 'Diwali', date: new Date('2025-10-21T12:00:00Z'), type: 'civil', category: 'India' },
  ],
  Christian: [
    { name: 'Good Friday', date: new Date('2025-04-18T12:00:00Z'), type: 'religious', category: 'Christian' },
    { name: 'Easter', date: new Date('2025-04-20T12:00:00Z'), type: 'religious', category: 'Christian' },
    { name: 'Christmas', date: new Date('2025-12-25T12:00:00Z'), type: 'religious', category: 'Christian' },
  ],
  Jewish: [
    { name: 'Rosh Hashanah', date: new Date('2025-09-23T12:00:00Z'), type: 'religious', category: 'Jewish' },
    { name: 'Yom Kippur', date: new Date('2025-10-02T12:00:00Z'), type: 'religious', category: 'Jewish' },
    { name: 'Hanukkah Begins', date: new Date('2025-12-15T12:00:00Z'), type: 'religious', category: 'Jewish' },
  ],
  Muslim: [
    { name: 'Eid al-Fitr', date: new Date('2025-03-30T12:00:00Z'), type: 'religious', category: 'Muslim' },
    { name: 'Eid al-Adha', date: new Date('2025-06-06T12:00:00Z'), type: 'religious', category: 'Muslim' },
  ],
  Hindu: [
    { name: 'Holi', date: new Date('2025-03-14T12:00:00Z'), type: 'religious', category: 'Hindu' },
    { name: 'Diwali', date: new Date('2025-10-21T12:00:00Z'), type: 'religious', category: 'Hindu' },
  ],
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Dental Implant Treatment',
    description: 'Complete treatment plan for a molar implant with Dr. Smith.',
    status: 'Active',
    color: 'blue',
    category: 'Health'
  },
  {
    id: 2,
    name: 'Startup Fundraising (Series A)',
    description: 'Secure Series A funding for the whowhe2wha concept.',
    status: 'Active',
    color: 'purple',
    category: 'Work'
  },
  {
    id: 3,
    name: '2025 Tax Preparation',
    description: 'Organize and file annual taxes.',
    status: 'On Hold',
    color: 'orange',
    category: 'Finance'
  },
  {
    id: 4,
    name: 'Town Errands',
    description: 'Miscellaneous tasks to run in the downtown area.',
    status: 'Completed',
    color: 'yellow',
    category: 'Personal'
  },
  {
    id: 5,
    name: 'Home Renovation',
    description: 'Kitchen and bathroom remodel project.',
    status: 'Active',
    color: 'green',
    category: 'Home'
  },
  {
    id: 6,
    name: 'Vacation Planning',
    description: 'Plan and book the 2026 summer vacation.',
    status: 'Active',
    color: 'pink',
    category: 'Personal'
  }
];

export const MOCK_EVENTS: EventNode[] = [
  {
    id: 1,
    projectId: 1,
    what: { id: 'what-1', name: 'Initial Consultation & Scan', description: 'Discuss implant procedure and get 3D scan.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-1', name: 'Nov 15, 2025, 3:00 PM', timestamp: '2025-11-15T15:00:00Z', display: 'Nov 15, 2025, 3:00 PM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    where: { id: 'where-1', name: 'Springfield Clinic', type: EntityType.Where, latitude: 39.7837, longitude: -89.6502 },
  },
  {
    id: 5,
    projectId: 4,
    what: { id: 'what-5', name: 'Pick up library books', description: 'Reserved books are ready.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-5', name: 'Nov 15, 2025, 4:30 PM', timestamp: '2025-11-15T16:30:00Z', display: 'Nov 15, 2025, 4:30 PM', type: EntityType.When },
    who: [],
    where: { id: 'where-4', name: 'Downtown Library', type: EntityType.Where, latitude: 39.7984, longitude: -89.6449 },
  },
  {
    id: 2,
    projectId: 2,
    what: { id: 'what-2', name: 'VC Pitch Practice', description: 'Dry run of the Series A funding pitch.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-2', name: 'Nov 20, 2025, 10:00 AM', timestamp: '2025-11-20T10:00:00Z', display: 'Nov 20, 2025, 10:00 AM', type: EntityType.When },
    who: [
        { id: 'who-2', name: 'Sarah (Founder)', type: EntityType.Who },
        { id: 'who-3', name: 'VC Firm Mentors', type: EntityType.Who }
    ],
    where: { id: 'where-2', name: 'Zoom Room', type: EntityType.Where },
  },
  {
    id: 7,
    projectId: 1,
    what: { id: 'what-7', name: 'Pre-Op Appointment', description: 'Final check-up before surgery.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-7', name: 'Nov 26, 2025, 2:00 PM', timestamp: '2025-11-26T14:00:00Z', display: 'Nov 26, 2025, 2:00 PM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    where: { id: 'where-1', name: 'Springfield Clinic', type: EntityType.Where, latitude: 39.7837, longitude: -89.6502 },
  },
  {
    id: 3,
    projectId: 1,
    what: { id: 'what-3', name: 'Implant Surgery', description: 'Placement of the titanium implant.', type: EntityType.What, whatType: WhatType.Milestone },
    when: { id: 'when-3', name: 'Nov 29, 2025, 11:30 AM', timestamp: '2025-11-29T11:30:00Z', display: 'Nov 29, 2025, 11:30 AM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    where: { id: 'where-1', name: 'Springfield Clinic', type: EntityType.Where, latitude: 39.7837, longitude: -89.6502 },
  },
  {
    id: 8,
    projectId: 5,
    what: { id: 'what-8', name: 'Project Kickoff', description: 'Initial meeting with the contractor.', type: EntityType.What, whatType: WhatType.Milestone },
    when: { id: 'when-8', name: 'Dec 2, 2025, 9:00 AM', timestamp: '2025-12-02T09:00:00Z', display: 'Dec 2, 2025, 9:00 AM', type: EntityType.When },
    who: [{ id: 'who-6', name: 'J.A. Contractors', type: EntityType.Who }],
    where: { id: 'where-3', name: 'Home Office', type: EntityType.Where, latitude: 39.7480, longitude: -89.6050 },
  },
  {
    id: 4,
    projectId: 3,
    what: { id: 'what-4', name: 'Gather Tax Documents', description: 'Collect all W2s, 1099s, and receipts.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-4', name: 'Dec 5, 2025, 9:00 AM', timestamp: '2025-12-05T09:00:00Z', display: 'Dec 5, 2025, 9:00 AM', type: EntityType.When },
    who: [{ id: 'who-4', name: 'Accountant', type: EntityType.Who }],
    where: { id: 'where-3', name: 'Home Office', type: EntityType.Where, latitude: 39.7480, longitude: -89.6050 },
  },
   {
    id: 9,
    projectId: 2,
    what: { id: 'what-9', name: 'Finalize Pitch Deck', description: 'Submit final version of the pitch deck for review.', type: EntityType.What, whatType: WhatType.Deadline },
    when: { id: 'when-9', name: 'Dec 10, 2025, 5:00 PM', timestamp: '2025-12-10T17:00:00Z', display: 'Dec 10, 2025, 5:00 PM', type: EntityType.When },
    who: [{ id: 'who-2', name: 'Sarah (Founder)', type: EntityType.Who }],
    where: { id: 'where-3', name: 'Home Office', type: EntityType.Where },
  },
  {
    id: 6,
    projectId: 1,
    what: { id: 'what-6', name: 'Post-Op Check-up', description: 'Follow-up to ensure healing is on track.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-6', name: 'Dec 13, 2025, 10:00 AM', timestamp: '2025-12-13T10:00:00Z', display: 'Dec 13, 2025, 10:00 AM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    where: { id: 'where-1', name: 'Springfield Clinic', type: EntityType.Where, latitude: 39.7837, longitude: -89.6502 },
  },
  {
    id: 10,
    projectId: 5,
    what: { id: 'what-10', name: 'Demolition Phase', description: 'Kitchen and bathroom demolition.', type: EntityType.What, whatType: WhatType.Period },
    when: { id: 'when-10', name: 'Dec 15, 2025', timestamp: '2025-12-15T08:00:00Z', display: 'Dec 15, 2025', type: EntityType.When },
    endWhen: { id: 'endwhen-10', name: 'Dec 19, 2025', timestamp: '2025-12-19T17:00:00Z', display: 'Dec 19, 2025', type: EntityType.When },
    who: [{ id: 'who-6', name: 'J.A. Contractors', type: EntityType.Who }],
    where: { id: 'where-3', name: 'Home', type: EntityType.Where },
  },
  {
    id: 11,
    projectId: 5,
    what: { id: 'what-11', name: 'Weekly Progress Check', description: 'Review weekly progress with contractor.', type: EntityType.What, whatType: WhatType.Checkpoint },
    when: { id: 'when-11', name: 'Dec 22, 2025, 8:00 AM', timestamp: '2025-12-22T08:00:00Z', display: 'Dec 22, 2025, 8:00 AM', type: EntityType.When },
    who: [{ id: 'who-6', name: 'J.A. Contractors', type: EntityType.Who }],
    where: { id: 'where-3', name: 'Home', type: EntityType.Where },
  },
  {
    id: 12,
    projectId: 3,
    what: { id: 'what-12', name: 'EOY Financial Review', description: 'Review end-of-year finances with accountant.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-12', name: 'Jan 15, 2026, 2:00 PM', timestamp: '2026-01-15T14:00:00Z', display: 'Jan 15, 2026, 2:00 PM', type: EntityType.When },
    who: [{ id: 'who-4', name: 'Accountant', type: EntityType.Who }],
    where: { id: 'where-2', name: 'Zoom Room', type: EntityType.Where },
  },
  {
    id: 13,
    projectId: 1,
    what: { id: 'what-13', name: 'Crown Placement', description: 'Final step of the implant process.', type: EntityType.What, whatType: WhatType.Milestone },
    when: { id: 'when-13', name: 'Feb 5, 2026, 4:00 PM', timestamp: '2026-02-05T16:00:00Z', display: 'Feb 5, 2026, 4:00 PM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    where: { id: 'where-1', name: 'Springfield Clinic', type: EntityType.Where, latitude: 39.7837, longitude: -89.6502 },
  },
  {
    id: 14,
    projectId: 6,
    what: { id: 'what-14', name: 'Book Flights', description: 'Book flights for summer vacation.', type: EntityType.What, whatType: WhatType.Deadline },
    when: { id: 'when-14', name: 'Feb 28, 2026, 11:59 PM', timestamp: '2026-02-28T23:59:00Z', display: 'Feb 28, 2026, 11:59 PM', type: EntityType.When },
    who: [],
    where: { id: 'where-3', name: 'Home', type: EntityType.Where },
  },
  {
    id: 15,
    projectId: 3,
    what: { id: 'what-15', name: 'File Taxes', description: 'Deadline to file personal income taxes.', type: EntityType.What, whatType: WhatType.Deadline },
    when: { id: 'when-15', name: 'Apr 15, 2026, 11:59 PM', timestamp: '2026-04-15T23:59:00Z', display: 'Apr 15, 2026, 11:59 PM', type: EntityType.When },
    who: [{ id: 'who-4', name: 'Accountant', type: EntityType.Who }],
    where: { id: 'where-3', name: 'Home', type: EntityType.Where },
  },
  {
    id: 16,
    projectId: 6,
    what: { id: 'what-16', name: 'Summer Vacation', description: 'Family trip.', type: EntityType.What, whatType: WhatType.Period },
    when: { id: 'when-16', name: 'Jun 20, 2026', timestamp: '2026-06-20T00:00:00Z', display: 'Jun 20, 2026', type: EntityType.When },
    endWhen: { id: 'endwhen-16', name: 'Jun 28, 2026', timestamp: '2026-06-28T23:59:59Z', display: 'Jun 28, 2026', type: EntityType.When },
    who: [],
    where: { id: 'where-6', name: 'National Park', type: EntityType.Where },
  }
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 'contact-1', name: 'Dr. Smith', role: 'Lead Dentist', locationName: 'Springfield Clinic' },
    { id: 'contact-2', name: 'Clinic Reception', role: 'Administration', locationName: 'Springfield Clinic' },
    { id: 'contact-3', name: 'Accountant', role: 'Tax Advisor', locationName: 'Home Office' },
    { id: 'contact-4', name: 'Head Librarian', role: 'Staff', locationName: 'Downtown Library' }
];