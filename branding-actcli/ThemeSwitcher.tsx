import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon, BrainIcon } from './icons';

// NEW ActCLI icons (add these to icons.tsx)
const VSCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
  </svg>
);

const NordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

const RoundTableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const themes: { name: Theme; icon: React.ReactNode; label: string }[] = [
  { name: 'light', icon: <SunIcon />, label: 'Light' },
  { name: 'dark', icon: <MoonIcon />, label: 'Dark' },
  { name: 'focus', icon: <BrainIcon />, label: 'Focus' },
  // NEW ActCLI themes
  { name: 'actcli', icon: <VSCodeIcon />, label: 'ActCLI Dark' },
  { name: 'actcli-light', icon: <SunIcon />, label: 'ActCLI Light' },
  { name: 'actcli-nord', icon: <NordIcon />, label: 'ActCLI Nord' },
  { name: 'actcli-roundtable', icon: <RoundTableIcon />, label: 'ActCLI Round Table' },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  return (
    <div className="flex items-center space-x-1 bg-tertiary p-1 rounded-full">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={`p-2 rounded-full transition-colors duration-200 ${
            theme === t.name
              ? 'bg-secondary text-primary shadow-sm'
              : 'text-tertiary hover:text-primary'
          }`}
          aria-label={`Switch to ${t.label} theme`}
          title={t.label}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};
