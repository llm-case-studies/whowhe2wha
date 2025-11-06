
import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECT_CATEGORIES } from '../constants';

interface AddProjectModalProps {
  onClose: () => void;
  onSave: (newProject: Project) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(PROJECT_CATEGORIES[0]);
  const [color, setColor] = useState('blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now(),
      name,
      description,
      category,
      color,
      status: 'Active',
    };
    onSave(newProject);
  };

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
        {/* Form fields here */}
        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold">Save Project</button>
        </div>
      </form>
    </div>
  );
};
