import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { MOCK_EVENTS, MOCK_PROJECTS } from './constants';
import { EventNode, Location, Project, Contact, When } from './types';
import { queryGraph } from './services/geminiService';
import { AddEventForm } from './components/AddEventForm';
import { MapModal } from './components/MapModal';
import { TimeMapModal } from './components/TimeMapModal';

type VoiceStatus = 'checking' | 'supported' | 'unsupported';

function App() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [allEvents, setAllEvents] = useState<EventNode[]>(MOCK_EVENTS);
  const [displayedEvents, setDisplayedEvents] = useState<EventNode[]>(allEvents);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedWhen, setSelectedWhen] = useState<When | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('checking');
  const [eventDefaults, setEventDefaults] = useState<{ who?: string, where?: string } | null>(null);

  useEffect(() => {
    // Check for voice recognition support on startup
    const checkVoiceSupport = async () => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setVoiceStatus('unsupported');
        return;
      }
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permissionStatus.state === 'denied') {
          setVoiceStatus('unsupported');
        } else {
          setVoiceStatus('supported');
        }
      } catch (e) {
        // Permissions API might not be supported in all browsers (e.g., older Firefox)
        setVoiceStatus('supported'); // Assume supported and let user click trigger prompt
      }
    };
    checkVoiceSupport();
  }, []);


  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      handleClear();
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSearched(true);

    try {
      const matchingIds = await queryGraph(query, { projects, events: allEvents });
      const filteredEvents = allEvents.filter(event => matchingIds.includes(event.id));
      setDisplayedEvents(filteredEvents);
    } catch (err) {
      console.error(err);
      setError('Failed to query the context graph. The AI may be busy, or an error occurred.');
      setDisplayedEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [allEvents, projects]);
  
  const handleClear = useCallback(() => {
    setDisplayedEvents(allEvents);
    setIsSearched(false);
    setError(null);
  }, [allEvents]);

  const handleSaveEvent = (newEventData: Omit<EventNode, 'id' | 'projectId'>, projectInfo: {id: number | null, name: string}) => {
    let targetProjectId = projectInfo.id;
    let updatedProjects = projects;

    // If it's a new project, create it first
    if (targetProjectId === null) {
      const newProject: Project = {
        id: Math.max(...projects.map(p => p.id), 0) + 1,
        name: projectInfo.name,
        description: `New project for: ${newEventData.what.name}`,
        status: 'Active',
      };
      updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      targetProjectId = newProject.id;
    }

    const newEvent: EventNode = {
      ...newEventData,
      id: Math.max(...allEvents.map(e => e.id), 0) + 1,
      projectId: targetProjectId!,
    };
    
    const updatedEvents = [newEvent, ...allEvents];
    setAllEvents(updatedEvents);
    setDisplayedEvents(updatedEvents);
    
    setIsSearched(false);
    setError(null);
    setIsFormVisible(false);
  };
  
  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };
  
  const handleWhenClick = (when: When) => {
    setSelectedWhen(when);
  };

  const handleScheduleFromContact = (contact: Contact, location: Location) => {
    setEventDefaults({
      who: contact.name,
      where: location.name,
    });
    setSelectedLocation(null); // Close map modal
    setIsFormVisible(true); // Open form
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEventDefaults(null); // Clear any defaults
  };

  return (
    <div className="min-h-screen bg-bg-dark font-sans text-text-light">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} onClear={handleClear} isLoading={isLoading} />
          
          <div className="mb-8 flex justify-end">
            <button 
              onClick={() => setIsFormVisible(true)}
              className="flex items-center justify-center h-12 px-5 bg-to-orange text-white font-bold rounded-md hover:bg-orange-500 transition duration-200"
              aria-label="Add new event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Event
            </button>
          </div>

          {isFormVisible && (
            <AddEventForm 
              projects={projects}
              onSave={handleSaveEvent} 
              onClose={handleCloseForm}
              voiceStatus={voiceStatus}
              initialData={eventDefaults}
            />
          )}

          {selectedLocation && (
            <MapModal
              location={selectedLocation}
              allEvents={allEvents}
              onClose={() => setSelectedLocation(null)}
              onSchedule={handleScheduleFromContact}
            />
          )}
          
          {selectedWhen && (
            <TimeMapModal
              when={selectedWhen}
              allEvents={allEvents}
              onClose={() => setSelectedWhen(null)}
            />
          )}

          <Dashboard 
            projects={projects}
            events={isSearched ? displayedEvents : allEvents}
            isLoading={isLoading} 
            error={error} 
            isSearched={isSearched}
            onLocationClick={handleLocationClick}
            onWhenClick={handleWhenClick}
          />
        </div>
      </main>
    </div>
  );
}

export default App;