import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { AddEventForm } from './components/AddEventForm';
import { AddLocationModal } from './components/AddLocationModal';
import { MapModal } from './components/MapModal';
import { TimeMapModal } from './components/TimeMapModal';
import { TierConfigModal } from './components/TierConfigModal';
import { Project, EventNode, Theme, Location, When, Contact, ViewMode, TimelineScale, Tier, EntityType } from './types';
import { MOCK_PROJECTS, MOCK_EVENTS, MOCK_LOCATIONS, PROJECT_CATEGORIES } from './constants';
import { queryGraph } from './services/geminiService';
import { ViewControls } from './components/ViewControls';

type GeocodedData = { name: string; latitude: number; longitude: number; };

const loadFromLocalStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Failed to parse ${key} from localStorage`, error);
  }
  return fallback;
};

const saveToLocalStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage`, error);
  }
};


const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [projects, setProjects] = useState<Project[]>(() => loadFromLocalStorage('whowhe2wha_projects', MOCK_PROJECTS));
  const [events, setEvents] = useState<EventNode[]>(() => loadFromLocalStorage('whowhe2wha_events', MOCK_EVENTS));
  const [locations, setLocations] = useState<Location[]>(() => loadFromLocalStorage('whowhe2wha_locations', MOCK_LOCATIONS));

  const [filteredEventIds, setFilteredEventIds] = useState<number[] | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddEventFormOpen, setIsAddEventFormOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');

  const [mapModalLocation, setMapModalLocation] = useState<Location | null>(null);
  const [timeMapModalWhen, setTimeMapModalWhen] = useState<When | null>(null);
  const [addEventInitialData, setAddEventInitialData] = useState<{ who?: string; where?: string } | null>(null);

  const [voiceStatus, setVoiceStatus] = useState<'checking' | 'supported' | 'unsupported'>('checking');
  
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [timelineScale, setTimelineScale] = useState<TimelineScale>('year');
  const [timelineDate, setTimelineDate] = useState(new Date('2025-11-04T12:00:00Z'));
  const [selectedHolidayCategories, setSelectedHolidayCategories] = useState<string[]>(['US', 'Jewish']);
  const [selectedProjectCategories, setSelectedProjectCategories] = useState<string[]>(PROJECT_CATEGORIES);

  const initialTierConfig: Tier[] = [
    { id: 'tier-1', name: 'Tier 1', categories: ['Home', 'Personal'] },
    { id: 'tier-2', name: 'Tier 2', categories: ['Work', 'Health'] },
    { id: 'tier-3', name: 'Tier 3', categories: ['Finance'] },
  ];
  const [tierConfig, setTierConfig] = useState<Tier[]>(initialTierConfig);
  const [isTierConfigModalOpen, setIsTierConfigModalOpen] = useState(false);


  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceStatus(SpeechRecognition ? 'supported' : 'unsupported');
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  useEffect(() => saveToLocalStorage('whowhe2wha_projects', projects), [projects]);
  useEffect(() => saveToLocalStorage('whowhe2wha_events', events), [events]);
  useEffect(() => saveToLocalStorage('whowhe2wha_locations', locations), [locations]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = { projects, events, locations };
      const matchingIds = await queryGraph(query, data);
      setFilteredEventIds(matchingIds);
      setViewMode('stream'); 
    } catch (e) {
      setError('An error occurred while searching. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setFilteredEventIds(null);
    setError(null);
  };
  
  const handleSaveEvent = (
    eventData: Omit<EventNode, 'id' | 'projectId' | 'whereId'>, 
    projectInfo: {id: number | null, name: string, category: string},
    whereInfo: { id: string | null, name: string, geocodedData: GeocodedData | null }
  ) => {
    let targetProjectId = projectInfo.id;

    if (!targetProjectId) {
      const newProject: Project = {
        id: Date.now(),
        name: projectInfo.name,
        description: 'Newly created project.',
        status: 'Active',
        color: ['pink', 'purple', 'yellow', 'green'][Math.floor(Math.random() * 4)],
        category: projectInfo.category || 'Personal'
      };
      setProjects(prev => [...prev, newProject]);
      targetProjectId = newProject.id;
    }

    let targetLocationId = whereInfo.id;
    // This part is now mostly handled by the AddLocationModal
    if (!targetLocationId) {
        const newLocation: Location = {
            id: `where-${Date.now()}`,
            name: whereInfo.geocodedData?.name || whereInfo.name,
            alias: whereInfo.name,
            type: EntityType.Where,
            latitude: whereInfo.geocodedData?.latitude,
            longitude: whereInfo.geocodedData?.longitude,
        };
        setLocations(prev => [...prev, newLocation]);
        targetLocationId = newLocation.id;
    }

    const finalEvent: EventNode = {
      ...eventData,
      id: Date.now(),
      projectId: targetProjectId,
      whereId: targetLocationId,
    };

    setEvents(prev => [...prev, finalEvent].sort((a, b) => new Date(a.when.timestamp).getTime() - new Date(b.when.timestamp).getTime()));
    setIsAddEventFormOpen(false);
    setAddEventInitialData(null);
  };

  const handleScheduleFromContact = (contact: Contact) => {
      const location = locations.find(l => l.id === contact.locationId);
      if (!location) return;
      
      setMapModalLocation(null);
      setAddEventInitialData({
          who: contact.name,
          where: location.alias || location.name,
      });
      setIsAddEventFormOpen(true);
  };
  
  const handleSaveTierConfig = (newConfig: Tier[]) => {
    setTierConfig(newConfig);
    setIsTierConfigModalOpen(false);
  }

  const handleOpenLocationFinder = (query: string) => {
      setLocationQuery(query);
      setIsAddLocationModalOpen(true);
  };

  const handleSaveNewLocation = (newLocation: Location) => {
      setLocations(prev => [...prev, newLocation]);
      setIsAddLocationModalOpen(false);
      // This is the key part: update the initial data for the still-open form
      setAddEventInitialData(prev => ({ ...prev, where: newLocation.alias || newLocation.name }));
  };

  const displayedEvents = filteredEventIds !== null
    ? events.filter(event => filteredEventIds.includes(event.id))
    : events;

  return (
    <div className="bg-primary min-h-screen text-primary font-sans">
      <Header theme={theme} setTheme={setTheme} />
      <main className="container mx-auto px-4 pb-10">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />

        <ViewControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          timelineScale={timelineScale}
          setTimelineScale={setTimelineScale}
          timelineDate={timelineDate}
          setTimelineDate={setTimelineDate}
          onAddEventClick={() => setIsAddEventFormOpen(true)}
          selectedHolidayCategories={selectedHolidayCategories}
          setSelectedHolidayCategories={setSelectedHolidayCategories}
          selectedProjectCategories={selectedProjectCategories}
          setSelectedProjectCategories={setSelectedProjectCategories}
          onConfigureTiersClick={() => setIsTierConfigModalOpen(true)}
        />

        <Dashboard
          projects={projects}
          events={displayedEvents}
          locations={locations}
          isLoading={isLoading}
          error={error}
          isSearched={filteredEventIds !== null}
          onLocationClick={setMapModalLocation}
          onWhenClick={setTimeMapModalWhen}
          viewMode={viewMode}
          timelineDate={timelineDate}
          setTimelineDate={setTimelineDate}
          timelineScale={timelineScale}
          selectedHolidayCategories={selectedHolidayCategories}
          selectedProjectCategories={selectedProjectCategories}
          tierConfig={tierConfig}
        />
      </main>
      
      {isAddEventFormOpen && (
        <AddEventForm
          projects={projects}
          locations={locations}
          onSave={handleSaveEvent}
          onClose={() => {
              setIsAddEventFormOpen(false);
              setAddEventInitialData(null);
          }}
          voiceStatus={voiceStatus}
          initialData={addEventInitialData}
          onOpenLocationFinder={handleOpenLocationFinder}
        />
      )}

      {isAddLocationModalOpen && (
          <AddLocationModal
            initialQuery={locationQuery}
            onSave={handleSaveNewLocation}
            onClose={() => setIsAddLocationModalOpen(false)}
          />
      )}

      {isTierConfigModalOpen && (
        <TierConfigModal
          currentConfig={tierConfig}
          onSave={handleSaveTierConfig}
          onClose={() => setIsTierConfigModalOpen(false)}
        />
      )}

      {mapModalLocation && (
        <MapModal 
            location={mapModalLocation} 
            allEvents={events} 
            allLocations={locations}
            onClose={() => setMapModalLocation(null)}
            onSchedule={handleScheduleFromContact}
        />
      )}

      {timeMapModalWhen && (
        <TimeMapModal
            when={timeMapModalWhen}
            allEvents={events}
            allLocations={locations}
            onClose={() => setTimeMapModalWhen(null)}
        />
      )}
    </div>
  );
};

export default App;