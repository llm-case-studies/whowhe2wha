import React, { useState, useMemo } from 'react';
import { Location } from '../types';
import { PinIcon } from './icons';

interface LocationSelectModalProps {
    locations: Location[];
    onSelect: (location: Location) => void;
    onAddNew: () => void;
    onClose: () => void;
}

export const LocationSelectModal: React.FC<LocationSelectModalProps> = ({ locations, onSelect, onAddNew, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLocations = useMemo(() => {
        if (!searchTerm) {
            return locations;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return locations.filter(location => 
            location.name.toLowerCase().includes(lowercasedTerm) ||
            location.alias?.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm, locations]);

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="location-select-title">
            <div className="bg-secondary border border-primary rounded-lg p-6 w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 id="location-select-title" className="text-2xl font-bold">Select a Location</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
                </div>

                <div className="flex gap-2 mb-4 flex-shrink-0">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                        placeholder="Search saved locations..."
                    />
                    <button onClick={onAddNew} className="px-5 py-2 rounded-md bg-to-orange text-white font-bold hover:bg-orange-600 transition">
                        + Add New
                    </button>
                </div>
                
                <div className="overflow-y-auto flex-grow pr-2">
                    {filteredLocations.length > 0 ? (
                        <div className="space-y-2">
                            {filteredLocations.map(location => (
                                <button 
                                    key={location.id} 
                                    onClick={() => onSelect(location)}
                                    className="w-full text-left p-3 rounded-md bg-tertiary hover:bg-wha-blue/20 transition flex items-start space-x-3"
                                >
                                    <div className="pt-1 text-where-green">
                                        <PinIcon className="h-5 w-5"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-primary">{location.alias || location.name}</p>
                                        {location.alias && <p className="text-xs text-secondary">{location.name}</p>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-secondary text-center py-8">No matching locations found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};