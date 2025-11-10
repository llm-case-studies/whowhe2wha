import React, { useState, useEffect, useRef } from 'react';
import { Location, EntityType } from '../types';
import { SpinnerIcon, PinIcon } from './icons';
import { useI18n } from '../hooks/useI18n';

interface AddLocationModalProps {
    initialQuery: string;
    onSave: (newLocation: Location) => void;
    onClose: () => void;
}

type LocationPermissionState = 'prompt' | 'granted' | 'denied';
type ViewMode = 'search' | 'manual';

declare global {
    interface Window {
        gm_authFailure?: () => void;
    }
}

let googleMapsApiPromise: Promise<typeof google> | null = null;

// Load Google Maps API once per session
const loadGoogleMapsAPI = (apiKey: string): Promise<typeof google> => {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Google Maps API can only be loaded in a browser.'));
    }

    if (typeof google !== 'undefined' && google.maps?.places) {
        return Promise.resolve(google);
    }

    if (!apiKey) {
        return Promise.reject(new Error('Google Maps API key is missing.'));
    }

    if (!googleMapsApiPromise) {
        googleMapsApiPromise = new Promise((resolve, reject) => {
            const existingScript = document.getElementById('google-maps-script') as HTMLScriptElement | null;
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(google));
                existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps API.')));
                return;
            }

            const script = document.createElement('script');
            script.id = 'google-maps-script';
            // Avoid loading=async so google.maps.places.* APIs exist when onload fires.
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(google);
            script.onerror = () => {
                googleMapsApiPromise = null;
                reject(new Error('Failed to load Google Maps API.'));
            };
            document.head.appendChild(script);
        });
    }

    return googleMapsApiPromise;
};

export const AddLocationModalV2: React.FC<AddLocationModalProps> = ({ initialQuery, onSave, onClose }) => {
    const { t } = useI18n();
    const rawMapsApiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapsApiKey = rawMapsApiKey && rawMapsApiKey !== 'undefined' && rawMapsApiKey !== 'null' ? rawMapsApiKey : '';
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteListener = useRef<google.maps.MapsEventListener | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    const dummyMapRef = useRef<HTMLDivElement | null>(null);

    const [searchValue, setSearchValue] = useState(initialQuery);
    const [view, setView] = useState<ViewMode>('search');
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [isMapsLoading, setIsMapsLoading] = useState(true);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locationPermission, setLocationPermission] = useState<LocationPermissionState>('prompt');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    const [alias, setAlias] = useState(initialQuery);
    const [notes, setNotes] = useState('');
    const [officialName, setOfficialName] = useState('');
    const [latitude, setLatitude] = useState<number | undefined>();
    const [longitude, setLongitude] = useState<number | undefined>();
    const [isGeocoding, setIsGeocoding] = useState(false);

    useEffect(() => {
        setSearchValue(initialQuery);
        setAlias(initialQuery);
    }, [initialQuery]);

    const applyResolvedLocation = (data: { aliasValue?: string | null; officialAddress?: string | null; lat?: number | null; lng?: number | null; }) => {
        if (data.aliasValue !== undefined) {
            setAlias(data.aliasValue || '');
        }
        if (data.officialAddress !== undefined) {
            setOfficialName(data.officialAddress || '');
        }
        if (data.lat !== undefined) {
            setLatitude(data.lat ?? undefined);
        }
        if (data.lng !== undefined) {
            setLongitude(data.lng ?? undefined);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const handleAuthFailure = () => {
            if (!isMounted) return;
            const origin = typeof window !== 'undefined' ? window.location.origin : 'this origin';
            console.error('[Location Finder] Google Maps API key rejected for origin:', origin);
            setError(`Google Maps rejected the API key for ${origin}. Add this origin (with /*) to the HTTP referrer allowlist in Google Cloud Console, then wait a few minutes and reload.`);
            setIsMapsLoading(false);
        };

        window.gm_authFailure = handleAuthFailure;

        if (!mapsApiKey) {
            setError('Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env.local file.');
            setIsMapsLoading(false);
            return () => {
                window.gm_authFailure = undefined;
            };
        }

        setIsMapsLoading(true);
        loadGoogleMapsAPI(mapsApiKey)
            .then(() => {
                if (!isMounted || !inputRef.current) return;

                dummyMapRef.current = document.createElement('div');
                placesServiceRef.current = new google.maps.places.PlacesService(dummyMapRef.current);

                const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
                    fields: ['formatted_address', 'geometry', 'name', 'place_id'],
                    types: ['establishment', 'geocode']
                });

                autocompleteListener.current = autocompleteInstance.addListener('place_changed', () => {
                    const place = autocompleteInstance.getPlace();
                    setSelectedPlace(place || null);
                    setError(null);

                    if (!place) {
                        return;
                    }

                    const latestInputValue = inputRef.current?.value || '';
                    setSearchValue(latestInputValue);

                    const handleResult = (result: google.maps.places.PlaceResult) => {
                        if (!result) return;
                        const fallbackLabel = result.name || result.formatted_address || latestInputValue || initialQuery;
                        applyResolvedLocation({
                            aliasValue: fallbackLabel,
                            officialAddress: result.formatted_address || fallbackLabel,
                            lat: result.geometry?.location?.lat(),
                            lng: result.geometry?.location?.lng(),
                        });
                    };

                    if (place.place_id && placesServiceRef.current) {
                        setIsFetchingDetails(true);
                        placesServiceRef.current.getDetails(
                            {
                                placeId: place.place_id,
                                fields: ['formatted_address', 'geometry', 'name']
                            },
                            (result, status) => {
                                if (!isMounted) return;
                                setIsFetchingDetails(false);
                                if (status !== google.maps.places.PlacesServiceStatus.OK || !result) {
                                    setError('Unable to load place details. Please pick another result.');
                                    return;
                                }
                                handleResult(result);
                            }
                        );
                    } else if (place.geometry?.location) {
                        handleResult(place);
                    } else {
                        setError('This result did not include coordinates. Try another suggestion.');
                    }
                });

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            if (!isMounted) return;
                            setLocationPermission('granted');
                            const coords: google.maps.LatLngLiteral = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            setUserLocation(coords);
                            const circle = new google.maps.Circle({
                                center: coords,
                                radius: 50000,
                            });
                            const bounds = circle.getBounds();
                            if (bounds) {
                                autocompleteInstance.setBounds(bounds);
                            }
                        },
                        (err) => {
                            console.warn('Geolocation failed:', err);
                            if (!isMounted) return;
                            setLocationPermission('denied');
                        }
                    );
                } else {
                    setLocationPermission('denied');
                }

                setIsMapsLoading(false);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error('Failed to load Google Maps:', err);
                setError(err instanceof Error ? err.message : 'Failed to load Google Maps.');
                setIsMapsLoading(false);
            });

        return () => {
            isMounted = false;
            window.gm_authFailure = undefined;
            autocompleteListener.current?.remove();
        };
    }, [mapsApiKey, initialQuery]);

    const handleManualGeocode = async () => {
        if (!officialName) {
            setError('Enter a full address before validating.');
            return;
        }
        if (!mapsApiKey) {
            setError('Google Maps API key is missing. Unable to geocode manually.');
            return;
        }
        setIsGeocoding(true);
        setError(null);
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(officialName)}&key=${mapsApiKey}`);
            const data = await response.json();
            if (data.status === 'OK' && data.results?.[0]) {
                const result = data.results[0];
                applyResolvedLocation({
                    aliasValue: alias || result.formatted_address,
                    officialAddress: result.formatted_address,
                    lat: result.geometry?.location?.lat ?? null,
                    lng: result.geometry?.location?.lng ?? null,
                });
                setSelectedPlace(null);
            } else {
                setError('Google Maps could not find that address. Please refine it and try again.');
            }
        } catch (err) {
            console.error('Manual geocode failed', err);
            setError('Failed to contact Google Geocoding API. Check your connection or API key.');
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setSelectedPlace(null);
        if (!e.target.value) {
            applyResolvedLocation({ officialAddress: '', lat: null, lng: null });
        }
    };

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

    const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';
    const mapSrc = hasCoordinates
        ? `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
        : '';
    const canSave = Boolean((alias && alias.trim()) || (officialName && officialName.trim()));

    const renderLocationDetails = (options?: { showManualGeocode?: boolean }) => (
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
            {isFetchingDetails && (
                <div className="flex items-center gap-2 text-xs text-secondary">
                    <SpinnerIcon className="h-4 w-4 animate-spin" />
                    <span>Fetching verified address…</span>
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
                {options?.showManualGeocode && (
                    <div className="flex items-center gap-3 mt-2">
                        <button
                            type="button"
                            onClick={handleManualGeocode}
                            disabled={!officialName || isGeocoding || !mapsApiKey}
                            className="px-3 py-1.5 rounded-md bg-wha-blue text-white text-sm font-semibold disabled:bg-tertiary flex items-center gap-2"
                        >
                            {isGeocoding ? (
                                <>
                                    <SpinnerIcon className="h-4 w-4 animate-spin" />
                                    <span>Validating…</span>
                                </>
                            ) : (
                                'Validate address'
                            )}
                        </button>
                        <p className="text-xs text-secondary">Uses Google Geocoding API</p>
                    </div>
                )}
                {hasCoordinates && (
                    <p className="text-xs text-secondary mt-1">
                        Lat: {latitude?.toFixed(6)}, Lng: {longitude?.toFixed(6)}
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
    );

    const renderSearchView = () => (
        <>
            <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                    Search for a place
                </label>
                <input
                    ref={inputRef}
                    type="text"
                    value={searchValue}
                    onChange={handleSearchInputChange}
                    className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                    placeholder="Start typing to search..."
                />
                <p className="text-xs text-secondary mt-1">
                    Powered by Google Places - select from dropdown
                </p>
            </div>
            {(selectedPlace || hasCoordinates) && renderLocationDetails()}
        </>
    );

    const renderManualView = () => (
        <div className="space-y-4">
            <p className="text-sm text-secondary">
                Use this form if autocomplete is unavailable or the place is not listed.
            </p>
            {renderLocationDetails({ showManualGeocode: true })}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{t('locationFinder')}</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none">&times;</button>
                </div>

                <div className="relative">
                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between text-xs">
                            <div>
                                {locationPermission === 'granted' && userLocation && (
                                    <div className="text-green-400 flex items-center gap-1">
                                        <span role="img" aria-label="location">📍</span>
                                        <span>Location-aware search enabled</span>
                                    </div>
                                )}
                                {locationPermission === 'denied' && (
                                    <div className="text-yellow-400 flex items-center gap-1">
                                        <span role="img" aria-label="warning">⚠️</span>
                                        <span>Enable browser location to bias results nearby</span>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setView(view === 'search' ? 'manual' : 'search')}
                                className="text-blue-400 hover:underline"
                            >
                                {view === 'search' ? t('addLocationManually') : 'Back to search'}
                            </button>
                        </div>

                        {view === 'search' ? renderSearchView() : renderManualView()}
                    </div>

                    {isMapsLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/90 backdrop-blur-sm rounded-lg">
                            <SpinnerIcon className="h-8 w-8 animate-spin text-wha-blue" />
                            <p className="text-secondary mt-2">Loading Google Maps...</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!canSave}
                        className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-tertiary"
                    >
                        {t('saveLocation')}
                    </button>
                </div>
            </div>
        </div>
    );
};
