import React from 'react';
import { Project } from '../types';
import { PencilIcon, TrashIcon, CalendarPlusIcon } from './icons';
import { PROJECT_COLOR_CLASSES } from '../constants';

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
  onAddEvent: () => void;
}

const statusClasses: Record<string, string> = {
    'Active': 'bg-green-500',
    'On Hold': 'bg-yellow-500',
    'Completed': 'bg-gray-500',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isSelected, onClick, onEdit, onDelete, onAddEvent }) => {
  const colorClass = PROJECT_COLOR_CLASSES[project.color] || PROJECT_COLOR_CLASSES['blue'];
  const statusClass = statusClasses[project.status] || statusClasses['Completed'];
  const selectedClass = isSelected ? 'ring-2 ring-wha-blue shadow-lg' : 'hover:shadow-md';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
  };
  
  const handleAddEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddEvent();
  };

  return (
    <div 
        className={`border-l-4 p-4 rounded-r-lg cursor-pointer transition-all duration-200 ${colorClass} ${selectedClass}`}
        onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-primary pr-2">{project.name}</h4>
        <div className="flex items-center space-x-2 text-xs font-semibold flex-shrink-0">
           <span className={`w-2 h-2 rounded-full ${statusClass}`}></span>
           <span>{project.status}</span>
        </div>
      </div>
       <p className="text-sm text-secondary mt-1">{project.description}</p>
       <div className="flex justify-end items-center space-x-1 mt-2">
          {isSelected && (
            <button onClick={handleAddEvent} className="p-1.5 rounded-full text-secondary/70 hover:bg-tertiary hover:text-green-400 transition-colors duration-200" title="Add Event to this Project">
                <CalendarPlusIcon className="h-4 w-4" />
            </button>
          )}
          <button onClick={handleEdit} className="p-1.5 rounded-full text-secondary/70 hover:bg-tertiary hover:text-primary transition-colors duration-200" title="Edit Project">
              <PencilIcon className="h-4 w-4" />
          </button>
          <button onClick={handleDelete} className="p-1.5 rounded-full text-secondary/70 hover:bg-tertiary hover:text-red-500 transition-colors duration-200" title="Delete Project">
              <TrashIcon className="h-4 w-4" />
          </button>
      </div>
    </div>
  );
};