import React, { useState } from 'react';
import { Location, EventNode, Contact } from '../types';
import { getDistanceInMiles } from '../services/geoService';
import { EventCard } from './EventCard';
import { PinIcon, CalendarIcon, UsersIcon } from './icons';
import { MOCK_CONTACTS } from '../constants';

interface MapModalProps {
  location: Location;
  allEvents: EventNode[];
  onClose: () => void;
  onSchedule: (contact: Contact, location: Location) => void;
}

const NEARBY_RADIUS_MILES = 5;

type ActiveTab = 'events' | 'contacts';

export const MapModal: React.FC<MapModalProps> = ({ location, allEvents, onClose, onSchedule }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');

  const nearbyEvents = allEvents.filter(event => {
    if (event.where.id === location.id) return false;
    if (location.latitude && location.longitude && event.where.latitude && event.where.longitude) {
      const distance = getDistanceInMiles(location.latitude, location.longitude, event.where.latitude, event.where.longitude);
      return distance <= NEARBY_RADIUS_MILES;
    }
    return false;
  });

  const locationContacts = MOCK_CONTACTS.filter(
    contact => contact.locationName.toLowerCase() === location.name.toLowerCase()
  );

  const handleLocationClick = () => {};
  // FIX: Add a dummy handler for onWhenClick to satisfy EventCard's required prop.
  const handleWhenClick = () => {};

  const mapSrc = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const TabButton: React.FC<{tab: ActiveTab, label: string, icon: React.ReactNode}> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeTab === tab 
          ? 'bg-wha-blue text-white' 
          : 'text-primary hover:bg-tertiary'
      }`}
      role="tab"
      aria-selected={activeTab === tab}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="map-modal-title">
      <div className="bg-secondary border border-primary rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 id="map-modal-title" className="text-2xl font-bold flex items-center">
            <PinIcon />
            <span className="ml-2">{location.name}</span>
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <iframe
          src={mapSrc}
          className="w-full h-64 rounded-lg border-2 border-primary mb-4"
          loading="lazy"
          title={`Map of ${location.name}`}
          aria-label={`Map of ${location.name}`}
        ></iframe>

        <div className="flex-shrink-0 mb-4 border-b border-primary" role="tablist">
          <div className="flex space-x-2">
            <TabButton tab="events" label="Scheduled Events" icon={<CalendarIcon />} />
            <TabButton tab="contacts" label="Contacts & Partners" icon={<UsersIcon />} />
          </div>
        </div>

        <div className="overflow-y-auto">
          {activeTab === 'events' && (
            <div role="tabpanel">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Nearby Events (within {NEARBY_RADIUS_MILES} miles)
              </h3>
              {nearbyEvents.length > 0 ? (
                <div className="space-y-4">
                  {nearbyEvents.map(event => (
                    <EventCard key={event.id} event={event} onLocationClick={handleLocationClick} onWhenClick={handleWhenClick} />
                  ))}
                </div>
              ) : (
                <p className="text-tertiary">No other events found nearby.</p>
              )}
            </div>
          )}
          {activeTab === 'contacts' && (
             <div role="tabpanel">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Key Contacts at this Location
              </h3>
              {locationContacts.length > 0 ? (
                <div className="divide-y divide-primary">
                  {locationContacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-semibold text-primary">{contact.name}</p>
                        <p className="text-sm text-secondary">{contact.role}</p>
                      </div>
                      <button 
                        onClick={() => onSchedule(contact, location)}
                        className="px-4 py-1.5 text-sm font-semibold bg-to-orange text-white rounded-md hover:bg-orange-500 transition-colors duration-200"
                      >
                        Schedule
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-tertiary">No key contacts listed for this location.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
