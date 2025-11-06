
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
import { Project, EventNode, Location, Contact, Theme, ConfirmationState } from './types';
import { queryGraph } from './services/geminiService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [events, setEvents] = useState<EventNode[]>(MOCK_EVENTS);
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);

  const [isLoading, setIsLoading] = useState(false);
  const [filteredEventIds, setFilteredEventIds] = useState<number[] | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [addLocationQuery, setAddLocationQuery] = useState('');

  const [editingEvent, setEditingEvent] = useState<EventNode | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [confirmationState, setConfirmationState] = useState<ConfirmationState | null>(null);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleSearch = async (query: string) => {
    if (!query) {
      setFilteredEventIds(null);
      return;
    }
    setIsLoading(true);
    setSelectedProjectId(null); // Clear project filter on new search
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

  const handleProjectSelect = (projectId: number) => {
      setFilteredEventIds(null); // Clear search filter when selecting a project
      setSelectedProjectId(prevId => prevId === projectId ? null : projectId);
  }

  // Event Handlers
  const handleSaveEvent = (event: EventNode) => {
    setEvents(prev => {
        const index = prev.findIndex(e => e.id === event.id);
        if (index > -1) {
            const newEvents = [...prev];
            newEvents[index] = event;
            return newEvents;
        }
        return [...prev, event];
    });
    setIsAddEventModalOpen(false);
    setEditingEvent(null);
  }
  const handleEditEvent = (event: EventNode) => { setEditingEvent(event); setIsAddEventModalOpen(true); }
  const handleDeleteEvent = (eventId: number) => {
      setConfirmationState({
          title: "Delete Event?",
          message: "Are you sure you want to permanently delete this event? This action cannot be undone.",
          onConfirm: () => {
              setEvents(prev => prev.filter(e => e.id !== eventId));
              setConfirmationState(null);
          }
      })
  }
  
  // Project Handlers
  const handleSaveProject = (project: Project) => {
    setProjects(prev => {
        const index = prev.findIndex(p => p.id === project.id);
        if (index > -1) {
            const newProjects = [...prev];
            newProjects[index] = project;
            return newProjects;
        }
        return [...prev, project];
    });
    setIsAddProjectModalOpen(false);
    setEditingProject(null);
  }
  const handleEditProject = (project: Project) => { setEditingProject(project); setIsAddProjectModalOpen(true); }
  const handleDeleteProject = (projectId: number) => {
      const eventsInProject = events.filter(e => e.projectId === projectId).length;
      setConfirmationState({
          title: "Delete Project?",
          message: (
            <>
                <p>Are you sure you want to permanently delete this project? This action cannot be undone.</p>
                {eventsInProject > 0 && <p className="mt-2 p-2 bg-red-900/50 text-red-300 rounded-md"><strong>Warning:</strong> This will also delete {eventsInProject} associated event(s).</p>}
            </>
          ),
          onConfirm: () => {
              setProjects(prev => prev.filter(p => p.id !== projectId));
              setEvents(prev => prev.filter(e => e.projectId !== projectId));
              if (selectedProjectId === projectId) setSelectedProjectId(null);
              setConfirmationState(null);
          }
      })
  }

  // Contact Handlers
  const handleSaveContact = (contact: Contact) => {
    setContacts(prev => {
        const index = prev.findIndex(c => c.id === contact.id);
        if (index > -1) {
            const newContacts = [...prev];
            newContacts[index] = contact;
            return newContacts;
        }
        return [...prev, contact];
    });
    setIsAddContactModalOpen(false);
    setEditingContact(null);
  }
  const handleEditContact = (contact: Contact) => { setEditingContact(contact); setIsAddContactModalOpen(true); }
  const handleDeleteContact = (contactId: string) => {
      setConfirmationState({
          title: "Delete Contact?",
          message: "Are you sure you want to permanently delete this contact? This will not affect past events.",
          onConfirm: () => {
              setContacts(prev => prev.filter(c => c.id !== contactId));
              setConfirmationState(null);
          }
      })
  }
  
  // Location Handlers
  const handleSaveLocation = (location: Location) => {
    setLocations(prev => {
        const index = prev.findIndex(l => l.id === location.id);
        if (index > -1) {
            const newLocations = [...prev];
            newLocations[index] = location;
            return newLocations;
        }
        return [...prev, location];
    });
    setIsAddLocationModalOpen(false);
    setEditingLocation(null);
  }
  const handleEditLocation = (location: Location) => { setEditingLocation(location); }
  const handleDeleteLocation = (locationId: string) => {
      setConfirmationState({
          title: "Delete Location?",
          message: "Are you sure you want to permanently delete this location? This action cannot be undone.",
          onConfirm: () => {
              setLocations(prev => prev.filter(l => l.id !== locationId));
              setConfirmationState(null);
          }
      })
  }

  // Filtering Logic
  let displayEvents = events;
  if (selectedProjectId) {
      displayEvents = events.filter(e => e.projectId === selectedProjectId);
  }
  if (filteredEventIds !== null) {
      const idSet = new Set(filteredEventIds);
      displayEvents = events.filter(e => idSet.has(e.id));
  }

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
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onAddProject={() => setIsAddProjectModalOpen(true)}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onAddContact={() => setIsAddContactModalOpen(true)}
          onEditContact={handleEditContact}
          onDeleteContact={handleDeleteContact}
          onAddLocation={handleOpenAddLocation}
          onEditLocation={handleEditLocation}
          onDeleteLocation={handleDeleteLocation}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
        />
      </main>

      {isAddEventModalOpen && <AddEventModal projects={projects} locations={locations} contacts={contacts} eventToEdit={editingEvent} onClose={() => { setIsAddEventModalOpen(false); setEditingEvent(null); }} onSave={handleSaveEvent} />}
      {isAddProjectModalOpen && <AddProjectModal projectToEdit={editingProject} onClose={() => { setIsAddProjectModalOpen(false); setEditingProject(null); }} onSave={handleSaveProject} />}
      {isAddContactModalOpen && <AddContactModal locations={locations} contactToEdit={editingContact} onClose={() => { setIsAddContactModalOpen(false); setEditingContact(null); }} onSave={handleSaveContact} />}
      {isAddLocationModalOpen && <AddLocationModal initialQuery={addLocationQuery} onClose={() => setIsAddLocationModalOpen(false)} onSave={handleSaveLocation} />}
      {editingLocation && <EditLocationModal location={editingLocation} onClose={() => setEditingLocation(null)} onSave={handleSaveLocation} />}
      {confirmationState && <ConfirmationModal {...confirmationState} onCancel={() => setConfirmationState(null)} />}
    </div>
  );
};

export default App;
