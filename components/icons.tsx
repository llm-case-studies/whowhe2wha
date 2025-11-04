import React from 'react';

export const PersonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export const PinIcon = ({ className = '' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

export const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneIcon = ({ className = '' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm-1 4a4 4 0 108 0V4a4 4 0 10-8 0v4zM10 15a1 1 0 001 1h.01a1 1 0 100-2H11a1 1 0 00-1 1zM3 10a1 1 0 011-1h.01a1 1 0 110 2H4a1 1 0 01-1-1zm14 0a1 1 0 00-1-1h-.01a1 1 0 100 2H16a1 1 0 001-1zm-6 5a3 3 0 01-3-3V9a1 1 0 10-2 0v3a5 5 0 1010 0V9a1 1 0 10-2 0v3a3 3 0 01-3 3z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneSlashIcon = ({ className = '' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.523l8.367 8.367zm-3.18-1.242a4 4 0 00-4.464-4.464L10.297 13.648zM15 8V4a4 4 0 00-8 0v.586l.293.293a1 1 0 011.414-1.414l-1-1A1 1 0 019 2h2a1 1 0 011 1v4a1 1 0 01-1 1h-2a1 1 0 01-1-1V8a1 1 0 011-1h.586l1.707 1.707A3.98 3.98 0 0015 8zm-5 7a1 1 0 001 1h.01a1 1 0 100-2H11a1 1 0 00-1 1zM3 10a1 1 0 011-1h.01a1 1 0 110 2H4a1 1 0 01-1-1zm14 0a1 1 0 00-1-1h-.01a1 1 0 100 2H16a1 1 0 001-1zm-5.707 5.293a1 1 0 01-1.414 0l-10-10a1 1 0 011.414-1.414l10 10a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);

export const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);

export const SpinnerIcon = ({ className = '' }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);