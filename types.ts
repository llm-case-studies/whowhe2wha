
export type Theme = 'light' | 'dark' | 'focus';

export enum EntityType {
    Who = 'who',
    Where = 'where',
    When = 'when',
    What = 'what',
    Project = 'project',
}

export enum WhatType {
    Appointment = 'Appointment',
    Milestone = 'Milestone',
    Deadline = 'Deadline',
    Checkpoint = 'Checkpoint',
    Period = 'Period',
}

export interface Participant {
    id: string;
    name: string;
    type: EntityType.Who;
}

export interface Location {
    id: string;
    name: string;
    type: EntityType.Where;
    latitude?: number;
    longitude?: number;
}

export interface When {
    id: string;
    name: string;
    timestamp: string;
    display: string;
    type: EntityType.When;
}

export interface What {
    id: string;
    name: string;
    description?: string;
    type: EntityType.What;
    whatType: WhatType;
}

export interface EventNode {
    id: number;
    projectId: number;
    what: What;
    when: When;
    endWhen?: When;
    who: Participant[];
    where: Location;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold';
}

export interface Contact {
  id: number;
  name: string;
  role: string;
  locationName: string;
}
