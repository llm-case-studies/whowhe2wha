import React, { useState } from 'react';
import { ProjectTemplate, TemplateEvent, WhatType } from '../types';
import { PROJECT_CATEGORIES } from '../constants';
import { TrashIcon } from './icons';

interface ProjectTemplatesModalProps {
    templates: ProjectTemplate[];
    onSave: (template: ProjectTemplate) => void;
    onDelete: (templateId: number) => void;
    onClose: () => void;
}

const emptyTemplate: Omit<ProjectTemplate, 'id'> = {
    name: '',
    description: '',
    category: PROJECT_CATEGORIES[0],
    events: [{ whatName: '', whatDescription: '', whatType: WhatType.Appointment }]
};

export const ProjectTemplatesModal: React.FC<ProjectTemplatesModalProps> = ({ templates, onSave, onDelete, onClose }) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | 'new' | null>(null);
    const [editingTemplate, setEditingTemplate] = useState<Omit<ProjectTemplate, 'id'> | ProjectTemplate>(emptyTemplate);

    const handleSelectTemplate = (template: ProjectTemplate) => {
        setSelectedTemplateId(template.id);
        setEditingTemplate(JSON.parse(JSON.stringify(template)));
    };

    const handleNewTemplate = () => {
        setSelectedTemplateId('new');
        setEditingTemplate(emptyTemplate);
    };

    const handleFieldChange = (field: keyof ProjectTemplate, value: any) => {
        setEditingTemplate(prev => ({ ...prev, [field]: value }));
    };

    const handleEventChange = (index: number, field: keyof TemplateEvent, value: any) => {
        const newEvents = [...editingTemplate.events];
        newEvents[index] = { ...newEvents[index], [field]: value };
        setEditingTemplate(prev => ({ ...prev, events: newEvents }));
    };

    const handleAddEvent = () => {
        const newEvents = [...editingTemplate.events, { whatName: '', whatDescription: '', whatType: WhatType.Appointment }];
        setEditingTemplate(prev => ({ ...prev, events: newEvents }));
    };
    
    const handleRemoveEvent = (index: number) => {
        if (editingTemplate.events.length <= 1) return;
        const newEvents = editingTemplate.events.filter((_, i) => i !== index);
        setEditingTemplate(prev => ({ ...prev, events: newEvents }));
    };

    const handleSave = () => {
        const templateToSave = {
            ...editingTemplate,
            id: selectedTemplateId === 'new' ? Date.now() : selectedTemplateId as number,
        };
        onSave(templateToSave);
        onClose();
    };
    
    const handleDelete = () => {
        if(selectedTemplateId && selectedTemplateId !== 'new') {
            onDelete(selectedTemplateId);
            setSelectedTemplateId(null);
            setEditingTemplate(emptyTemplate);
        }
    }
    
    const isEditing = selectedTemplateId !== null;

    return (
         <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-4xl h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 className="text-2xl font-bold">Project Templates</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none">&times;</button>
                </div>

                <div className="flex-grow flex gap-8 min-h-0">
                    {/* Left Panel: List of templates */}
                    <div className="w-1/3 flex flex-col">
                        <h3 className="text-lg font-semibold mb-2">My Templates</h3>
                        <div className="flex-grow overflow-y-auto border border-primary rounded-md p-2 space-y-2">
                             {templates.map(template => (
                                <button key={template.id} onClick={() => handleSelectTemplate(template)} className={`w-full text-left p-3 rounded-md transition ${selectedTemplateId === template.id ? 'bg-wha-blue/30' : 'bg-tertiary hover:bg-tertiary/60'}`}>
                                    <p className="font-bold text-primary">{template.name}</p>
                                    <p className="text-xs text-secondary">{template.category}</p>
                                </button>
                            ))}
                        </div>
                        <button onClick={handleNewTemplate} className="w-full mt-4 px-4 py-2 font-bold bg-to-orange text-white rounded-md hover:bg-orange-600 transition">
                            + Create New Template
                        </button>
                    </div>

                    {/* Right Panel: Editor */}
                    <div className="w-2/3 flex flex-col">
                         <h3 className="text-lg font-semibold mb-2">{selectedTemplateId === 'new' ? 'New Template' : 'Edit Template'}</h3>
                         {isEditing ? (
                             <div className="flex-grow overflow-y-auto border border-primary rounded-md p-4 space-y-4">
                                <input type="text" placeholder="Template Name" value={editingTemplate.name} onChange={e => handleFieldChange('name', e.target.value)} className="w-full text-lg font-bold p-2 bg-input border border-primary rounded-md" />
                                <textarea placeholder="Description" value={editingTemplate.description} onChange={e => handleFieldChange('description', e.target.value)} rows={2} className="w-full p-2 bg-input border border-primary rounded-md" />
                                <select value={editingTemplate.category} onChange={e => handleFieldChange('category', e.target.value)} className="w-full p-2 bg-input border border-primary rounded-md">
                                     {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                
                                <h4 className="font-semibold pt-4 border-t border-primary">Template Steps</h4>
                                <div className="space-y-3">
                                {editingTemplate.events.map((event, index) => (
                                    <div key={index} className="bg-tertiary/50 p-3 rounded-md space-y-2">
                                        <div className="flex items-center gap-2">
                                            <input type="text" placeholder={`Step ${index + 1} Name`} value={event.whatName} onChange={e => handleEventChange(index, 'whatName', e.target.value)} className="flex-grow p-2 bg-input border border-primary rounded-md" />
                                            <select value={event.whatType} onChange={e => handleEventChange(index, 'whatType', e.target.value)} className="p-2 bg-input border border-primary rounded-md">
                                                {Object.values(WhatType).map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                            </select>
                                            <button onClick={() => handleRemoveEvent(index)} disabled={editingTemplate.events.length <= 1} className="p-2 text-secondary hover:text-red-500 disabled:opacity-50"><TrashIcon/></button>
                                        </div>
                                        <textarea placeholder="Step description (optional)" value={event.whatDescription} onChange={e => handleEventChange(index, 'whatDescription', e.target.value)} rows={1} className="w-full p-2 bg-input border border-primary rounded-md" />
                                    </div>
                                ))}
                                </div>
                                <button onClick={handleAddEvent} className="w-full mt-2 text-sm font-semibold p-2 bg-tertiary hover:bg-wha-blue hover:text-white rounded-md transition">+ Add Step</button>
                             </div>
                         ) : (
                             <div className="flex-grow flex items-center justify-center border border-dashed border-primary rounded-md">
                                 <p className="text-secondary">Select a template to edit or create a new one.</p>
                             </div>
                         )}
                    </div>
                </div>

                <div className="flex justify-end items-center space-x-4 pt-6 flex-shrink-0">
                    {selectedTemplateId !== 'new' && selectedTemplateId !== null && (
                         <button onClick={handleDelete} className="px-5 py-2 rounded-md font-semibold text-red-400 hover:bg-red-900/50 transition">Delete Template</button>
                    )}
                    <div className="flex-grow"></div>
                    <button onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition">Cancel</button>
                    <button onClick={handleSave} disabled={!isEditing || !editingTemplate.name} className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 disabled:bg-tertiary transition">Save Template</button>
                </div>
            </div>
        </div>
    );
};
