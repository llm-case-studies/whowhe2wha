
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { PROJECT_CATEGORIES } from '../constants';

interface AddProjectModalProps {
  projectToEdit?: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const colorOptions = ['blue', 'purple', 'orange', 'yellow', 'green', 'pink'];

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ projectToEdit, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(PROJECT_CATEGORIES[0]);
  const [color, setColor] = useState('blue');
  const [status, setStatus] = useState<'Active' | 'On Hold' | 'Completed'>('Active');

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
      setCategory(projectToEdit.category);
      setColor(projectToEdit.color);
      setStatus(projectToEdit.status);
    }
  }, [projectToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: Project = {
      id: projectToEdit ? projectToEdit.id : Date.now(),
      name,
      description,
      category,
      color,
      status,
    };
    onSave(newProject);
  };

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-project-title">
      <form onSubmit={handleSubmit} className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
         <div className="flex justify-between items-center mb-6">
            <h2 id="add-project-title" className="text-2xl font-bold">{projectToEdit ? 'Edit Project' : 'Add New Project'}</h2>
             <button type="button" onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
        </div>
       
        <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">Project Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-secondary mb-1">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                        {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-secondary mb-1">Status</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary mb-1">Color Tag</label>
                <div className="flex space-x-2">
                    {colorOptions.map(c => (
                        <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full bg-${c}-500/50 border-2 ${color === c ? `border-${c}-400 ring-2 ring-offset-2 ring-offset-secondary ring-${c}-400` : 'border-transparent'}`}></button>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold">{projectToEdit ? 'Save Changes' : 'Save Project'}</button>
        </div>
      </form>
    </div>
  );
};
