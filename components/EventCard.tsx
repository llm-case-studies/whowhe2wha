
import React from 'react';
import { EventNode, Location, EntityType, WhatType } from '../types';
import { EntityTag } from './EntityTag';
import { PinIcon, ClockIcon, UsersIcon, MilestoneIcon, DeadlineIcon, PeriodIcon, CheckpointIcon, AppointmentIcon, PencilIcon, TrashIcon } from './icons';

interface EventCardProps {
  event: EventNode;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  onWhenClick: (when: EventNode['when']) => void;
  onEdit: (event: EventNode) => void;
  onDelete: (eventId: number) => void;
}

const WhatIcon: React.FC<{whatType: WhatType}> = ({ whatType }) => {
    const iconProps = { className: "h-6 w-6 text-wha-blue" };
    switch(whatType) {
        case WhatType.Milestone: return <MilestoneIcon {...iconProps} />;
        case WhatType.Deadline: return <DeadlineIcon {...iconProps} />;
        case WhatType.Period: return <PeriodIcon {...iconProps} />;
        case WhatType.Checkpoint: return <CheckpointIcon {...iconProps} />;
        case WhatType.Appointment:
        default:
            return <AppointmentIcon {...iconProps} />;
    }
}


export const EventCard: React.FC<EventCardProps> = ({ event, locations, onLocationClick, onWhenClick, onEdit, onDelete }) => {
  const location = locations.find(l => l.id === event.whereId);

  return (
    <div className="bg-secondary border border-primary rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="pt-1">
          <WhatIcon whatType={event.what.whatType} />
        </div>
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-primary">{event.what.name}</h3>
                    {event.what.description && <p className="text-sm text-secondary mt-1">{event.what.description}</p>}
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <button onClick={() => onEdit(event)} className="p-1.5 rounded-full text-secondary hover:bg-tertiary hover:text-primary transition-colors duration-200" title="Edit Event">
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(event.id)} className="p-1.5 rounded-full text-secondary hover:bg-tertiary hover:text-red-500 transition-colors duration-200" title="Delete Event">
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
            
            <div className="mt-4 space-y-3">
                {/* When */}
                <div className="flex items-center space-x-3 text-sm">
                    <ClockIcon className="h-5 w-5 text-secondary" />
                    <EntityTag label={event.when.display} type={EntityType.When} onClick={() => onWhenClick(event.when)} />
                    {event.endWhen && (
                        <>
                            <span className="text-secondary">&rarr;</span>
                            <EntityTag label={event.endWhen.display} type={EntityType.When} onClick={() => onWhenClick(event.endWhen!)} />
                        </>
                    )}
                </div>
                
                {/* Where */}
                {location && (
                    <div className="flex items-center space-x-3 text-sm">
                        <PinIcon className="h-5 w-5 text-secondary" />
                        <EntityTag label={location.alias || location.name} type={EntityType.Where} onClick={() => onLocationClick(location)} />
                    </div>
                )}

                {/* Who */}
                {event.who.length > 0 && (
                     <div className="flex items-start space-x-3 text-sm">
                        <UsersIcon className="h-5 w-5 text-secondary pt-1" />
                        <div className="flex flex-wrap gap-2">
                           {event.who.map(person => (
                                <EntityTag key={person.id} label={person.name} type={EntityType.Who} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
