import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { AddEventForm } from './components/AddEventForm';
import { MapModal } from './components/MapModal';
import { TimeMapModal } from './components/TimeMapModal';
import { Project, EventNode, Theme, Location, When, Contact, ViewMode, TimelineScale } from './types';
import { MOCK_PROJECTS, MOCK_EVENTS } from './constants';
import { queryGraph } from './services/geminiService';
import { ViewControls } from './components/ViewControls';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [events, setEvents] = useState<EventNode[]>(MOCK_EVENTS);
  const [filteredEventIds, setFilteredEventIds] = useState<number[] | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddEventFormOpen, setIsAddEventFormOpen] = useState(false);
  const [mapModalLocation, setMapModalLocation] = useState<Location | null>(null);
  const [timeMapModalWhen, setTimeMapModalWhen] = useState<When | null>(null);
  const [addEventInitialData, setAddEventInitialData] = useState<{ who?: string; where?: string } | null>(null);

  const [voiceStatus, setVoiceStatus] = useState<'checking' | 'supported' | 'unsupported'>('checking');
  
  // New state for timeline view
  const [viewMode, setViewMode] = useState<ViewMode>('stream');
  const [timelineScale, setTimelineScale] = useState<TimelineScale>('month');
  const [timelineDate, setTimelineDate] = useState(new Date());
  const [selectedHolidayCategories, setSelectedHolidayCategories] = useState<string[]>(['US']);


  useEffect(() => {
    // Check for speech recognition support once on mount
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceStatus(SpeechRecognition ? 'supported' : 'unsupported');
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = { projects, events };
      const matchingIds = await queryGraph(query, data);
      setFilteredEventIds(matchingIds);
      setViewMode('stream'); // Force back to stream view for search results
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
  
  const handleSaveEvent = (newEventData: Omit<EventNode, 'id' | 'projectId'>, projectInfo: {id: number | null, name: string}) => {
    let targetProjectId = projectInfo.id;

    if (!targetProjectId) {
      // Create a new project
      const newProject: Project = {
        id: Date.now(),
        name: projectInfo.name,
        description: 'Newly created project.',
        status: 'Active',
      };
      setProjects(prev => [...prev, newProject]);
      targetProjectId = newProject.id;
    }

    const finalEvent: EventNode = {
      ...newEventData,
      id: Date.now(),
      projectId: targetProjectId,
    };

    setEvents(prev => [...prev, finalEvent].sort((a, b) => new Date(a.when.timestamp).getTime() - new Date(b.when.timestamp).getTime()));
    setIsAddEventFormOpen(false);
    setAddEventInitialData(null);
  };

  const handleScheduleFromContact = (contact: Contact, location: Location) => {
      setMapModalLocation(null); // Close map modal
      setAddEventInitialData({
          who: contact.name,
          where: location.name,
      });
      setIsAddEventFormOpen(true);
  };

  const displayedEvents = filteredEventIds !== null
    ? events.filter(event => filteredEventIds.includes(event.id))
    : events;

  const displayedProjects = filteredEventIds !== null
    ? [] // Don't show projects in search results, just the events
    : projects;


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
        />

        <Dashboard
          projects={displayedProjects}
          events={displayedEvents}
          isLoading={isLoading}
          error={error}
          isSearched={filteredEventIds !== null}
          onLocationClick={setMapModalLocation}
          onWhenClick={setTimeMapModalWhen}
          viewMode={viewMode}
          timelineDate={timelineDate}
          timelineScale={timelineScale}
          selectedHolidayCategories={selectedHolidayCategories}
        />
      </main>
      
      {isAddEventFormOpen && (
        <AddEventForm
          projects={projects}
          onSave={handleSaveEvent}
          onClose={() => {
              setIsAddEventFormOpen(false);
              setAddEventInitialData(null);
          }}
          voiceStatus={voiceStatus}
          initialData={addEventInitialData}
        />
      )}

      {mapModalLocation && (
        <MapModal 
            location={mapModalLocation} 
            allEvents={events} 
            onClose={() => setMapModalLocation(null)}
            onSchedule={handleScheduleFromContact}
        />
      )}

      {timeMapModalWhen && (
        <TimeMapModal
            when={timeMapModalWhen}
            allEvents={events}
            onClose={() => setTimeMapModalWhen(null)}
        />
      )}
    </div>
  );
};

export default App;