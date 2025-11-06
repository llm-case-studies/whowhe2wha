import React from 'react';
import { EventNode, EntityType, Location, When, WhatType } from '../types';
import { EntityTag } from './EntityTag';
import { PersonIcon, PinIcon, CalendarIcon, MilestoneIcon, DeadlineIcon, CheckpointIcon } from './icons';

interface EventCardProps {
  event: EventNode;
  locations: Location[];
  onLocationClick: (location: Location) => void;
  onWhenClick: (when: When) => void;
}

const WhatTypeIcon: React.FC<{ type: WhatType, className?: string }> = ({ type, className = "h-5 w-5 mr-2 text-secondary" }) => {
    switch(type) {
        case WhatType.Milestone:
            return <MilestoneIcon className={className} title="Milestone"/>
        case WhatType.Deadline:
            return <DeadlineIcon className={className} title="Deadline"/>
        case WhatType.Checkpoint:
            return <CheckpointIcon className={className} title="Checkpoint"/>
        case WhatType.Period:
             return <CalendarIcon className={className} title="Period"/>
        default:
            return null;
    }
}

export const EventCard: React.FC<EventCardProps> = ({ event, locations, onLocationClick, onWhenClick }) => {
  const isPeriod = event.what.whatType === WhatType.Period && event.endWhen;
  const location = locations.find(l => l.id === event.whereId);

  if (!location) {
    // Handle case where location might not be found
    return (
        <div className="bg-secondary/70 border border-red-700 rounded-lg p-5">
            <p className="text-red-300">Error: Location data missing for this event.</p>
        </div>
    );
  }

  return (
    <div className="bg-secondary/70 border border-primary rounded-lg p-5 transition-all duration-300 hover:border-wha-blue hover:shadow-lg hover:shadow-wha-blue/10">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <h3 className="text-xl font-bold text-primary flex items-center">
            <WhatTypeIcon type={event.what.whatType} />
            {event.what.name}
        </h3>
      </div>
      {event.what.description && <p className="text-secondary mb-6">{event.what.description}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
            {event.who.length > 0 && <div className="flex items-center space-x-2">
                <div className="w-6 text-secondary"><PersonIcon/></div>
                <div className="flex flex-wrap gap-2">
                    {event.who.map(p => <EntityTag key={p.id} label={p.name} type={EntityType.Who} />)}
                </div>
            </div>}
             <div className="flex items-start space-x-2">
                <div className="w-6 text-secondary pt-1"><PinIcon/></div>
                <div className="flex flex-wrap gap-2">
                    <EntityTag 
                      label={location.alias || location.name} 
                      type={EntityType.Where} 
                      onClick={location.latitude && location.longitude ? () => onLocationClick(location) : undefined}
                    />
                </div>
            </div>
        </div>
        <div className="flex items-start space-x-2 md:pl-6 md:border-l md:border-primary">
             <div className="w-6 text-secondary pt-1"><CalendarIcon/></div>
             <div className="flex flex-wrap gap-2">
                {isPeriod ? (
                    <>
                        <EntityTag 
                          label={event.when.display} 
                          type={EntityType.When}
                          onClick={() => onWhenClick(event.when)}
                        />
                        <span className="text-secondary self-center">to</span>
                        <EntityTag 
                          label={event.endWhen.display} 
                          type={EntityType.When}
                          onClick={() => onWhenClick(event.endWhen)}
                        />
                    </>
                ) : (
                     <EntityTag 
                      label={event.when.display} 
                      type={EntityType.When}
                      onClick={() => onWhenClick(event.when)}
                    />
                )}
             </div>
        </div>
      </div>
    </div>
  );
};