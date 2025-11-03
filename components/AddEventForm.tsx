import React, { useState, useEffect } from 'react';
import { EventNode, EntityType, Participant, When, Project } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicrophoneIcon, MicrophoneSlashIcon } from './icons';

type VoiceStatus = 'checking' | 'supported' | 'unsupported';

interface AddEventFormProps {
  projects: Project[];
  onSave: (event: Omit<EventNode, 'id' | 'projectId'>, projectInfo: {id: number | null, name: string}) => void;
  onClose: () => void;
  voiceStatus: VoiceStatus;
  initialData?: { who?: string, where?: string } | null;
}

// FIX: Added default values to make microphone-related props optional.
const FormInput = ({ label, id, onMicClick = () => {}, isListening = false, hasMicSupport = undefined, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <div className="relative">
            <input
                id={id}
                className={`w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none transition duration-200 ${hasMicSupport ? 'pr-10' : ''}`}
                {...props}
            />
            {hasMicSupport !== undefined && (
                <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10">
                {hasMicSupport ? (
                    <button
                        type="button"
                        onClick={onMicClick}
                        className="w-full h-full flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-200"
                        aria-label={`Dictate ${label}`}
                        title={`Dictate ${label}`}
                    >
                        <MicrophoneIcon className={`h-5 w-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                    </button>
                ) : (
                   <div title="Speech recognition not supported or permission denied">
                      <MicrophoneSlashIcon className="h-5 w-5 text-slate-500" />
                   </div>
                )}
              </div>
            )}
        </div>
    </div>
);

const FormTextArea = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea
            id={id}
            rows={2}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none transition duration-200"
            {...props}
        />
    </div>
);

export const AddEventForm: React.FC<AddEventFormProps> = ({ projects, onSave, onClose, voiceStatus, initialData }) => {
    const [whatName, setWhatName] = useState('');
    const [whatDesc, setWhatDesc] = useState('');
    const [projectName, setProjectName] = useState('');
    const [who, setWho] = useState(initialData?.who || '');
    const [where, setWhere] = useState(initialData?.where || '');
    const [when, setWhen] = useState('');

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
        if (error) {
            const message = `Speech recognition error: ${error}. Please check your network connection and microphone permissions.`;
            setRecognitionError(message);
            const timer = setTimeout(() => setRecognitionError(null), 5000); // Clear after 5s
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
            }
             // Stop listening after transcript is processed
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

    const isFormValid = whatName && where && when && projectName;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        const existingProject = projects.find(p => p.name.toLowerCase() === projectName.trim().toLowerCase());

        const whoArray: Participant[] = who.split(',').map(name => name.trim()).filter(name => name).map((name, index) => ({
            id: `new-who-${Date.now()}-${index}`,
            name,
            type: EntityType.Who,
        }));

        const date = new Date(when);
        const whenObject: When = {
            id: `new-when-${Date.now()}`,
            timestamp: date.toISOString(),
            display: date.toLocaleString([], {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true
            }).replace(',', ''),
            type: EntityType.When,
        };

        const newEventData: Omit<EventNode, 'id' | 'projectId'> = {
            what: {
                id: `new-what-${Date.now()}`,
                name: whatName,
                description: whatDesc,
                type: EntityType.What,
            },
            when: whenObject,
            who: whoArray,
            where: {
                id: `new-where-${Date.now()}`,
                name: where,
                type: EntityType.Where,
            },
        };
        
        const projectInfo = {
            id: existingProject ? existingProject.id : null,
            name: projectName.trim()
        };

        onSave(newEventData, projectInfo);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="add-event-title">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="add-event-title" className="text-2xl font-bold">Add New Event</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none" aria-label="Close form">&times;</button>
                </div>
                {recognitionError && (
                  <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-md p-3 mb-4" role="alert">
                      {recognitionError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            label="When"
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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Who (comma-separated)"
                            id="who"
                            type="text"
                            value={who}
                            onChange={(e) => setWho(e.target.value)}
                            placeholder="e.g., Dr. Smith"
                        />
                        <FormInput
                            label="Where"
                            id="where"
                            type="text"
                            value={where}
                            onChange={(e) => setWhere(e.target.value)}
                            placeholder="e.g., Springfield Clinic"
                            onMicClick={() => handleMicClick('where')}
                            isListening={isListening && listeningField === 'where'}
                            hasMicSupport={showMics}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-slate-300 hover:bg-slate-700 transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};