
import React from 'react';
import { Project, EventNode, Location, When } from '../types';
import { ProjectCard } from './ProjectCard';

interface DashboardProps {
    projects: Project[];
    events: EventNode[];
    onLocationClick: (location: Location) => void;
    onWhenClick: (when: When) => void;
    onAddEventClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, events, onLocationClick, onWhenClick, onAddEventClick }) => {
    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={onAddEventClick}
                    className="px-5 py-2 bg-to-orange text-white font-bold rounded-md hover:bg-orange-600 transition duration-200"
                >
                    + Add Event
                </button>
            </div>
            {projects.length > 0 ? (
                 <div className="space-y-6">
                    {projects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            events={events.filter(e => e.projectId === project.id)}
                            onLocationClick={onLocationClick}
                            onWhenClick={onWhenClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-secondary/70 border border-secondary rounded-lg">
                    <h3 className="text-xl font-semibold text-primary">No results found.</h3>
                    <p className="text-tertiary mt-2">Try a different search query or add a new event.</p>
                </div>
            )}
        </div>
    );
};
