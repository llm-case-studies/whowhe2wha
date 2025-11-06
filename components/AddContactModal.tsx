
import React, { useState } from 'react';
import { Contact, Location } from '../types';

interface AddContactModalProps {
    locations: Location[];
    onSave: (contactData: Omit<Contact, 'id'>) => void;
    onClose: () => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ locations, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [locationId, setLocationId] = useState<string>('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [messenger, setMessenger] = useState('');

    const isFormValid = name.trim() !== '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        onSave({
            name: name.trim(),
            role: role.trim() || undefined,
            locationId: locationId || undefined,
            email: email.trim() || undefined,
            phone: phone.trim() || undefined,
            messenger: messenger.trim() || undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-contact-title">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="add-contact-title" className="text-2xl font-bold">Add New Contact/Partner</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="contactName" className="block text-sm font-medium text-secondary mb-1">Name</label>
                            <input
                                id="contactName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                                placeholder="e.g., Dr. Smith"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="contactRole" className="block text-sm font-medium text-secondary mb-1">Role / Title (Optional)</label>
                            <input
                                id="contactRole"
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                                placeholder="e.g., Lead Dentist"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-secondary mb-1">Email (Optional)</label>
                        <input
                            id="contactEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                            placeholder="e.g., contact@example.com"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="contactPhone" className="block text-sm font-medium text-secondary mb-1">Phone # (Optional)</label>
                            <input
                                id="contactPhone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                                placeholder="e.g., 555-123-4567"
                            />
                        </div>
                        <div>
                            <label htmlFor="contactMessenger" className="block text-sm font-medium text-secondary mb-1">Messenger (Optional)</label>
                            <input
                                id="contactMessenger"
                                type="text"
                                value={messenger}
                                onChange={(e) => setMessenger(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                                placeholder="e.g., @username"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="contactLocation" className="block text-sm font-medium text-secondary mb-1">Associated Location (Optional)</label>
                        <select
                            id="contactLocation"
                            value={locationId}
                            onChange={(e) => setLocationId(e.target.value)}
                            className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                        >
                            <option value="">None / Not Applicable</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.alias || loc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-tertiary disabled:cursor-not-allowed"
                        >
                            Save Contact
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
