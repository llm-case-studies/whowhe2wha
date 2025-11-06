import React, { useState } from 'react';
import { Project, EventNode, Location, When } from '../types';
import { EventCard } from './EventCard';

interface ProjectCardProps {
  project: Project;
  events: EventNode[];
  locations: Location[];
  onLocationClick: (location: Location) => void;
  onWhenClick: (when: When) => void;
}

const statusColorMap = {
    'Active': 'text-status-active-text bg-status-active',
    'Completed': 'text-status-completed-text bg-status-completed',
    'On Hold': 'text-status-onhold-text bg-status-onhold',
};

const ChevronDownIcon = ({ className = '' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const ProjectCard: React.FC<ProjectCardProps> = ({ project, events, locations, onLocationClick, onWhenClick }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const sortedEvents = [...events].sort((a,b) => new Date(a.when.timestamp).getTime() - new Date(b.when.timestamp).getTime());

    return (
        <div className="bg-secondary/70 border border-secondary rounded-lg overflow-hidden">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center p-4 bg-secondary/50 hover:bg-tertiary transition duration-200"
                aria-expanded={isExpanded}
                aria-controls={`project-events-${project.id}`}
            >
                <div className="text-left">
                    <h3 className="text-xl font-bold text-primary">{project.name}</h3>
                    <p className="text-secondary text-sm">{project.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[project.status]}`}>
                        {project.status}
                    </span>
                    <ChevronDownIcon className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            
            {isExpanded && (
                <div id={`project-events-${project.id}`} className="p-4 space-y-4">
                    {sortedEvents.length > 0 ? (
                        sortedEvents.map(event => <EventCard key={event.id} event={event} locations={locations} onLocationClick={onLocationClick} onWhenClick={onWhenClick} />)
                    ) : (
                        <div className="text-center text-tertiary py-4">No events in this project yet.</div>
                    )}
                </div>
            )}
        </div>
    );
};