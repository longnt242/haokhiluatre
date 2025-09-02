import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyThemeVariables } from '../lib/themeUtils';

export type ThemeType = 'modern' | 'trad';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeType>('modern');

  useEffect(() => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    
    if (urlTheme === 'modern' || urlTheme === 'trad') {
      setThemeState(urlTheme);
      localStorage.setItem('theme', urlTheme);
    } else {
      // Check localStorage
      const savedTheme = localStorage.getItem('theme') as ThemeType;
      if (savedTheme === 'modern' || savedTheme === 'trad') {
        setThemeState(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to HTML element
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply theme-specific classes to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    
    // Apply theme variables to CSS
    applyThemeVariables(theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'modern' ? 'trad' : 'modern';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}