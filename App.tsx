
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
import { HistoryPanel } from './components/HistoryPanel';
import { ProjectTemplatesModal } from './components/ProjectTemplatesModal';
import { MOCK_PROJECTS, MOCK_EVENTS, MOCK_LOCATIONS, MOCK_CONTACTS, MOCK_PROJECT_TEMPLATES } from './constants';
import { Project, EventNode, Location, Contact, Theme, ConfirmationState, HistoryEntry, HistoryActionType, HistoryEntityType, ProjectTemplate, EntityType, When, WhatType } from './types';
import { queryGraph } from './services/geminiService';
import { parseTemplateEventDuration } from './utils/templateUtils';

const MAX_HISTORY_LENGTH = 20;

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [events, setEvents] = useState<EventNode[]>(MOCK_EVENTS);
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [projectTemplates, setProjectTemplates] = useState<ProjectTemplate[]>(MOCK_PROJECT_TEMPLATES);
  
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [filteredEventIds, setFilteredEventIds] = useState<number[] | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isProjectTemplatesModalOpen, setIsProjectTemplatesModalOpen] = useState(false);
  const [addLocationQuery, setAddLocationQuery] = useState('');
  
  const [preselectedProjectId, setPreselectedProjectId] = useState<number | null>(null);

  const [editingEvent, setEditingEvent] = useState<EventNode | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [confirmationState, setConfirmationState] = useState<ConfirmationState | null>(null);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  const pushToHistory = (action: HistoryActionType, entity: HistoryEntityType, description: string, undoData: HistoryEntry['undoData']) => {
      setHistory(prev => {
          const newEntry: HistoryEntry = { id: Date.now(), timestamp: Date.now(), action, entity, description, undoData };
          const newHistory = [newEntry, ...prev];
          if (newHistory.length > MAX_HISTORY_LENGTH) {
              newHistory.pop();
          }
          return newHistory;
      });
  }

  const handleSearch = async (query: string) => {
    if (!query) {
      setFilteredEventIds(null);
      return;
    }
    setIsLoading(true);
    setSelectedProjectId(null);
    try {
      const ids = await queryGraph(query, { projects, events, locations });
      setFilteredEventIds(ids);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => { setFilteredEventIds(null); };
  
  const handleOpenAddLocation = (query: string) => {
      setAddLocationQuery(query);
      setIsAddLocationModalOpen(true);
  }

  const handleProjectSelect = (projectId: number) => {
      setFilteredEventIds(null);
      setSelectedProjectId(prevId => prevId === projectId ? null : projectId);
  }
  
  const handleOpenAddEventModal = (projectId: number | null = null) => {
    setEditingEvent(null); // Ensure we are not in edit mode
    if (projectId) {
      setPreselectedProjectId(projectId);
    }
    setIsAddEventModalOpen(true);
  };

  // Event Handlers
  const handleSaveEvent = (event: EventNode) => {
    const isEditing = events.some(e => e.id === event.id);
    if (isEditing) {
        const previousState = events.find(e => e.id === event.id)!;
        pushToHistory('UPDATE', 'Event', `Updated event: "${event.what.name}"`, { previousState: JSON.parse(JSON.stringify(previousState)) });
        setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    } else {
        pushToHistory('CREATE', 'Event', `Created event: "${event.what.name}"`, { id: event.id });
        setEvents(prev => [...prev, event]);
    }
    setIsAddEventModalOpen(false);
    setEditingEvent(null);
  }
  const handleEditEvent = (event: EventNode) => { setEditingEvent(event); setIsAddEventModalOpen(true); }
  const handleDeleteEvent = (eventId: number) => {
      const eventToDelete = events.find(e => e.id === eventId);
      if (!eventToDelete) return;
      setConfirmationState({
          title: "Delete Event?",
          message: "Are you sure you want to permanently delete this event? This action can be undone from the History panel.",
          onConfirm: () => {
              pushToHistory('DELETE', 'Event', `Deleted event: "${eventToDelete.what.name}"`, { deletedState: JSON.parse(JSON.stringify(eventToDelete)) });
              setEvents(prev => prev.filter(e => e.id !== eventId));
              setConfirmationState(null);
          }
      })
  }
  
  // Project Handlers
  const handleSaveProject = (project: Project, templateId?: number, startDate?: string) => {
    const isEditing = projects.some(p => p.id === project.id);
    if (isEditing) {
        const previousState = projects.find(p => p.id === project.id)!;
        pushToHistory('UPDATE', 'Project', `Updated project: "${project.name}"`, { previousState: JSON.parse(JSON.stringify(previousState)) });
        setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    } else {
        const template = projectTemplates.find(t => t.id === templateId);
        const newEvents: EventNode[] = [];

        if (template && startDate) {
            const baseDate = new Date(startDate);
            baseDate.setHours(8, 0, 0, 0); // Use a consistent start time to avoid timezone issues.
            let sequentialOffset = 0;

            template.events.forEach((te) => {
                const durationInfo = parseTemplateEventDuration(te.whatName);
                let eventStartDate: Date;
                let durationDays = 1;

                if (durationInfo) {
                    eventStartDate = new Date(baseDate.getTime());
                    eventStartDate.setDate(baseDate.getDate() + durationInfo.startOffsetDays);
                    durationDays = durationInfo.durationDays;
                } else {
                    eventStartDate = new Date(baseDate.getTime());
                    eventStartDate.setDate(baseDate.getDate() + sequentialOffset);
                }
                
                const formatOptionsPoint: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit' };
                const formatOptionsPeriod: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

                // Fix: Add missing 'name' property to When object. The name and display values are the same.
                const whenDisplay = te.whatType === WhatType.Period ? eventStartDate.toLocaleDateString([], formatOptionsPeriod) : eventStartDate.toLocaleString([], formatOptionsPoint);
                const when: When = {
                    id: `when-${Date.now() + Math.random()}`,
                    name: whenDisplay,
                    timestamp: eventStartDate.toISOString(),
                    display: whenDisplay,
                    type: EntityType.When,
                };
                
                let endWhen: When | undefined = undefined;
                if (durationDays > 1 && te.whatType === WhatType.Period) {
                    const eventEndDate = new Date(eventStartDate.getTime());
                    eventEndDate.setDate(eventStartDate.getDate() + durationDays - 1);
                    // Fix: Add missing 'name' property to When object. The name and display values are the same.
                    const endWhenDisplay = eventEndDate.toLocaleDateString([], formatOptionsPeriod);
                    endWhen = {
                         id: `endwhen-${Date.now() + Math.random()}`,
                         name: endWhenDisplay,
                         timestamp: eventEndDate.toISOString(),
                         display: endWhenDisplay,
                         type: EntityType.When,
                    };
                }

                newEvents.push({
                    id: Date.now() + Math.random(),
                    projectId: project.id,
                    what: {
                        id: `what-${Date.now() + Math.random()}`,
                        name: te.whatName,
                        description: te.whatDescription,
                        type: EntityType.What,
                        whatType: te.whatType,
                    },
                    who: [],
                    when: when,
                    endWhen: endWhen,
                });
                
                if (!durationInfo) {
                    sequentialOffset += durationDays;
                }
            });
        }

        const eventIds = newEvents.map(e => e.id);
        const historyDescription = template 
            ? `Created project "${project.name}" from template`
            : `Created project: "${project.name}"`;
        
        pushToHistory('CREATE', 'Project', historyDescription, { id: project.id, eventIds });
        setProjects(prev => [...prev, project]);
        if (newEvents.length > 0) {
            setEvents(prev => [...prev, ...newEvents]);
        }
    }
    setIsAddProjectModalOpen(false);
    setEditingProject(null);
  }
  const handleEditProject = (project: Project) => { setEditingProject(project); setIsAddProjectModalOpen(true); }
  const handleDeleteProject = (projectId: number) => {
      const projectToDelete = projects.find(p => p.id === projectId);
      if(!projectToDelete) return;
      const eventsInProject = events.filter(e => e.projectId === projectId);
      setConfirmationState({
          title: "Delete Project?",
          message: (
            <>
                <p>Are you sure you want to permanently delete this project? This action can be undone.</p>
                {eventsInProject.length > 0 && <p className="mt-2 p-2 bg-red-900/50 text-red-300 rounded-md"><strong>Warning:</strong> This will also delete {eventsInProject.length} associated event(s).</p>}
            </>
          ),
          onConfirm: () => {
              pushToHistory('DELETE', 'Project', `Deleted project: "${projectToDelete.name}"`, { 
                  deletedState: JSON.parse(JSON.stringify(projectToDelete)),
                  deletedEvents: JSON.parse(JSON.stringify(eventsInProject))
              });
              setProjects(prev => prev.filter(p => p.id !== projectId));
              setEvents(prev => prev.filter(e => e.projectId !== projectId));
              if (selectedProjectId === projectId) setSelectedProjectId(null);
              setConfirmationState(null);
          }
      })
  }

  // Contact Handlers
  const handleSaveContact = (contact: Contact) => {
    const isEditing = contacts.some(c => c.id === contact.id);
     if (isEditing) {
        const previousState = contacts.find(c => c.id === contact.id)!;
        pushToHistory('UPDATE', 'Contact', `Updated contact: "${contact.name}"`, { previousState: JSON.parse(JSON.stringify(previousState)) });
        setContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
    } else {
        pushToHistory('CREATE', 'Contact', `Created contact: "${contact.name}"`, { id: contact.id });
        setContacts(prev => [...prev, contact]);
    }
    setIsAddContactModalOpen(false);
    setEditingContact(null);
  }
  const handleEditContact = (contact: Contact) => { setEditingContact(contact); setIsAddContactModalOpen(true); }
  const handleDeleteContact = (contactId: string) => {
      const contactToDelete = contacts.find(c => c.id === contactId);
      if(!contactToDelete) return;
      setConfirmationState({
          title: "Delete Contact?",
          message: "Are you sure you want to permanently delete this contact? This will not affect past events but can be undone.",
          onConfirm: () => {
              pushToHistory('DELETE', 'Contact', `Deleted contact: "${contactToDelete.name}"`, { deletedState: JSON.parse(JSON.stringify(contactToDelete)) });
              setContacts(prev => prev.filter(c => c.id !== contactId));
              setConfirmationState(null);
          }
      })
  }
  
  // Location Handlers
  const handleSaveLocation = (location: Location) => {
    const isEditing = locations.some(l => l.id === location.id);
    if (isEditing) {
        const previousState = locations.find(l => l.id === location.id)!;
        pushToHistory('UPDATE', 'Location', `Updated location: "${location.alias || location.name}"`, { previousState: JSON.parse(JSON.stringify(previousState)) });
        setLocations(prev => prev.map(l => l.id === location.id ? location : l));
    } else {
        pushToHistory('CREATE', 'Location', `Created location: "${location.alias || location.name}"`, { id: location.id });
        setLocations(prev => [...prev, location]);
    }
    setIsAddLocationModalOpen(false);
    setEditingLocation(null);
  }
  const handleEditLocation = (location: Location) => { setEditingLocation(location); }
  const handleDeleteLocation = (locationId: string) => {
      const locationToDelete = locations.find(l => l.id === locationId);
      if(!locationToDelete) return;
      setConfirmationState({
          title: "Delete Location?",
          message: "Are you sure you want to permanently delete this location? This action can be undone.",
          onConfirm: () => {
              pushToHistory('DELETE', 'Location', `Deleted location: "${locationToDelete.alias || locationToDelete.name}"`, { deletedState: JSON.parse(JSON.stringify(locationToDelete)) });
              setLocations(prev => prev.filter(l => l.id !== locationId));
              setConfirmationState(null);
          }
      })
  }

  // Template Handlers
  const handleSaveTemplate = (template: ProjectTemplate) => {
      const isEditing = projectTemplates.some(t => t.id === template.id);
      if(isEditing) {
          const previousState = projectTemplates.find(t => t.id === template.id)!;
          pushToHistory('UPDATE', 'ProjectTemplate', `Updated template: "${template.name}"`, { previousState });
          setProjectTemplates(prev => prev.map(t => t.id === template.id ? template : t));
      } else {
          pushToHistory('CREATE', 'ProjectTemplate', `Created template: "${template.name}"`, { id: template.id });
          setProjectTemplates(prev => [...prev, template]);
      }
  }
  const handleDeleteTemplate = (templateId: number) => {
      const templateToDelete = projectTemplates.find(t => t.id === templateId);
      if(!templateToDelete) return;
      pushToHistory('DELETE', 'ProjectTemplate', `Deleted template: "${templateToDelete.name}"`, { deletedState: templateToDelete });
      setProjectTemplates(prev => prev.filter(t => t.id !== templateId));
  }
  
  // History Handlers
  const handleUndo = (historyId: number) => {
      const entry = history.find(h => h.id === historyId);
      if (!entry) return;

      const { action, entity, undoData } = entry;
      
      const stateUpdater = (setter: React.Dispatch<React.SetStateAction<any[]>>, item: any) => {
         setter(prev => [...prev, item].sort((a,b) => a.id > b.id ? 1 : -1));
      };
      const stateRemover = (setter: React.Dispatch<React.SetStateAction<any[]>>, id: any) => {
         setter(prev => prev.filter(item => item.id !== id));
      };
      const stateRestorer = (setter: React.Dispatch<React.SetStateAction<any[]>>, item: any) => {
         setter(prev => prev.map(i => i.id === item.id ? item : i));
      };

      const entityMap: Record<HistoryEntityType, any> = {
          'Event': { setter: setEvents, remover: stateRemover, restorer: stateRestorer, adder: stateUpdater },
          'Project': { setter: setProjects, remover: stateRemover, restorer: stateRestorer, adder: stateUpdater },
          'Contact': { setter: setContacts, remover: stateRemover, restorer: stateRestorer, adder: stateUpdater },
          'Location': { setter: setLocations, remover: stateRemover, restorer: stateRestorer, adder: stateUpdater },
          'ProjectTemplate': { setter: setProjectTemplates, remover: stateRemover, restorer: stateRestorer, adder: stateUpdater },
      };

      const handler = entityMap[entity];

      if (action === 'CREATE') {
          handler.remover(handler.setter, undoData.id);
          if (entity === 'Project' && undoData.eventIds && undoData.eventIds.length > 0) {
              const eventIdSet = new Set(undoData.eventIds);
              setEvents(prev => prev.filter(e => !eventIdSet.has(e.id)));
          }
      } else if (action === 'DELETE') {
          handler.adder(handler.setter, undoData.deletedState);
          if (entity === 'Project' && undoData.deletedEvents) {
              setEvents(prev => [...prev, ...undoData.deletedEvents!]);
          }
      } else if (action === 'UPDATE') {
          handler.restorer(handler.setter, undoData.previousState);
      }
      
      setHistory(prev => prev.filter(h => h.id !== historyId));
  }
  
  const handleClearHistory = () => setHistory([]);

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
    <div className="bg-background-primary text-primary min-h-screen font-sans flex flex-col h-screen">
      <Header theme={theme} setTheme={setTheme} onToggleHistory={() => setIsHistoryPanelOpen(p => !p)} />
      <main className="container mx-auto px-4 flex flex-col flex-grow min-h-0">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />
        <Dashboard
          events={displayEvents}
          allEvents={events}
          projects={projects}
          locations={locations}
          contacts={contacts}
          onAddEvent={handleOpenAddEventModal}
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
          onOpenProjectTemplates={() => setIsProjectTemplatesModalOpen(true)}
        />
      </main>

      {isAddEventModalOpen && <AddEventModal projects={projects} locations={locations} contacts={contacts} eventToEdit={editingEvent} preselectedProjectId={preselectedProjectId} onClose={() => { setIsAddEventModalOpen(false); setEditingEvent(null); setPreselectedProjectId(null); }} onSave={handleSaveEvent} />}
      {isAddProjectModalOpen && <AddProjectModal projectToEdit={editingProject} projectTemplates={projectTemplates} onClose={() => { setIsAddProjectModalOpen(false); setEditingProject(null); }} onSave={handleSaveProject} />}
      {isAddContactModalOpen && <AddContactModal locations={locations} contactToEdit={editingContact} onClose={() => { setIsAddContactModalOpen(false); setEditingContact(null); }} onSave={handleSaveContact} />}
      {isAddLocationModalOpen && <AddLocationModal initialQuery={addLocationQuery} onClose={() => setIsAddLocationModalOpen(false)} onSave={handleSaveLocation} />}
      {editingLocation && <EditLocationModal location={editingLocation} onClose={() => setEditingLocation(null)} onSave={handleSaveLocation} />}
      {confirmationState && <ConfirmationModal {...confirmationState} onCancel={() => setConfirmationState(null)} />}
      {isHistoryPanelOpen && <HistoryPanel history={history} onUndo={handleUndo} onClear={handleClearHistory} onClose={() => setIsHistoryPanelOpen(false)} />}
      {isProjectTemplatesModalOpen && <ProjectTemplatesModal templates={projectTemplates} onSave={handleSaveTemplate} onDelete={handleDeleteTemplate} onClose={() => setIsProjectTemplatesModalOpen(false)} />}
    </div>
  );
};

export default App;
