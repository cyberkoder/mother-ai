import React, { useState, useEffect } from 'react';
import { useSettings, AIProvider, ColorTheme } from '../contexts/SettingsContext';
import { AIService } from '../services/aiService';

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'provider' | 'theme' | 'display'>('provider');
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  // Fetch Ollama models when modal opens and Ollama is selected
  useEffect(() => {
    if (isOpen && settings.aiProvider === 'ollama') {
      loadOllamaModels();
    }
  }, [isOpen, settings.aiProvider, settings.ollamaUrl]);

  const loadOllamaModels = async () => {
    if (!settings.ollamaUrl) return;
    
    setLoadingModels(true);
    try {
      const models = await AIService.fetchOllamaModels(settings.ollamaUrl);
      setOllamaModels(models);
    } catch (error) {
      console.error('Failed to load Ollama models:', error);
      setOllamaModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  if (!isOpen) return null;

  const aiProviders: { value: AIProvider; label: string }[] = [
    { value: 'ollama', label: 'OLLAMA (LOCAL)' },
    { value: 'openai', label: 'OPENAI GPT' },
    { value: 'google', label: 'GOOGLE GEMINI' },
    { value: 'anthropic', label: 'ANTHROPIC CLAUDE' },
  ];

  const colorThemes: { value: ColorTheme; label: string; color: string }[] = [
    { value: 'green', label: 'ALIEN GREEN', color: '#00ff41' },
    { value: 'yellow', label: 'AMBER TERMINAL', color: '#ffaa00' },
    { value: 'blue', label: 'CYBER BLUE', color: '#00aaff' },
    { value: 'red', label: 'HAL 9000 RED', color: '#ff0040' },
    { value: 'purple', label: 'VOID PURPLE', color: '#aa00ff' },
    { value: 'cyan', label: 'MATRIX CYAN', color: '#00ffaa' },
    { value: 'alienEarth', label: 'ALIEN EARTH', color: '#ffb86c' },
  ];

  const handleProviderChange = (provider: AIProvider) => {
    updateSettings({ aiProvider: provider });
    
    // Load models if switching to Ollama
    if (provider === 'ollama') {
      loadOllamaModels();
    }
  };

  const handleApiKeyChange = (key: string, value: string) => {
    updateSettings({ [key]: value });
  };

  const handleThemeChange = (theme: ColorTheme) => {
    updateSettings({ colorTheme: theme });
    // Update CSS custom properties
    const root = document.documentElement;
    const themeColors = {
      green: '#00ff41',
      yellow: '#ffaa00',
      blue: '#00aaff',
      red: '#ff0040',
      purple: '#aa00ff',
      cyan: '#00ffaa',
      alienEarth: '#ffb86c',
    };
    root.style.setProperty('--theme-color', themeColors[theme]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className={`bg-black border-2 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto text-alien-green`} style={{ borderColor: 'var(--theme-color)', color: 'var(--theme-color)' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-mono text-glow">SYSTEM CONFIGURATION</h2>
          <button
            onClick={onClose}
            className="text-2xl font-mono hover:opacity-80 transition-opacity"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-alien-green">
          {[
            { key: 'provider', label: 'AI PROVIDER' },
            { key: 'theme', label: 'VISUAL THEME' },
            { key: 'display', label: 'DISPLAY' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 font-mono text-sm border-r border-alien-green transition-all ${
                activeTab === tab.key 
                  ? 'opacity-100 bg-black border-b-2 border-b-alien-green text-alien-green' 
                  : 'opacity-60 hover:opacity-80 bg-transparent text-alien-green'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Provider Tab */}
        {activeTab === 'provider' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-mono mb-4">SELECT AI PROVIDER</h3>
              <div className="grid grid-cols-2 gap-3">
                {aiProviders.map((provider) => (
                  <button
                    key={provider.value}
                    onClick={() => handleProviderChange(provider.value)}
                    className={`p-3 border rounded font-mono text-sm transition-all ${
                      settings.aiProvider === provider.value
                        ? 'bg-black border-alien-green border-2 text-alien-green shadow-lg'
                        : 'border-alien-green text-alien-green hover:border-2'
                    }`}
                  >
                    {provider.label}
                  </button>
                ))}
              </div>
            </div>

            {/* API Configuration */}
            <div className="space-y-4">
              {settings.aiProvider === 'ollama' && (
                <div>
                  <label className="block font-mono text-sm mb-2">OLLAMA SERVER URL</label>
                  <input
                    type="text"
                    value={settings.ollamaUrl}
                    onChange={(e) => updateSettings({ ollamaUrl: e.target.value })}
                    className="w-full bg-transparent border-2 border-alien-green rounded p-2 font-mono text-sm text-alien-green placeholder-alien-green/30"
                    placeholder="https://your-ollama-server.com"
                  />
                </div>
              )}

              {settings.aiProvider === 'openai' && (
                <div>
                  <label className="block font-mono text-sm mb-2">OPENAI API KEY</label>
                  <input
                    type="password"
                    value={settings.openaiApiKey}
                    onChange={(e) => handleApiKeyChange('openaiApiKey', e.target.value)}
                    className="w-full bg-transparent border-2 border-alien-green rounded p-2 font-mono text-sm text-alien-green placeholder-alien-green/30"
                    placeholder="sk-..."
                  />
                </div>
              )}

              {settings.aiProvider === 'google' && (
                <div>
                  <label className="block font-mono text-sm mb-2">GOOGLE API KEY</label>
                  <input
                    type="password"
                    value={settings.googleApiKey}
                    onChange={(e) => handleApiKeyChange('googleApiKey', e.target.value)}
                    className="w-full bg-transparent border-2 border-alien-green rounded p-2 font-mono text-sm text-alien-green placeholder-alien-green/30"
                    placeholder="AI..."
                  />
                </div>
              )}

              {settings.aiProvider === 'anthropic' && (
                <div>
                  <label className="block font-mono text-sm mb-2">ANTHROPIC API KEY</label>
                  <input
                    type="password"
                    value={settings.anthropicApiKey}
                    onChange={(e) => handleApiKeyChange('anthropicApiKey', e.target.value)}
                    className="w-full bg-transparent border-2 border-alien-green rounded p-2 font-mono text-sm text-alien-green placeholder-alien-green/30"
                    placeholder="sk-ant-..."
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-mono text-sm">CURRENT MODEL</label>
                  {settings.aiProvider === 'ollama' && (
                    <button
                      onClick={loadOllamaModels}
                      disabled={loadingModels}
                      className="px-2 py-1 border-2 border-alien-green rounded font-mono text-xs text-alien-green hover:bg-alien-green hover:bg-opacity-20 transition-all disabled:opacity-50"
                    >
                      {loadingModels ? 'LOADING...' : 'REFRESH'}
                    </button>
                  )}
                </div>
                
                {settings.aiProvider === 'ollama' ? (
                  <select
                    value={settings.currentModel}
                    onChange={(e) => updateSettings({ currentModel: e.target.value })}
                    className="w-full bg-black border-2 border-alien-green rounded p-2 font-mono text-sm text-alien-green"
                    disabled={loadingModels}
                  >
                    <option value="">SELECT MODEL...</option>
                    {ollamaModels.map((model) => (
                      <option key={model.name} value={model.name} className="bg-black text-alien-green">
                        {model.name} ({(model.size / 1e9).toFixed(1)}GB)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={settings.currentModel}
                    onChange={(e) => updateSettings({ currentModel: e.target.value })}
                    className="w-full bg-transparent border-2 border-alien-green rounded p-2 font-mono text-sm text-alien-green placeholder-alien-green/30"
                    placeholder="model-name"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-mono mb-4">SELECT COLOR THEME</h3>
              <div className="grid grid-cols-2 gap-3">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className={`p-3 border rounded font-mono text-sm transition-all flex items-center justify-between ${
                      settings.colorTheme === theme.value
                        ? 'border-2 bg-opacity-20'
                        : 'border hover:border-2'
                    }`}
                    style={{
                      borderColor: theme.color,
                      backgroundColor: settings.colorTheme === theme.value ? theme.color + '33' : 'transparent',
                      color: theme.color,
                    }}
                  >
                    <span>{theme.label}</span>
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: theme.color, borderColor: theme.color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Display Tab */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-mono mb-4">DISPLAY OPTIONS</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.enableSounds}
                    onChange={(e) => updateSettings({ enableSounds: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="font-mono text-sm">ENABLE SOUND EFFECTS</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.showScanlines}
                    onChange={(e) => updateSettings({ showScanlines: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="font-mono text-sm">SHOW CRT SCANLINES</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-alien-green flex justify-between">
          <button
            onClick={resetSettings}
            className="px-4 py-2 border-2 border-alien-green rounded font-mono text-sm text-alien-green hover:bg-alien-green hover:bg-opacity-20 transition-all"
          >
            RESET TO DEFAULTS
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-alien-green bg-opacity-80 border-2 border-alien-green rounded font-mono text-sm text-black hover:bg-opacity-100 transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;