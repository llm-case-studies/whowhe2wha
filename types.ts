export enum EntityType {
  Who = 'who',
  Where = 'where',
  What = 'what',
  When = 'when',
}

export enum WhatType {
  Appointment = 'appointment',
  Period = 'period',
  Deadline = 'deadline',
  Milestone = 'milestone',
  Checkpoint = 'checkpoint',
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
}

export interface Participant extends Entity {
  type: EntityType.Who;
}

export interface What extends Entity {
  type: EntityType.What;
  description?: string;
  whatType: WhatType;
}

export interface Location extends Entity {
  type: EntityType.Where;
  alias?: string; // User-defined friendly name
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  portalUrl?: string;
  notes?: string;
}

export interface When extends Entity {
  type: EntityType.When;
  timestamp: string; // ISO 8601
  display: string;
}

export interface EventNode {
  id: number;
  projectId: number;
  what: What;
  when: When;
  endWhen?: When;
  who: Participant[];
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

export interface Contact {
    id: string;
    name: string;
    role: string;
    locationId: string;
}

export interface Holiday {
    name: string;
    date: Date;
    type: 'civil' | 'religious';
    category: string;
}

export type Theme = 'light' | 'dark' | 'focus';
export type ViewMode = 'stream' | 'timeline';
export type TimelineScale = 'week' | 'month' | 'quarter' | 'year';

// New types for dynamic timeline tiers
export interface Tier {
  id: string;
  name: string;
  categories: string[];
}
export type TierConfig = Tier[];