
import React from 'react';
import { EventNode, Location, EntityType, WhatType } from '../types';
import { EntityTag } from './EntityTag';
import { PinIcon, ClockIcon, UsersIcon, MilestoneIcon, DeadlineIcon, PeriodIcon, CheckpointIcon, AppointmentIcon } from './icons';

interface EventCardProps {
  event: EventNode;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  onWhenClick: (when: EventNode['when']) => void;
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


export const EventCard: React.FC<EventCardProps> = ({ event, locations, onLocationClick, onWhenClick }) => {
  const location = locations.find(l => l.id === event.whereId);

  return (
    <div className="bg-secondary border border-primary rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="pt-1">
          <WhatIcon whatType={event.what.whatType} />
        </div>
        <div className="flex-1">
            <h3 className="text-lg font-bold text-primary">{event.what.name}</h3>
            {event.what.description && <p className="text-sm text-secondary mt-1">{event.what.description}</p>}
            
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
