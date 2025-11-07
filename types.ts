export type Theme = 'light' | 'dark' | 'focus';
export type MainView = 'dashboard' | 'contacts';
export type ViewMode = 'stream' | 'timeline';
export type TimelineScale = 'week' | 'month' | 'quarter' | 'year';

export enum EntityType {
    Project = 'Project',
    What = 'What',
    When = 'When',
    Who = 'Who',
    Where = 'Where'
}

export enum WhatType {
    Appointment = 'Appointment', // A point-in-time meeting or session
    Task = 'Task',               // An action to be completed, can be point-in-time or have a duration
    Period = 'Period',             // A longer duration activity or phase, like a training block
    Milestone = 'Milestone',       // A goal-oriented marker of achievement
    Deadline = 'Deadline',         // A goal-oriented due date with an implicit lead-up time
    Checkpoint = 'Checkpoint',     // A point-in-time progress check
}

// Base Entity
interface BaseNode {
    id: string;
    name: string;
    type: EntityType;
}

// Specific Entity Nodes
export interface WhatNode extends BaseNode {
    description?: string;
    whatType: WhatType;
    type: EntityType.What;
    leadTimeDays?: number; // Specific to Deadlines, but can be on the base type
}

export interface WhenNode extends BaseNode {
    timestamp: string; // ISO string
    display: string;
    type: EntityType.When;
}

export interface WhoNode extends BaseNode {
    type: EntityType.Who;
}

// Main Data Structures
export interface Location {
    id: string;
    name: string;
    alias?: string;
    type: EntityType.Where;
    latitude?: number;
    longitude?: number;
    phone?: string;
    website?: string;
    notes?: string;
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

export interface Project {
    id: number;
    name: string;
    description: string;
    category: string;
    color: string;
    status: 'Active' | 'On Hold' | 'Completed';
}

export interface RecurrenceRule {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: string; // ISO string
}

export interface EventNode {
    id: number;
    projectId: number;
    what: WhatNode;
    when?: WhenNode;
    endWhen?: WhenNode;
    who: WhoNode[];
    whereId: string;
    recurrence?: RecurrenceRule;
    parentId?: number; // ID of the parent EventNode (for nesting)
}

export interface Holiday {
    name: string;
    date: Date;
    category: string;
}

// App State & History
export interface AppState {
    events: EventNode[];
    projects: Project[];
    locations: Location[];
    contacts: Contact[];
    projectTemplates: ProjectTemplate[];
}

export interface HistoryEntry {
    id: number;
    description: string;
    timestamp: number;
    undo: (currentState: AppState) => AppState;
}

// Project Templates
export interface ProjectTemplateEvent {
    whatName: string;
    whatType: WhatType;
    description: string;
    durationDays: number;
    sequence: number;
}

export interface ProjectTemplate {
    id: number;
    name: string;
    description: string;
    category: string;
    events: ProjectTemplateEvent[];
}

// API response types
export interface DiscoveredPlace {
    title: string;
    uri: string;
}

// Timeline tier config
export interface Tier {
    id: string;
    name:string;
    categories: string[];
}

export type TierConfig = Tier[];

// Sharing
export interface SharedProjectData {
    project: Project;
    events: EventNode[];
    locations: Location[];
    contacts: Contact[];
}

export interface SharedTemplateData {
    template: ProjectTemplate;
}

// Data Import/Export
export interface ParsedEvent {
  summary: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  description?: string;
}

export interface ProjectAndTemplateData {
    projects: Project[];
    projectTemplates: ProjectTemplate[];
}