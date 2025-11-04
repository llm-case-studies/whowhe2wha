import React from 'react';
import { EventNode, Location, Project, When, ViewMode, TimelineScale } from '../types';
import { EventCard } from './EventCard';
import { ProjectCard } from './ProjectCard';
import { TimelineView } from './TimelineView';

interface DashboardProps {
  projects: Project[];
  events: EventNode[];
  isLoading: boolean;
  error: string | null;
  isSearched: boolean;
  onLocationClick: (location: Location) => void;
  onWhenClick: (when: When) => void;
  viewMode: ViewMode;
  timelineDate: Date;
  timelineScale: TimelineScale;
  setTimelineDate: (date: Date) => void;
  selectedHolidayCategories: string[];
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  projects, events, isLoading, error, isSearched, onLocationClick, onWhenClick,
  viewMode, timelineDate, timelineScale, setTimelineDate, selectedHolidayCategories
}) => {
  if (isLoading) {
    return (
        <div className="text-center py-10">
            <div className="text-secondary">Querying the context graph...</div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 px-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">{error}</div>;
  }
  
  if (viewMode === 'timeline') {
    return (
      <TimelineView 
        events={events} 
        projects={projects} 
        currentDate={timelineDate} 
        scale={timelineScale} 
        selectedHolidayCategories={selectedHolidayCategories}
        setTimelineDate={setTimelineDate}
      />
    );
  }

  // Default to 'stream' view
  const renderContent = () => {
    if (isSearched) {
      if (events.length === 0) {
        return (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-2">No Connections Found</h3>
            <p className="text-secondary">The context engine couldn't find any events matching your query. Try a different search.</p>
          </div>
        );
      }
      return events.map(event => <EventCard key={event.id} event={event} onLocationClick={onLocationClick} onWhenClick={onWhenClick} />);
    }

    if (projects.length === 0 && events.length > 0) {
      // Handle case where search results might only contain events without their projects
       return events.map(event => <EventCard key={event.id} event={event} onLocationClick={onLocationClick} onWhenClick={onWhenClick} />);
    }

    return projects
      .sort((a,b) => a.id - b.id)
      .map(project => {
        const projectEvents = events.filter(e => e.projectId === project.id);
        return <ProjectCard key={project.id} project={project} events={projectEvents} onLocationClick={onLocationClick} onWhenClick={onWhenClick} />;
      });
  };

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-bold tracking-tight text-primary border-b border-primary pb-2">
        {isSearched ? "Query Results" : "Project Stream"}
      </h2>
      {renderContent()}
    </div>
  );
};
