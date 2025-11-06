
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { AddEventModal } from './components/AddEventForm';
import { AddProjectModal } from './components/AddProjectModal';
import { AddContactModal } from './components/AddContactModal';
import { AddLocationModal } from './components/AddLocationModal';
import { EditLocationModal } from './components/EditLocationModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { MOCK_PROJECTS, MOCK_EVENTS, MOCK_LOCATIONS, MOCK_CONTACTS } from './constants';
import { Project, EventNode, Location, Contact, Theme } from './types';
import { queryGraph } from './services/geminiService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [events, setEvents] = useState<EventNode[]>(MOCK_EVENTS);
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);

  const [isLoading, setIsLoading] = useState(false);
  const [filteredEventIds, setFilteredEventIds] = useState<number[] | null>(null);

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [addLocationQuery, setAddLocationQuery] = useState('');

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setFilteredEventIds(null);
      return;
    }
    setIsLoading(true);
    try {
      const ids = await queryGraph(query, { projects, events, locations });
      setFilteredEventIds(ids);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setFilteredEventIds(null);
  };
  
  const handleOpenAddLocation = (query: string) => {
      setAddLocationQuery(query);
      setIsAddLocationModalOpen(true);
  }

  const handleSaveLocation = (newLocation: Location) => {
      setLocations(prev => [...prev, newLocation]);
      setIsAddLocationModalOpen(false);
  }

  const displayEvents = filteredEventIds !== null ? events.filter(e => filteredEventIds.includes(e.id)) : events;

  return (
    <div className="bg-background-primary text-primary min-h-screen font-sans">
      <Header theme={theme} setTheme={setTheme} />
      <main className="container mx-auto px-4 pb-12">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />
        <Dashboard
          events={displayEvents}
          allEvents={events}
          projects={projects}
          locations={locations}
          contacts={contacts}
          onAddEvent={() => setIsAddEventModalOpen(true)}
          onAddProject={() => setIsAddProjectModalOpen(true)}
          onAddContact={() => setIsAddContactModalOpen(true)}
          onAddLocation={handleOpenAddLocation}
        />
      </main>

      {isAddEventModalOpen && <AddEventModal projects={projects} locations={locations} contacts={contacts} onClose={() => setIsAddEventModalOpen(false)} onSave={(event) => { setEvents(prev => [...prev, event]); setIsAddEventModalOpen(false); }} />}
      {isAddProjectModalOpen && <AddProjectModal onClose={() => setIsAddProjectModalOpen(false)} onSave={(project) => { setProjects(prev => [...prev, project]); setIsAddProjectModalOpen(false); }} />}
      {isAddContactModalOpen && <AddContactModal locations={locations} onClose={() => setIsAddContactModalOpen(false)} onSave={(contact) => { setContacts(prev => [...prev, contact]); setIsAddContactModalOpen(false); }} />}
      {isAddLocationModalOpen && <AddLocationModal initialQuery={addLocationQuery} onClose={() => setIsAddLocationModalOpen(false)} onSave={handleSaveLocation} />}
    </div>
  );
};

export default App;
