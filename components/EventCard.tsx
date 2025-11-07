import React from 'react';
import { EventNode, Project, Location, EntityType, WhenNode } from '../types';
import { EntityTag } from './EntityTag';
import { PencilIcon, TrashIcon, RepeatIcon } from './icons';
import { PROJECT_COLOR_CLASSES } from '../constants';

interface EventCardProps {
  event: EventNode;
  project?: Project;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  onWhenClick: (when: WhenNode) => void;
  onEdit: (event: EventNode) => void;
  onDelete: (eventId: number) => void;
  isReadOnly?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, project, locations, onLocationClick, onWhenClick, onEdit, onDelete, isReadOnly = false }) => {
  const location = locations.find(l => l.id === event.whereId);
  const colorClass = project ? (PROJECT_COLOR_CLASSES[project.color] || PROJECT_COLOR_CLASSES['blue']) : PROJECT_COLOR_CLASSES['blue'];

  return (
    <div className={`border-l-4 p-4 rounded-r-lg shadow-sm ${!isReadOnly && 'hover:shadow-md'} transition-shadow duration-200 ${colorClass}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
            {event.recurrence && <RepeatIcon className="h-4 w-4 text-secondary flex-shrink-0" title="Recurring Event" />}
            <h3 className="font-bold text-primary text-lg">{event.what.name}</h3>
        </div>
        {!isReadOnly && (
          <div className="flex items-center space-x-1 flex-shrink-0">
             <button onClick={() => onEdit(event)} className="p-1.5 rounded-full text-secondary/70 hover:bg-tertiary hover:text-primary transition-colors duration-200" title="Edit Event">
                <PencilIcon className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(event.id)} className="p-1.5 rounded-full text-secondary/70 hover:bg-tertiary hover:text-red-500 transition-colors duration-200" title="Delete Event">
                <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
       {project && <p className="text-sm font-semibold text-secondary mt-1">{project.name}</p>}
       {event.what.description && <p className="text-sm text-secondary mt-1">{event.what.description}</p>}
      <div className="flex flex-wrap gap-2 mt-3 items-center">
        {event.when && (
            <EntityTag 
                label={event.when.display} 
                type={EntityType.When} 
                onClick={!isReadOnly ? () => onWhenClick(event.when!) : undefined}
            />
        )}
        {location && (
            <EntityTag 
                label={location.alias || location.name} 
                type={EntityType.Where}
                onClick={!isReadOnly ? () => onLocationClick(location) : undefined}
            />
        )}
        {event.who.map(person => (
            <EntityTag 
                key={person.id} 
                label={person.name} 
                type={EntityType.Who} 
            />
        ))}
      </div>
    </div>
  );
};