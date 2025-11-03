import React from 'react';
import { EntityType } from '../types';
import { COLORS } from '../constants';

interface EntityTagProps {
  label: string;
  type: EntityType;
  onClick?: () => void;
}

export const EntityTag: React.FC<EntityTagProps> = ({ label, type, onClick }) => {
  const colorClass = COLORS[type] || 'bg-gray-500';
  const baseClasses = 'text-white text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap';

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${colorClass} transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={`${baseClasses} ${colorClass}`}>
      {label}
    </span>
  );
};