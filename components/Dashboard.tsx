import React from 'react';
import { EventNode, Location, Project, When } from '../types';
import { EventCard } from './EventCard';
import { ProjectCard } from './ProjectCard';

interface DashboardProps {
  projects: Project[];
  events: EventNode[];
  isLoading: boolean;
  error: string | null;
  isSearched: boolean;
  onLocationClick: (location: Location) => void;
  onWhenClick: (when: When) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, events, isLoading, error, isSearched, onLocationClick, onWhenClick }) => {
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

    return projects
      .sort((a,b) => a.id - b.id)
      .map(project => {
        const projectEvents = events.filter(e => e.projectId === project.id);
        return <ProjectCard key={project.id} project={project} events={projectEvents} onLocationClick={onLocationClick} onWhenClick={onWhenClick} />;
      });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-primary border-b border-primary pb-2">
        {isSearched ? "Query Results" : "Project Stream"}
      </h2>
      {renderContent()}
    </div>
  );
};
