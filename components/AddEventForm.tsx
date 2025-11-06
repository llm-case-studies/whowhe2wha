import React, { useState, useEffect } from 'react';
import { EventNode, EntityType, Participant, When, Project, Location, WhatType } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicrophoneIcon, MicrophoneSlashIcon, SpinnerIcon, PinIcon, SearchIcon } from './icons';

type VoiceStatus = 'checking' | 'supported' | 'unsupported';

interface AddEventFormProps {
  projects: Project[];
  locations: Location[];
  onSave: (
    event: Omit<EventNode, 'id' | 'projectId' | 'whereId'>, 
    projectInfo: {id: number | null, name: string, category: string},
    whereInfo: { id: string | null, name: string }
  ) => void;
  onClose: () => void;
  voiceStatus: VoiceStatus;
  initialData?: { who?: string, where?: string } | null;
  onOpenLocationFinder: (query: string) => void;
}

const whatTypeOptions = Object.values(WhatType).map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));

const FormInput = ({ label, id, onMicClick = () => {}, isListening = false, hasMicSupport = undefined, onSearchClick = null, ...props }) => {
    const showSearchButton = id === 'where' && onSearchClick;
    const showMicButton = hasMicSupport && !showSearchButton;
    const showMicDisabled = hasMicSupport === false && !showSearchButton;

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-secondary mb-1">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    className={`w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none transition duration-200 ${hasMicSupport || id === 'where' ? 'pr-10' : ''}`}
                    {...props}
                />
                <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10">
                    {showSearchButton && (
                        <button
                            type="button"
                            onClick={onSearchClick}
                            className="w-full h-full flex items-center justify-center text-secondary hover:text-primary transition-colors duration-200"
                            aria-label="Find Location"
                            title="Find Location"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                    )}
                    
                    {showMicButton && (
                         <button
                            type="button"
                            onClick={onMicClick}
                            className="w-full h-full flex items-center justify-center text-secondary hover:text-primary transition-colors duration-200"
                            aria-label={`Dictate ${label}`}
                            title={`Dictate ${label}`}
                        >
                            <MicrophoneIcon className={`h-5 w-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                        </button>
                    )}
                    {showMicDisabled && (
                       <div title="Speech recognition not supported or permission denied">
                          <MicrophoneSlashIcon className="h-5 w-5 text-tertiary" />
                       </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FormTextArea = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-secondary mb-1">{label}</label>
        <textarea
            id={id}
            rows={2}
            className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none transition duration-200"
            {...props}
        />
    </div>
);

const FormSelect = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-secondary mb-1">{label}</label>
        <select
            id={id}
            className="w-full px-3 py-2 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none transition duration-200"
            {...props}
        >
            {whatTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);


export const AddEventForm: React.FC<AddEventFormProps> = ({ projects, locations, onSave, onClose, voiceStatus, initialData, onOpenLocationFinder }) => {
    const [whatName, setWhatName] = useState('');
    const [whatDesc, setWhatDesc] = useState('');
    const [whatType, setWhatType] = useState<WhatType>(WhatType.Appointment);
    const [projectName, setProjectName] = useState('');
    const [who, setWho] = useState(initialData?.who || '');
    const [where, setWhere] = useState(initialData?.where || '');
    const [when, setWhen] = useState('');
    const [endWhen, setEndWhen] = useState('');

    const [listeningField, setListeningField] = useState<string | null>(null);
    const [recognitionError, setRecognitionError] = useState<string | null>(null);
    
    const {
        transcript,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport,
        error,
    } = useSpeechRecognition();
    
    const showMics = voiceStatus === 'supported';

    useEffect(() => {
        // If the App component passes a new `where` value (e.g., from the location finder modal),
        // update this form's state to reflect it.
        if (initialData?.where && initialData.where !== where) {
            setWhere(initialData.where);
        }
    }, [initialData?.where]);


    useEffect(() => {
        if (error) {
            const message = `Speech recognition error: ${error}. Please check your network connection and microphone permissions.`;
            setRecognitionError(message);
            const timer = setTimeout(() => setRecognitionError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (transcript && listeningField) {
            switch (listeningField) {
                case 'whatName':
                    setWhatName(transcript);
                    break;
                case 'where':
                    setWhere(transcript);
                    break;
                case 'when':
                    setWhen(transcript);
                    break;
                 case 'endWhen':
                    setEndWhen(transcript);
                    break;
            }
            stopListening();
            setListeningField(null);
        }
    }, [transcript, listeningField, stopListening]);


    const handleMicClick = (field: string) => {
        if (isListening) {
            stopListening();
            setListeningField(null);
        } else {
            setListeningField(field);
            startListening();
        }
    };

    const isFormValid = whatName && where && when && projectName && (whatType !== WhatType.Period || endWhen);

    const createWhenObject = (datetimeString: string): When => {
        const date = new Date(datetimeString);
        const displayString = date.toLocaleString([], {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        }).replace(',', '');
        return {
            id: `new-when-${Date.now()}-${Math.random()}`,
            name: displayString,
            timestamp: date.toISOString(),
            display: displayString,
            type: EntityType.When,
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        const existingProject = projects.find(p => p.name.toLowerCase() === projectName.trim().toLowerCase());
        const existingLocation = locations.find(l => 
            l.name.toLowerCase() === where.trim().toLowerCase() || 
            l.alias?.toLowerCase() === where.trim().toLowerCase()
        );

        if (!existingLocation) {
            // This should ideally not happen if the flow is followed, but as a fallback:
            onOpenLocationFinder(where.trim());
            return;
        }

        const whoArray: Participant[] = who.split(',').map(name => name.trim()).filter(name => name).map((name, index) => ({
            id: `new-who-${Date.now()}-${index}`,
            name,
            type: EntityType.Who,
        }));
        
        const newEventData: Omit<EventNode, 'id' | 'projectId' | 'whereId'> = {
            what: {
                id: `new-what-${Date.now()}`,
                name: whatName,
                description: whatDesc,
                type: EntityType.What,
                whatType: whatType,
            },
            when: createWhenObject(when),
            endWhen: (whatType === WhatType.Period && endWhen) ? createWhenObject(endWhen) : undefined,
            who: whoArray,
        };
        
        const projectInfo = {
            id: existingProject ? existingProject.id : null,
            name: projectName.trim(),
            category: existingProject?.category || 'Personal'
        };

        const whereInfo = {
            id: existingLocation.id,
            name: where.trim(),
        };

        onSave(newEventData, projectInfo, whereInfo);
    };

    const isWhereUnmatched = where.trim() && !locations.some(l => l.name.toLowerCase() === where.trim().toLowerCase() || l.alias?.toLowerCase() === where.trim().toLowerCase());

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-event-title">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="add-event-title" className="text-2xl font-bold">Add New Event</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
                </div>
                {recognitionError && (
                  <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-md p-3 mb-4" role="alert">
                      {recognitionError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                             <FormInput
                                label="What (Event/Step Name)"
                                id="whatName"
                                type="text"
                                value={whatName}
                                onChange={(e) => setWhatName(e.target.value)}
                                placeholder="e.g., Implant Surgery"
                                onMicClick={() => handleMicClick('whatName')}
                                isListening={isListening && listeningField === 'whatName'}
                                hasMicSupport={showMics}
                                required
                            />
                        </div>
                        <FormSelect
                            label="Event Type"
                            id="whatType"
                            value={whatType}
                            onChange={(e) => setWhatType(e.target.value as WhatType)}
                        />
                    </div>
                    <FormTextArea
                        label="Description"
                        id="whatDesc"
                        value={whatDesc}
                        onChange={(e) => setWhatDesc(e.target.value)}
                        placeholder="e.g., Placement of the titanium implant."
                    />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Project (Select or Create New)"
                            id="project"
                            type="text"
                            list="projects-list"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g., Dental Implant Treatment"
                            required
                        />
                        <datalist id="projects-list">
                            {projects.map(p => <option key={p.id} value={p.name} />)}
                        </datalist>
                         <FormInput
                            label={whatType === WhatType.Period ? "Start Date" : "When"}
                            id="when"
                            type="datetime-local"
                            value={when}
                            onChange={(e) => setWhen(e.target.value)}
                            onMicClick={() => handleMicClick('when')}
                            isListening={isListening && listeningField === 'when'}
                            hasMicSupport={showMics}
                            required
                        />
                    </div>
                    {whatType === WhatType.Period && (
                        <FormInput
                            label="End Date"
                            id="endWhen"
                            type="datetime-local"
                            value={endWhen}
                            onChange={(e) => setEndWhen(e.target.value)}
                            onMicClick={() => handleMicClick('endWhen')}
                            isListening={isListening && listeningField === 'endWhen'}
                            hasMicSupport={showMics}
                            required
                        />
                    )}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Who (comma-separated)"
                            id="who"
                            type="text"
                            value={who}
                            onChange={(e) => setWho(e.target.value)}
                            placeholder="e.g., Dr. Smith"
                        />
                        <div>
                            <FormInput
                                label="Where (Select or Find New)"
                                id="where"
                                type="text"
                                list="locations-list"
                                value={where}
                                onChange={(e) => setWhere(e.target.value)}
                                placeholder="e.g., Springfield Clinic"
                                onMicClick={() => handleMicClick('where')}
                                isListening={isListening && listeningField === 'where'}
                                hasMicSupport={showMics}
                                onSearchClick={isWhereUnmatched ? () => onOpenLocationFinder(where) : null}
                                required
                            />
                            {isWhereUnmatched && (
                                <p className="text-xs text-amber-400 mt-1">New location. Click the search icon to find and verify it.</p>
                            )}
                        </div>
                        <datalist id="locations-list">
                            {locations.map(l => <option key={l.id} value={l.alias && l.alias !== l.name ? l.alias : l.name} />)}
                        </datalist>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isWhereUnmatched}
                            className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-tertiary disabled:cursor-not-allowed"
                        >
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};