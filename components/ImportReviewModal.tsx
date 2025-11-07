import React, { useState } from 'react';
import { ParsedEvent, Project } from '../types';

interface ImportReviewModalProps {
  parsedEvents: ParsedEvent[];
  projects: Project[];
  onClose: () => void;
  onConfirm: (projectId: number) => void;
}

export const ImportReviewModal: React.FC<ImportReviewModalProps> = ({ parsedEvents, projects, onClose, onConfirm }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const handleConfirm = () => {
    if (selectedProjectId) {
      onConfirm(Number(selectedProjectId));
    }
  };

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="import-review-title">
      <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 id="import-review-title" className="text-2xl font-bold">Review Import</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
        </div>

        <p className="text-sm text-secondary mb-4 flex-shrink-0">Found {parsedEvents.length} event(s). Please select a project to import them into.</p>

        <div className="mb-4 flex-shrink-0">
          <label htmlFor="projectId" className="block text-sm font-medium text-secondary mb-1">Import to Project:</label>
          <select
            id="projectId"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-primary rounded-lg"
          >
            <option value="" disabled>-- Select a project --</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="overflow-y-auto flex-grow border-t border-b border-primary py-4 pr-2">
          <div className="space-y-3">
            {parsedEvents.map((event, index) => (
              <div key={index} className="bg-tertiary p-3 rounded-md">
                <p className="font-semibold text-primary">{event.summary}</p>
                <p className="text-xs text-secondary mt-1">{event.startDate.toLocaleString()}</p>
                {event.location && <p className="text-xs text-secondary">Location: {event.location}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!selectedProjectId}
            className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-tertiary disabled:cursor-not-allowed"
          >
            Confirm Import
          </button>
        </div>
      </div>
    </div>
  );
};
