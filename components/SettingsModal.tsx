import React, { useRef } from 'react';

interface SettingsModalProps {
  onClose: () => void;
  onExport: () => void;
  onImport: (fileContent: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onExport, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            onImport(content);
        };
        reader.readAsText(file);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="settings-modal-title" className="text-2xl font-bold">Settings & Data</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
                </div>

                <div className="space-y-6">
                    {/* Export Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Export Data</h3>
                        <p className="text-sm text-secondary mb-3">Download a complete backup of all your projects, events, contacts, locations, and templates in a single JSON file.</p>
                        <button 
                            onClick={onExport}
                            className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition"
                        >
                            Export All Data (.json)
                        </button>
                    </div>

                    {/* Import Section */}
                    <div className="border-t border-primary pt-6">
                        <h3 className="text-lg font-semibold text-primary mb-2">Import Events</h3>
                        <p className="text-sm text-secondary mb-3">Import events from a standard iCalendar (.ics) file. This is useful for migrating from Google Calendar, Outlook, or Apple Calendar.</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept=".ics,text/calendar"
                            className="hidden"
                        />
                        <button
                            onClick={handleImportClick}
                            className="px-5 py-2 rounded-md bg-tertiary text-primary font-bold hover:bg-secondary transition"
                        >
                            Import from .ics File
                        </button>
                    </div>
                </div>

                <div className="flex justify-end pt-8 mt-4 border-t border-primary">
                    <button onClick={onClose} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
