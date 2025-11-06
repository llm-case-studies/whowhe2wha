
export enum EntityType {
    Who = 'who',
    Where = 'where',
    What = 'what',
    When = 'when',
}

export enum WhatType {
    Appointment = 'appointment',
    Milestone = 'milestone',
    Deadline = 'deadline',
    Period = 'period',
    Checkpoint = 'checkpoint',
}

export interface BaseNode {
    id: string | number;
    name: string;
    type: EntityType;
}

export interface Who extends BaseNode {
    type: EntityType.Who;
}

export interface What extends BaseNode {
    id: string;
    type: EntityType.What;
    description?: string;
    whatType: WhatType;
}

export interface When extends BaseNode {
    id: string;
    type: EntityType.When;
    timestamp: string;
    display: string;
}

export interface Location extends BaseNode {
    id: string;
    type: EntityType.Where;
    latitude?: number;
    longitude?: number;
    alias?: string;
    phone?: string;
    website?: string;
    portalUrl?: string;
    notes?: string;
}

export interface EventNode {
    id: number;
    projectId: number;
    what: What;
    when: When;
    endWhen?: When;
    who: Who[];
    whereId: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    status: 'Active' | 'On Hold' | 'Completed';
    color: string;
    category: string;
}

export interface Holiday {
    name: string;
    date: Date;
    type: 'civil' | 'religious';
    category: string;
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

export type Theme = 'light' | 'dark' | 'focus';

export type ViewMode = 'stream' | 'timeline';
export type TimelineScale = 'week' | 'month' | 'quarter' | 'year';

export interface DiscoveredPlace {
    title: string;
    uri: string;
}

export interface Tier {
    id: string;
    name: string;
    categories: string[];
}

export type TierConfig = Tier[];
