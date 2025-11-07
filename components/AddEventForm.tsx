import React, { useState, useEffect } from 'react';
import { Project, Location, Contact, EventNode, WhatType, EntityType } from '../types';
import { LocationSelectModal } from './LocationSelectModal';

interface AddEventModalProps {
  projects: Project[];
  locations: Location[];
  contacts: Contact[];
  eventToEdit?: EventNode | null;
  preselectedProjectId?: number | null;
  onClose: () => void;
  onSave: (event: EventNode) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ projects, locations, contacts, eventToEdit, preselectedProjectId, onClose, onSave }) => {
  const [whatName, setWhatName] = useState('');
  const [description, setDescription] = useState('');
  const [whatType, setWhatType] = useState<WhatType>(WhatType.Appointment);
  const [projectId, setProjectId] = useState<number | ''>('');
  const [when, setWhen] = useState('');
  const [whoIds, setWhoIds] = useState<string[]>([]);
  const [whereId, setWhereId] = useState<string | ''>('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Recurrence state
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setWhatName(eventToEdit.what.name);
      setDescription(eventToEdit.what.description || '');
      setWhatType(eventToEdit.what.whatType);
      setProjectId(eventToEdit.projectId);
      // Format timestamp for datetime-local input
      const localDateTime = new Date(new Date(eventToEdit.when.timestamp).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setWhen(localDateTime);
      setWhereId(eventToEdit.whereId);
      // FIX: The original ID parsing was brittle and caused a type error.
      // Switched to a more robust name-based lookup to find the correct contact IDs.
      setWhoIds(eventToEdit.who.map(w => contacts.find(c => c.name === w.name)?.id).filter(Boolean) as string[]);
      
      if (eventToEdit.recurrence) {
        setIsRecurring(true);
        setFrequency(eventToEdit.recurrence.frequency);
        setRecurrenceEndDate(eventToEdit.recurrence.endDate ? eventToEdit.recurrence.endDate.split('T')[0] : '');
      } else {
        setIsRecurring(false);
        setFrequency('weekly');
        setRecurrenceEndDate('');
      }

    } else {
      if (preselectedProjectId) {
          setProjectId(preselectedProjectId);
      } else if (projects.length > 0) {
          setProjectId(projects[0].id)
      }
      // Reset recurrence for new event
      setIsRecurring(false);
      setFrequency('weekly');
      setRecurrenceEndDate('');
    }
  }, [eventToEdit, preselectedProjectId, projects, contacts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatName || !projectId || !when || !whereId) return;

    const whenDate = new Date(when);

    const eventData: EventNode = {
      id: eventToEdit ? eventToEdit.id : Date.now(),
      projectId: projectId,
      what: { 
        id: eventToEdit ? eventToEdit.what.id :`what-${Date.now()}`, 
        name: whatName, 
        description: description,
        type: EntityType.What, 
        whatType: whatType 
      },
      when: { 
        id: eventToEdit ? eventToEdit.when.id :`when-${Date.now()}`, 
        name: whenDate.toLocaleString(), 
        timestamp: whenDate.toISOString(), 
        display: whenDate.toLocaleString(), 
        type: EntityType.When 
      },
      who: whoIds.map(id => {
          const contact = contacts.find(c => c.id === id);
          return { id: `who-${id}`, name: contact?.name || 'Unknown', type: EntityType.Who };
      }),
      whereId: whereId,
      recurrence: isRecurring ? {
        frequency: frequency,
        endDate: recurrenceEndDate ? new Date(recurrenceEndDate).toISOString() : undefined,
      } : undefined,
    };
    onSave(eventData);
  };
  
  const handleLocationSelect = (location: Location) => {
      setWhereId(location.id);
      setIsLocationModalOpen(false);
  }

  return (
    <>
      <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-event-title">
        <form onSubmit={handleSubmit} className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 id="add-event-title" className="text-2xl font-bold">{eventToEdit ? 'Edit Event' : 'Add New Event'}</h2>
            <button type="button" onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label htmlFor="whatName" className="block text-sm font-medium text-secondary mb-1">What (Event/Step Name)</label>
                    <input type="text" id="whatName" value={whatName} onChange={(e) => setWhatName(e.target.value)} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                </div>
                <div>
                     <label htmlFor="whatType" className="block text-sm font-medium text-secondary mb-1">Event Type</label>
                    <select id="whatType" value={whatType} onChange={(e) => setWhatType(e.target.value as WhatType)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                        {/* FIX: Corrected a type error where the 'type' variable was inferred as 'unknown'. Added an explicit cast to string to ensure type safety. */}
                        {Object.values(WhatType).map(type => <option key={type as string} value={type as string}>{(type as string).charAt(0).toUpperCase() + (type as string).slice(1)}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="projectId" className="block text-sm font-medium text-secondary mb-1">Project</label>
                    <select id="projectId" value={projectId} onChange={(e) => setProjectId(Number(e.target.value))} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                        <option value="" disabled>Select a project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="when" className="block text-sm font-medium text-secondary mb-1">When</label>
                    <input type="datetime-local" id="when" value={when} onChange={(e) => setWhen(e.target.value)} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
                </div>
                <div>
                    <label htmlFor="where" className="block text-sm font-medium text-secondary mb-1">Where</label>
                    <button type="button" onClick={() => setIsLocationModalOpen(true)} className="w-full text-left px-3 py-2 bg-input border border-primary rounded-lg truncate">
                        {whereId ? locations.find(l=>l.id === whereId)?.alias || locations.find(l=>l.id === whereId)?.name : 'Select a location...'}
                    </button>
                </div>
            </div>
             <div className="space-y-2 pt-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isRecurring"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="h-4 w-4 rounded bg-input border-primary text-wha-blue focus:ring-wha-blue"
                    />
                    <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-secondary">
                        This event repeats
                    </label>
                </div>

                {isRecurring && (
                    <div className="grid grid-cols-2 gap-4 p-3 bg-tertiary/50 rounded-lg">
                        <div>
                            <label htmlFor="frequency" className="block text-xs font-medium text-secondary mb-1">Frequency</label>
                            <select 
                                id="frequency" 
                                value={frequency} 
                                onChange={(e) => setFrequency(e.target.value as any)} 
                                className="w-full px-3 py-2 text-sm bg-input border border-primary rounded-lg"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="recurrenceEndDate" className="block text-xs font-medium text-secondary mb-1">End Date (optional)</label>
                            <input 
                                type="date" 
                                id="recurrenceEndDate" 
                                value={recurrenceEndDate} 
                                onChange={(e) => setRecurrenceEndDate(e.target.value)} 
                                className="w-full px-3 py-2 text-sm bg-input border border-primary rounded-lg" 
                            />
                        </div>
                    </div>
                )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition">{eventToEdit ? 'Save Changes' : 'Save Event'}</button>
          </div>
        </form>
      </div>
      {isLocationModalOpen && <LocationSelectModal locations={locations} onClose={() => setIsLocationModalOpen(false)} onSelect={handleLocationSelect} onAddNew={() => {}} onUrlSubmit={() => {}} />}
    </>
  );
};