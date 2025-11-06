
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500/20 text-blue-300 border-blue-400',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-400',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-400',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
  green: 'bg-green-500/20 text-green-300 border-green-400',
  pink: 'bg-pink-500/20 text-pink-300 border-pink-400',
};

const statusClasses: Record<string, string> = {
    'Active': 'bg-green-500',
    'On Hold': 'bg-yellow-500',
    'Completed': 'bg-gray-500',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const colorClass = colorClasses[project.color] || colorClasses['blue'];
  const statusClass = statusClasses[project.status] || statusClasses['Completed'];

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${colorClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-primary">{project.name}</h4>
          <p className="text-sm text-secondary mt-1">{project.description}</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold">
           <span className={`w-2 h-2 rounded-full ${statusClass}`}></span>
           <span>{project.status}</span>
        </div>
      </div>
    </div>
  );
};
