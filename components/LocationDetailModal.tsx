
import React, { useState } from 'react';
import { Location, EventNode, Contact } from '../types';
import { getDistanceInMiles } from '../services/geoService';
import { EventCard } from './EventCard';
import { PinIcon, CalendarIcon, UsersIcon, NavigateIcon, PencilIcon, TrashIcon, EmailIcon, ChatBubbleIcon } from './icons';

interface LocationDetailModalProps {
  location: Location;
  allEvents: EventNode[];
  allLocations: Location[];
  contacts: Contact[];
  onClose: () => void;
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (locationId: string) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
}

const NEARBY_RADIUS_MILES = 5;
type ActiveTab = 'events' | 'contacts';

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({ 
    location, allEvents, allLocations, contacts, onClose, 
    onEditLocation, onDeleteLocation, onEditContact, onDeleteContact 
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('contacts');

  const eventsAtThisLocation = allEvents.filter(event => event.whereId === location.id);
  const locationContacts = contacts.filter(contact => contact.locationId === location.id);

  const canDeleteLocation = eventsAtThisLocation.length === 0;

  const mapSrc = (location.latitude && location.longitude) ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=&z=14&ie=UTF8&iwloc=&output=embed` : '';
  const navigationUrl = (location.latitude && location.longitude) ? `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}` : '';

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
      <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-white text-wha-blue' : 'bg-tertiary text-secondary'}`}>{count}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="map-modal-title">
      <div className="bg-secondary border border-primary rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
          <div className="flex items-center space-x-4">
             <PinIcon className="h-8 w-8 text-where-green flex-shrink-0"/>
             <div>
                <h2 id="map-modal-title" className="text-2xl font-bold">{location.alias || location.name}</h2>
                {location.alias && <p className="text-sm text-secondary">{location.name}</p>}
             </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow min-h-0">
            {/* Left Column */}
            <div className="md:col-span-1 flex flex-col space-y-4">
                {mapSrc && (
                    <iframe
                      src={mapSrc}
                      className="w-full h-48 rounded-lg border-2 border-primary"
                      loading="lazy"
                      title={`Map of ${location.name}`}
                    ></iframe>
                )}
                 <div className="flex items-center space-x-2">
                    {navigationUrl && <a href={navigationUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-bold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"><NavigateIcon className="h-5 w-5 mr-2" />Navigate</a>}
                    <button onClick={() => onEditLocation(location)} className="p-2 rounded-md text-secondary hover:bg-tertiary hover:text-primary transition-colors" title="Edit Location Details"><PencilIcon className="h-5 w-5" /></button>
                    <button 
                        onClick={() => onDeleteLocation(location.id)} 
                        disabled={!canDeleteLocation}
                        className="p-2 rounded-md text-secondary hover:bg-tertiary hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        title={canDeleteLocation ? "Delete Location" : "Cannot delete location with scheduled events"}
                    ><TrashIcon className="h-5 w-5" /></button>
                 </div>
                 <div className="bg-tertiary/50 p-3 rounded-lg text-sm space-y-2">
                     {location.phone && <p><strong className="text-secondary">Phone:</strong> <a href={`tel:${location.phone}`} className="text-primary hover:underline">{location.phone}</a></p>}
                     {location.website && <p><strong className="text-secondary">Website:</strong> <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate block">{location.website}</a></p>}
                     {location.notes && <p><strong className="text-secondary">Notes:</strong> <span className="text-primary">{location.notes}</span></p>}
                 </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 flex flex-col">
                <div className="flex-shrink-0 mb-4 border-b border-primary" role="tablist">
                  <div className="flex space-x-2">
                    <TabButton tab="contacts" label="Contacts" icon={<UsersIcon />} count={locationContacts.length} />
                    <TabButton tab="events" label="Scheduled Events" icon={<CalendarIcon />} count={eventsAtThisLocation.length} />
                  </div>
                </div>

                <div className="overflow-y-auto pr-2">
                  {activeTab === 'contacts' && (
                     <div role="tabpanel">
                      {locationContacts.length > 0 ? (
                        <div className="divide-y divide-primary">
                          {locationContacts.map(contact => (
                            <div key={contact.id} className="flex items-start justify-between py-3">
                              <div>
                                <p className="font-semibold text-primary">{contact.name}</p>
                                {contact.role && <p className="text-sm text-secondary">{contact.role}</p>}
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                                    {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center space-x-1.5 text-secondary hover:text-primary"><UsersIcon className="h-4 w-4" /><span>{contact.phone}</span></a>}
                                    {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center space-x-1.5 text-secondary hover:text-primary"><EmailIcon className="h-4 w-4" /><span>{contact.email}</span></a>}
                                    {contact.messenger && <p className="flex items-center space-x-1.5 text-secondary"><ChatBubbleIcon className="h-4 w-4" /><span>{contact.messenger}</span></p>}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                                 <button onClick={() => onEditContact(contact)} className="p-1.5 rounded-full text-secondary hover:bg-tertiary hover:text-primary"><PencilIcon className="h-4 w-4" /></button>
                                 <button onClick={() => onDeleteContact(contact.id)} className="p-1.5 rounded-full text-secondary hover:bg-tertiary hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : ( <p className="text-tertiary text-center py-8">No contacts listed for this location.</p> )}
                    </div>
                  )}
                  {activeTab === 'events' && (
                    <div role="tabpanel">
                      {eventsAtThisLocation.length > 0 ? (
                        <div className="space-y-4">
                          {eventsAtThisLocation.map(event => (
                            <EventCard key={event.id} event={event} locations={allLocations} onLocationClick={() => {}} onWhenClick={() => {}} onEdit={() => {}} onDelete={() => {}} />
                          ))}
                        </div>
                      ) : ( <p className="text-tertiary text-center py-8">No events scheduled at this location.</p> )}
                    </div>
                  )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
