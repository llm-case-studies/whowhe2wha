export enum EntityType {
  Who = 'Who',
  Where = 'Where',
  What = 'What',
  When = 'When',
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
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

export interface Wha {
  id: string;
  name:string;
  type: EntityType.What;
  description?: string;
}

export interface When {
  id: string;
  timestamp: string;
  type: EntityType.When;
  display: string;
}

export interface EventNode {
  id: number;
  projectId: number;
  what: Wha;
  when: When;
  who: Participant[];
  where: Location;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  locationName: string;
}
