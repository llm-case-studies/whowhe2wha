
import React, { useState } from 'react';
import { Contact, Location } from '../types';

interface AddContactModalProps {
  locations: Location[];
  onClose: () => void;
  onSave: (newContact: Contact) => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ locations, onClose, onSave }) => {
  const [name, setName] = useState('');
  // Other contact fields

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name,
    };
    onSave(newContact);
  };

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Add New Contact</h2>
        {/* Form fields here */}
        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold">Save Contact</button>
        </div>
      </form>
    </div>
  );
};
