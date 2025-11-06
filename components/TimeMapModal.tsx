import React from 'react';
// FIX: Renamed type 'When' to 'WhenNode' to match the exported type from 'types.ts'.
import { WhenNode, EventNode, Location } from '../types';
import { CalendarIcon, NavigateIcon } from './icons';

interface TimeMapModalProps {
  when: WhenNode;
  allEvents: EventNode[];
  allLocations: Location[];
  onClose: () => void;
}

const DAY_WINDOW = 3; // +/- 3 days

const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export const TimeMapModal: React.FC<TimeMapModalProps> = ({ when, allEvents, allLocations, onClose }) => {
  const centerDate = new Date(when.timestamp);
  
  const startDate = new Date(centerDate);
  startDate.setDate(centerDate.getDate() - DAY_WINDOW);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(centerDate);
  endDate.setDate(centerDate.getDate() + DAY_WINDOW);
  endDate.setHours(23, 59, 59, 999);

  // FIX: Add a guard for event.when, as it can be optional for unscheduled events.
  const eventsInWindow = allEvents.filter(event => {
      if (!event.when) return false;
      const eventDate = new Date(event.when.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
  }).sort((a,b) => new Date(a.when!.timestamp).getTime() - new Date(b.when!.timestamp).getTime());
  
  const getMapUrl = (): string => {
    const locationsWithCoords = eventsInWindow
      .map(e => allLocations.find(l => l.id === e.whereId))
      .filter((w): w is Location & { latitude: number, longitude: number } => !!w && w.latitude !== undefined && w.longitude !== undefined);
      
    if (locationsWithCoords.length === 0) {
      // Generic map of the US, no key needed
      return `https://maps.google.com/maps?q=USA&t=&z=4&ie=UTF8&iwloc=&output=embed`;
    }

    const uniqueLocations = Array.from(new Map(locationsWithCoords.map(item => [`${item.latitude},${item.longitude}`, item])).values());
    
    if (uniqueLocations.length === 1) {
      const loc = uniqueLocations[0];
      // Single point embed, no key needed
      return `https://maps.google.com/maps?q=${loc.latitude},${loc.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    } 
    
    // For multiple locations, construct a directions URL using saddr and daddr which is embeddable.
    const origin = uniqueLocations[0];
    const destination = uniqueLocations[uniqueLocations.length - 1];
    const waypoints = uniqueLocations.slice(1, -1);

    const originParam = `${origin.latitude},${origin.longitude}`;
    const destinationParam = `${destination.latitude},${destination.longitude}`;

    let url = `https://maps.google.com/maps?output=embed&saddr=${originParam}&daddr=${destinationParam}`;

    if (waypoints.length > 0) {
        const waypointsParam = waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('+to:');
        url += `+to:${waypointsParam}`;
    }
    
    return url;
  };

  const mapUrl = getMapUrl();

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="time-map-modal-title">
      <div className="bg-secondary border border-primary rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <CalendarIcon />
            <div>
              <h2 id="time-map-modal-title" className="text-2xl font-bold">Spatial-Temporal View</h2>
              <p className="text-sm text-secondary">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>

        <iframe
          src={mapUrl}
          className="w-full h-64 rounded-lg border-2 border-primary mb-4 flex-shrink-0"
          loading="lazy"
          title={`Map of events from ${formatDate(startDate)} to ${formatDate(endDate)}`}
          allowFullScreen
        ></iframe>

        <div className="overflow-y-auto">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Itinerary ({eventsInWindow.length} {eventsInWindow.length === 1 ? 'Event' : 'Events'})
          </h3>
           {eventsInWindow.length > 0 ? (
                <div className="divide-y divide-primary">
                  {eventsInWindow.map(event => {
                    const location = allLocations.find(l => l.id === event.whereId);
                    if (!location || !event.when) return null;
                    return (
                        <div key={event.id} className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-semibold text-primary">{event.what.name}</p>
                            <p className="text-sm text-secondary">{event.when.display}</p>
                            <p className="text-sm text-primary font-medium">@ {location.alias || location.name}</p>
                          </div>
                          {location.latitude && location.longitude && (
                             <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-tertiary hover:bg-green-600 hover:text-white transition-colors duration-200"
                                title={`Navigate to ${location.name}`}
                             >
                                 <NavigateIcon className="h-5 w-5" />
                             </a>
                          )}
                        </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-tertiary">No events scheduled in this time window.</p>
              )}
        </div>
      </div>
    </div>
  );
};