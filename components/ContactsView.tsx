import React, { useState } from 'react';
import { Contact, Location } from '../types';
import { ContactCard } from './ContactCard';
import { UsersIcon, PlusIcon } from './icons';

interface ContactsViewProps {
  contacts: Contact[];
  locations: Location[];
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onLocationClick: (location: Location) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ contacts, locations, onAddContact, onEditContact, onDeleteContact, onLocationClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-primary flex items-center">
          <UsersIcon className="h-7 w-7 mr-3" />
          Contacts & Partners
        </h2>
        <button onClick={onAddContact} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md bg-wha-blue text-white hover:bg-blue-600 transition">
          <PlusIcon className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex-shrink-0">
        <input
          type="text"
          placeholder="Search contacts by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
        />
      </div>

      {/* Grid */}
      <div className="overflow-y-auto pr-4 pb-12 flex-grow">
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredContacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                location={locations.find(l => l.id === contact.locationId)}
                onEdit={onEditContact}
                onDelete={onDeleteContact}
                onLocationClick={onLocationClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-secondary rounded-lg">
            <h3 className="text-lg font-semibold text-primary">No Contacts Found</h3>
            <p className="text-tertiary mt-2">Try adjusting your search or adding a new contact.</p>
          </div>
        )}
      </div>
    </div>
  );
};