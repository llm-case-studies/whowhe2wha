import React, { useState, useEffect } from 'react';
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
import { ShareModal } from './components/ShareModal';
import { ShareView } from './components/ShareView';
import { queryGraph } from './services/geminiService';
import { MOCK_EVENTS, MOCK_PROJECTS, MOCK_LOCATIONS, MOCK_CONTACTS, MOCK_TEMPLATES } from './mockData';
import { Theme, EventNode, Project, Location, Contact, HistoryEntry, AppState, ProjectTemplate, EntityType, WhatType, SharedProjectData } from './types';

// --- Helper functions for compression and base64 encoding ---

function uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
    const binary_string = atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

async function compressAndEncode(data: object): Promise<string> {
    const jsonString = JSON.stringify(data);
    const stream = new Blob([jsonString]).stream().pipeThrough(new CompressionStream('gzip'));
    const compressedResponse = new Response(stream);
    const buffer = await compressedResponse.arrayBuffer();
    // URL-safe Base64: replace '+' with '-', '/' with '_', and remove padding '='
    return uint8ArrayToBase64(new Uint8Array(buffer))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function decodeAndDecompress<T>(encodedString: string): Promise<T> {
    // Add back padding and reverse URL-safe replacements
    let base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    const bytes = base64ToUint8Array(base64);
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const decompressedResponse = new Response(stream);
    const jsonString = await decompressedResponse.text();
    return JSON.parse(jsonString);
}


const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [isLoading, setIsLoading] = useState(false);

    // Main data state
    const [allProjects, setAllProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [allEvents, setAllEvents] = useState<EventNode[]>(MOCK_EVENTS);
    const [allLocations, setAllLocations] = useState<Location[]>(MOCK_LOCATIONS);
    const [allContacts, setAllContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [projectTemplates, setProjectTemplates] = useState<ProjectTemplate[]>(MOCK_TEMPLATES);

    // Filtered data for display
    const [filteredEventIds, setFilteredEventIds] = useState<number[] | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    
    // Modal states
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
    const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);
    const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
    const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

    // State for editing items
    const [eventToEdit, setEventToEdit] = useState<EventNode | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    const [locationToEdit, setLocationToEdit] = useState<Location | null>(null);
    const [preselectedProjectId, setPreselectedProjectId] = useState<number | null>(null);
    const [addLocationQuery, setAddLocationQuery] = useState('');

    // Confirmation modal state
    const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);

    // History state
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    
    // Share state
    const [shareData, setShareData] = useState<SharedProjectData | null>(null);
    const [isShareView, setIsShareView] = useState(false);
    const [shareModalUrl, setShareModalUrl] = useState<string | null>(null);


    useEffect(() => {
        document.documentElement.className = theme;
        
        const loadSharedData = async () => {
            try {
                const hash = window.location.hash;
                if (hash.startsWith('#share=')) {
                    const encodedData = hash.substring(7); // remove #share=
                    const data = await decodeAndDecompress<SharedProjectData>(encodedData);
                    // Basic validation
                    if (data.project && data.events && data.locations && data.contacts) {
                        setShareData(data);
                        setIsShareView(true);
                    }
                }
            } catch (error) {
                console.error("Failed to parse share data from URL", error);
                // If parsing fails, just load the normal app
                window.location.hash = '';
            }
        };
        
        loadSharedData();

    }, [theme]);
    
    // --- History Management ---
    const getCurrentAppState = (): AppState => ({
        events: allEvents,
        projects: allProjects,
        locations: allLocations,
        contacts: allContacts,
        projectTemplates: projectTemplates,
    });
    
    const addHistoryEntry = (description: string, beforeState: AppState) => {
        const newEntry: HistoryEntry = {
            id: Date.now(),
            description,
            timestamp: Date.now(),
            undo: (_currentState: AppState) => beforeState,
        };
        setHistory(prev => [newEntry, ...prev]);
    };

    const handleUndo = (historyId: number) => {
        const entryToUndo = history.find(h => h.id === historyId);
        if (!entryToUndo) return;

        const previousState = entryToUndo.undo(getCurrentAppState());
        
        setAllEvents(previousState.events);
        setAllProjects(previousState.projects);
        setAllLocations(previousState.locations);
        setAllContacts(previousState.contacts);
        setProjectTemplates(previousState.projectTemplates);

        setHistory(prev => prev.filter(h => h.id !== historyId));
    };


    const handleSearch = async (query: string) => {
        setIsLoading(true);
        try {
            const data = { projects: allProjects, events: allEvents, locations: allLocations };
            const matchingIds = await queryGraph(query, data);
            setFilteredEventIds(matchingIds);
        } catch (error) {
            console.error("Search failed:", error);
            // Optionally, show an error to the user
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClearSearch = () => {
        setFilteredEventIds(null);
        setSelectedProjectId(null);
    };

    const handleProjectSelect = (projectId: number) => {
        if (selectedProjectId === projectId) {
            setSelectedProjectId(null); // Deselect if clicking the same project
        } else {
            setSelectedProjectId(projectId);
        }
    };

    // Filter events based on search or project selection
    const displayedEvents = React.useMemo(() => {
        if (selectedProjectId !== null) {
            return allEvents.filter(e => e.projectId === selectedProjectId);
        }
        if (filteredEventIds !== null) {
            const idSet = new Set(filteredEventIds);
            return allEvents.filter(e => idSet.has(e.id));
        }
        return allEvents;
    }, [allEvents, filteredEventIds, selectedProjectId]);


    // --- CRUD Handlers ---
    const handleSaveEvent = (event: EventNode) => {
        const beforeState = getCurrentAppState();
        if (eventToEdit) {
            addHistoryEntry(`Edited event: "${event.what.name}"`, beforeState);
            setAllEvents(allEvents.map(e => e.id === event.id ? event : e));
        } else {
            addHistoryEntry(`Added event: "${event.what.name}"`, beforeState);
            setAllEvents([...allEvents, event]);
        }
        setEventToEdit(null);
        setIsAddEventModalOpen(false);
    };
    
    const handleAddEventClick = (projectId?: number) => {
        setEventToEdit(null);
        setPreselectedProjectId(projectId || null);
        setIsAddEventModalOpen(true);
    };

    const handleEditEventClick = (event: EventNode) => {
        setEventToEdit(event);
        setIsAddEventModalOpen(true);
    };

    const handleDeleteEvent = (eventId: number) => {
        const eventToDelete = allEvents.find(e => e.id === eventId);
        if (!eventToDelete) return;
        setConfirmation({
            title: "Delete Event?",
            message: "Are you sure you want to permanently delete this event?",
            onConfirm: () => {
                const beforeState = getCurrentAppState();
                addHistoryEntry(`Deleted event: "${eventToDelete.what.name}"`, beforeState);
                setAllEvents(allEvents.filter(e => e.id !== eventId));
                setConfirmation(null);
            }
        });
    };
    
    const handleSaveProject = (project: Project, templateId?: number, startDate?: string) => {
        const beforeState = getCurrentAppState();
        
        if (projectToEdit) {
            // Editing an existing project
            addHistoryEntry(`Edited project: "${project.name}"`, beforeState);
            setAllProjects(allProjects.map(p => p.id === project.id ? project : p));
        } else {
            // Adding a new project
            const newProjectWithId = { ...project, id: Date.now() };
            let newEventsFromTemplate: EventNode[] = [];
            let historyDescription = `Added project: "${project.name}"`;

            if (templateId && startDate) {
                const template = projectTemplates.find(t => t.id === templateId);
                const projectStartDate = new Date(startDate);
                if (template) {
                    historyDescription += ` from template "${template.name}"`;
                    let cumulativeOffset = 0;
                    newEventsFromTemplate = template.events
                        .sort((a, b) => a.sequence - b.sequence)
                        .map(templateEvent => {
                            const eventStartDate = new Date(projectStartDate);
                            eventStartDate.setDate(projectStartDate.getDate() + cumulativeOffset);

                            const eventEndDate = new Date(eventStartDate);
                            const duration = Math.max(1, templateEvent.durationDays);
                            eventEndDate.setDate(eventStartDate.getDate() + duration - 1);
                            
                            cumulativeOffset += duration;

                            return {
                                id: Date.now() + Math.random(),
                                projectId: newProjectWithId.id,
                                what: {
                                    id: `what-${Date.now() + Math.random()}`,
                                    name: templateEvent.whatName,
                                    description: templateEvent.description,
                                    type: EntityType.What,
                                    whatType: templateEvent.whatType,
                                },
                                when: {
                                    id: `when-${Date.now() + Math.random()}`,
                                    name: eventStartDate.toISOString(),
                                    timestamp: eventStartDate.toISOString(),
                                    display: eventStartDate.toLocaleString(),
                                    type: EntityType.When,
                                },
                                endWhen: duration > 1 ? {
                                    id: `endwhen-${Date.now() + Math.random()}`,
                                    name: eventEndDate.toISOString(),
                                    timestamp: eventEndDate.toISOString(),
                                    display: eventEndDate.toLocaleString(),
                                    type: EntityType.When,
                                } : undefined,
                                who: [],
                                whereId: '', // Needs to be assigned by user later
                            };
                        });
                }
            }
            
            addHistoryEntry(historyDescription, beforeState);
            setAllProjects([...allProjects, newProjectWithId]);
            setAllEvents([...allEvents, ...newEventsFromTemplate]);
        }
        
        setProjectToEdit(null);
        setIsAddProjectModalOpen(false);
    };
    
    const handleAddProjectClick = () => {
        setProjectToEdit(null);
        setIsAddProjectModalOpen(true);
    };
    
    const handleEditProjectClick = (project: Project) => {
        setProjectToEdit(project);
        setIsAddProjectModalOpen(true);
    };
    
    const handleDeleteProject = (projectId: number) => {
        const projectToDelete = allProjects.find(p => p.id === projectId);
        if (!projectToDelete) return;
         setConfirmation({
            title: "Delete Project?",
            message: "Are you sure? This will also delete all associated events.",
            onConfirm: () => {
                const beforeState = getCurrentAppState();
                addHistoryEntry(`Deleted project: "${projectToDelete.name}"`, beforeState);
                setAllProjects(allProjects.filter(p => p.id !== projectId));
                setAllEvents(allEvents.filter(e => e.projectId !== projectId));
                setConfirmation(null);
            }
        });
    };

    const handleSaveContact = (contact: Contact) => {
        const beforeState = getCurrentAppState();
        if(contactToEdit) {
            addHistoryEntry(`Edited contact: "${contact.name}"`, beforeState);
            setAllContacts(allContacts.map(c => c.id === contact.id ? contact : c));
        } else {
            addHistoryEntry(`Added contact: "${contact.name}"`, beforeState);
            setAllContacts([...allContacts, contact]);
        }
        setContactToEdit(null);
        setIsAddContactModalOpen(false);
    }

    const handleAddContactClick = () => {
        setContactToEdit(null);
        setIsAddContactModalOpen(true);
    };

    const handleEditContactClick = (contact: Contact) => {
        setContactToEdit(contact);
        setIsAddContactModalOpen(true);
    };

    const handleDeleteContact = (contactId: string) => {
        const contactToDelete = allContacts.find(c => c.id === contactId);
        if (!contactToDelete) return;
         setConfirmation({
            title: "Delete Contact?",
            message: "Are you sure you want to delete this contact?",
            onConfirm: () => {
                const beforeState = getCurrentAppState();
                addHistoryEntry(`Deleted contact: "${contactToDelete.name}"`, beforeState);
                setAllContacts(allContacts.filter(c => c.id !== contactId));
                setConfirmation(null);
            }
        });
    }

    const handleSaveLocation = (location: Location) => {
        const beforeState = getCurrentAppState();
        if(locationToEdit) {
            addHistoryEntry(`Edited location: "${location.alias || location.name}"`, beforeState);
            setAllLocations(allLocations.map(l => l.id === location.id ? location : l));
            setIsEditLocationModalOpen(false);
        } else {
            addHistoryEntry(`Added location: "${location.alias || location.name}"`, beforeState);
            setAllLocations([...allLocations, location]);
            setIsAddLocationModalOpen(false);
        }
        setLocationToEdit(null);
    }

    const handleAddLocationClick = (query: string = '') => {
        setAddLocationQuery(query);
        setIsAddLocationModalOpen(true);
    };

    const handleEditLocationClick = (location: Location) => {
        setLocationToEdit(location);
        setIsEditLocationModalOpen(true);
    };

    const handleDeleteLocation = (locationId: string) => {
        const locationToDelete = allLocations.find(l => l.id === locationId);
        if (!locationToDelete) return;
         setConfirmation({
            title: "Delete Location?",
            message: "You can only delete locations that have no events scheduled. Are you sure?",
            onConfirm: () => {
                const isUsed = allEvents.some(e => e.whereId === locationId);
                if (!isUsed) {
                    const beforeState = getCurrentAppState();
                    addHistoryEntry(`Deleted location: "${locationToDelete.alias || locationToDelete.name}"`, beforeState);
                    setAllLocations(allLocations.filter(l => l.id !== locationId));
                } else {
                    alert("Cannot delete location as it is currently in use by one or more events.");
                }
                setConfirmation(null);
            }
        });
    };

    const handleSaveTemplate = (template: ProjectTemplate) => {
        const beforeState = getCurrentAppState();
        const existing = projectTemplates.some(t => t.id === template.id);
        if (existing) {
            addHistoryEntry(`Edited template: "${template.name}"`, beforeState);
            setProjectTemplates(projectTemplates.map(pt => pt.id === template.id ? template : pt));
        } else {
            addHistoryEntry(`Added template: "${template.name}"`, beforeState);
            setProjectTemplates([...projectTemplates, template]);
        }
    };

    const handleDeleteTemplate = (templateId: number) => {
        const templateToDelete = projectTemplates.find(t => t.id === templateId);
        if (!templateToDelete) return;

        setConfirmation({
            title: "Delete Template?",
            message: "Are you sure you want to permanently delete this project template?",
            onConfirm: () => {
                const beforeState = getCurrentAppState();
                addHistoryEntry(`Deleted template: "${templateToDelete.name}"`, beforeState);
                setProjectTemplates(projectTemplates.filter(pt => pt.id !== templateId));
                setConfirmation(null);
            }
        });
    };
    
    const handleShareProject = async (projectId: number) => {
        const project = allProjects.find(p => p.id === projectId);
        if (!project) return;

        const projectEvents = allEvents.filter(e => e.projectId === projectId);
        const locationIds = new Set(projectEvents.map(e => e.whereId));
        const projectLocations = allLocations.filter(l => locationIds.has(l.id));

        const contactNames = new Set(projectEvents.flatMap(e => e.who.map(w => w.name)));
        const projectContacts = allContacts.filter(c => contactNames.has(c.name));

        const data: SharedProjectData = {
            project,
            events: projectEvents,
            locations: projectLocations,
            contacts: projectContacts,
        };

        const encodedData = await compressAndEncode(data);
        const url = `${window.location.origin}${window.location.pathname}#share=${encodedData}`;
        setShareModalUrl(url);
    };

    if (isShareView && shareData) {
        return <ShareView data={shareData} />;
    }

    return (
        <div className="bg-background text-primary min-h-screen font-sans flex flex-col">
            <Header theme={theme} setTheme={setTheme} onToggleHistory={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)} />
            <main className="container mx-auto px-4 flex-grow flex flex-col">
                <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />
                <Dashboard
                    events={displayedEvents}
                    allEvents={allEvents}
                    projects={allProjects}
                    locations={allLocations}
                    contacts={allContacts}
                    onAddEvent={handleAddEventClick}
                    onEditEvent={handleEditEventClick}
                    onDeleteEvent={handleDeleteEvent}
                    onAddProject={handleAddProjectClick}
                    onEditProject={handleEditProjectClick}
                    onDeleteProject={handleDeleteProject}
                    onAddContact={handleAddContactClick}
                    onEditContact={handleEditContactClick}
                    onDeleteContact={handleDeleteContact}
                    onAddLocation={handleAddLocationClick}
                    onEditLocation={handleEditLocationClick}
                    onDeleteLocation={handleDeleteLocation}
                    selectedProjectId={selectedProjectId}
                    onProjectSelect={handleProjectSelect}
                    onOpenProjectTemplates={() => setIsTemplatesModalOpen(true)}
                    onShareProject={handleShareProject}
                />
            </main>
            
            {/* --- Modals --- */}
            {isAddEventModalOpen && (
                <AddEventModal
                    projects={allProjects}
                    locations={allLocations}
                    contacts={allContacts}
                    eventToEdit={eventToEdit}
                    preselectedProjectId={preselectedProjectId}
                    onClose={() => { setIsAddEventModalOpen(false); setEventToEdit(null); }}
                    onSave={handleSaveEvent}
                />
            )}
            {isAddProjectModalOpen && (
                <AddProjectModal
                    projectToEdit={projectToEdit}
                    projectTemplates={projectTemplates}
                    onClose={() => { setIsAddProjectModalOpen(false); setProjectToEdit(null); }}
                    onSave={handleSaveProject}
                />
            )}
             {isAddContactModalOpen && (
                <AddContactModal
                    locations={allLocations}
                    contactToEdit={contactToEdit}
                    onClose={() => { setIsAddContactModalOpen(false); setContactToEdit(null); }}
                    onSave={handleSaveContact}
                />
            )}
            {isAddLocationModalOpen && (
                <AddLocationModal
                    initialQuery={addLocationQuery}
                    onClose={() => setIsAddLocationModalOpen(false)}
                    onSave={handleSaveLocation}
                />
            )}
            {isEditLocationModalOpen && locationToEdit && (
                <EditLocationModal
                    location={locationToEdit}
                    onClose={() => { setIsEditLocationModalOpen(false); setLocationToEdit(null); }}
                    onSave={handleSaveLocation}
                />
            )}
            {isTemplatesModalOpen && (
                <ProjectTemplatesModal
                    isOpen={isTemplatesModalOpen}
                    onClose={() => setIsTemplatesModalOpen(false)}
                    templates={projectTemplates}
                    onSave={handleSaveTemplate}
                    onDelete={handleDeleteTemplate}
                />
            )}
            {shareModalUrl && (
                <ShareModal url={shareModalUrl} onClose={() => setShareModalUrl(null)} />
            )}
            {confirmation && (
                <ConfirmationModal
                    title={confirmation.title}
                    message={confirmation.message}
                    onConfirm={confirmation.onConfirm}
                    onCancel={() => setConfirmation(null)}
                />
            )}
            {isHistoryPanelOpen && (
                 <HistoryPanel
                    history={history}
                    onClose={() => setIsHistoryPanelOpen(false)}
                    onUndo={handleUndo}
                    onClear={() => setHistory([])}
                />
            )}
        </div>
    );
};

export default App;