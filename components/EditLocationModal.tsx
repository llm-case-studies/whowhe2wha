
import React, { useState } from 'react';
import { Location } from '../types';

interface EditLocationModalProps {
  location: Location;
  onClose: () => void;
  onSave: (updatedLocation: Location) => void;
}

export const EditLocationModal: React.FC<EditLocationModalProps> = ({ location, onClose, onSave }) => {
  const [alias, setAlias] = useState(location.alias || '');
  const [phone, setPhone] = useState(location.phone || '');
  const [website, setWebsite] = useState(location.website || '');
  const [notes, setNotes] = useState(location.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...location,
      alias: alias.trim(),
      phone: phone.trim(),
      website: website.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="edit-location-title">
      <form onSubmit={handleSubmit} className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
            <h2 id="edit-location-title" className="text-2xl font-bold">Edit Location</h2>
            <button type="button" onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
        </div>
        
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Official Name / Address</label>
              <p className="px-3 py-2 bg-tertiary border border-primary rounded-lg text-secondary">{location.name}</p>
            </div>
            <div>
              <label htmlFor="alias" className="block text-sm font-medium text-secondary mb-1">Friendly Name (Alias)</label>
              <input type="text" id="alias" value={alias} onChange={(e) => setAlias(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
             <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
             <div>
              <label htmlFor="website" className="block text-sm font-medium text-secondary mb-1">Website URL</label>
              <input type="url" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
            <div>
                 <label htmlFor="notes" className="block text-sm font-medium text-secondary mb-1">Notes / Description</label>
                 <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-input border border-primary rounded-lg"
                />
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition">Save Changes</button>
        </div>
      </form>
    </div>
  );
};
