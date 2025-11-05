
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SearchBar } from './components/SearchBar';
import { AddEventForm } from './components/AddEventForm';
import { MapModal } from './components/MapModal';
import { TimeMapModal } from './components/TimeMapModal';
import { Theme, Project, EventNode, Location, When, Contact } from './types';
import { MOCK_PROJECTS, MOCK_EVENTS } from './constants';
import { queryGraph } from './services/geminiService';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme');
        return (storedTheme as Theme) || 'dark';
    });

    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [events, setEvents] = useState<EventNode[]>(MOCK_EVENTS);
    const [filteredEventIds, setFilteredEventIds] = useState<number[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [addModalInitialData, setAddModalInitialData] = useState<{ who?: string, where?: string } | null>(null);
    const [mapModalLocation, setMapModalLocation] = useState<Location | null>(null);
    const [timeMapModalWhen, setTimeMapModalWhen] = useState<When | null>(null);
    
    // Check for speech recognition support once
    const [voiceStatus, setVoiceStatus] = useState<'checking' | 'supported' | 'unsupported'>('checking');
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        setVoiceStatus(SpeechRecognition ? 'supported' : 'unsupported');
    }, []);

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            setFilteredEventIds(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const dataContext = { projects, events };
            const matchingIds = await queryGraph(query, dataContext);
            setFilteredEventIds(matchingIds);
        } catch (err) {
            setError('Failed to perform search. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClearSearch = () => {
        setFilteredEventIds(null);
    };

    const handleSaveEvent = (newEventData: Omit<EventNode, 'id' | 'projectId'>, projectInfo: {id: number | null, name: string}) => {
        let targetProjectId = projectInfo.id;
        
        // Create new project if it doesn't exist
        if (targetProjectId === null) {
            const newProject: Project = {
                id: Date.now(),
                name: projectInfo.name,
                description: '',
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
        
        setEvents(prev => [...prev, finalEvent]);
        setAddModalOpen(false);
        setAddModalInitialData(null);
    };

    const handleScheduleFromContact = (contact: Contact, location: Location) => {
        setMapModalLocation(null); // Close map modal
        setAddModalInitialData({ who: contact.name, where: location.name });
        setAddModalOpen(true);
    };

    const displayedEvents = useMemo(() => {
        if (filteredEventIds === null) {
            return events;
        }
        const idSet = new Set(filteredEventIds);
        return events.filter(event => idSet.has(event.id));
    }, [events, filteredEventIds]);

    const displayedProjectIds = useMemo(() => {
        return new Set(displayedEvents.map(event => event.projectId));
    }, [displayedEvents]);

    const displayedProjects = useMemo(() => {
        return projects.filter(project => displayedProjectIds.has(project.id));
    }, [projects, displayedProjectIds]);


    return (
        <div className="bg-primary text-primary min-h-screen font-sans">
            <Header theme={theme} setTheme={setTheme} />
            <main className="container mx-auto px-4 pb-12">
                <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />
                 {error && <div className="text-center text-red-500 mb-4">{error}</div>}
                <Dashboard
                    projects={displayedProjects}
                    events={displayedEvents}
                    onLocationClick={setMapModalLocation}
                    onWhenClick={setTimeMapModalWhen}
                    onAddEventClick={() => setAddModalOpen(true)}
                />
            </main>
            {isAddModalOpen && (
                <AddEventForm 
                    projects={projects} 
                    onSave={handleSaveEvent}
                    onClose={() => {
                        setAddModalOpen(false);
                        setAddModalInitialData(null);
                    }}
                    voiceStatus={voiceStatus}
                    initialData={addModalInitialData}
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
