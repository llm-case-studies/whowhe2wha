// Global types for the application

export type Theme = 'light' | 'dark' | 'focus';

export type ViewMode = 'stream' | 'timeline';

export type TimelineScale = 'week' | 'month' | 'quarter' | 'year';

export enum EntityType {
    Project = "Project",
    What = "What",
    When = "When",
    Who = "Who",
    Where = "Where",
}

export enum WhatType {
    Appointment = "appointment",
    Milestone = "milestone",
    Deadline = "deadline",
    Checkpoint = "checkpoint",
    Period = "period",
    Task = "task",
}

export interface BaseNode {
    id: string | number;
    name: string;
    type: EntityType;
}

export interface WhatNode extends BaseNode {
    type: EntityType.What;
    whatType: WhatType;
    description?: string;
}

export interface WhenNode extends BaseNode {
    type: EntityType.When;
    timestamp: string; // ISO 8601 format
    display: string;
}

export interface WhoNode extends BaseNode {
    type: EntityType.Who;
}

export interface WhereNode extends BaseNode {
    type: EntityType.Where;
    alias?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
}

export interface Location extends WhereNode {
    id: string; // "where-" + timestamp
    phone?: string;
    website?: string;
}

export interface EventNode {
    id: number;
    projectId: number;
    what: WhatNode;
    when: WhenNode;
    endWhen?: WhenNode; // For period events
    who: WhoNode[];
    whereId: string; // Location ID
}

export interface Project {
    id: number;
    name: string;
    description: string;
    category: string;
    color: string;
    status: 'Active' | 'On Hold' | 'Completed';
}

export interface Contact {
    id: string;
    name: string;
    role?: string;
    locationId?: string;
    phone?: string;
    email?: string;
    messenger?: string;
}

export interface DiscoveredPlace {
    title: string;
    uri: string;
}

export interface AppState {
    events: EventNode[];
    projects: Project[];
    locations: Location[];
    contacts: Contact[];
}

export interface HistoryEntry {
    id: number;
    description: string;
    timestamp: number;
    undo: (data: AppState) => AppState;
}

export interface ProjectTemplateEvent {
    whatName: string;
    whatType: WhatType;
    description: string;
    durationDays: number; // Duration from project start
    sequence: number; // Order of events
}

export interface ProjectTemplate {
    id: number;
    name: string;
    description: string;
    category: string;
    events: ProjectTemplateEvent[];
}


export interface Tier {
    id: string;
    name: string;
    categories: string[];
}
export type TierConfig = Tier[];

export interface Holiday {
    name: string;
    date: Date;
    category: string;
}
