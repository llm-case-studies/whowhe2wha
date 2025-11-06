import React, { useState } from 'react';
import { Project } from '../types';
import { PROJECT_CATEGORIES } from '../constants';

interface AddProjectModalProps {
    onSave: (projectData: Omit<Project, 'id'>) => void;
    onClose: () => void;
}

const projectStatusOptions: Project['status'][] = ['Active', 'On Hold', 'Completed'];
const colorOptions = ['blue', 'green', 'pink', 'purple', 'orange', 'yellow'];


export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(PROJECT_CATEGORIES[0]);
    const [status, setStatus] = useState<Project['status']>('Active');
    const [color, setColor] = useState('blue');

    const isFormValid = name.trim() !== '' && category.trim() !== '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        onSave({
            name,
            description,
            status,
            color,
            category,
        });
    };

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-project-title">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="add-project-title" className="text-2xl font-bold">Add New Project</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-secondary mb-1">Project Name</label>
                        <input
                            id="projectName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                            placeholder="e.g., Startup Fundraising (Series A)"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="projectDesc" className="block text-sm font-medium text-secondary mb-1">Description</label>
                        <textarea
                            id="projectDesc"
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                            placeholder="e.g., Secure Series A funding for the whowhe2wha concept."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="projectCategory" className="block text-sm font-medium text-secondary mb-1">Category</label>
                            <select
                                id="projectCategory"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                            >
                                {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="projectStatus" className="block text-sm font-medium text-secondary mb-1">Status</label>
                            <select
                                id="projectStatus"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Project['status'])}
                                className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                            >
                                {projectStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="projectColor" className="block text-sm font-medium text-secondary mb-1">Color Tag</label>
                        <select
                            id="projectColor"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none"
                        >
                            {colorOptions.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-tertiary disabled:cursor-not-allowed"
                        >
                            Save Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};