import React, { useState } from 'react';
import { ParsedEvent, Project, EventNode } from '../types';
import { useI18n } from '../hooks/useI18n';

interface ImportReviewModalProps {
  parsedICSEvents: ParsedEvent[] | null;
  jsonEvents: EventNode[] | null;
  projects: Project[];
  onClose: () => void;
  onConfirmICS: (projectId: number) => void;
  onConfirmJSON: (projectId: number) => void;
}

export const ImportReviewModal: React.FC<ImportReviewModalProps> = ({ parsedICSEvents, jsonEvents, projects, onClose, onConfirmICS, onConfirmJSON }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const { t } = useI18n();
  
  const events = parsedICSEvents || jsonEvents;
  const isICS = !!parsedICSEvents;

  const handleConfirm = () => {
    if (selectedProjectId) {
      if(isICS) {
        onConfirmICS(Number(selectedProjectId));
      } else {
        onConfirmJSON(Number(selectedProjectId));
      }
    }
  };
  
  if (!events) return null;

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="import-review-title">
      <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 id="import-review-title" className="text-2xl font-bold">{t('reviewImport')}</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label={t('close')}>&times;</button>
        </div>

        <p className="text-sm text-secondary mb-4 flex-shrink-0">Found {events.length} event(s). Please select a project to import them into.</p>

        <div className="mb-4 flex-shrink-0">
          <label htmlFor="projectId" className="block text-sm font-medium text-secondary mb-1">{t('importToProject')}</label>
          <select
            id="projectId"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-primary rounded-lg"
          >
            <option value="" disabled>-- {t('selectProject')} --</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="overflow-y-auto flex-grow border-t border-b border-primary py-4 pr-2">
          <div className="space-y-3">
            {events.map((event, index) => {
               if (isICS) {
                    const parsedEvent = event as ParsedEvent;
                    return (
                        <div key={index} className="bg-tertiary p-3 rounded-md">
                            <p className="font-semibold text-primary">{parsedEvent.summary}</p>
                            <p className="text-xs text-secondary mt-1">{parsedEvent.startDate.toLocaleString()}</p>
                            {parsedEvent.location && <p className="text-xs text-secondary">Location: {parsedEvent.location}</p>}
                        </div>
                    );
                } else {
                    const jsonEvent = event as EventNode;
                    return (
                         <div key={index} className="bg-tertiary p-3 rounded-md">
                            <p className="font-semibold text-primary">{jsonEvent.what.name}</p>
                            {jsonEvent.when && <p className="text-xs text-secondary mt-1">{new Date(jsonEvent.when.timestamp).toLocaleString()}</p>}
                        </div>
                    );
                }
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition">{t('cancel')}</button>
          <button
            onClick={handleConfirm}
            disabled={!selectedProjectId}
            className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-tertiary disabled:cursor-not-allowed"
          >
            {t('confirm')} Import
          </button>
        </div>
      </div>
    </div>
  );
};
