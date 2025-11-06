
import React from 'react';
import { Location } from '../types';

interface LocationDetailModalProps {
  location: Location;
  onClose: () => void;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({ location, onClose }) => {
  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50">
      <div className="bg-secondary border border-primary rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{location.alias || location.name}</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary text-3xl">&times;</button>
        </div>
        <div>
          <p className="text-secondary">{location.name}</p>
          {location.notes && <p className="mt-2">{location.notes}</p>}
        </div>
      </div>
    </div>
  );
};
