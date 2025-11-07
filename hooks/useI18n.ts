import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../i18n/translations';

type Language = 'en' | 'es' | 'fr' | 'de' | 'pt';
type Translations = typeof translations.en;

interface I18nContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: keyof Translations, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
    language: Language;
    setLanguage: (language: Language) => void;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, language, setLanguage }) => {
    const t = (key: keyof Translations, fallback?: string): string => {
        const langPack = translations[language] as Translations | undefined;
        return langPack?.[key] || translations.en[key] || fallback || key;
    };

    // FIX: Replaced JSX with React.createElement to be valid in a .ts file. This resolves errors caused by the TypeScript compiler misinterpreting JSX syntax as comparison operators.
    return React.createElement(I18nContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};