import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

const SummonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H6a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
  </svg>
);

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear, isLoading }) => {
  const [query, setQuery] = useState('');
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const handleClear = () => {
      setQuery('');
      onClear();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchBarPlaceholder')}
          className="w-full pl-4 pr-32 py-4 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none transition duration-200 text-lg"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
           {query && <button type="button" onClick={handleClear} className="px-3 py-2 text-secondary hover:text-primary" disabled={isLoading}>
                &times;
            </button>}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center h-12 px-5 bg-wha-blue text-white font-bold rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-tertiary disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('summoning')}
              </>
            ) : (
                <>
                <SummonIcon/>
                {t('summon')}
                </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
