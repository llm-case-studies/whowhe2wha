import React from 'react';
import { SharedTemplateData } from '../types';
import { useI18n } from '../hooks/useI18n';

interface ShareTemplateViewProps {
    data: SharedTemplateData;
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

export const ShareTemplateView: React.FC<ShareTemplateViewProps> = ({ data }) => {
    const { template } = data;
    const { t } = useI18n();

    const handleImport = () => {
        // This is for phase 2. For now, it will just redirect to the main app.
        window.location.href = window.location.origin + window.location.pathname;
    };

    return (
        <div className="bg-background text-primary min-h-screen font-sans flex flex-col items-center p-4 md:p-8">
            <header className="w-full max-w-4xl text-center mb-8">
                <div className="flex justify-center mb-2"><Logo /></div>
                <p className="text-sm text-secondary">{t('sharedTemplateFrom')}</p>
            </header>
            
            <main className="w-full max-w-4xl bg-secondary rounded-lg p-6 md:p-8">
                <div className="mb-6 border-b border-primary pb-4">
                    <h1 className="font-bold text-primary text-2xl">{template.name}</h1>
                    <p className="text-sm text-secondary mt-1">{template.description}</p>
                    <div className="mt-2 text-xs font-semibold inline-block bg-tertiary text-secondary px-2 py-1 rounded-full">{template.category}</div>
                </div>
                
                <h2 className="text-xl font-bold text-primary mb-4">{t('templateEvents')}</h2>
                
                <div className="space-y-4">
                    {template.events.length > 0 ? (
                        template.events.map((event, index) => (
                           <div key={index} className="bg-tertiary p-4 rounded-lg">
                               <div className="flex justify-between items-start">
                                   <h3 className="font-bold text-primary">{event.whatName}</h3>
                                   <span className="text-sm font-semibold text-secondary whitespace-nowrap">
                                        Duration: {event.durationDays} day{event.durationDays !== 1 ? 's' : ''}
                                   </span>
                               </div>
                               <p className="text-sm text-secondary mt-1">{event.description}</p>
                           </div>
                        ))
                    ) : (
                        <p className="text-secondary text-center py-4">This template has no events defined.</p>
                    )}
                </div>
            </main>

            <footer className="w-full max-w-4xl text-center mt-8">
                <button 
                    onClick={handleImport}
                    className="px-8 py-3 rounded-md bg-to-orange text-white font-bold hover:bg-orange-600 transition duration-200"
                >
                    {t('useTemplateInApp')}
                </button>
                 <p className="text-xs text-secondary mt-4">
                    whowhe2wha helps you connect the dots in your life. <a href={window.location.origin + window.location.pathname} className="text-blue-400 hover:underline">{t('tryItNow')}</a>
                </p>
            </footer>
        </div>
    );
};
