import React, { useRef } from 'react';
import { useI18n } from '../hooks/useI18n';

type ImportType = 'ics' | 'events-json' | 'projects-templates-json' | 'backup-json';

interface SettingsModalProps {
  onClose: () => void;
  onExportFullBackup: () => void;
  onExportEventsICS: () => void;
  onExportEventsJSON: () => void;
  onExportProjectsAndTemplates: () => void;
  onImportICS: (fileContent: string) => void;
  onImportEventsJSON: (fileContent: string) => void;
  onImportProjectsAndTemplates: (fileContent: string) => void;
  onImportFromBackup: (fileContent: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    onClose, 
    onExportFullBackup,
    onExportEventsICS,
    onExportEventsJSON,
    onExportProjectsAndTemplates,
    onImportICS,
    onImportEventsJSON,
    onImportProjectsAndTemplates,
    onImportFromBackup,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentImportType = useRef<ImportType | null>(null);
    const { t, language, setLanguage } = useI18n();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !currentImportType.current) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            switch(currentImportType.current) {
                case 'ics': onImportICS(content); break;
                case 'events-json': onImportEventsJSON(content); break;
                case 'projects-templates-json': onImportProjectsAndTemplates(content); break;
                case 'backup-json': onImportFromBackup(content); break;
            }
        };
        reader.readAsText(file);
        // Reset file input to allow selecting the same file again
        event.target.value = ''; 
    };

    const handleImportClick = (type: ImportType) => {
        currentImportType.current = type;
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 id="settings-modal-title" className="text-2xl font-bold">{t('settingsAndData')}</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label={t('close')}>&times;</button>
                </div>
                
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".ics,text/calendar,.json,application/json"
                    className="hidden"
                />

                <div className="overflow-y-auto pr-2 space-y-6">
                    {/* Language Section */}
                     <div className="p-4 bg-tertiary/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary mb-2">{t('language')}</h3>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="w-full md:w-1/2 px-3 py-2 bg-input border border-primary rounded-lg"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="pt">Português</option>
                        </select>
                    </div>

                    {/* Events Section */}
                    <div className="p-4 bg-tertiary/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary mb-2">{t('addEvent')}s</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-secondary mb-3">{t('importEvents')}</p>
                                <div className="space-y-2">
                                    <button onClick={() => handleImportClick('ics')} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">{t('importICS')}</button>
                                    <button onClick={() => handleImportClick('events-json')} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">{t('importJSON')}</button>
                                </div>
                            </div>
                             <div>
                                <p className="text-sm text-secondary mb-3">{t('exportEvents')}</p>
                                <div className="space-y-2">
                                    <button onClick={onExportEventsICS} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">{t('exportICS')}</button>
                                    <button onClick={onExportEventsJSON} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">{t('exportJSON')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Projects & Templates Section */}
                    <div className="p-4 bg-tertiary/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary mb-2">{t('projects')} & {t('templates')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-secondary mb-3">{t('importProjectsTemplates')}</p>
                                <button onClick={() => handleImportClick('projects-templates-json')} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">{t('importJSON')}</button>
                            </div>
                            <div>
                                <p className="text-sm text-secondary mb-3">{t('exportProjectsTemplates')}</p>
                                <button onClick={onExportProjectsAndTemplates} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">{t('exportJSON')}</button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Full Backup Section */}
                    <div className="p-4 bg-tertiary/50 rounded-lg border border-yellow-500/50">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">{t('fullBackupRestore')}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-secondary mb-3">{t('restoreBackupMsg')}</p>
                                <button onClick={() => handleImportClick('backup-json')} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">{t('restoreBackupBtn')}</button>
                            </div>
                            <div>
                                <p className="text-sm text-secondary mb-3">{t('createBackupMsg')}</p>
                                <button onClick={onExportFullBackup} className="w-full text-left px-4 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition">{t('createBackupBtn')}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 mt-auto flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition">
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};