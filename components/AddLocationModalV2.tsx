import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
    const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
    const dummyMapRef = useRef<HTMLDivElement | null>(null);
    const predictionRequestIdRef = useRef(0);

    const [searchValue, setSearchValue] = useState(initialQuery);
    const [view, setView] = useState<ViewMode>('search');
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [isPredictionLoading, setIsPredictionLoading] = useState(false);
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

        const initMaps = async () => {
            setIsMapsLoading(true);
            try {
                await loadGoogleMapsAPI(mapsApiKey);
                if (!isMounted) return;

                dummyMapRef.current = document.createElement('div');
                placesServiceRef.current = new google.maps.places.PlacesService(dummyMapRef.current);

                try {
                    const importLibrary = (google.maps as unknown as { importLibrary?: (name: string) => Promise<void> }).importLibrary;
                    if (typeof importLibrary === 'function') {
                        await importLibrary('places');
                    }
                } catch (libErr) {
                    console.warn('google.maps.importLibrary unavailable; continuing with legacy globals.', libErr);
                }

                autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
                if (google.maps.places.AutocompleteSessionToken) {
                    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
                }

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

                if (isMounted) {
                    setIsMapsLoading(false);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error('Failed to load Google Maps:', err);
                setError(err instanceof Error ? err.message : 'Failed to load Google Maps.');
                setIsMapsLoading(false);
            }
        };

        initMaps();

        return () => {
            isMounted = false;
            window.gm_authFailure = undefined;
        };
    }, [mapsApiKey]);

    const ensureSessionToken = () => {
        if (typeof google === 'undefined') {
            return undefined;
        }
        if (!sessionTokenRef.current && google?.maps?.places?.AutocompleteSessionToken) {
            sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        }
        return sessionTokenRef.current ?? undefined;
    };

    const getDisplayNameText = (value: unknown): string | undefined => {
        if (!value) return undefined;
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && 'text' in (value as { text?: string })) {
            const text = (value as { text?: string }).text;
            if (typeof text === 'string') {
                return text;
            }
        }
        return undefined;
    };

    const normalizeLatLng = (location: unknown): { lat?: number; lng?: number } => {
        if (!location) return {};
        const candidate = location as { lat?: number | (() => number); lng?: number | (() => number) };
        const lat = typeof candidate.lat === 'function' ? candidate.lat() : candidate.lat;
        const lng = typeof candidate.lng === 'function' ? candidate.lng() : candidate.lng;
        return {
            lat: typeof lat === 'number' ? lat : undefined,
            lng: typeof lng === 'number' ? lng : undefined,
        };
    };

    const fetchPlaceDetailsWithModernApi = async (placeId: string, fallbackLabel: string, fallbackAddress: string) => {
        if (typeof google === 'undefined') {
            return false;
        }
        const PlaceCtor = (google.maps.places as unknown as { Place?: new (options: { id: string }) => any }).Place;
        if (!PlaceCtor) {
            return false;
        }
        try {
            const modernPlace = new PlaceCtor({ id: placeId });
            if (typeof modernPlace.fetchFields === 'function') {
                await modernPlace.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
            }
            const coords = normalizeLatLng(modernPlace.location);
            applyResolvedLocation({
                aliasValue: getDisplayNameText(modernPlace.displayName) ?? fallbackLabel,
                officialAddress: modernPlace.formattedAddress || fallbackAddress,
                lat: coords.lat ?? null,
                lng: coords.lng ?? null,
            });
            return true;
        } catch (err) {
            console.warn('google.maps.places.Place fetchFields failed, falling back to PlacesService.', err);
            return false;
        }
    };

    const fetchPlaceDetailsWithLegacyService = (placeId: string, fallbackLabel: string, fallbackAddress: string) =>
        new Promise<boolean>((resolve) => {
            if (typeof google === 'undefined' || !placesServiceRef.current) {
                resolve(false);
                return;
            }
            placesServiceRef.current.getDetails(
                {
                    placeId,
                    fields: ['formatted_address', 'geometry', 'name']
                },
                (result, status) => {
                    if (status !== google.maps.places.PlacesServiceStatus.OK || !result) {
                        console.warn('PlacesService getDetails failed', status);
                        resolve(false);
                        return;
                    }
                    applyResolvedLocation({
                        aliasValue: result.name || fallbackLabel,
                        officialAddress: result.formatted_address || fallbackAddress,
                        lat: result.geometry?.location?.lat(),
                        lng: result.geometry?.location?.lng(),
                    });
                    resolve(true);
                }
            );
        });

    const fetchPlaceDetailsViaHttp = async (placeId: string, fallbackLabel: string, fallbackAddress: string) => {
        if (!mapsApiKey) {
            return false;
        }
        try {
            const params = new URLSearchParams({
                place_id: placeId,
                fields: 'name,formatted_address,geometry',
                key: mapsApiKey,
            });
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`);
            const data = await response.json();
            if (data.status === 'OK' && data.result) {
                const result = data.result;
                applyResolvedLocation({
                    aliasValue: result.name || fallbackLabel,
                    officialAddress: result.formatted_address || fallbackAddress,
                    lat: result.geometry?.location?.lat ?? null,
                    lng: result.geometry?.location?.lng ?? null,
                });
                return true;
            }
            console.warn('HTTP Place Details failed', data.status, data.error_message);
            return false;
        } catch (err) {
            console.error('HTTP Place Details error', err);
            return false;
        }
    };

    const fetchPredictions = useCallback((value: string) => {
        if (typeof google === 'undefined') {
            return;
        }
        const trimmed = value.trim();
        if (!autocompleteServiceRef.current || trimmed.length < 3) {
            setPredictions([]);
            setIsPredictionLoading(false);
            return;
        }
        const requestId = ++predictionRequestIdRef.current;
        setIsPredictionLoading(true);
        const request: google.maps.places.AutocompletionRequest = {
            input: trimmed,
            sessionToken: ensureSessionToken(),
            types: ['establishment', 'geocode'],
        };
        if (userLocation) {
            request.locationBias = userLocation;
        }
        autocompleteServiceRef.current.getPlacePredictions(request, (results, status) => {
            if (requestId !== predictionRequestIdRef.current) {
                return;
            }
            setIsPredictionLoading(false);
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                setPredictions(results);
            } else {
                setPredictions([]);
            }
        });
    }, [userLocation]);

    const handlePredictionSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
        setSearchValue(prediction.description);
        setPredictions([]);
        setIsFetchingDetails(true);
        setError(null);
        try {
            const fallbackLabel = prediction.structured_formatting?.main_text || prediction.description;
            const fallbackAddress = prediction.description;
            let resolved = await fetchPlaceDetailsWithModernApi(prediction.place_id, fallbackLabel, fallbackAddress);
            if (!resolved) {
                resolved = await fetchPlaceDetailsWithLegacyService(prediction.place_id, fallbackLabel, fallbackAddress);
            }
            if (!resolved) {
                resolved = await fetchPlaceDetailsViaHttp(prediction.place_id, fallbackLabel, fallbackAddress);
            }
            if (!resolved) {
                throw new Error('Place detail providers failed');
            }
            sessionTokenRef.current = null;
        } catch (err) {
            console.error('Failed to retrieve place details', err);
            setError('Unable to load place details. Please pick another result.');
        } finally {
            setIsFetchingDetails(false);
        }
    };

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
                setPredictions([]);
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
        const value = e.target.value;
        setSearchValue(value);
        if (!value) {
            applyResolvedLocation({ officialAddress: '', lat: null, lng: null });
            setPredictions([]);
        } else {
            fetchPredictions(value);
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
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchValue}
                        onChange={handleSearchInputChange}
                        className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                        placeholder="Start typing to search..."
                        autoComplete="off"
                    />
                    {isPredictionLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary flex items-center gap-2">
                            <SpinnerIcon className="h-3 w-3 animate-spin" />
                            <span>Searching…</span>
                        </div>
                    )}
                </div>
                {predictions.length > 0 && (
                    <ul className="mt-2 bg-tertiary border border-primary rounded-lg divide-y divide-primary max-h-48 overflow-y-auto">
                        {predictions.map(prediction => (
                            <li key={prediction.place_id}>
                                <button
                                    type="button"
                                    onClick={() => handlePredictionSelect(prediction)}
                                    className="w-full text-left px-3 py-2 hover:bg-primary/20 transition"
                                >
                                    <p className="text-sm font-semibold text-white">
                                        {prediction.structured_formatting?.main_text || prediction.description}
                                    </p>
                                    {prediction.structured_formatting?.secondary_text && (
                                        <p className="text-xs text-secondary">
                                            {prediction.structured_formatting.secondary_text}
                                        </p>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {!isPredictionLoading && searchValue.trim().length >= 3 && predictions.length === 0 && (
                    <p className="text-xs text-secondary mt-2">No suggestions yet. Refine the name or city.</p>
                )}
                <p className="text-xs text-secondary mt-2">
                    Powered by Google Places - select from dropdown
                </p>
            </div>
            {hasCoordinates && renderLocationDetails()}
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
                                onClick={() => {
                                    setView(view === 'search' ? 'manual' : 'search');
                                    setPredictions([]);
                                }}
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
