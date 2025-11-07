import React, { useState, useEffect } from 'react';
import { ProjectTemplate, ProjectTemplateEvent, WhatType } from '../types';
import { TrashIcon, PlusIcon, ShareIcon } from './icons';

interface ProjectTemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: ProjectTemplate[];
    onSave: (template: ProjectTemplate) => void;
    onDelete: (templateId: number) => void;
    onShare: (templateId: number) => void;
}

const EmptyTemplateEvent: ProjectTemplateEvent = {
    whatName: '',
    whatType: WhatType.Task,
    description: '',
    durationDays: 0,
    sequence: 1
};

const EmptyTemplate: Omit<ProjectTemplate, 'id'> = {
    name: '',
    description: '',
    category: 'Work',
    events: [EmptyTemplateEvent]
};

export const ProjectTemplatesModal: React.FC<ProjectTemplatesModalProps> = ({ isOpen, onClose, templates, onSave, onDelete, onShare }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [formData, setFormData] = useState<Omit<ProjectTemplate, 'id'>>(EmptyTemplate);

    useEffect(() => {
        if (!isOpen) {
            setSelectedTemplate(null);
            setIsCreatingNew(false);
        }
    }, [isOpen]);
    
    useEffect(() => {
        if(selectedTemplate && !isCreatingNew) {
            setFormData(selectedTemplate);
        }
    }, [selectedTemplate, isCreatingNew]);

    if (!isOpen) return null;
    
    const handleSelectTemplate = (template: ProjectTemplate) => {
        setIsCreatingNew(false);
        setSelectedTemplate(template);
    };
    
    const handleCreateNew = () => {
        setIsCreatingNew(true);
        setSelectedTemplate(null);
        setFormData(EmptyTemplate);
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleEventChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newEvents = [...formData.events];
        const eventToUpdate = { ...newEvents[index], [name]: value };
        
        if(name === 'durationDays') {
            eventToUpdate.durationDays = Number(value)
        }
        
        newEvents[index] = eventToUpdate;
        setFormData(prev => ({ ...prev, events: newEvents }));
    };
    
    const addEventField = () => {
        const newEvent = {
            ...EmptyTemplateEvent,
            sequence: formData.events.length + 1
        };
        setFormData(prev => ({...prev, events: [...prev.events, newEvent]}));
    }
    
    const removeEventField = (index: number) => {
        setFormData(prev => ({...prev, events: prev.events.filter((_, i) => i !== index)}));
    }
    
    const handleSave = () => {
        let templateToSave: ProjectTemplate;
        if(isCreatingNew) {
            templateToSave = { ...formData, id: Date.now() };
        } else if (selectedTemplate) {
            templateToSave = { ...formData, id: selectedTemplate.id };
        } else {
            return;
        }
        onSave(templateToSave);
        setSelectedTemplate(templateToSave);
        setIsCreatingNew(false);
    };

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50">
            <div className="bg-secondary border border-primary rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold">Project Templates</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none">&times;</button>
                </div>

                <div className="grid grid-cols-3 gap-6 flex-grow min-h-0">
                    {/* List */}
                    <div className="col-span-1 border-r border-primary pr-4 overflow-y-auto">
                        <button onClick={handleCreateNew} className="w-full text-center p-2 mb-2 rounded-md bg-wha-blue text-white font-semibold hover:bg-blue-600 transition">
                            + Create New
                        </button>
                        <div className="space-y-2">
                           {templates.map(t => (
                               <button 
                                key={t.id} 
                                onClick={() => handleSelectTemplate(t)}
                                className={`w-full text-left p-2 rounded-md transition ${selectedTemplate?.id === t.id && !isCreatingNew ? 'bg-wha-blue/30' : 'bg-tertiary hover:bg-wha-blue/20'}`}
                               >
                                {t.name}
                               </button>
                           ))}
                        </div>
                    </div>
                    {/* Editor */}
                    <div className="col-span-2 overflow-y-auto pr-2">
                      {(selectedTemplate || isCreatingNew) && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-primary">{isCreatingNew ? 'New Template' : 'Edit Template'}</h3>
                             <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Template Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleFormChange} rows={2} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                             </div>
                             <h4 className="text-lg font-semibold text-primary pt-2 border-t border-primary">Template Events</h4>
                             <div className="space-y-3">
                                 {formData.events.map((event, index) => (
                                     <div key={index} className="bg-tertiary p-3 rounded-md space-y-2 relative">
                                        <button onClick={() => removeEventField(index)} className="absolute top-2 right-2 p-1 text-secondary hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-secondary">Event Name</label>
                                                <input type="text" name="whatName" value={event.whatName} onChange={(e) => handleEventChange(index, e)} className="w-full text-sm p-1 bg-input border border-primary rounded-md" />
                                            </div>
                                             <div>
                                                <label className="text-xs text-secondary">Days from Start</label>
                                                <input type="number" name="durationDays" value={event.durationDays} onChange={(e) => handleEventChange(index, e)} className="w-full text-sm p-1 bg-input border border-primary rounded-md" />
                                            </div>
                                        </div>
                                     </div>
                                 ))}
                             </div>
                             <button onClick={addEventField} className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md bg-tertiary hover:bg-wha-blue/30">
                                 <PlusIcon className="h-4 w-4" />
                                 <span>Add Event</span>
                             </button>
                             <div className="flex justify-end items-center pt-4 space-x-2">
                                {!isCreatingNew && selectedTemplate && (
                                    <button 
                                        onClick={() => onDelete(selectedTemplate.id)} 
                                        className="px-5 py-2 rounded-md bg-tertiary text-secondary hover:bg-red-800 hover:text-primary"
                                    >
                                        Delete
                                    </button>
                                )}
                                <div className="flex-grow" /> {/* Spacer */}
                                {!isCreatingNew && selectedTemplate && (
                                    <button
                                        onClick={() => onShare(selectedTemplate.id)}
                                        type="button"
                                        className="p-2.5 rounded-md bg-tertiary text-secondary hover:bg-wha-blue/30 transition-colors"
                                        title="Share Template"
                                    >
                                        <ShareIcon className="h-5 w-5" />
                                    </button>
                                )}
                                <button onClick={handleSave} className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600">Save Template</button>
                            </div>
                        </div>
                      )}
                    </div>
                </div>
            </div>
        </div>
    );
};