import React from 'react';
import { EventNode, EntityType, Location, When } from '../types';
import { EntityTag } from './EntityTag';
import { PersonIcon, PinIcon, CalendarIcon } from './icons';

interface EventCardProps {
  event: EventNode;
  onLocationClick: (location: Location) => void;
  onWhenClick: (when: When) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onLocationClick, onWhenClick }) => {
  return (
    <div className="bg-secondary/70 border border-primary rounded-lg p-5 transition-all duration-300 hover:border-wha-blue hover:shadow-lg hover:shadow-wha-blue/10">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <h3 className="text-xl font-bold text-primary">{event.what.name}</h3>
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
                      label={event.where.name} 
                      type={EntityType.Where} 
                      onClick={event.where.latitude && event.where.longitude ? () => onLocationClick(event.where) : undefined}
                    />
                </div>
            </div>
        </div>
        <div className="flex items-start space-x-2 md:pl-6 md:border-l md:border-primary">
             <div className="w-6 text-secondary pt-1"><CalendarIcon/></div>
             <div className="flex flex-wrap gap-2">
                <EntityTag 
                  label={event.when.display} 
                  type={EntityType.When}
                  onClick={() => onWhenClick(event.when)}
                />
             </div>
        </div>
      </div>
    </div>
  );
};
