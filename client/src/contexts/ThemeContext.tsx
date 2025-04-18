import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Инициализируем тему из localStorage или используем 'light' по умолчанию
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('prayer-app-theme');
    return (savedTheme as Theme) || 'light';
  });

  // Эффект для применения темы к документу
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Очистим предыдущие классы тем
    root.classList.remove('light-theme', 'dark-theme');
    
    // Добавим новый класс темы
    root.classList.add(`${theme}-theme`);
    
    // Сохраним выбор пользователя
    localStorage.setItem('prayer-app-theme', theme);
  }, [theme]);

  // Функция переключения темы
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для доступа к контексту темы
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};