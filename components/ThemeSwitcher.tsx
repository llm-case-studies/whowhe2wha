import React from 'react';
import { Theme } from '../types';
import { SunIcon, MoonIcon, BrainIcon } from './icons';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const themes: { name: Theme; icon: React.ReactNode }[] = [
  { name: 'light', icon: <SunIcon /> },
  { name: 'dark', icon: <MoonIcon /> },
  { name: 'focus', icon: <BrainIcon /> },
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
          aria-label={`Switch to ${t.name} theme`}
          title={`Switch to ${t.name} theme`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};
