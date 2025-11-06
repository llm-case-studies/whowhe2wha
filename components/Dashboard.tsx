
import React, { useState } from 'react';
import { EventNode, Project, Location, Contact, ViewMode, TimelineScale, TierConfig } from '../types';
import { ViewControls } from './ViewControls';
import { TimelineView } from './TimelineView';
import { EventCard } from './EventCard';
import { ProjectCard } from './ProjectCard';
import { TierConfigModal } from './TierConfigModal';
import { LocationDetailModal } from './LocationDetailModal';
import { TimeMapModal } from './TimeMapModal';

interface DashboardProps {
  events: EventNode[];
  allEvents: EventNode[];
  projects: Project[];
  locations: Location[];
  contacts: Contact[];
  onAddEvent: (projectId?: number) => void;
  onEditEvent: (event: EventNode) => void;
  onDeleteEvent: (eventId: number) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: number) => void;
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onAddLocation: (query: string) => void;
  onEditLocation: (location: Location) => void;
  onDeleteLocation: (locationId: string) => void;
  selectedProjectId: number | null;
  onProjectSelect: (projectId: number) => void;
}

const initialTierConfig: TierConfig = [
  { id: 'tier-1', name: 'Primary', categories: ['Work', 'Health', 'Finance'] },
  { id: 'tier-2', name: 'Secondary', categories: ['Home', 'Personal'] },
];

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const {
    events, allEvents, projects, locations, contacts, 
    onAddEvent, onEditEvent, onDeleteEvent, 
    onAddProject, onEditProject, onDeleteProject,
    onAddContact, onEditContact, onDeleteContact,
    onAddLocation, onEditLocation, onDeleteLocation,
    selectedProjectId, onProjectSelect
  } = props;

  const [viewMode, setViewMode] = useState<ViewMode>('stream');
  const [timelineScale, setTimelineScale] = useState<TimelineScale>('month');
  const [timelineDate, setTimelineDate] = useState(new Date('2025-11-15T12:00:00Z'));
  
  const [selectedHolidayCategories, setSelectedHolidayCategories] = useState<string[]>(['US']);
  const [selectedProjectCategories, setSelectedProjectCategories] = useState<string[]>(() => projects.map(p => p.category));
  const [isTierConfigModalOpen, setIsTierConfigModalOpen] = useState(false);
  const [tierConfig, setTierConfig] = useState<TierConfig>(initialTierConfig);

  const [locationDetailModal, setLocationDetailModal] = useState<Location | null>(null);
  const [timeMapModalWhen, setTimeMapModalWhen] = useState<EventNode['when'] | null>(null);
  
  const handleSaveTierConfig = (newConfig: TierConfig) => {
    setTierConfig(newConfig);
    setIsTierConfigModalOpen(false);
  };

  const visibleProjects = projects.filter(p => selectedProjectCategories.includes(p.category));

  return (
    <>
      <ViewControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        timelineScale={timelineScale}
        setTimelineScale={setTimelineScale}
        timelineDate={timelineDate}
        setTimelineDate={setTimelineDate}
        onAddEventClick={() => onAddEvent()}
        onAddProjectClick={onAddProject}
        onAddContactClick={onAddContact}
        onAddLocationClick={() => onAddLocation('')}
        selectedHolidayCategories={selectedHolidayCategories}
        setSelectedHolidayCategories={setSelectedHolidayCategories}
        selectedProjectCategories={selectedProjectCategories}
        setSelectedProjectCategories={setSelectedProjectCategories}
        onConfigureTiersClick={() => setIsTierConfigModalOpen(true)}
      />

      {viewMode === 'stream' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-primary">Event Stream</h2>
            {events.length > 0 ? (
              events
                .slice()
                .sort((a, b) => new Date(a.when.timestamp).getTime() - new Date(b.when.timestamp).getTime())
                .map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    locations={locations} 
                    onLocationClick={setLocationDetailModal} 
                    onWhenClick={setTimeMapModalWhen} 
                    onEdit={onEditEvent}
                    onDelete={onDeleteEvent}
                  />
                ))
            ) : (
              <div className="text-center py-16 px-6 bg-secondary rounded-lg">
                  <h3 className="text-lg font-semibold text-primary">No Events Found</h3>
                  <p className="text-tertiary mt-2">Try clearing your search or project filter.</p>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Projects</h2>
                {selectedProjectId && (
                    <button onClick={() => onProjectSelect(selectedProjectId)} className="text-sm text-wha-blue hover:underline">Clear Filter</button>
                )}
            </div>
            {visibleProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project}
                isSelected={selectedProjectId === project.id}
                onClick={() => onProjectSelect(project.id)}
                onEdit={onEditProject}
                onDelete={onDeleteProject}
                onAddEvent={() => onAddEvent(project.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {viewMode === 'timeline' && (
        <TimelineView 
            events={events} 
            projects={visibleProjects} 
            currentDate={timelineDate} 
            scale={timelineScale}
            selectedHolidayCategories={selectedHolidayCategories}
            selectedProjectCategories={selectedProjectCategories}
            setTimelineDate={setTimelineDate}
            tierConfig={tierConfig}
        />
      )}

      {isTierConfigModalOpen && <TierConfigModal currentConfig={tierConfig} onSave={handleSaveTierConfig} onClose={() => setIsTierConfigModalOpen(false)} />}
      {locationDetailModal && (
        <LocationDetailModal 
            location={locationDetailModal} 
            allEvents={allEvents} 
            allLocations={locations} 
            contacts={contacts}
            onClose={() => setLocationDetailModal(null)} 
            onEditLocation={onEditLocation}
            onDeleteLocation={onDeleteLocation}
            onEditContact={onEditContact}
            onDeleteContact={onDeleteContact}
        />
      )}
      {timeMapModalWhen && <TimeMapModal when={timeMapModalWhen} allEvents={allEvents} allLocations={locations} onClose={() => setTimeMapModalWhen(null)} />}
    </>
  );
};