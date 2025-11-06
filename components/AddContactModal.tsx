
import React, { useState, useEffect } from 'react';
import { Contact, Location } from '../types';

interface AddContactModalProps {
  locations: Location[];
  contactToEdit?: Contact | null;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ locations, contactToEdit, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [locationId, setLocationId] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [messenger, setMessenger] = useState('');

  useEffect(() => {
    if (contactToEdit) {
        setName(contactToEdit.name);
        setRole(contactToEdit.role || '');
        setLocationId(contactToEdit.locationId || '');
        setPhone(contactToEdit.phone || '');
        setEmail(contactToEdit.email || '');
        setMessenger(contactToEdit.messenger || '');
    }
  }, [contactToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newContact: Contact = {
      id: contactToEdit ? contactToEdit.id : `contact-${Date.now()}`,
      name,
      role: role || undefined,
      locationId: locationId || undefined,
      phone: phone || undefined,
      email: email || undefined,
      messenger: messenger || undefined,
    };
    onSave(newContact);
  };

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-contact-title">
      <form onSubmit={handleSubmit} className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 id="add-contact-title" className="text-2xl font-bold">{contactToEdit ? 'Edit Contact' : 'Add New Contact'}</h2>
            <button type="button" onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
        </div>
        
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-secondary mb-1">Role / Title</label>
                    <input type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                </div>
            </div>
            <div>
                <label htmlFor="locationId" className="block text-sm font-medium text-secondary mb-1">Associated Location</label>
                <select id="locationId" value={locationId} onChange={(e) => setLocationId(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                    <option value="">None</option>
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.alias || loc.name}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-1">Phone #</label>
                    <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                </div>
            </div>
             <div>
                <label htmlFor="messenger" className="block text-sm font-medium text-secondary mb-1">Messenger</label>
                <input type="text" id="messenger" value={messenger} onChange={(e) => setMessenger(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" placeholder="@username, WhatsApp, etc." />
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold">{contactToEdit ? 'Save Changes' : 'Save Contact'}</button>
        </div>
      </form>
    </div>
  );
};
