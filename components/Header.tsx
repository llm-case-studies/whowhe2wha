import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Theme } from '../types';

interface HeaderProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const Logo = () => (
  <svg width="280" height="60" viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg" className="w-auto h-10 md:h-12">
    <defs>
      <marker id="arrow-pink" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#ec4899" />
      </marker>
      <marker id="arrow-green" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
      </marker>
      <marker id="arrow-orange" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
      </marker>
    </defs>
    <text x="0" y="62" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="#ec4899">who</text>
    <line x1="75" y1="55" x2="100" y2="55" stroke="#ec4899" strokeWidth="4" markerEnd="url(#arrow-pink)"/>
    <text x="110" y="62" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="#10b981">whe</text>
    <line x1="185" y1="55" x2="210" y2="55" stroke="#10b981" strokeWidth="4" markerEnd="url(#arrow-green)"/>
    <text x="220" y="66" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="42" fill="#f59e0b">2</text>
    <line x1="245" y1="55" x2="270" y2="55" stroke="#f59e0b" strokeWidth="4" markerEnd="url(#arrow-orange)"/>
    <text x="280" y="62" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="#3b82f6">wha</text>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  return (
    <header className="py-6 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex-1 flex justify-center items-center flex-col space-y-2">
          <Logo />
          <p className="text-sm text-secondary">The Unified Context Engine for Life and Work</p>
        </div>
        <div className="flex-1 flex justify-end">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
};
