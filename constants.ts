import { EventNode, EntityType, Project, Contact, Holiday, WhatType, Location, ProjectTemplate } from './types';

export const COLORS: { [key in EntityType]: string } = {
  [EntityType.Who]: 'bg-who-pink',
  [EntityType.Where]: 'bg-where-green',
  [EntityType.What]: 'bg-wha-blue',
  [EntityType.When]: 'bg-wha-blue',
};

export const PROJECT_COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-300 border-blue-400',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-400',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-400',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
  green: 'bg-green-500/20 text-green-300 border-green-400',
  pink: 'bg-pink-500/20 text-pink-300 border-pink-400',
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

export const MOCK_PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 1,
    name: 'Half-Marathon Training (12 Weeks)',
    category: 'Health',
    description: 'A 12-week beginner training plan to prepare for a half-marathon.',
    events: [
      { whatName: 'Week 1-4: Build Base Mileage', whatDescription: 'Focus on consistent, easy runs to build endurance.', whatType: WhatType.Period },
      { whatName: 'Week 5: Checkpoint', whatDescription: 'Assess progress and adjust plan if needed.', whatType: WhatType.Checkpoint },
      { whatName: 'Week 5-9: Introduce Speed Work', whatDescription: 'Incorporate tempo runs and interval training.', whatType: WhatType.Period },
      { whatName: 'Week 10-11: Tapering', whatDescription: 'Reduce mileage to allow muscles to recover and store energy.', whatType: WhatType.Period },
      { whatName: 'Final Week: Rest & Hydrate', whatDescription: 'Very short, easy runs. Focus on nutrition and hydration.', whatType: WhatType.Period },
      { whatName: 'Race Day', whatDescription: 'The culmination of your training!', whatType: WhatType.Milestone },
    ]
  },
  {
    id: 2,
    name: 'Agile Sprint (2 Weeks)',
    category: 'Work',
    description: 'A standard two-week sprint cycle for a software development team.',
    events: [
      { whatName: 'Sprint Planning', whatDescription: 'Team commits to a set of work for the upcoming sprint.', whatType: WhatType.Appointment },
      { whatName: 'Daily Standup Meetings', whatDescription: 'Brief daily check-ins to sync on progress and blockers.', whatType: WhatType.Period },
      { whatName: 'Backlog Refinement', whatDescription: 'Review and prepare user stories for the next sprint.', whatType: WhatType.Appointment },
      { whatName: 'Sprint Review', whatDescription: 'Demonstrate the work completed during the sprint to stakeholders.', whatType: WhatType.Milestone },
      { whatName: 'Sprint Retrospective', whatDescription: 'Team reflects on the past sprint to identify areas for improvement.', whatType: WhatType.Appointment },
    ]
  },
  {
    id: 3,
    name: 'US Visa Application',
    category: 'Personal',
    description: 'Standard process for applying for a non-immigrant US visa.',
    events: [
      { whatName: 'Complete DS-160 Form', whatDescription: 'Fill out the online non-immigrant visa application.', whatType: WhatType.Milestone },
      { whatName: 'Pay Application Fee', whatDescription: 'Pay the non-refundable MRV fee.', whatType: WhatType.Deadline },
      { whatName: 'Schedule Interview', whatDescription: 'Schedule appointments for biometrics and the consular interview.', whatType: WhatType.Appointment },
      { whatName: 'Gather Required Documents', whatDescription: 'Passport, photos, receipts, application confirmation, etc.', whatType: WhatType.Milestone },
      { whatName: 'Attend Interview', whatDescription: 'Attend the scheduled interview at the embassy or consulate.', whatType: WhatType.Appointment },
      { whatName: 'Passport Return', whatDescription: 'Receive passport with visa via courier or pickup.', whatType: WhatType.Checkpoint },
    ]
  },
   {
    id: 4,
    name: 'Home Renovation',
    category: 'Home',
    description: 'A template for managing a major home renovation project.',
    events: [
      { whatName: 'Define Scope & Budget', whatDescription: 'Finalize project goals and financial limits.', whatType: WhatType.Milestone },
      { whatName: 'Hire Contractor & Sign Contract', whatDescription: 'Select and legally engage a general contractor.', whatType: WhatType.Deadline },
      { whatName: 'Obtain Necessary Permits', whatDescription: 'Apply for and receive all required building permits.', whatType: WhatType.Milestone },
      { whatName: 'Demolition Phase', whatDescription: 'Clear out the existing space.', whatType: WhatType.Period },
      { whatName: 'Rough-in Work', whatDescription: 'Install new plumbing, electrical, and HVAC systems.', whatType: WhatType.Period },
      { whatName: 'Initial Inspections', whatDescription: 'Have rough-in work inspected by city officials.', whatType: WhatType.Checkpoint },
      { whatName: 'Drywall, Paint & Flooring', whatDescription: 'Close up walls and install final surfaces.', whatType: WhatType.Period },
      { whatName: 'Cabinetry & Fixture Installation', whatDescription: 'Install kitchen/bathroom cabinets, lights, sinks, etc.', whatType: WhatType.Period },
      { whatName: 'Final Inspection', whatDescription: 'The final walkthrough with the inspector.', whatType: WhatType.Deadline },
      { whatName: 'Punch List & Final Payment', whatDescription: 'Address any remaining small issues before final payment.', whatType: WhatType.Milestone },
    ]
  },
];


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

export const MOCK_LOCATIONS: Location[] = [
    { 
        id: 'where-1', 
        name: 'Springfield Clinic', 
        type: EntityType.Where, 
        latitude: 39.7837, 
        longitude: -89.6502,
        alias: 'Springfield Dental',
        phone: '217-528-0000',
        website: 'https://www.springfieldclinic.com',
        portalUrl: 'https://myhealth.springfieldclinic.com',
        notes: 'Main entrance is on the north side of the building. Parking is available in the adjacent garage.'
    },
    { id: 'where-2', name: 'Zoom Room', type: EntityType.Where },
    { id: 'where-3', name: 'Home', type: EntityType.Where, latitude: 39.7480, longitude: -89.6050, alias: 'Home Office' },
    { id: 'where-4', name: 'Downtown Library', type: EntityType.Where, latitude: 39.7984, longitude: -89.6449, phone: '217-753-4900', website: 'https://www.lincolnlibrary.info/' },
    { id: 'where-6', name: 'National Park', type: EntityType.Where },
];

export const MOCK_EVENTS: EventNode[] = [
  {
    id: 1,
    projectId: 1,
    what: { id: 'what-1', name: 'Initial Consultation & Scan', description: 'Discuss implant procedure and get 3D scan.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-1', name: 'Nov 15, 2025, 3:00 PM', timestamp: '2025-11-15T15:00:00Z', display: 'Nov 15, 2025, 3:00 PM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    whereId: 'where-1',
  },
  {
    id: 5,
    projectId: 4,
    what: { id: 'what-5', name: 'Pick up library books', description: 'Reserved books are ready.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-5', name: 'Nov 15, 2025, 4:30 PM', timestamp: '2025-11-15T16:30:00Z', display: 'Nov 15, 2025, 4:30 PM', type: EntityType.When },
    who: [],
    whereId: 'where-4',
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
    whereId: 'where-2',
  },
  {
    id: 7,
    projectId: 1,
    what: { id: 'what-7', name: 'Pre-Op Appointment', description: 'Final check-up before surgery.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-7', name: 'Nov 26, 2025, 2:00 PM', timestamp: '2025-11-26T14:00:00Z', display: 'Nov 26, 2025, 2:00 PM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    whereId: 'where-1',
  },
  {
    id: 3,
    projectId: 1,
    what: { id: 'what-3', name: 'Implant Surgery', description: 'Placement of the titanium implant.', type: EntityType.What, whatType: WhatType.Milestone },
    when: { id: 'when-3', name: 'Nov 29, 2025, 11:30 AM', timestamp: '2025-11-29T11:30:00Z', display: 'Nov 29, 2025, 11:30 AM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    whereId: 'where-1',
  },
  {
    id: 8,
    projectId: 5,
    what: { id: 'what-8', name: 'Project Kickoff', description: 'Initial meeting with the contractor.', type: EntityType.What, whatType: WhatType.Milestone },
    when: { id: 'when-8', name: 'Dec 2, 2025, 9:00 AM', timestamp: '2025-12-02T09:00:00Z', display: 'Dec 2, 2025, 9:00 AM', type: EntityType.When },
    who: [{ id: 'who-6', name: 'J.A. Contractors', type: EntityType.Who }],
    whereId: 'where-3',
  },
  {
    id: 4,
    projectId: 3,
    what: { id: 'what-4', name: 'Gather Tax Documents', description: 'Collect all W2s, 1099s, and receipts.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-4', name: 'Dec 5, 2025, 9:00 AM', timestamp: '2025-12-05T09:00:00Z', display: 'Dec 5, 2025, 9:00 AM', type: EntityType.When },
    who: [{ id: 'who-4', name: 'Accountant', type: EntityType.Who }],
    whereId: 'where-3',
  },
   {
    id: 9,
    projectId: 2,
    what: { id: 'what-9', name: 'Finalize Pitch Deck', description: 'Submit final version of the pitch deck for review.', type: EntityType.What, whatType: WhatType.Deadline },
    when: { id: 'when-9', name: 'Dec 10, 2025, 5:00 PM', timestamp: '2025-12-10T17:00:00Z', display: 'Dec 10, 2025, 5:00 PM', type: EntityType.When },
    who: [{ id: 'who-2', name: 'Sarah (Founder)', type: EntityType.Who }],
    whereId: 'where-3',
  },
  {
    id: 6,
    projectId: 1,
    what: { id: 'what-6', name: 'Post-Op Check-up', description: 'Follow-up to ensure healing is on track.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-6', name: 'Dec 13, 2025, 10:00 AM', timestamp: '2025-12-13T10:00:00Z', display: 'Dec 13, 2025, 10:00 AM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    whereId: 'where-1',
  },
  {
    id: 10,
    projectId: 5,
    what: { id: 'what-10', name: 'Demolition Phase', description: 'Kitchen and bathroom demolition.', type: EntityType.What, whatType: WhatType.Period },
    when: { id: 'when-10', name: 'Dec 15, 2025', timestamp: '2025-12-15T08:00:00Z', display: 'Dec 15, 2025', type: EntityType.When },
    endWhen: { id: 'endwhen-10', name: 'Dec 19, 2025', timestamp: '2025-12-19T17:00:00Z', display: 'Dec 19, 2025', type: EntityType.When },
    who: [{ id: 'who-6', name: 'J.A. Contractors', type: EntityType.Who }],
    whereId: 'where-3',
  },
  {
    id: 11,
    projectId: 5,
    what: { id: 'what-11', name: 'Weekly Progress Check', description: 'Review weekly progress with contractor.', type: EntityType.What, whatType: WhatType.Checkpoint },
    when: { id: 'when-11', name: 'Dec 22, 2025, 8:00 AM', timestamp: '2025-12-22T08:00:00Z', display: 'Dec 22, 2025, 8:00 AM', type: EntityType.When },
    who: [{ id: 'who-6', name: 'J.A. Contractors', type: EntityType.Who }],
    whereId: 'where-3',
  },
  {
    id: 12,
    projectId: 3,
    what: { id: 'what-12', name: 'EOY Financial Review', description: 'Review end-of-year finances with accountant.', type: EntityType.What, whatType: WhatType.Appointment },
    when: { id: 'when-12', name: 'Jan 15, 2026, 2:00 PM', timestamp: '2026-01-15T14:00:00Z', display: 'Jan 15, 2026, 2:00 PM', type: EntityType.When },
    who: [{ id: 'who-4', name: 'Accountant', type: EntityType.Who }],
    whereId: 'where-2',
  },
  {
    id: 13,
    projectId: 1,
    what: { id: 'what-13', name: 'Crown Placement', description: 'Final step of the implant process.', type: EntityType.What, whatType: WhatType.Milestone },
    when: { id: 'when-13', name: 'Feb 5, 2026, 4:00 PM', timestamp: '2026-02-05T16:00:00Z', display: 'Feb 5, 2026, 4:00 PM', type: EntityType.When },
    who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
    whereId: 'where-1',
  },
  {
    id: 14,
    projectId: 6,
    what: { id: 'what-14', name: 'Book Flights', description: 'Book flights for summer vacation.', type: EntityType.What, whatType: WhatType.Deadline },
    when: { id: 'when-14', name: 'Feb 28, 2026, 11:59 PM', timestamp: '2026-02-28T23:59:00Z', display: 'Feb 28, 2026, 11:59 PM', type: EntityType.When },
    who: [],
    whereId: 'where-3',
  },
  {
    id: 15,
    projectId: 3,
    what: { id: 'what-15', name: 'File Taxes', description: 'Deadline to file personal income taxes.', type: EntityType.What, whatType: WhatType.Deadline },
    when: { id: 'when-15', name: 'Apr 15, 2026, 11:59 PM', timestamp: '2026-04-15T23:59:00Z', display: 'Apr 15, 2026, 11:59 PM', type: EntityType.When },
    who: [{ id: 'who-4', name: 'Accountant', type: EntityType.Who }],
    whereId: 'where-3',
  },
  {
    id: 16,
    projectId: 6,
    what: { id: 'what-16', name: 'Summer Vacation', description: 'Family trip.', type: EntityType.What, whatType: WhatType.Period },
    when: { id: 'when-16', name: 'Jun 20, 2026', timestamp: '2026-06-20T00:00:00Z', display: 'Jun 20, 2026', type: EntityType.When },
    endWhen: { id: 'endwhen-16', name: 'Jun 28, 2026', timestamp: '2026-06-28T23:59:59Z', display: 'Jun 28, 2026', type: EntityType.When },
    who: [],
    whereId: 'where-6',
  }
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 'contact-1', name: 'Dr. Smith', role: 'Lead Dentist', locationId: 'where-1', phone: '217-528-0000', email: 'dr.smith@springfield.clinic' },
    { id: 'contact-2', name: 'Clinic Reception', role: 'Administration', locationId: 'where-1', phone: '217-528-0000' },
    { id: 'contact-3', name: 'Accountant', role: 'Tax Advisor', email: 'taxes@cpa.com', phone: '555-123-4567' },
    { id: 'contact-4', name: 'Head Librarian', role: 'Staff', locationId: 'where-4' },
    { id: 'contact-5', name: 'Sarah (Founder)', role: 'Co-founder', messenger: '@sarahfounder' }
];