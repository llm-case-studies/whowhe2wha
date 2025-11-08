import React, { useState, useEffect, useRef } from 'react';
import { Location, EntityType } from '../types';
import { SpinnerIcon, PinIcon } from './icons';
import { useI18n } from '../hooks/useI18n';

interface AddLocationModalProps {
    initialQuery: string;
    onSave: (newLocation: Location) => void;
    onClose: () => void;
}

// Load Google Maps API
const loadGoogleMapsAPI = (): Promise<typeof google> => {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps) {
            resolve(google);
            return;
        }

        const API_KEY = process.env.API_KEY || '';
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(google);
        script.onerror = () => reject(new Error('Failed to load Google Maps API'));
        document.head.appendChild(script);
    });
};

export const AddLocationModalV2: React.FC<AddLocationModalProps> = ({ initialQuery, onSave, onClose }) => {
    const { t } = useI18n();
    const inputRef = useRef<HTMLInputElement>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [alias, setAlias] = useState(initialQuery);
    const [notes, setNotes] = useState('');
    const [officialName, setOfficialName] = useState('');
    const [latitude, setLatitude] = useState<number | undefined>();
    const [longitude, setLongitude] = useState<number | undefined>();

    useEffect(() => {
        loadGoogleMapsAPI()
            .then(() => {
                if (!inputRef.current) return;

                // Create autocomplete
                const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
                    fields: ['formatted_address', 'geometry', 'name', 'place_id'],
                    types: ['establishment', 'geocode']
                });

                // Try to bias to user's location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const location = new google.maps.LatLng(
                                position.coords.latitude,
                                position.coords.longitude
                            );
                            const circle = new google.maps.Circle({
                                center: location,
                                radius: 50000 // 50km radius
                            });
                            autocompleteInstance.setBounds(circle.getBounds()!);
                        },
                        (err) => console.warn('Geolocation failed:', err)
                    );
                }

                // Handle place selection
                autocompleteInstance.addListener('place_changed', () => {
                    const place = autocompleteInstance.getPlace();

                    if (!place.geometry || !place.geometry.location) {
                        setError('No location data available for this place');
                        return;
                    }

                    setSelectedPlace(place);
                    setOfficialName(place.formatted_address || place.name || '');
                    setLatitude(place.geometry.location.lat());
                    setLongitude(place.geometry.location.lng());
                    setAlias(place.name || initialQuery);
                    setError(null);
                });

                setAutocomplete(autocompleteInstance);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load Google Maps:', err);
                setError('Failed to load Google Maps. Please check your API key.');
                setLoading(false);
            });
    }, [initialQuery]);

    const handleSave = () => {
        const newLocation: Location = {
            id: `where-${Date.now()}`,
            name: officialName || alias,
            alias: alias.trim() || undefined,
            type: EntityType.Where,
            latitude,
            longitude,
            notes: notes.trim() || undefined,
        };
        onSave(newLocation);
    };

    const mapSrc = (latitude && longitude)
        ? `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
        : '';

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{t('locationFinder')}</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none">&times;</button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <SpinnerIcon className="h-8 w-8 animate-spin mx-auto text-wha-blue" />
                        <p className="text-secondary mt-2">Loading Google Maps...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">
                                Search for a place
                            </label>
                            <input
                                ref={inputRef}
                                type="text"
                                defaultValue={initialQuery}
                                className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                                placeholder="Start typing to search..."
                            />
                            <p className="text-xs text-secondary mt-1">
                                Powered by Google Places - select from dropdown
                            </p>
                        </div>

                        {selectedPlace && (
                            <>
                                {mapSrc && (
                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-1">Location Preview</label>
                                        <iframe
                                            src={mapSrc}
                                            className="w-full h-48 rounded-lg border-2 border-primary"
                                            loading="lazy"
                                            title="Location preview"
                                        ></iframe>
                                        <p className="text-xs text-yellow-400 mt-1">⚠️ Verify this is the correct location</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">{t('alias')}</label>
                                    <input
                                        type="text"
                                        value={alias}
                                        onChange={e => setAlias(e.target.value)}
                                        className="w-full px-3 py-2 bg-input border border-primary rounded-lg"
                                        placeholder={t('aliasPlaceholder')}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">{t('officialName')}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={officialName}
                                            onChange={e => setOfficialName(e.target.value)}
                                            className="w-full pl-3 pr-10 py-2 bg-tertiary border border-primary rounded-lg"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <PinIcon className="h-5 w-5 text-green-500" />
                                        </div>
                                    </div>
                                    {latitude && longitude && (
                                        <p className="text-xs text-secondary mt-1">
                                            Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">{t('notes')}</label>
                                    <textarea
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 bg-input border border-primary rounded-lg"
                                        placeholder={t('notesPlaceholder')}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition"
                    >
                        {t('cancel')}
                    </button>
                    {selectedPlace && (
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!officialName && !alias}
                            className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-tertiary"
                        >
                            {t('saveLocation')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
