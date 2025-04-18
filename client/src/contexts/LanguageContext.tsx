import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../locales/translations';

// Типы языков (12 самых популярных языков мира)
export type Language = 
  | 'en' // English
  | 'zh' // Chinese (Mandarin)
  | 'hi' // Hindi
  | 'es' // Spanish
  | 'fr' // French
  | 'ar' // Arabic
  | 'bn' // Bengali
  | 'ru' // Russian
  | 'pt' // Portuguese
  | 'id' // Indonesian
  | 'ur' // Urdu
  | 'de'; // German

// Информация о языках для отображения
export const languageInfo: Record<Language, { name: string, nativeName: string, flag: string }> = {
  'en': { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  'zh': { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  'ar': { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  'bn': { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  'ru': { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  'id': { name: 'Indonesian', nativeName: 'Indonesia', flag: '🇮🇩' },
  'ur': { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  'de': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
};

// Интерфейс контекста
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Функция перевода
  languageInfo: typeof languageInfo;
}

// Создаем контекст
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Провайдер контекста
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  // Функция перевода
  const t = (key: string): string => {
    if (!translations[language][key]) {
      console.warn(`Translation key "${key}" not found for language ${language}`);
      // Вернем английский перевод если нет для текущего языка
      return translations['en'][key] || key;
    }
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования контекста
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};