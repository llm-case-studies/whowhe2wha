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
import { ShareTemplateView } from './components/ShareTemplateView';
import { SettingsModal } from './components/SettingsModal';
import { ImportReviewModal } from './components/ImportReviewModal';
import { queryGraph } from './services/geminiService';
import { parseICS } from './utils/icsParser';
import { generateICS } from './utils/icsGenerator';
import { expandRecurringEvents } from './utils/recurrence';
import { generateEventsFromTemplate } from './utils/templateUtils';
import { MOCK_EVENTS, MOCK_PROJECTS, MOCK_LOCATIONS, MOCK_CONTACTS, MOCK_TEMPLATES } from './mockData';
import { Theme, EventNode, Project, Location, Contact, HistoryEntry, AppState, ProjectTemplate, EntityType, WhatType, SharedProjectData, SharedTemplateData, MainView, ParsedEvent, ProjectAndTemplateData } from './types';
import { I18nProvider, useI18n } from './hooks/useI18n';

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


const AppContent: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [isLoading, setIsLoading] = useState(false);
    const [mainView, setMainView] = useState<MainView>('dashboard');
    const { t } = useI18n();

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
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isImportReviewModalOpen, setIsImportReviewModalOpen] = useState(false);

    // State for editing items
    const [eventToEdit, setEventToEdit] = useState<EventNode | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    const [locationToEdit, setLocationToEdit] = useState<Location | null>(null);
    const [preselectedProjectId, setPreselectedProjectId] = useState<number | null>(null);
    const [addLocationQuery, setAddLocationQuery] = useState('');

    // Confirmation modal state
    const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; } | null>(null);

    // History state
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    
    // Share state
    const [shareData, setShareData] = useState<SharedProjectData | null>(null);
    const [shareTemplateData, setShareTemplateData] = useState<SharedTemplateData | null>(null);
    const [isShareView, setIsShareView] = useState(false);
    const [shareModalUrl, setShareModalUrl] = useState<string | null>(null);
    
    // Import/Export State
    const [parsedICSEvents, setParsedICSEvents] = useState<ParsedEvent[] | null>(null);
    const [jsonEventsToImport, setJsonEventsToImport] = useState<EventNode[] | null>(null);


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
                } else if (hash.startsWith('#share-template=')) {
                    const encodedData = hash.substring(16); // remove #share-template=
                    const data = await decodeAndDecompress<SharedTemplateData>(encodedData);
                     if (data.template) {
                        setShareTemplateData(data);
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
        let baseEvents = allEvents;
        if (selectedProjectId !== null) {
            baseEvents = allEvents.filter(e => e.projectId === selectedProjectId);
        }
        if (filteredEventIds !== null) {
            const idSet = new Set(filteredEventIds);
            baseEvents = allEvents.filter(e => idSet.has(e.id));
        }

        // For stream view, expand events for the next 2 years.
        // For timeline view, this would need to be adjusted based on timeline's visible range,
        // but for now, a fixed future window is a good start and will work for both.
        const viewStartDate = new Date();
        viewStartDate.setMonth(viewStartDate.getMonth() - 3); // show some past events
        const viewEndDate = new Date();
        viewEndDate.setFullYear(viewEndDate.getFullYear() + 2);
    
        // Expand recurring events
        const expanded = expandRecurringEvents(baseEvents, viewStartDate, viewEndDate);
    
        return expanded;

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
        const masterEvent = allEvents.find(e => e.id === event.id);
        if (!masterEvent) return;

        const openEditModal = () => {
            setEventToEdit(masterEvent);
            setIsAddEventModalOpen(true);
            if (confirmation) setConfirmation(null);
        };

        if (masterEvent.recurrence) {
            setConfirmation({
                title: t('editRecurringEvent'),
                message: t('editRecurringEventMsg'),
                onConfirm: openEditModal,
                confirmText: t('editAll'),
            });
        } else {
            openEditModal();
        }
    };

    const handleDeleteEvent = (eventId: number) => {
        const eventToDelete = allEvents.find(e => e.id === eventId);
        if (!eventToDelete) return;

        const confirmDelete = () => {
            const beforeState = getCurrentAppState();
            addHistoryEntry(`Deleted event: "${eventToDelete.what.name}"`, beforeState);
            setAllEvents(allEvents.filter(e => e.id !== eventId));
            setConfirmation(null);
        };

        if (eventToDelete.recurrence) {
             setConfirmation({
                title: t('deleteRecurringEvent'),
                message: t('deleteRecurringEventMsg'),
                onConfirm: confirmDelete
            });
        } else {
            setConfirmation({
                title: t('deleteEvent'),
                message: t('deleteEventMsg'),
                onConfirm: confirmDelete
            });
        }
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
                if (template) {
                    historyDescription += ` from template "${template.name}"`;
                    newEventsFromTemplate = generateEventsFromTemplate(template, newProjectWithId.id, new Date(startDate));
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
            title: t('deleteProject'),
            message: t('deleteProjectMsg'),
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
            title: t('deleteContact'),
            message: t('deleteContactMsg'),
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
            title: t('deleteLocation'),
            message: t('deleteLocationMsg'),
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
            title: t('deleteTemplate'),
            message: t('deleteTemplateMsg'),
            onConfirm: () => {
                const beforeState = getCurrentAppState();
                addHistoryEntry(`Deleted template: "${templateToDelete.name}"`, beforeState);
                setProjectTemplates(projectTemplates.filter(pt => pt.id !== templateId));
                setConfirmation(null);
            }
        });
    };
    
    // --- Sharing Handlers ---
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
    
    const handleShareTemplate = async (templateId: number) => {
        const template = projectTemplates.find(t => t.id === templateId);
        if (!template) return;

        const data: SharedTemplateData = { template };

        const encodedData = await compressAndEncode(data);
        const url = `${window.location.origin}${window.location.pathname}#share-template=${encodedData}`;
        setShareModalUrl(url);
    };
    
    // --- Data Import/Export Handlers ---
    
    const triggerDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportFullBackup = () => {
        const appState = getCurrentAppState();
        const jsonString = JSON.stringify(appState, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const date = new Date().toISOString().split('T')[0];
        triggerDownload(blob, `whowhe2wha_backup_${date}.json`);
        setIsSettingsModalOpen(false);
    };

    const handleExportEventsICS = () => {
        const icsString = generateICS(allEvents, allProjects, allLocations);
        const blob = new Blob([icsString], { type: 'text/calendar' });
        const date = new Date().toISOString().split('T')[0];
        triggerDownload(blob, `whowhe2wha_events_${date}.ics`);
    };

    const handleExportEventsJSON = () => {
        const jsonString = JSON.stringify(allEvents, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        triggerDownload(blob, `whowhe2wha_events.json`);
    };
    
    const handleExportProjectsAndTemplates = () => {
        const data: ProjectAndTemplateData = {
            projects: allProjects,
            projectTemplates: projectTemplates
        };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        triggerDownload(blob, `whowhe2wha_projects_templates.json`);
    };

    const handleImportICS = (fileContent: string) => {
        try {
            const parsed = parseICS(fileContent);
            if(parsed.length > 0) {
                setParsedICSEvents(parsed);
                setIsSettingsModalOpen(false);
                setIsImportReviewModalOpen(true);
            } else {
                alert("No valid events found in the selected file.");
            }
        } catch (error) {
            console.error("Failed to parse ICS file:", error);
            alert("An error occurred while parsing the .ics file.");
        }
    };
    
    const handleImportEventsJSON = (fileContent: string) => {
        try {
            const parsed = JSON.parse(fileContent);
            if(Array.isArray(parsed) && parsed.length > 0) {
                // Basic validation
                if ('what' in parsed[0] && 'projectId' in parsed[0]) {
                     setJsonEventsToImport(parsed as EventNode[]);
                     setIsSettingsModalOpen(false);
                     setIsImportReviewModalOpen(true);
                } else {
                    throw new Error("Invalid event format");
                }
            } else {
                 alert("No valid events found in the JSON file.");
            }
        } catch (error) {
            console.error("Failed to parse JSON event file:", error);
            alert("An error occurred while parsing the JSON file. Please ensure it is a valid event export.");
        }
    };
    
    const handleImportProjectsAndTemplates = (fileContent: string) => {
        try {
            const parsed = JSON.parse(fileContent) as ProjectAndTemplateData;
            if (Array.isArray(parsed.projects) && Array.isArray(parsed.projectTemplates)) {
                setConfirmation({
                    title: t('confirmImport'),
                    message: `This will add ${parsed.projects.length} projects and ${parsed.projectTemplates.length} templates. Existing items will not be overwritten. Continue?`,
                    onConfirm: () => {
                        const beforeState = getCurrentAppState();
                        const newProjects = parsed.projects.map(p => ({ ...p, id: Date.now() + Math.random() }));
                        const newTemplates = parsed.projectTemplates.map(t => ({ ...t, id: Date.now() + Math.random() }));
                        
                        setAllProjects(prev => [...prev, ...newProjects]);
                        setProjectTemplates(prev => [...prev, ...newTemplates]);
                        addHistoryEntry(`Imported ${newProjects.length} projects and ${newTemplates.length} templates`, beforeState);
                        setConfirmation(null);
                        setIsSettingsModalOpen(false);
                    }
                })
            } else {
                throw new Error("Invalid projects/templates format");
            }
        } catch (error) {
            console.error("Failed to parse projects/templates file:", error);
            alert("An error occurred while parsing the JSON file. Please ensure it is a valid projects & templates export.");
        }
    };

    const handleImportFromBackup = (fileContent: string) => {
         try {
            const parsed = JSON.parse(fileContent) as AppState;
            if (parsed.projects && parsed.events && parsed.locations && parsed.contacts && parsed.projectTemplates) {
                setConfirmation({
                    title: t('restoreFromBackup'),
                    message: t('restoreFromBackupMsg'),
                    onConfirm: () => {
                        setAllProjects(parsed.projects);
                        setAllEvents(parsed.events);
                        setAllLocations(parsed.locations);
                        setAllContacts(parsed.contacts);
                        setProjectTemplates(parsed.projectTemplates);
                        setHistory([]); // History is invalidated
                        setConfirmation(null);
                        setIsSettingsModalOpen(false);
                    }
                })
            } else {
                throw new Error("Invalid backup file format");
            }
        } catch (error) {
            console.error("Failed to parse backup file:", error);
            alert("An error occurred while parsing the backup file. It appears to be invalid.");
        }
    };

    
    const handleConfirmICSImport = (projectId: number) => {
        if (!parsedICSEvents || !projectId) return;
        const beforeState = getCurrentAppState();
        const newLocations: Location[] = [];
        const newEvents: EventNode[] = [];
        let currentLocations = [...allLocations];

        for (const parsedEvent of parsedICSEvents) {
            let eventWhereId = '';
            if (parsedEvent.location) {
                let existingLocation = currentLocations.find(l => 
                    l.name.toLowerCase() === parsedEvent.location!.toLowerCase() ||
                    l.alias?.toLowerCase() === parsedEvent.location!.toLowerCase()
                );
                if (!existingLocation) {
                    const newLoc: Location = { id: `where-${Date.now() + Math.random()}`, name: parsedEvent.location, type: EntityType.Where };
                    newLocations.push(newLoc);
                    currentLocations.push(newLoc);
                    eventWhereId = newLoc.id;
                } else {
                    eventWhereId = existingLocation.id;
                }
            }
            const startDate = parsedEvent.startDate;
            const endDate = parsedEvent.endDate;
            const isPeriod = endDate && (endDate.getTime() - startDate.getTime()) >= (24 * 60 * 60 * 1000);

            const newEv: EventNode = {
                id: Date.now() + Math.random(),
                projectId,
                what: { id: `what-${Date.now() + Math.random()}`, name: parsedEvent.summary, description: parsedEvent.description, type: EntityType.What, whatType: isPeriod ? WhatType.Period : WhatType.Appointment },
                when: { id: `when-${Date.now() + Math.random()}`, name: startDate.toISOString(), timestamp: startDate.toISOString(), display: startDate.toLocaleString(), type: EntityType.When },
                endWhen: isPeriod ? { id: `endwhen-${Date.now() + Math.random()}`, name: endDate!.toISOString(), timestamp: endDate!.toISOString(), display: endDate!.toLocaleString(), type: EntityType.When } : undefined,
                who: [],
                whereId: eventWhereId,
            };
            newEvents.push(newEv);
        }

        setAllEvents(prev => [...prev, ...newEvents]);
        if (newLocations.length > 0) setAllLocations(prev => [...prev, ...newLocations]);
        addHistoryEntry(`Imported ${newEvents.length} events from .ics file`, beforeState);

        setParsedICSEvents(null);
        setIsImportReviewModalOpen(false);
    };
    
    const handleConfirmJSONEventImport = (projectId: number) => {
        if (!jsonEventsToImport || !projectId) return;
        const beforeState = getCurrentAppState();
        const newEvents = jsonEventsToImport.map(event => ({
            ...event,
            id: Date.now() + Math.random(),
            projectId: projectId,
        }));
        setAllEvents(prev => [...prev, ...newEvents]);
        addHistoryEntry(`Imported ${newEvents.length} events from JSON file`, beforeState);
        setJsonEventsToImport(null);
        setIsImportReviewModalOpen(false);
    };


    if (isShareView) {
        if (shareData) {
            return <ShareView data={shareData} />;
        }
        if (shareTemplateData) {
            return <ShareTemplateView data={shareTemplateData} />;
        }
    }

    return (
        <div className="bg-background text-primary h-screen font-sans flex flex-col overflow-hidden">
            <Header theme={theme} setTheme={setTheme} onToggleHistory={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)} onOpenSettings={() => setIsSettingsModalOpen(true)} />
            <main className="container mx-auto px-4 flex-grow flex flex-col min-h-0">
                <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isLoading={isLoading} />
                <Dashboard
                    mainView={mainView}
                    setMainView={setMainView}
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
                    onShare={handleShareTemplate}
                />
            )}
            {shareModalUrl && (
                <ShareModal url={shareModalUrl} onClose={() => setShareModalUrl(null)} />
            )}
            {isSettingsModalOpen && (
                <SettingsModal
                    onClose={() => setIsSettingsModalOpen(false)}
                    onExportFullBackup={handleExportFullBackup}
                    onExportEventsICS={handleExportEventsICS}
                    onExportEventsJSON={handleExportEventsJSON}
                    onExportProjectsAndTemplates={handleExportProjectsAndTemplates}
                    onImportICS={handleImportICS}
                    onImportEventsJSON={handleImportEventsJSON}
                    onImportProjectsAndTemplates={handleImportProjectsAndTemplates}
                    onImportFromBackup={handleImportFromBackup}
                />
            )}
            {isImportReviewModalOpen && (parsedICSEvents || jsonEventsToImport) && (
                <ImportReviewModal
                    parsedICSEvents={parsedICSEvents}
                    jsonEvents={jsonEventsToImport}
                    projects={allProjects}
                    onClose={() => { setIsImportReviewModalOpen(false); setParsedICSEvents(null); setJsonEventsToImport(null); }}
                    onConfirmICS={handleConfirmICSImport}
                    onConfirmJSON={handleConfirmJSONEventImport}
                />
            )}
            {confirmation && (
                <ConfirmationModal
                    title={confirmation.title}
                    message={confirmation.message}
                    onConfirm={confirmation.onConfirm}
                    onCancel={() => setConfirmation(null)}
                    confirmText={confirmation.confirmText}
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

const App: React.FC = () => {
    type Language = 'en' | 'es' | 'fr' | 'de' | 'pt';
    const [language, setLanguage] = useState<Language>((localStorage.getItem('whowhe2wha-lang') as Language) || 'en');

    useEffect(() => {
        localStorage.setItem('whowhe2wha-lang', language);
    }, [language]);

    return (
        <I18nProvider language={language} setLanguage={setLanguage}>
            <AppContent />
        </I18nProvider>
    );
};


export default App;