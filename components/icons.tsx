import React from 'react';

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
};

export const PersonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
);

export const PinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 21l-4.95-6.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
);

// FIX: Update icon to render title prop as a <title> element to resolve typing errors.
export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement> & {className?: string; title?: string}> = ({className, title, ...props}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'} {...props}>
        {title && <title>{title}</title>}
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm-2 5a1 1 0 011-1h12a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 000 2h.01a1 1 0 100-2H5zm2 0a1 1 0 000 2h.01a1 1 0 100-2H7zm2 0a1 1 0 000 2h.01a1 1 0 100-2H9zm2 0a1 1 0 000 2h.01a1 1 0 100-2H11zm2 0a1 1 0 000 2h.01a1 1 0 100-2H13zm2 0a1 1 0 000 2h.01a1 1 0 100-2H15z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93V17h-2v-2.07A8.001 8.001 0 012 8V7a1 1 0 012 0v1a6 6 0 1012 0V7a1 1 0 112 0v1a8.001 8.001 0 01-5 7.93z" clipRule="evenodd" /></svg>
);

export const MicrophoneSlashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M15.42 16.85a.75.75 0 10-1.06-1.06L5.65 4.08a.75.75 0 00-1.06 1.06L15.42 16.85zM8 4a3 3 0 013 3v2.17l-3-3V4zm-3 4a3 3 0 003 3v.83l-3-3V8zm7.93 5.07A8.001 8.001 0 012 8V7a1 1 0 012 0v1a6 6 0 005.13 5.93l1.8 1.8z" clipRule="evenodd" /></svg>
);

export const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg fill="none" viewBox="0 0 24 24" className={className || 'h-5 w-5'}><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);

export const UsersIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0117 18h.59a2.5 2.5 0 100-1H17a5 5 0 01-5.07-5.28A6.97 6.97 0 0012 11c-.34 0-.673.024-1 .07V12a5 5 0 01-5 5H4.41a2.5 2.5 0 100 1H6a5 5 0 014.33-2.5A6.97 6.97 0 0011 16c0 .34-.024.673-.07 1h2z" /></svg>
);

export const SunIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-2.172 4.243a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM4.464 4.05a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414L4.464 5.464a1 1 0 010-1.414zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clipRule="evenodd" /></svg>
);

export const MoonIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
);

export const BrainIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM3 10a7 7 0 1114 0 7 7 0 01-14 0z" clipRule="evenodd" /><path d="M7 10a3 3 0 116 0 3 3 0 01-6 0z" /></svg>
);

export const StreamIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
);

export const TimelineIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
);

export const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M10 2.5l2.121 4.293 4.737.688-3.428 3.34.81 4.72L10 13.25l-4.24 2.29.81-4.72-3.428-3.34 4.737-.688L10 2.5z" clipRule="evenodd" /></svg>
);

// FIX: Update icon to render title prop as a <title> element to resolve typing errors.
export const MilestoneIcon: React.FC<React.SVGProps<SVGSVGElement> & {className?: string; title?: string}> = ({className, title, ...props}) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className || 'h-5 w-5'} {...props}>
        {title && <title>{title}</title>}
        <path d="M10 0L17 7L10 14L3 7Z" />
    </svg>
);

// FIX: Update icon to render title prop as a <title> element to resolve typing errors.
export const DeadlineIcon: React.FC<React.SVGProps<SVGSVGElement> & {className?: string; title?: string}> = ({className, title, ...props}) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className || 'h-5 w-5'} {...props}>
        {title && <title>{title}</title>}
        <path d="M2 2v18h2v-8h14l-4-4 4-4H4V2H2z" />
    </svg>
);

// FIX: Update icon to render title prop as a <title> element to resolve typing errors.
export const CheckpointIcon: React.FC<React.SVGProps<SVGSVGElement> & {className?: string; title?: string}> = ({className, title, ...props}) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className || 'h-5 w-5'} {...props}>
        {title && <title>{title}</title>}
        <circle cx="10" cy="10" r="4" />
    </svg>
);

export const FilterIcon: React.FC<{className?: string}> = ({className}) => (
    <svg {...iconProps} className={className || 'h-5 w-5'}><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
);