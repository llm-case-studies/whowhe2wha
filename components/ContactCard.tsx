import React from 'react';
import { Contact, Location } from '../types';
import { PencilIcon, TrashIcon, PinIcon, EmailIcon, ChatBubbleIcon, UsersIcon as PhoneIcon } from './icons';

interface ContactCardProps {
  contact: Contact;
  location?: Location;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  onLocationClick: (location: Location) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, location, onEdit, onDelete, onLocationClick }) => {
    
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(contact);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(contact.id);
  };

  return (
    <div className="bg-secondary border border-primary rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 border-l-4 border-who-pink">
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-primary">{contact.name}</h3>
            {contact.role && <p className="text-sm font-semibold text-secondary">{contact.role}</p>}
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button onClick={handleEdit} className="p-1.5 rounded-full text-secondary/70 hover:bg-tertiary hover:text-primary transition-colors" title="Edit Contact">
              <PencilIcon className="h-4 w-4" />
            </button>
            <button onClick={handleDelete} className="p-1.5 rounded-full text-secondary/70 hover:bg-tertiary hover:text-red-500 transition-colors" title="Delete Contact">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {location && (
          <button onClick={() => onLocationClick(location)} className="flex items-center space-x-2 text-sm text-secondary hover:text-primary transition-colors my-2 text-left">
            <PinIcon className="h-4 w-4 text-where-green flex-shrink-0" />
            <span className="truncate">{location.alias || location.name}</span>
          </button>
        )}
        
        <div className="space-y-2 mt-3 pt-3 border-t border-primary">
          {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center space-x-2 text-sm text-secondary hover:text-primary"><PhoneIcon className="h-4 w-4" /><span>{contact.phone}</span></a>}
          {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center space-x-2 text-sm text-secondary hover:text-primary"><EmailIcon className="h-4 w-4" /><span>{contact.email}</span></a>}
          {contact.messenger && <p className="flex items-center space-x-2 text-sm text-secondary"><ChatBubbleIcon className="h-4 w-4" /><span>{contact.messenger}</span></p>}
        </div>
      </div>
    </div>
  );
};
