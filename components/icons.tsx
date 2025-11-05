
import React from 'react';

export const SunIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MoonIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const BrainIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V4.5A2.5 2.5 0 0 1 17 2h.5a2.5 2.5 0 0 1 2.5 2.5v1.2a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V4.5A2.5 2.5 0 0 1 24 2" transform="translate(-1.5 1)" />
        <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5v1.2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V4.5A2.5 2.5 0 0 0 5 2h-.5A2.5 2.5 0 0 0 2 4.5v1.2a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V4.5A2.5 2.5 0 0 0-2 2" transform="translate(1.5 1) scale(-1 1)" />
        <path d="M4.5 19.5A2.5 2.5 0 0 1 2 17v-1.2a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V17a2.5 2.5 0 0 1-2.5 2.5" transform="translate(20 0) rotate(90)" />
        <path d="M4.5 19.5A2.5 2.5 0 0 0 2 17v-1.2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V17a2.5 2.5 0 0 0 2.5 2.5" transform="translate(-1 18) rotate(-90)" />
        <path d="M14 13.5c0 2.5 2 4.5 4.5 4.5h.5c2.5 0 4.5-2 4.5-4.5v-1.2a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V13.5" transform="translate(-7 0)" />
        <path d="M10 13.5c0 2.5-2 4.5-4.5 4.5H5c-2.5 0-4.5-2-4.5-4.5v-1.2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V13.5" transform="translate(7 0)" />
        <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
    </svg>
);

export const PersonIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const PinIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

export const CalendarIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const MilestoneIcon = ({ className = "h-6 w-6", ...props }: { className?: string, title?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
);

export const DeadlineIcon = ({ className = "h-6 w-6", ...props }: { className?: string, title?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
    </svg>
);

export const CheckpointIcon = ({ className = "h-6 w-6", ...props }: { className?: string, title?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-12 0H3a7.001 7.001 0 007 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-4v-2.07z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneSlashIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M15.46 14.54a.5.5 0 00.707-.707L6.167 4.833a.5.5 0 00-.707.707L15.46 14.54z" clipRule="evenodd" />
        <path d="M10 3a3 3 0 00-3 3v4a3 3 0 005.122 2.121l-7.244-7.244A2.98 2.98 0 0010 3z" />
        <path d="M3 8a6 6 0 005.122 5.918l-8.244-8.244A7.001 7.001 0 003 8zm13.122.918L7.878 17.162A7.001 7.001 0 0017 8h-1a6 6 0 01-2.878.918z" />
    </svg>
);

export const SpinnerIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const UsersIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);
