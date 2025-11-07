import React from 'react';
import { SharedProjectData } from '../types';
import { EventCard } from './EventCard';
import { PROJECT_COLOR_CLASSES } from '../constants';
import { useI18n } from '../hooks/useI18n';

interface ShareViewProps {
    data: SharedProjectData;
}

const Logo = () => (
    <svg width="280" height="60" viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg" className="w-auto h-10 md:h-12">
      <defs>
        <marker id="arrow-pink-share" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#ec4899" />
        </marker>
        <marker id="arrow-green-share" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
        </marker>
        <marker id="arrow-orange-share" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
        </marker>
      </defs>
      <text x="0" y="62" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="#ec4899">who</text>
      <line x1="75" y1="55" x2="100" y2="55" stroke="#ec4899" strokeWidth="4" markerEnd="url(#arrow-pink-share)"/>
      <text x="110" y="62" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="#10b981">whe</text>
      <line x1="185" y1="55" x2="210" y2="55" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrow-green-share)"/>
      <text x="220" y="66" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="42" fill="#f59e0b">2</text>
      <line x1="245" y1="55" x2="270" y2="55" stroke="#f59e0b" strokeWidth="4" markerEnd="url(#arrow-orange-share)"/>
      <text x="280" y="62" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="#3b82f6">wha</text>
    </svg>
  );

export const ShareView: React.FC<ShareViewProps> = ({ data }) => {
    const { project, events, locations } = data;
    const { t } = useI18n();
    const colorClass = PROJECT_COLOR_CLASSES[project.color] || PROJECT_COLOR_CLASSES['blue'];
    const statusClasses: Record<string, string> = {
        'Active': 'bg-green-500',
        'On Hold': 'bg-yellow-500',
        'Completed': 'bg-gray-500',
    };
    const statusClass = statusClasses[project.status] || statusClasses['Completed'];


    const handleImport = () => {
        // This is for phase 2. For now, it will just redirect to the main app.
        window.location.href = window.location.origin + window.location.pathname;
    };

    const scheduledEvents = events
        .filter(e => !!e.when)
        .sort((a, b) => new Date(a.when!.timestamp).getTime() - new Date(b.when!.timestamp).getTime());

    return (
        <div className="bg-background text-primary min-h-screen font-sans flex flex-col items-center p-4 md:p-8">
            <header className="w-full max-w-4xl text-center mb-8">
                <div className="flex justify-center mb-2"><Logo /></div>
                <p className="text-sm text-secondary">{t('sharedProjectFrom')}</p>
            </header>
            
            <main className="w-full max-w-4xl bg-secondary rounded-lg p-6 md:p-8">
                <div className="mb-6">
                     <div className={`border-l-4 p-4 rounded-r-lg ${colorClass}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-primary pr-2 text-xl">{project.name}</h4>
                            <div className="flex items-center space-x-2 text-xs font-semibold flex-shrink-0">
                               <span className={`w-2 h-2 rounded-full ${statusClass}`}></span>
                               <span>{project.status}</span>
                            </div>
                        </div>
                        <p className="text-sm text-secondary mt-1">{project.description}</p>
                    </div>
                </div>
                
                <h2 className="text-xl font-bold text-primary mb-4">{t('eventStream')}</h2>
                
                <div className="space-y-4">
                    {scheduledEvents.length > 0 ? (
                        scheduledEvents.map(event => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                project={project}
                                locations={locations} 
                                onLocationClick={() => {}}
                                onWhenClick={() => {}}
                                onEdit={() => {}}
                                onDelete={() => {}}
                                isReadOnly={true}
                            />
                        ))
                    ) : (
                        <p className="text-secondary text-center py-4">{t('noScheduledEvents')}</p>
                    )}
                </div>
            </main>

            <footer className="w-full max-w-4xl text-center mt-8">
                <button 
                    onClick={handleImport}
                    className="px-8 py-3 rounded-md bg-to-orange text-white font-bold hover:bg-orange-600 transition duration-200"
                >
                    {t('addToApp')}
                </button>
                 <p className="text-xs text-secondary mt-4">
                    whowhe2wha helps you connect the dots in your life. <a href={window.location.origin + window.location.pathname} className="text-blue-400 hover:underline">{t('tryItNow')}</a>
                </p>
            </footer>
        </div>
    );
};
