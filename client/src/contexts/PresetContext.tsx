import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ComponentType } from 'react';

export type PresetType = 'modern' | 'trad' | 'premium';

interface PresetContextType {
  preset: PresetType;
  setPreset: (preset: PresetType) => void;
  togglePreset: () => void;
}

const PresetContext = createContext<PresetContextType | undefined>(undefined);

interface PresetProviderProps {
  children: React.ReactNode;
}

export function PresetProvider({ children }: PresetProviderProps) {
  const [preset, setPresetState] = useState<PresetType>('modern');

  useEffect(() => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlPreset = urlParams.get('preset');
    
    if (urlPreset === 'modern' || urlPreset === 'trad' || urlPreset === 'premium') {
      setPresetState(urlPreset);
      localStorage.setItem('preset', urlPreset);
    } else {
      // Check localStorage
      const savedPreset = localStorage.getItem('preset') as PresetType;
      if (savedPreset === 'modern' || savedPreset === 'trad' || savedPreset === 'premium') {
        setPresetState(savedPreset);
      }
    }
  }, []);

  useEffect(() => {
    // Apply preset to HTML element
    document.documentElement.setAttribute('data-preset', preset);
    document.body.setAttribute('data-preset', preset);
    
    // Apply preset-specific classes to body
    document.body.className = document.body.className.replace(/preset-\w+/g, '');
    document.body.classList.add(`preset-${preset}`);
  }, [preset]);

  const setPreset = (newPreset: PresetType) => {
    setPresetState(newPreset);
    localStorage.setItem('preset', newPreset);
  };

  const togglePreset = () => {
    const presets: PresetType[] = ['modern', 'trad', 'premium'];
    const currentIndex = presets.indexOf(preset);
    const nextIndex = (currentIndex + 1) % presets.length;
    setPreset(presets[nextIndex]);
  };

  return (
    <PresetContext.Provider value={{ preset, setPreset, togglePreset }}>
      {children}
    </PresetContext.Provider>
  );
}

export function usePreset() {
  const context = useContext(PresetContext);
  if (context === undefined) {
    throw new Error('usePreset must be used within a PresetProvider');
  }
  return context;
}

// Component registry types
export interface PresetComponentProps {
  [key: string]: any;
}

export type PresetComponents<T extends PresetComponentProps = PresetComponentProps> = {
  modern: ComponentType<T>;
  trad: ComponentType<T>;
  premium: ComponentType<T>;
};

export interface PresetRegistry {
  Navbar: PresetComponents;
  Hero: PresetComponents;
  ModelsGrid: PresetComponents;
  Gallery: PresetComponents;
  Videos: PresetComponents;
  Footer: PresetComponents;
  Button: PresetComponents;
  Card: PresetComponents;
}

// Component registry hook
export function usePresetComponent<K extends keyof PresetRegistry>(
  componentName: K
): PresetRegistry[K][PresetType] {
  const { preset } = usePreset();
  
  // We'll populate this registry as we create components
  const registry: Partial<PresetRegistry> = {
    // Will be populated by component imports
  };
  
  const component = registry[componentName]?.[preset];
  
  if (!component) {
    throw new Error(`No ${preset} variant found for component ${componentName}`);
  }
  
  return component;
}