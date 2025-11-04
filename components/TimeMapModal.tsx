import React from 'react';
import { When, EventNode, Location } from '../types';
import { CalendarIcon } from './icons';

interface TimeMapModalProps {
  when: When;
  allEvents: EventNode[];
  onClose: () => void;
}

const DAY_WINDOW = 3; // +/- 3 days

const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export const TimeMapModal: React.FC<TimeMapModalProps> = ({ when, allEvents, onClose }) => {
  const centerDate = new Date(when.timestamp);
  
  const startDate = new Date(centerDate);
  startDate.setDate(centerDate.getDate() - DAY_WINDOW);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(centerDate);
  endDate.setDate(centerDate.getDate() + DAY_WINDOW);
  endDate.setHours(23, 59, 59, 999);

  const eventsInWindow = allEvents.filter(event => {
      const eventDate = new Date(event.when.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
  }).sort((a,b) => new Date(a.when.timestamp).getTime() - new Date(b.when.timestamp).getTime());
  
  const getMapUrl = (): string => {
    const locationsWithCoords = eventsInWindow
      .map(e => e.where)
      .filter((w): w is Location & { latitude: number, longitude: number } => !!w.latitude && !!w.longitude);
      
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="time-map-modal-title">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <CalendarIcon />
            <div>
              <h2 id="time-map-modal-title" className="text-2xl font-bold">Spatial-Temporal View</h2>
              <p className="text-sm text-slate-400">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>

        <iframe
          src={mapUrl}
          className="w-full h-64 rounded-lg border-2 border-slate-700 mb-4 flex-shrink-0"
          loading="lazy"
          title={`Map of events from ${formatDate(startDate)} to ${formatDate(endDate)}`}
          allowFullScreen
        ></iframe>

        <div className="overflow-y-auto">
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            Itinerary ({eventsInWindow.length} {eventsInWindow.length === 1 ? 'Event' : 'Events'})
          </h3>
           {eventsInWindow.length > 0 ? (
                <div className="divide-y divide-slate-700">
                  {eventsInWindow.map(event => (
                    <div key={event.id} className="py-3">
                      <p className="font-semibold text-text-light">{event.what.name}</p>
                      <p className="text-sm text-slate-400">{event.when.display}</p>
                      <p className="text-sm text-slate-300 font-medium">@ {event.where.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No events scheduled in this time window.</p>
              )}
        </div>
      </div>
    </div>
  );
};
