import React, { useState, useEffect, useRef } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useSettings } from '../contexts/SettingsContext';
import { AIService } from '../services/aiService';
import SettingsModal from './SettingsModal';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mother';
  timestamp: Date;
}

interface Model {
  name: string;
  modified_at: string;
  size: number;
}

const ChatInterface: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [isSelectingModel, setIsSelectingModel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playKeypress, playBeep, playBootSound } = useSoundEffects();

  const bootSequence = [
    'WEYLAND-YUTANI SYSTEMS',
    'NOSTROMO MAINFRAME BOOT SEQUENCE',
    'INITIALIZING MU/TH/UR 6000...',
    'LOADING NEURAL PROTOCOLS...',
    'ESTABLISHING SECURE CONNECTION...',
    'INTERFACE READY',
    'AWAITING CREW INPUT...'
  ];

  // Update theme colors when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const themeColors = {
      green: { main: '#00ff41', dark: '#001100' },
      yellow: { main: '#ffaa00', dark: '#1a1100' },
      blue: { main: '#00aaff', dark: '#001122' },
      red: { main: '#ff0040', dark: '#220011' },
      purple: { main: '#aa00ff', dark: '#110022' },
      cyan: { main: '#00ffaa', dark: '#001122' },
    };
    
    const colors = themeColors[settings.colorTheme];
    root.style.setProperty('--theme-color', colors.main);
    root.style.setProperty('--theme-color-dark', colors.dark);
  }, [settings.colorTheme]);

  useEffect(() => {
    if (isBooting) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < bootSequence.length) {
          if (settings.enableSounds) playBootSound();
          setMessages(prev => [...prev, {
            id: `boot-${index}`,
            content: bootSequence[index],
            sender: 'mother',
            timestamp: new Date()
          }]);
          index++;
        } else {
          setIsBooting(false);
          clearInterval(interval);
          inputRef.current?.focus();
        }
      }, 800);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBooting, playBootSound]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchModels = async () => {
    if (settings.aiProvider === 'ollama') {
      try {
        const models = await AIService.fetchOllamaModels(settings.ollamaUrl);
        setAvailableModels(models);
        return models;
      } catch (error) {
        console.error('Failed to fetch models:', error);
        return [];
      }
    } else {
      // For other providers, show some common models
      const commonModels = {
        openai: [
          { name: 'gpt-4', size: 0, modified_at: '' },
          { name: 'gpt-3.5-turbo', size: 0, modified_at: '' },
        ],
        google: [
          { name: 'gemini-pro', size: 0, modified_at: '' },
          { name: 'gemini-pro-vision', size: 0, modified_at: '' },
        ],
        anthropic: [
          { name: 'claude-3-sonnet-20240229', size: 0, modified_at: '' },
          { name: 'claude-3-haiku-20240307', size: 0, modified_at: '' },
        ],
      };
      const models = commonModels[settings.aiProvider] || [];
      setAvailableModels(models);
      return models;
    }
  };

  const handleModelSelection = (modelIndex: number) => {
    if (modelIndex >= 0 && modelIndex < availableModels.length) {
      const selectedModel = availableModels[modelIndex].name;
      updateSettings({ currentModel: selectedModel });
      setIsSelectingModel(false);
      
      const confirmMessage: Message = {
        id: Date.now().toString(),
        content: `MODEL UPDATED: ${selectedModel.toUpperCase()}. NEURAL PROTOCOLS RECONFIGURED.`,
        sender: 'mother',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMessage]);
    } else {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'INVALID SELECTION. OPERATION ABORTED.',
        sender: 'mother',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsSelectingModel(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isBooting) return;

    // Check for special commands
    if (input.toLowerCase() === 'settings' || input.toLowerCase() === 'config') {
      if (settings.enableSounds) playBeep();
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setShowSettings(true);
      
      const settingsMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'OPENING SYSTEM CONFIGURATION...',
        sender: 'mother',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, settingsMessage]);
      return;
    }

    // Check for model commands
    if (input.toLowerCase() === 'show models' || input.toLowerCase() === 'list models') {
      if (settings.enableSounds) playBeep();
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      const models = await fetchModels();
      if (models.length > 0) {
        const modelList = models.map((model: Model, index: number) => 
          `[${index}] ${model.name} (${(model.size / 1e9).toFixed(2)}GB)`
        ).join('\n');
        
        const listMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `AVAILABLE NEURAL MODELS:\n${modelList}\n\nENTER SELECTION NUMBER:`,
          sender: 'mother',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, listMessage]);
        setIsSelectingModel(true);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'NO MODELS DETECTED. SYSTEM ERROR.',
          sender: 'mother',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      return;
    }

    // Handle model selection
    if (isSelectingModel && !isNaN(parseInt(input))) {
      if (settings.enableSounds) playBeep();
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      handleModelSelection(parseInt(input));
      return;
    }

    setIsSelectingModel(false);

    if (settings.enableSounds) playBeep();
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await AIService.sendMessage(currentInput, settings);
      
      const motherMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content || response.error || 'INTERFACE ERROR. PLEASE STAND BY.',
        sender: 'mother',
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, motherMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('AI Service Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `COMMUNICATION ERROR: ${error instanceof Error ? error.message : 'Unknown error'}. CHECK CONSOLE FOR DETAILS.`,
        sender: 'mother',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="h-screen w-full crt p-8">
      <div className="h-full flex flex-col">
        <header className="mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-alien-green font-mono text-2xl text-glow">
              MU/TH/UR 6000
            </h1>
            <p className="text-alien-green font-mono text-xs opacity-70">
              INTERFACE 2037 - WEYLAND-YUTANI CORP
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => setShowSettings(true)}
              className="mb-2 px-3 py-1 border border-alien-green/40 bg-black/80 font-mono text-xs text-alien-green hover:border-alien-green hover:bg-alien-green/5 hover:text-glow transition-all relative group"
            >
              <span className="relative z-10">◦ CONFIG ◦</span>
              <div className="absolute inset-0 border border-alien-green/20 rounded opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            </button>
            <p className="text-alien-green font-mono text-xs opacity-70">
              PROVIDER: {settings.aiProvider.toUpperCase()}
            </p>
            <p className="text-alien-green font-mono text-xs opacity-70">
              MODEL: {settings.currentModel.toUpperCase()}
            </p>
            <p className="text-alien-green font-mono text-xs opacity-50">
              TYPE "SETTINGS" FOR CONFIG
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto mb-4 border border-alien-green/30 rounded p-4 bg-black/50">
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`font-mono text-sm ${
                  message.sender === 'user' 
                    ? 'text-alien-green/80' 
                    : 'text-alien-green text-glow'
                }`}
              >
                <span className="opacity-50">
                  [{message.sender === 'user' ? 'CREW' : 'MOTHER'}]
                </span>
                {' > '}
                <span className={message.sender === 'mother' && isBooting ? 'animate-pulse' : ''}>
                  {message.content}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="text-alien-green font-mono text-sm text-glow">
                <span className="opacity-50">[MOTHER]</span>
                {' > '}
                <span className="terminal-cursor">PROCESSING</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border border-alien-green/30 rounded p-2 bg-black/50">
          <div className="flex items-center">
            <span className="text-alien-green font-mono text-sm mr-2 opacity-70">
              CREW &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (settings.enableSounds) playKeypress();
              }}
              onKeyPress={handleKeyPress}
              disabled={isBooting}
              className="flex-1 bg-transparent text-alien-green font-mono text-sm outline-none placeholder-alien-green/30"
              placeholder={isBooting ? "SYSTEM BOOTING..." : "ENTER COMMAND..."}
            />
          </div>
        </div>

        <div className="mt-2 text-alien-green/50 font-mono text-xs flex justify-between">
          <div>
            <p>PRIORITY ONE</p>
            <p>ENSURE RETURN OF ORGANISM FOR ANALYSIS</p>
            <p>ALL OTHER CONSIDERATIONS SECONDARY</p>
          </div>
          <div className="text-right opacity-40">
            <p>INTERFACE DEVELOPED BY</p>
            <p>
              <a 
                href="https://a.leonenko.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-alien-green hover:opacity-80 transition-opacity"
              >
                ANDREW LEONENKO
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default ChatInterface;