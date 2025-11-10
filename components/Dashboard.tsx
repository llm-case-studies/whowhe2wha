import React, { useState } from 'react';
import { EventNode, Project, Location, Contact, ViewMode, TimelineScale, TierConfig, MainView } from '../types';
import { ViewControls } from './ViewControls';
import { TimelineView } from './TimelineView';
import { RhythmicGridView } from './RhythmicGridView';
import { EventCard } from './EventCard';
import { ProjectCard } from './ProjectCard';
import { TierConfigModal } from './TierConfigModal';
import { LocationDetailModal } from './LocationDetailModal';
import { TimeMapModal } from './TimeMapModal';
import { ContactsView } from './ContactsView';
import { useI18n } from '../hooks/useI18n';

interface DashboardProps {
  mainView: MainView;
  setMainView: (view: MainView) => void;
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
  onOpenProjectTemplates: () => void;
  onShareProject: (projectId: number) => void;
}

const initialTierConfig: TierConfig = [
  { id: 'tier-1', name: 'Primary', categories: ['Work', 'Health', 'Finance'] },
  { id: 'tier-2', name: 'Secondary', categories: ['Home', 'Personal'] },
];

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const {
    mainView, setMainView,
    events, allEvents, projects, locations, contacts, 
    onAddEvent, onEditEvent, onDeleteEvent, 
    onAddProject, onEditProject, onDeleteProject,
    onAddContact, onEditContact, onDeleteContact,
    onAddLocation, onEditLocation, onDeleteLocation,
    selectedProjectId, onProjectSelect, onOpenProjectTemplates,
    onShareProject
  } = props;

  const [viewMode, setViewMode] = useState<ViewMode>('stream');
  const [timelineScale, setTimelineScale] = useState<TimelineScale>('month');
  const [timelineDate, setTimelineDate] = useState(new Date('2025-11-15T12:00:00Z'));
  const { t } = useI18n();
  
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

  const unscheduledEvents = events.filter(e => !e.when).sort((a,b) => a.id - b.id);
  const scheduledEvents = events.filter(e => !!e.when).sort((a, b) => new Date(a.when!.timestamp).getTime() - new Date(b.when!.timestamp).getTime());

  return (
    <div className="flex flex-col h-full min-h-0">
      <ViewControls
        mainView={mainView}
        setMainView={setMainView}
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
        onOpenTemplatesClick={onOpenProjectTemplates}
        selectedHolidayCategories={selectedHolidayCategories}
        setSelectedHolidayCategories={setSelectedHolidayCategories}
        selectedProjectCategories={selectedProjectCategories}
        setSelectedProjectCategories={setSelectedProjectCategories}
        onConfigureTiersClick={() => setIsTierConfigModalOpen(true)}
      />

      <div className="flex-grow min-h-0">
        {mainView === 'contacts' && (
          <ContactsView
              contacts={contacts}
              locations={locations}
              onAddContact={onAddContact}
              onEditContact={onEditContact}
              onDeleteContact={onDeleteContact}
              onLocationClick={setLocationDetailModal}
          />
        )}

        {mainView === 'dashboard' && (
          <div className="h-full">
            {viewMode === 'stream' && (
              <div className="flex md:flex-row flex-col gap-8 h-full min-h-0">
                <div className="md:w-2/3 w-full h-full overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                  {unscheduledEvents.length > 0 && (
                    <div className="mb-10">
                       <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary">{t('unscheduledEvents')}</h2>
                       <div className="space-y-4">
                          {unscheduledEvents.map(event => {
                            const project = projects.find(p => p.id === event.projectId);
                            return (
                              <EventCard 
                                key={event.id} 
                                event={event} 
                                project={project}
                                locations={locations} 
                                onLocationClick={setLocationDetailModal} 
                                onWhenClick={(w) => setTimeMapModalWhen(w)} 
                                onEdit={onEditEvent}
                                onDelete={onDeleteEvent}
                              />
                            );
                          })}
                       </div>
                    </div>
                  )}
                  
                  <h2 className="text-xl font-bold text-primary">{t('eventStream')}</h2>
                  {scheduledEvents.length > 0 ? (
                      scheduledEvents.map(event => {
                        const project = projects.find(p => p.id === event.projectId);
                        return (
                          <EventCard 
                            key={`${event.id}-${event.when!.timestamp}`} 
                            event={event} 
                            project={project}
                            locations={locations} 
                            onLocationClick={setLocationDetailModal} 
                            onWhenClick={(w) => setTimeMapModalWhen(w)} 
                            onEdit={onEditEvent}
                            onDelete={onDeleteEvent}
                          />
                        );
                      })
                  ) : (
                    <div className="text-center py-16 px-6 bg-secondary rounded-lg">
                        <h3 className="text-lg font-semibold text-primary">{t('noScheduledEvents')}</h3>
                        <p className="text-tertiary mt-2">{t('noScheduledEventsDesc')}</p>
                    </div>
                  )}
                </div>
                <div className="md:w-1/3 w-full h-full overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                  <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-primary">{t('projects')}</h2>
                      {selectedProjectId && (
                          <button onClick={() => onProjectSelect(selectedProjectId)} className="text-sm text-wha-blue hover:underline">{t('clearFilter')}</button>
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
                      onShare={onShareProject}
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
                  onEditEvent={onEditEvent}
                  onDeleteEvent={onDeleteEvent}
                  onScaleChange={setTimelineScale}
              />
            )}

            {viewMode === 'grid' && (
              <RhythmicGridView
                events={events}
                projects={projects}
              />
            )}
          </div>
        )}
      </div>

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
    </div>
  );
};
