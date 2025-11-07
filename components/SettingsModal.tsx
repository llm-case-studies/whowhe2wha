import React, { useRef } from 'react';

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
                    <h2 id="settings-modal-title" className="text-2xl font-bold">Settings & Data</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
                </div>
                
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".ics,text/calendar,.json,application/json"
                    className="hidden"
                />

                <div className="overflow-y-auto pr-2 space-y-6">
                    {/* Events Section */}
                    <div className="p-4 bg-tertiary/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary mb-2">Events</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-secondary mb-3">Import events from calendar files or JSON backups.</p>
                                <div className="space-y-2">
                                    <button onClick={() => handleImportClick('ics')} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">Import from .ics</button>
                                    <button onClick={() => handleImportClick('events-json')} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">Import from .json</button>
                                </div>
                            </div>
                             <div>
                                <p className="text-sm text-secondary mb-3">Export events to standard formats for use elsewhere.</p>
                                <div className="space-y-2">
                                    <button onClick={onExportEventsICS} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">Export to .ics</button>
                                    <button onClick={onExportEventsJSON} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">Export to .json</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Projects & Templates Section */}
                    <div className="p-4 bg-tertiary/50 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary mb-2">Projects & Templates</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-secondary mb-3">Import project structures and templates from a JSON file.</p>
                                <button onClick={() => handleImportClick('projects-templates-json')} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">Import from .json</button>
                            </div>
                            <div>
                                <p className="text-sm text-secondary mb-3">Export your project and template structures.</p>
                                <button onClick={onExportProjectsAndTemplates} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">Export to .json</button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Full Backup Section */}
                    <div className="p-4 bg-tertiary/50 rounded-lg border border-yellow-500/50">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Full Backup & Restore</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-secondary mb-3">Restore your entire application state from a full backup file.</p>
                                <button onClick={() => handleImportClick('backup-json')} className="w-full text-left px-4 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition">Restore from Backup...</button>
                            </div>
                            <div>
                                <p className="text-sm text-secondary mb-3">Create a full backup of all data in your application.</p>
                                <button onClick={onExportFullBackup} className="w-full text-left px-4 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition">Create Full Backup</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 mt-auto flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};