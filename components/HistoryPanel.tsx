import React from 'react';
import { HistoryEntry } from '../types';
import { timeAgo } from '../utils/dateUtils';
import { useI18n } from '../hooks/useI18n';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onUndo: (historyId: number) => void;
  onClear: () => void;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onUndo, onClear, onClose }) => {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-modal-overlay" onClick={onClose}></div>
        <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-secondary border-l border-primary shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-primary flex-shrink-0">
                <h2 className="text-xl font-bold">{t('changesHistory')}</h2>
                <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none">&times;</button>
            </div>

            {history.length > 0 ? (
                 <div className="overflow-y-auto flex-grow p-4 space-y-3">
                    {history.map(entry => (
                        <div key={entry.id} className="bg-tertiary/60 p-3 rounded-md flex justify-between items-start gap-4">
                            <div className="flex-grow">
                                <p className="text-sm text-primary">{entry.description}</p>
                                <p className="text-xs text-secondary mt-1">{timeAgo(entry.timestamp)}</p>
                            </div>
                            <button 
                                onClick={() => onUndo(entry.id)}
                                className="flex-shrink-0 px-3 py-1 text-xs font-semibold bg-wha-blue/80 text-white rounded-md hover:bg-wha-blue"
                            >
                                {t('undo')}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-secondary">{t('noRecentChanges')}</p>
                </div>
            )}


            <div className="p-4 border-t border-primary flex-shrink-0">
                <button 
                    onClick={onClear}
                    disabled={history.length === 0}
                    className="w-full px-4 py-2 text-sm font-semibold bg-tertiary text-secondary rounded-md hover:bg-red-800 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t('clearHistory')}
                </button>
            </div>
        </div>
    </div>
  );
};
