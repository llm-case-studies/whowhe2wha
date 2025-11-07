import { Location, Contact, Project, EventNode, ProjectTemplate, EntityType, WhatType } from './types';

// --- MOCK LOCATIONS ---
export const MOCK_LOCATIONS: Location[] = [
    {
        id: 'where-1',
        name: '123 Health St, Springfield, IL 62704',
        alias: 'Springfield Clinic',
        type: EntityType.Where,
        latitude: 39.7817,
        longitude: -89.6501,
        phone: '217-555-1234',
        website: 'https://springfieldclinic.example.com',
        notes: 'Main entrance is on the west side of the building.'
    },
    {
        id: 'where-2',
        name: '456 Bookworm Ave, Springfield, IL 62701',
        alias: 'Downtown Library',
        type: EntityType.Where,
        latitude: 39.8015,
        longitude: -89.6441
    },
    {
        id: 'where-3',
        name: '789 Home Cir, Springfield, IL 62711',
        alias: 'Home',
        type: EntityType.Where,
        latitude: 39.7392,
        longitude: -89.7545
    },
     {
        id: 'where-4',
        name: '101 Fitness Run, Springfield, IL 62702',
        alias: 'Runners Plus',
        type: EntityType.Where,
        latitude: 39.7900,
        longitude: -89.6600
    },
];

// --- MOCK CONTACTS ---
export const MOCK_CONTACTS: Contact[] = [
    {
        id: 'contact-1',
        name: 'Dr. Smith',
        role: 'Implant Specialist',
        locationId: 'where-1',
        phone: '217-555-1235',
        email: 'dr.smith@springfieldclinic.example.com'
    },
    {
        id: 'contact-2',
        name: 'Clinic Reception',
        role: 'Scheduling',
        locationId: 'where-1',
        phone: '217-555-1234'
    },
     {
        id: 'contact-3',
        name: 'Dr. Allen',
        role: 'Physiotherapist',
        locationId: 'where-1',
        phone: '217-555-1236',
        email: 'dr.allen@springfieldclinic.example.com'
    },
];

// --- MOCK PROJECTS ---
export const MOCK_PROJECTS: Project[] = [
    { id: 1, name: 'Dental Implant Treatment', description: 'Complete treatment plan for a molar implant with Dr. Smith.', category: 'Health', color: 'blue', status: 'Active' },
    { id: 6, name: 'Half-Marathon Training for Mayor\'s Cup', description: '12-week training plan to prepare for the annual city half-marathon.', category: 'Health', color: 'blue', status: 'Active' },
    { id: 2, name: 'Startup Fundraising (Series A)', description: 'Secure Series A funding for the whowhe2wha concept.', category: 'Work', color: 'purple', status: 'Active' },
    { id: 3, name: '2025 Tax Preparation', description: 'Organize and file annual taxes.', category: 'Finance', color: 'orange', status: 'On Hold' },
    { id: 4, name: 'Town Errands', description: 'Miscellaneous tasks to run in the downtown area.', category: 'Personal', color: 'yellow', status: 'Completed' },
    { id: 5, name: 'Home Renovation', description: 'Kitchen and bathroom remodel project.', category: 'Home', color: 'green', status: 'Active' },
];


// --- MOCK EVENTS ---
export const MOCK_EVENTS: EventNode[] = [
    {
        id: 1, projectId: 1,
        what: { id: 'what-1', name: 'Initial Consultation & Scan', type: EntityType.What, whatType: WhatType.Appointment, description: 'Discuss plan with Dr. Smith and get 3D scans.' },
        when: { id: 'when-1', name: '2025-11-15T15:00:00.000Z', timestamp: '2025-11-15T15:00:00.000Z', display: new Date('2025-11-15T15:00:00.000Z').toLocaleString(), type: EntityType.When },
        who: [{ id: 'who-1', name: 'Dr. Smith', type: EntityType.Who }],
        whereId: 'where-1'
    },
    {
        id: 2, projectId: 1,
        what: { id: 'what-2', name: 'Implant Surgery', type: EntityType.What, whatType: WhatType.Appointment },
        when: { id: 'when-2', name: '2025-12-05T10:00:00.000Z', timestamp: '2025-12-05T10:00:00.000Z', display: new Date('2025-12-05T10:00:00.000Z').toLocaleString(), type: EntityType.When },
        who: [{ id: 'who-2', name: 'Dr. Smith', type: EntityType.Who }],
        whereId: 'where-1'
    },
    {
        id: 3, projectId: 4,
        what: { id: 'what-3', name: 'Pick up library books', type: EntityType.What, whatType: WhatType.Task },
        when: { id: 'when-3', name: '2025-11-15T16:30:00.000Z', timestamp: '2025-11-15T16:30:00.000Z', display: new Date('2025-11-15T16:30:00.000Z').toLocaleString(), type: EntityType.When },
        who: [],
        whereId: 'where-2'
    },
    {
        id: 10, projectId: 6,
        what: { id: 'what-10', name: 'Week 1-4: Build Base Mileage', type: EntityType.What, whatType: WhatType.Period, description: 'Focus on consistent, easy runs to build endurance.' },
        when: { id: 'when-10', name: '2025-11-10T12:00:00.000Z', timestamp: '2025-11-10T12:00:00.000Z', display: new Date('2025-11-10T12:00:00.000Z').toLocaleDateString(), type: EntityType.When },
        endWhen: { id: 'endwhen-10', name: '2025-12-07T12:00:00.000Z', timestamp: '2025-12-07T12:00:00.000Z', display: new Date('2025-12-07T12:00:00.000Z').toLocaleDateString(), type: EntityType.When },
        who: [],
        whereId: 'where-3'
    },
    {
        id: 11, projectId: 6, parentId: 10,
        what: { id: 'what-11', name: 'Physio check-up', type: EntityType.What, whatType: WhatType.Appointment, description: 'Assess running form and any pains.' },
        when: { id: 'when-11', name: '2025-11-18T11:00:00.000Z', timestamp: '2025-11-18T11:00:00.000Z', display: new Date('2025-11-18T11:00:00.000Z').toLocaleString(), type: EntityType.When },
        who: [{id: 'who-3', name: 'Dr. Allen', type: EntityType.Who}],
        whereId: 'where-1'
    },
    {
        id: 12, projectId: 6, parentId: 10,
        what: { id: 'what-12', name: 'Buy new running shoes', type: EntityType.What, whatType: WhatType.Task },
        when: { id: 'when-12', name: '2025-11-22T14:00:00.000Z', timestamp: '2025-11-22T14:00:00.000Z', display: new Date('2025-11-22T14:00:00.000Z').toLocaleString(), type: EntityType.When },
        who: [],
        whereId: 'where-4'
    },
    {
        id: 13, projectId: 6,
        what: { id: 'what-13', name: 'Week 5: Checkpoint', type: EntityType.What, whatType: WhatType.Checkpoint, description: 'Assess progress and adjust plan if needed.' },
        when: { id: 'when-13', name: '2025-12-08T12:00:00.000Z', timestamp: '2025-12-08T12:00:00.000Z', display: new Date('2025-12-08T12:00:00.000Z').toLocaleString(), type: EntityType.When },
        who: [],
        whereId: 'where-3'
    },
];


// --- MOCK TEMPLATES ---
export const MOCK_TEMPLATES: ProjectTemplate[] = [
    {
        id: 1,
        name: 'Half-Marathon Training (12 Weeks)',
        description: 'A 12-week training plan for beginner to intermediate runners targeting a half-marathon.',
        category: 'Health',
        events: [
            { whatName: 'Week 1-4: Build Base Mileage', whatType: WhatType.Period, description: 'Focus on consistent, easy runs to build endurance.', durationDays: 28, sequence: 1 },
            { whatName: 'Week 5: Checkpoint', whatType: WhatType.Checkpoint, description: 'Assess progress and adjust plan if needed.', durationDays: 1, sequence: 2 },
            { whatName: 'Week 5-9: Introduce Speed Work', whatType: WhatType.Period, description: 'Incorporate tempo runs and interval training.', durationDays: 35, sequence: 3 },
            { whatName: 'Week 10-11: Tapering', whatType: WhatType.Period, description: 'Reduce mileage to allow muscles to recover and store energy.', durationDays: 14, sequence: 4 },
            { whatName: 'Race Day!', whatType: WhatType.Milestone, description: 'Execute the race plan. Good luck!', durationDays: 1, sequence: 5 },
        ]
    }
];