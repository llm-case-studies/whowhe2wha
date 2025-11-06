
import React, { useState } from 'react';
import { Location } from '../types';

interface EditLocationModalProps {
  location: Location;
  onClose: () => void;
  onSave: (updatedLocation: Location) => void;
}

export const EditLocationModal: React.FC<EditLocationModalProps> = ({ location, onClose, onSave }) => {
  const [formData, setFormData] = useState<Location>(location);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Edit Location</h2>
        {/* Form fields here, pre-filled with location data */}
        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold">Save Changes</button>
        </div>
      </form>
    </div>
  );
};
