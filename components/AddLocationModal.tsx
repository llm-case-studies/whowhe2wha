import React, { useState, useEffect } from 'react';
import { Location, DiscoveredPlace, EntityType } from '../types';
import { discoverPlaces, geocodeLocation, findPlaceFromUrl } from '../services/geminiService';
import { SpinnerIcon, PinIcon } from './icons';
import { useI18n } from '../hooks/useI18n';

interface AddLocationModalProps {
    initialQuery: string;
    onSave: (newLocation: Location) => void;
    onClose: () => void;
}

type GeocodedData = { name: string; latitude: number; longitude: number; };
type View = 'search' | 'confirm' | 'manual';

const URL_REGEX = /(https?:\/\/(?:maps\.app\.goo\.gl\/[a-zA-Z0-9]+|www\.google\.com\/maps\/[^\s]+))/;

export const AddLocationModal: React.FC<AddLocationModalProps> = ({ initialQuery, onSave, onClose }) => {
    const [query, setQuery] = useState(initialQuery);
    const [view, setView] = useState<View>('search');
    const { t } = useI18n();

    // User location state
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

    // Search state
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessingUrl, setIsProcessingUrl] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<DiscoveredPlace[]>([]);
    
    // Confirm/Manual state
    const [selectedPlace, setSelectedPlace] = useState<DiscoveredPlace | null>(null);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [geocodedData, setGeocodedData] = useState<GeocodedData | null>(null);
    const [alias, setAlias] = useState('');
    const [notes, setNotes] = useState('');
    const [finalName, setFinalName] = useState('');

    useEffect(() => {
        // Request user's location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationPermission('granted');
                },
                (error) => {
                    console.warn('Geolocation permission denied or unavailable:', error);
                    setLocationPermission('denied');
                }
            );
        } else {
            setLocationPermission('denied');
        }

        // Run initial action on mount
        const match = query.match(URL_REGEX);
        if (match) {
            handleUrlProcessing(match[0]);
        } else if(query) {
            handleSearch();
        }
    }, []);
    
    useEffect(() => {
        if (selectedPlace) {
            handleGeocode(selectedPlace.title);
            setAlias(selectedPlace.title);
            setView('confirm');
        }
    }, [selectedPlace]);
    
    useEffect(() => {
        if (geocodedData) {
            setFinalName(geocodedData.name);
        }
    }, [geocodedData]);

    const handleUrlProcessing = async (url: string) => {
        setIsProcessingUrl(true);
        setError(null);
        setResults([]);
        try {
            const places = await findPlaceFromUrl(url);
            if (places.length > 0) {
                // The API should return one specific place for a direct URL.
                // Go directly to confirmation with the first result.
                setSelectedPlace(places[0]);
            } else {
                setError('Could not extract location data from that URL. Please try searching by name.');
            }
        } catch (err) {
            setError('An error occurred while processing the URL. Please try again.');
        } finally {
            setIsProcessingUrl(false);
        }
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        const match = newQuery.match(URL_REGEX);
        if (match) {
            handleUrlProcessing(match[0]);
        }
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query || isProcessingUrl) return;

        setIsLoading(true);
        setError(null);
        setResults([]);
        try {
            const places = await discoverPlaces(
                query,
                userLocation?.lat,
                userLocation?.lng
            );
            setResults(places);
        } catch (err) {
            setError('Failed to search for places. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGeocode = async (placeTitle: string) => {
        setIsGeocoding(true);
        setGeocodedData(null);
        try {
            const data = await geocodeLocation(
                placeTitle,
                userLocation?.lat,
                userLocation?.lng
            );
            if (data) {
                setGeocodedData(data);
            }
        } catch (err) {
            console.error("Geocoding failed", err);
        } finally {
            setIsGeocoding(false);
        }
    };
    
    const handleSave = () => {
        const newLocation: Location = {
            id: `where-${Date.now()}`,
            name: finalName || selectedPlace?.title || query,
            alias: alias.trim() || undefined,
            type: EntityType.Where,
            latitude: geocodedData?.latitude,
            longitude: geocodedData?.longitude,
            notes: notes.trim() || undefined,
        };
        onSave(newLocation);
    }

    const renderSearchBar = () => (
         <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                className="flex-grow px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                placeholder={t('locationSearchPlaceholder')}
            />
            <button type="submit" disabled={isLoading || isProcessingUrl} className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-tertiary">
                {isLoading || isProcessingUrl ? <SpinnerIcon className="h-5 w-5 animate-spin"/> : t('search')}
            </button>
        </form>
    );

    const renderSearchView = () => (
        <>
            {locationPermission === 'granted' && userLocation && (
                <div className="mb-2 text-xs text-green-400 flex items-center gap-1">
                    <span>📍</span>
                    <span>Location-aware search enabled</span>
                </div>
            )}
            {locationPermission === 'denied' && (
                <div className="mb-2 text-xs text-yellow-400 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Enable location for better search results</span>
                </div>
            )}
            {renderSearchBar()}
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            
            {isProcessingUrl && (
                 <div className="text-center py-4">
                    <SpinnerIcon className="h-8 w-8 animate-spin mx-auto text-wha-blue" />
                    <p className="text-secondary mt-2">{t('analyzingLink')}</p>
                </div>
            )}
            
            <div className="space-y-2 overflow-y-auto max-h-64 pr-2">
                {results.length > 0 ? (
                    results.map((place, index) => (
                        <button 
                            key={index} 
                            onClick={() => setSelectedPlace(place)} 
                            className="w-full text-left p-3 rounded-md bg-tertiary hover:bg-wha-blue/20 transition flex items-start space-x-3"
                        >
                            <div className="pt-1 text-secondary">
                                <PinIcon className="h-5 w-5"/>
                            </div>
                            <div>
                                <p className="font-semibold text-primary">{place.title}</p>
                                <a href={place.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline" onClick={(e) => e.stopPropagation()}>
                                    View on Google Maps
                                </a>
                            </div>
                        </button>
                    ))
                ) : (
                    !isLoading && !isProcessingUrl && !error && <p className="text-secondary text-center py-4">{t('noResultsFound')}</p>
                )}
            </div>
            <div className="border-t border-primary mt-4 pt-4 space-y-2">
                <div className="text-center">
                    <button
                        onClick={() => window.open('https://maps.google.com', '_blank')}
                        className="text-sm text-blue-400 hover:underline flex items-center justify-center gap-1 mx-auto"
                    >
                        <span>🗺️</span>
                        <span>Find on Google Maps and paste link here</span>
                    </button>
                </div>
                <div className="text-center">
                    <button onClick={() => setView('manual')} className="text-sm text-blue-400 hover:underline">
                        {t('addLocationManually')}
                    </button>
                </div>
            </div>
        </>
    );
    
    const renderConfirmView = () => (
        <div className="space-y-4">
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
                        value={finalName}
                        onChange={e => setFinalName(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 bg-tertiary border border-primary rounded-lg"
                        disabled={isGeocoding}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {isGeocoding ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : <PinIcon className="h-5 w-5 text-green-500" />}
                    </div>
                </div>
                {geocodedData && <p className="text-xs text-secondary mt-1">Lat: {geocodedData.latitude.toFixed(4)}, Lng: {geocodedData.longitude.toFixed(4)}</p>}
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
        </div>
    );
    
    const renderManualView = () => (
         <div className="space-y-4">
            <p className="text-sm text-secondary">Adding "{initialQuery}" as a custom location without address details.</p>
             <div>
                <label className="block text-sm font-medium text-secondary mb-1">Location Name</label>
                <input
                    type="text"
                    value={finalName}
                    onChange={e => setFinalName(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-primary rounded-lg"
                />
            </div>
             <div>
                 <label className="block text-sm font-medium text-secondary mb-1">{t('notes')}</label>
                 <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-input border border-primary rounded-lg"
                    placeholder="e.g., The conference room in the basement."
                />
            </div>
        </div>
    );
    
    useEffect(() => {
        if (view === 'manual') {
            setFinalName(initialQuery);
        }
    }, [view, initialQuery]);


    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="location-finder-title">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="location-finder-title" className="text-2xl font-bold">{t('locationFinder')}</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label={t('close')}>&times;</button>
                </div>

                {view === 'search' && renderSearchView()}
                {view === 'confirm' && renderConfirmView()}
                {view === 'manual' && renderManualView()}

                <div className="flex justify-end space-x-4 pt-6">
                    {view !== 'search' && (
                        <button type="button" onClick={() => setView('search')} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition">
                            Back to Search
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition">
                        {t('cancel')}
                    </button>
                    {(view === 'confirm' || view === 'manual') && (
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!finalName}
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
