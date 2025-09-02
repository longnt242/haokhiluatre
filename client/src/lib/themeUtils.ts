import { modernTheme } from '../themes/modern';
import { traditionalTheme } from '../themes/traditional';
import type { ThemeType } from '../contexts/ThemeContext';

export function applyThemeVariables(theme: ThemeType) {
  const themeConfig = theme === 'modern' ? modernTheme : traditionalTheme;
  
  const root = document.documentElement;
  
  // Apply color variables
  root.style.setProperty('--bg', themeConfig.background);
  root.style.setProperty('--bg-muted', themeConfig.backgroundMuted);
  root.style.setProperty('--surface', themeConfig.surface);
  root.style.setProperty('--text', themeConfig.foreground);
  root.style.setProperty('--text-muted', themeConfig.foregroundMuted);
  
  root.style.setProperty('--primary', themeConfig.primary);
  root.style.setProperty('--primary-contrast', themeConfig.primaryContrast);
  root.style.setProperty('--primary-foreground', themeConfig.primaryForeground);
  
  root.style.setProperty('--accent', themeConfig.accent);
  root.style.setProperty('--accent-contrast', themeConfig.accentContrast);
  root.style.setProperty('--accent-foreground', themeConfig.accentForeground);
  
  root.style.setProperty('--secondary', themeConfig.secondary);
  root.style.setProperty('--secondary-foreground', themeConfig.secondaryForeground);
  
  root.style.setProperty('--border', themeConfig.border);
  root.style.setProperty('--ring', themeConfig.ring);
  
  // Apply typography variables
  root.style.setProperty('--font-family', themeConfig.fontFamily);
  root.style.setProperty('--font-family-display', themeConfig.fontFamilyDisplay);
  root.style.setProperty('--font-family-body', themeConfig.fontFamilyBody);
  
  // Apply layout variables
  root.style.setProperty('--radius', themeConfig.radius);
  root.style.setProperty('--radius-large', themeConfig.radiusLarge);
  root.style.setProperty('--radius-small', themeConfig.radiusSmall);
  
  // Apply shadow variables
  root.style.setProperty('--shadow-elev-1', themeConfig.shadowElevation1);
  root.style.setProperty('--shadow-elev-2', themeConfig.shadowElevation2);
  root.style.setProperty('--shadow-elev-3', themeConfig.shadowElevation3);
  
  // Apply spacing
  root.style.setProperty('--spacing', themeConfig.spacing);
  
  // Apply effects
  root.style.setProperty('--backdrop-blur', themeConfig.backdropBlur);
  root.style.setProperty('--background-texture', themeConfig.backgroundTexture);
  root.style.setProperty('--pattern-opacity', themeConfig.patternOpacity);
}