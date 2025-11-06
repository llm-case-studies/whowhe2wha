
import React, { useState } from 'react';
import { EventNode, Project, Location, Contact, ViewMode, TimelineScale, TierConfig } from '../types';
import { ViewControls } from './ViewControls';
import { TimelineView } from './TimelineView';
import { EventCard } from './EventCard';
import { ProjectCard } from './ProjectCard';
import { TierConfigModal } from './TierConfigModal';
import { MapModal } from './MapModal';
import { TimeMapModal } from './TimeMapModal';
import { AddEventModal } from './AddEventForm';

interface DashboardProps {
  events: EventNode[];
  allEvents: EventNode[];
  projects: Project[];
  locations: Location[];
  contacts: Contact[];
  onAddEvent: () => void;
  onAddProject: () => void;
  onAddContact: () => void;
  onAddLocation: (query: string) => void;
}

const initialTierConfig: TierConfig = [
  { id: 'tier-1', name: 'Primary', categories: ['Work', 'Health', 'Finance'] },
  { id: 'tier-2', name: 'Secondary', categories: ['Home', 'Personal'] },
];

export const Dashboard: React.FC<DashboardProps> = ({
  events,
  allEvents,
  projects,
  locations,
  contacts,
  onAddEvent,
  onAddProject,
  onAddContact,
  onAddLocation,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('stream');
  const [timelineScale, setTimelineScale] = useState<TimelineScale>('month');
  const [timelineDate, setTimelineDate] = useState(new Date('2025-11-15T12:00:00Z'));
  
  const [selectedHolidayCategories, setSelectedHolidayCategories] = useState<string[]>(['US']);
  const [selectedProjectCategories, setSelectedProjectCategories] = useState<string[]>(() => projects.map(p => p.category));
  const [isTierConfigModalOpen, setIsTierConfigModalOpen] = useState(false);
  const [tierConfig, setTierConfig] = useState<TierConfig>(initialTierConfig);

  const [mapModalLocation, setMapModalLocation] = useState<Location | null>(null);
  const [timeMapModalWhen, setTimeMapModalWhen] = useState<EventNode['when'] | null>(null);
  const [addEventWithContact, setAddEventWithContact] = useState<Contact | null>(null);
  
  const handleSaveTierConfig = (newConfig: TierConfig) => {
    setTierConfig(newConfig);
    setIsTierConfigModalOpen(false);
  };

  const handleScheduleFromMap = (contact: Contact) => {
    setMapModalLocation(null);
    setAddEventWithContact(contact);
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
        onAddEventClick={onAddEvent}
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
                  <EventCard key={event.id} event={event} locations={locations} onLocationClick={setMapModalLocation} onWhenClick={setTimeMapModalWhen} />
                ))
            ) : (
              <p className="text-tertiary">No events to display.</p>
            )}
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary">Projects</h2>
            {visibleProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
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
      {mapModalLocation && <MapModal location={mapModalLocation} allEvents={allEvents} allLocations={locations} onClose={() => setMapModalLocation(null)} onSchedule={handleScheduleFromMap} />}
      {timeMapModalWhen && <TimeMapModal when={timeMapModalWhen} allEvents={allEvents} allLocations={locations} onClose={() => setTimeMapModalWhen(null)} />}
      {addEventWithContact && <AddEventModal projects={projects} locations={locations} contacts={contacts} initialContact={addEventWithContact} onClose={() => setAddEventWithContact(null)} onSave={() => setAddEventWithContact(null)} />}
    </>
  );
};
