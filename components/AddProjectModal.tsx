import React, { useState, useEffect } from 'react';
import { Project, ProjectTemplate } from '../types';
import { PROJECT_CATEGORIES } from '../constants';
import { useI18n } from '../hooks/useI18n';

interface AddProjectModalProps {
  projectToEdit?: Project | null;
  projectTemplates: ProjectTemplate[];
  onClose: () => void;
  onSave: (project: Project, templateId?: number, startDate?: string) => void;
}

const colorOptions = ['blue', 'purple', 'orange', 'yellow', 'green', 'pink'];

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ projectToEdit, projectTemplates, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(PROJECT_CATEGORIES[0]);
  const [color, setColor] = useState('blue');
  const [status, setStatus] = useState<'Active' | 'On Hold' | 'Completed'>('Active');
  const [templateId, setTemplateId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const { t } = useI18n();


  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
      setCategory(projectToEdit.category);
      setColor(projectToEdit.color);
      setStatus(projectToEdit.status);
    }
  }, [projectToEdit]);
  
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value;
      setTemplateId(selectedId);
      if (selectedId) {
          const template = projectTemplates.find(t => t.id === Number(selectedId));
          if (template && !name) {
              setName(template.name);
              setDescription(template.description);
              setCategory(template.category);
          }
      } else {
          // Clear start date if "Start from scratch" is chosen
          setStartDate('');
      }
  }

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
    onSave(newProject, templateId ? Number(templateId) : undefined, startDate);
  };

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-project-title">
      <form onSubmit={handleSubmit} className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
         <div className="flex justify-between items-center mb-6">
            <h2 id="add-project-title" className="text-2xl font-bold">{projectToEdit ? t('editProjectTitle') : t('addProjectTitle')}</h2>
             <button type="button" onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label={t('close')}>&times;</button>
        </div>
       
        <div className="space-y-4">
            {!projectToEdit && (
                 <div>
                    <label htmlFor="template" className="block text-sm font-medium text-secondary mb-1">{t('fromTemplate')}</label>
                    <select id="template" value={templateId} onChange={handleTemplateChange} className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                        <option value="">{t('startFromScratch')}</option>
                        {projectTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            )}
             {templateId && !projectToEdit && (
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-secondary mb-1">{t('projectStartDate')}</label>
                    <input type="datetime-local" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                    <p className="text-xs text-secondary mt-1">{t('projectStartDateDesc')}</p>
                </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">{t('projectName')}</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">{t('descriptionLabel')}</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-secondary mb-1">{t('category')}</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                        {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-secondary mb-1">{t('status')}</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary mb-1">{t('colorTag')}</label>
                <div className="flex space-x-2">
                    {colorOptions.map(c => (
                        <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full bg-${c}-500/50 border-2 ${color === c ? `border-${c}-400 ring-2 ring-offset-2 ring-offset-secondary ring-${c}-400` : 'border-transparent'}`}></button>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary">{t('cancel')}</button>
          <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold">{projectToEdit ? t('saveChanges') : t('saveProject')}</button>
        </div>
      </form>
    </div>
  );
};
