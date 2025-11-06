
import React, { useState } from 'react';
import { Location, EventNode, Contact } from '../types';
import { EventCard } from './EventCard';
import { PinIcon, CalendarIcon, UsersIcon, NavigateIcon, PhoneIcon, WebsiteIcon, LinkIcon, NotesIcon, EmailIcon, ChatBubbleIcon } from './icons';

interface LocationDetailModalProps {
  location: Location;
  allEvents: EventNode[];
  allLocations: Location[];
  contacts: Contact[];
  onClose: () => void;
  onSchedule: (contact: Contact) => void;
}

type ActiveTab = 'events' | 'contacts';

const DetailRow: React.FC<{ icon: React.ReactNode, label: string, value: string | undefined, href?: string }> = ({ icon, label, value, href }) => {
    if (!value) return null;

    const content = href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-words">
            {value}
        </a>
    ) : (
        <p className="text-primary break-words">{value}</p>
    );

    return (
        <div className="flex items-start space-x-4 py-2">
            <div className="flex-shrink-0 w-5 h-5 text-secondary mt-1">{icon}</div>
            <div className="flex-grow">
                <p className="text-sm font-semibold text-secondary">{label}</p>
                {content}
            </div>
        </div>
    );
};


export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({ location, allEvents, allLocations, contacts, onClose, onSchedule }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');

  const relatedEvents = allEvents.filter(event => event.whereId === location.id)
    .sort((a,b) => new Date(a.when.timestamp).getTime() - new Date(b.when.timestamp).getTime());

  const locationContacts = contacts.filter(
    contact => contact.locationId === location.id
  );

  const handleLocationClick = () => {};
  const handleWhenClick = () => {};

  const mapSrc = location.latitude && location.longitude 
    ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=&z=14&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(location.name)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    
  const navigationUrl = location.latitude && location.longitude 
    ? `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`;


  const TabButton: React.FC<{tab: ActiveTab, label: string, icon: React.ReactNode, count: number}> = ({ tab, label, icon, count }) => (
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
      <span className="bg-tertiary text-secondary text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="location-detail-title">
      <div className="bg-secondary border border-primary rounded-lg p-6 w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
          <div>
            <h2 id="location-detail-title" className="text-2xl font-bold flex items-center">
              <PinIcon />
              <span className="ml-2">{location.alias || location.name}</span>
            </h2>
            {location.alias && <p className="text-sm text-secondary ml-8">{location.name}</p>}
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <div className="flex-grow flex gap-6 overflow-hidden">
            {/* Left Column: Map and Details */}
            <div className="w-1/3 flex flex-col gap-4 flex-shrink-0">
                 <div className="relative">
                    <iframe
                      src={mapSrc}
                      className="w-full h-56 rounded-lg border-2 border-primary"
                      loading="lazy"
                      title={`Map of ${location.name}`}
                      aria-label={`Map of ${location.name}`}
                    ></iframe>
                     <a 
                        href={navigationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 inline-flex items-center px-3 py-1.5 text-xs font-bold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                        <NavigateIcon className="h-4 w-4 mr-1.5" />
                        Navigate
                    </a>
                </div>
                <div className="bg-tertiary/30 p-4 rounded-lg flex-grow overflow-y-auto">
                    <h3 className="text-lg font-semibold text-primary mb-2">Location Details</h3>
                    <div className="divide-y divide-primary/50">
                       <DetailRow icon={<PinIcon />} label="Address" value={location.name} />
                       <DetailRow icon={<PhoneIcon />} label="Phone" value={location.phone} href={`tel:${location.phone}`} />
                       <DetailRow icon={<WebsiteIcon />} label="Website" value={location.website} href={location.website} />
                       <DetailRow icon={<LinkIcon />} label="Portal" value={location.portalUrl} href={location.portalUrl} />
                       <DetailRow icon={<NotesIcon />} label="Notes" value={location.notes} />
                    </div>
                </div>
            </div>

            {/* Right Column: Events and Contacts */}
            <div className="w-2/3 flex flex-col">
                <div className="flex-shrink-0 mb-4 border-b border-primary" role="tablist">
                  <div className="flex space-x-2">
                    <TabButton tab="events" label="Scheduled Events" icon={<CalendarIcon />} count={relatedEvents.length} />
                    <TabButton tab="contacts" label="Contacts & Partners" icon={<UsersIcon />} count={locationContacts.length}/>
                  </div>
                </div>
                <div className="overflow-y-auto pr-2 flex-grow">
                  {activeTab === 'events' && (
                    <div role="tabpanel" className="space-y-4">
                      {relatedEvents.length > 0 ? (
                          relatedEvents.map(event => (
                            <EventCard key={event.id} event={event} locations={allLocations} onLocationClick={handleLocationClick} onWhenClick={handleWhenClick} />
                          ))
                      ) : (
                        <p className="text-tertiary text-center pt-8">No events scheduled at this location.</p>
                      )}
                    </div>
                  )}
                  {activeTab === 'contacts' && (
                     <div role="tabpanel">
                      {locationContacts.length > 0 ? (
                        <div className="divide-y divide-primary">
                          {locationContacts.map(contact => (
                            <div key={contact.id} className="flex items-start justify-between py-4">
                                <div>
                                    <p className="font-semibold text-primary">{contact.name}</p>
                                    {contact.role && <p className="text-sm text-secondary">{contact.role}</p>}
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                        {contact.phone && (
                                            <a href={`tel:${contact.phone}`} className="flex items-center text-xs text-secondary hover:text-primary transition-colors duration-200">
                                                <PhoneIcon className="w-3.5 h-3.5 mr-1.5" /> {contact.phone}
                                            </a>
                                        )}
                                        {contact.email && (
                                            <a href={`mailto:${contact.email}`} className="flex items-center text-xs text-secondary hover:text-primary transition-colors duration-200 break-all">
                                                <EmailIcon className="w-3.5 h-3.5 mr-1.5" /> {contact.email}
                                            </a>
                                        )}
                                        {contact.messenger && (
                                            <span className="flex items-center text-xs text-secondary">
                                                <ChatBubbleIcon className="w-3.5 h-3.5 mr-1.5" /> {contact.messenger}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onSchedule(contact)}
                                    className="px-4 py-1.5 text-sm font-semibold bg-to-orange text-white rounded-md hover:bg-orange-500 transition-colors duration-200 flex-shrink-0 ml-4"
                                >
                                    Schedule
                                </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-tertiary text-center pt-8">No key contacts listed for this location.</p>
                      )}
                    </div>
                  )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
