import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gurucraft_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark'; // Default to premium dark theme
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('gurucraft_theme', theme);

    // Dynamically update browser tab favicon to match active theme
    const activeFavicon = theme === 'dark' ? '/favicon-dark.jpg' : '/favicon-light.jpg';
    const iconLinks = document.querySelectorAll("link[rel*='icon']");
    if (iconLinks.length > 0) {
      iconLinks.forEach((el) => {
        (el as HTMLLinkElement).href = activeFavicon;
      });
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = activeFavicon;
      document.head.appendChild(newLink);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
