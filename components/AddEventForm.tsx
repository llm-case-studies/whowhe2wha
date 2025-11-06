
import React, { useState } from 'react';
import { Project, Location, Contact, EventNode, WhatType, EntityType } from '../types';
import { LocationSelectModal } from './LocationSelectModal';

interface AddEventModalProps {
  projects: Project[];
  locations: Location[];
  contacts: Contact[];
  initialContact?: Contact | null;
  onClose: () => void;
  onSave: (newEvent: EventNode) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ projects, locations, contacts, initialContact, onClose, onSave }) => {
  const [whatName, setWhatName] = useState('');
  const [whatType, setWhatType] = useState<WhatType>(WhatType.Appointment);
  const [projectId, setProjectId] = useState<number | ''>(projects.length > 0 ? projects[0].id : '');
  const [when, setWhen] = useState('');
  const [whoIds, setWhoIds] = useState<string[]>(initialContact ? [initialContact.id] : []);
  const [whereId, setWhereId] = useState<string | ''>('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatName || !projectId || !when || !whereId) return;

    const newEvent: EventNode = {
      id: Date.now(),
      projectId: projectId,
      what: { id: `what-${Date.now()}`, name: whatName, type: EntityType.What, whatType: whatType },
      when: { id: `when-${Date.now()}`, name: new Date(when).toLocaleString(), timestamp: new Date(when).toISOString(), display: new Date(when).toLocaleString(), type: EntityType.When },
      who: whoIds.map(id => {
          const contact = contacts.find(c => c.id === id);
          return { id: `who-${id}`, name: contact?.name || 'Unknown', type: EntityType.Who };
      }),
      whereId: whereId,
    };
    onSave(newEvent);
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
            <h2 id="add-event-title" className="text-2xl font-bold">Add New Event</h2>
            <button type="button" onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="whatName" className="block text-sm font-medium text-secondary mb-1">What is happening?</label>
              <input type="text" id="whatName" value={whatName} onChange={(e) => setWhatName(e.target.value)} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
             <div>
              <label htmlFor="whatType" className="block text-sm font-medium text-secondary mb-1">Event Type</label>
              <select id="whatType" value={whatType} onChange={(e) => setWhatType(e.target.value as WhatType)} className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                  {Object.values(WhatType).map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-secondary mb-1">Project</label>
              <select id="projectId" value={projectId} onChange={(e) => setProjectId(Number(e.target.value))} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg">
                <option value="" disabled>Select a project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="when" className="block text-sm font-medium text-secondary mb-1">When?</label>
              <input type="datetime-local" id="when" value={when} onChange={(e) => setWhen(e.target.value)} required className="w-full px-3 py-2 bg-input border border-primary rounded-lg" />
            </div>
            <div>
              <label htmlFor="where" className="block text-sm font-medium text-secondary mb-1">Where?</label>
              <button type="button" onClick={() => setIsLocationModalOpen(true)} className="w-full text-left px-3 py-2 bg-input border border-primary rounded-lg">
                  {whereId ? locations.find(l=>l.id === whereId)?.name : 'Select a location...'}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition">Save Event</button>
          </div>
        </form>
      </div>
      {isLocationModalOpen && <LocationSelectModal locations={locations} onClose={() => setIsLocationModalOpen(false)} onSelect={handleLocationSelect} onAddNew={() => {}} onUrlSubmit={() => {}} />}
    </>
  );
};
