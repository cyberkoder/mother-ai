import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AIProvider = 'ollama' | 'openai' | 'google' | 'anthropic';
export type ColorTheme = 'green' | 'yellow' | 'blue' | 'red' | 'purple' | 'cyan' | 'alienEarth';

export interface Settings {
  // AI Provider settings
  aiProvider: AIProvider;
  ollamaUrl: string;
  openaiApiKey: string;
  googleApiKey: string;
  anthropicApiKey: string;
  currentModel: string;
  
  // Theme settings
  colorTheme: ColorTheme;
  
  // Display settings
  enableSounds: boolean;
  showScanlines: boolean;
}

const defaultSettings: Settings = {
  aiProvider: 'ollama',
  ollamaUrl: 'https://ollama.whitetailnas.app',
  openaiApiKey: '',
  googleApiKey: '',
  anthropicApiKey: '',
  currentModel: 'llama3.1:8b',
  colorTheme: 'green',
  enableSounds: true,
  showScanlines: true,
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mother-ai-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mother-ai-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('mother-ai-settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};