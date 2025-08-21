import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useSettings } from '../contexts/SettingsContext';
import { AIService } from '../services/aiService';
import { wikiDB } from '../services/wikiDatabase';
import { Planet, Alien, Character, Organization, Spaceship, Movie } from '../types/wiki';
import SettingsModal from './SettingsModal';
import Suggestions from './Suggestions';

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
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<{ [key: string]: string }>({});
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBooting, setIsBooting] = useState(true);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [isSelectingModel, setIsSelectingModel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playKeypress, playBeep, playBootSound } = useSoundEffects();

  const bootSequence = [
    'WEYLAND-YUTANI SYSTEMS',
    'NOSTROMO MAINFRAME BOOT SEQUENCE',
    'INITIALIZING MU/TH/UR 6000...', 
    'LOADING NEURAL PROTOCOLS...', 
    'LOADING KNOWLEDGE DATABASE...', 
    'ESTABLISHING SECURE CONNECTION...', 
    'INTERFACE READY',
    'AWAITING CREW INPUT...'
  ];

  // Copy message to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (settings.enableSounds) playBeep();
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Clear chat messages
  const clearChat = () => {
    setMessages([]);
    setCommandHistory([]);
    setHistoryIndex(-1);
    setInput('');
    setTypingMessageId(null);
    setDisplayedText({});
    setSuggestions([]);
    if (settings.enableSounds) playBeep();
  };

  const generateSuggestions = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    const newSuggestions: string[] = [];

    if (lowerText.includes('planet')) {
      newSuggestions.push('What is the climate of this planet?', 'Who are the inhabitants?', 'What are its notable locations?');
    } else if (lowerText.includes('alien') || lowerText.includes('xenomorph') || lowerText.includes('hybrid')) {
      newSuggestions.push('What is their home planet?', 'What are their notable abilities?', 'Tell me about their culture.');
    } else if (lowerText.includes('directive')) {
      newSuggestions.push('What is your primary directive?', 'Do you have other directives?', 'Who gave you these directives?');
    } else if (lowerText.includes('system') || lowerText.includes('status')) {
      newSuggestions.push('What is the status of the ship?', 'Are there any system alerts?', 'Report on power levels.');
    }

    setSuggestions(newSuggestions);
  }, []);

  // Typewriter effect for MOTHER's messages
  const typewriterEffect = useCallback((messageId: string, text: string, speed: number = 30) => {
    const formattedText = text.replace(/(\d+\.\s)/g, '\n$1').trim();
    let index = 0;
    setDisplayedText(prev => ({ ...prev, [messageId]: '' }));
    
    const interval = setInterval(() => {
      if (index < formattedText.length) {
        setDisplayedText(prev => ({
          ...prev,
          [messageId]: formattedText.substring(0, index + 1)
        }));
        index++;
        if (settings.enableSounds && index % 3 === 0) {
          playKeypress();
        }
      } else {
        clearInterval(interval);
        setTypingMessageId(null);
        generateSuggestions(formattedText);
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [settings.enableSounds, playKeypress, generateSuggestions]);

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
      alienEarth: { main: '#ffb86c', dark: '#0d1a26' },
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
          const bootMessage = {
            id: `boot-${index}`,
            content: bootSequence[index],
            sender: 'mother' as const,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, bootMessage]);
          setTypingMessageId(bootMessage.id);
          typewriterEffect(bootMessage.id, bootMessage.content, 15);
          index++;
        } else {
          setIsBooting(false);
          clearInterval(interval);
          inputRef.current?.focus();
        }
      }, 1200);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBooting, playBootSound, typewriterEffect]);

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

  const handleWikiCommand = (input: string): string => {
    const parts = input.trim().split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case '/wiki':
        if (args.length === 0) {
          return `NOSTROMO KNOWLEDGE DATABASE ACTIVE\n\nAVAILABLE COMMANDS:\n/planets [search] - Search planetary database\n/aliens [search] - Search xenobiological database\n/characters [search] - Search character database\n/organizations [search] - Search organization database\n/spaceships [search] - Search spaceship database\n/movies [search] - Search movie database\n/wiki help - Show this help message\n\nEXAMPLES:\n/planets LV-426\n/aliens Xenomorph\n/characters Ripley\n\nDATABASE ENTRIES: ${wikiDB.getAllPlanets().length} planets, ${wikiDB.getAllAliens().length} aliens, ${wikiDB.getAllCharacters().length} characters, ${wikiDB.getAllOrganizations().length} organizations, ${wikiDB.getAllSpaceships().length} spaceships, ${wikiDB.getAllMovies().length} movies`;
        }
        if (args[0] === 'help') {
          return handleWikiCommand('/wiki');
        }
        break;

      case '/planets':
        if (args.length === 0) {
          const planets = wikiDB.getAllPlanets();
          return `PLANETARY DATABASE - ${planets.length} ENTRIES:\n\n${planets.map(p => `• ${p.name.toUpperCase()} (${p.franchise}) - ${p.classification}`).join('\n')}\n\nUse: /planets [name] to get detailed information`;
        } else {
          const query = args.join(' ');
          const results = wikiDB.searchPlanets(query);
          if (results.length > 0) {
            if (results.length === 1) {
              return formatPlanetDetails(results[0]);
            } else {
              return `PLANETARY SEARCH RESULTS (${results.length}):\n\n${results.map(p => `• ${p.name.toUpperCase()} (${p.franchise}) - ${p.classification}`).join('\n')}\n\nUse: /planets [exact name] for detailed information`;
            }
          } else {
            return `NO PLANETARY DATA FOUND FOR: "${query.toUpperCase()}"\n\nSUGGESTION: Try /planets to see all available entries`;
          }
        }
        break;

      case '/aliens':
        if (args.length === 0) {
          const aliens = wikiDB.getAllAliens();
          return `XENOBIOLOGICAL DATABASE - ${aliens.length} ENTRIES:\n\n${aliens.map(a => `• ${a.name.toUpperCase()} (${a.franchise}) - ${a.classification}`).join('\n')}\n\nUse: /aliens [name] to get detailed information`;
        } else {
          const query = args.join(' ');
          const results = wikiDB.searchAliens(query);
          if (results.length > 0) {
            if (results.length === 1) {
              return formatAlienDetails(results[0]);
            } else {
              return `XENOBIOLOGICAL SEARCH RESULTS (${results.length}):\n\n${results.map(a => `• ${a.name.toUpperCase()} (${a.franchise}) - ${a.classification}`).join('\n')}\n\nUse: /aliens [exact name] for detailed information`;
            }
          } else {
            return `NO XENOBIOLOGICAL DATA FOUND FOR: "${query.toUpperCase()}"\n\nSUGGESTION: Try /aliens to see all available entries`;
          }
        }
        break;

      case '/characters':
        if (args.length === 0) {
          const characters = wikiDB.getAllCharacters();
          return `CHARACTER DATABASE - ${characters.length} ENTRIES:\n\n${characters.map(c => `• ${c.name.toUpperCase()} (${c.franchise}) - ${c.occupation}`).join('\n')}\n\nUse: /characters [name] to get detailed information`;
        } else {
          const query = args.join(' ');
          const results = wikiDB.searchCharacters(query);
          if (results.length > 0) {
            if (results.length === 1) {
              return formatCharacterDetails(results[0]);
            } else {
              return `CHARACTER SEARCH RESULTS (${results.length}):\n\n${results.map(c => `• ${c.name.toUpperCase()} (${c.franchise}) - ${c.occupation}`).join('\n')}\n\nUse: /characters [exact name] for detailed information`;
            }
          } else {
            return `NO CHARACTER DATA FOUND FOR: "${query.toUpperCase()}"\n\nSUGGESTION: Try /characters to see all available entries`;
          }
        }
        break;

      case '/organizations':
        if (args.length === 0) {
          const organizations = wikiDB.getAllOrganizations();
          return `ORGANIZATION DATABASE - ${organizations.length} ENTRIES:\n\n${organizations.map(o => `• ${o.name.toUpperCase()} (${o.franchise}) - ${o.type}`).join('\n')}\n\nUse: /organizations [name] to get detailed information`;
        } else {
          const query = args.join(' ');
          const results = wikiDB.searchOrganizations(query);
          if (results.length > 0) {
            if (results.length === 1) {
              return formatOrganizationDetails(results[0]);
            } else {
              return `ORGANIZATION SEARCH RESULTS (${results.length}):\n\n${results.map(o => `• ${o.name.toUpperCase()} (${o.franchise}) - ${o.type}`).join('\n')}\n\nUse: /organizations [exact name] for detailed information`;
            }
          } else {
            return `NO ORGANIZATION DATA FOUND FOR: "${query.toUpperCase()}"\n\nSUGGESTION: Try /organizations to see all available entries`;
          }
        }
        break;

      case '/spaceships':
        if (args.length === 0) {
          const spaceships = wikiDB.getAllSpaceships();
          return `SPACESHIP DATABASE - ${spaceships.length} ENTRIES:\n\n${spaceships.map(s => `• ${s.name.toUpperCase()} (${s.franchise}) - ${s.class}`).join('\n')}\n\nUse: /spaceships [name] to get detailed information`;
        } else {
          const query = args.join(' ');
          const results = wikiDB.searchSpaceships(query);
          if (results.length > 0) {
            if (results.length === 1) {
              return formatSpaceshipDetails(results[0]);
            } else {
              return `SPACESHIP SEARCH RESULTS (${results.length}):\n\n${results.map(s => `• ${s.name.toUpperCase()} (${s.franchise}) - ${s.class}`).join('\n')}\n\nUse: /spaceships [exact name] for detailed information`;
            }
          } else {
            return `NO SPACESHIP DATA FOUND FOR: "${query.toUpperCase()}"\n\nSUGGESTION: Try /spaceships to see all available entries`;
          }
        }
        break;

        case '/movies':
            if (args.length === 0) {
                const movies = wikiDB.getAllMovies();
                return `MOVIE DATABASE - ${movies.length} ENTRIES:\n\n${movies.map(m => `• ${m.name.toUpperCase()} (${m.franchise}) - ${m.release_year}`).join('\n')}\n\nUse: /movies [name] to get detailed information`;
            } else {
                const query = args.join(' ');
                const results = wikiDB.searchMovies(query);
                if (results.length > 0) {
                    if (results.length === 1) {
                        return formatMovieDetails(results[0]);
                    } else {
                        return `MOVIE SEARCH RESULTS (${results.length}):\n\n${results.map(m => `• ${m.name.toUpperCase()} (${m.franchise}) - ${m.release_year}`).join('\n')}\n\nUse: /movies [exact name] for detailed information`;
                    }
                } else {
                    return `NO MOVIE DATA FOUND FOR: "${query.toUpperCase()}"\n\nSUGGESTION: Try /movies to see all available entries`;
                }
            }
            break;

      default:
        return 'UNKNOWN WIKI COMMAND. Use /wiki for help.';
    }
    return 'COMMAND PROCESSING ERROR.';
  };

  const formatPlanetDetails = (planet: Planet): string => {
    return `PLANETARY ANALYSIS: ${planet.name.toUpperCase()}\n\nCLASSIFICATION: ${planet.classification}\nLOCATION: ${planet.location}\nATMOSPHERE: ${planet.atmosphere}\nGRAVITY: ${planet.gravity}\nCLIMATE: ${planet.climate}\n\nDESCRIPTION:\n${planet.description}\n\nNOTABLE FEATURES:\n${planet.notable_features.map(f => `• ${f}`).join('\n')}\n\nNOTABLE LOCATIONS:\n${planet.notable_locations.map(l => `• ${l}`).join('\n')}\n\nINHABITANTS: ${planet.inhabitants.join(', ')}\nFIRST DOCUMENTED: ${planet.first_appearance}`;
  };

  const formatAlienDetails = (alien: Alien): string => {
    return `XENOBIOLOGICAL ANALYSIS: ${alien.name.toUpperCase()}\n\nSPECIES: ${alien.species}\nCLASSIFICATION: ${alien.classification}\nHOME PLANET: ${alien.home_planet}\nINTELLIGENCE LEVEL: ${alien.intelligence_level}\nPHYSIOLOGY: ${alien.physiology}\n\nDESCRIPTION:\n${alien.description}\n\nNOTABLE ABILITIES:\n${alien.notable_abilities.map(a => `• ${a}`).join('\n')}\n\nNOTABLE INDIVIDUALS:\n${alien.notable_individuals.map(i => `• ${i}`).join('\n')}\n\nFIRST DOCUMENTED: ${alien.first_appearance}`;
  };

  const formatCharacterDetails = (character: Character): string => {
    return `CHARACTER ANALYSIS: ${character.name.toUpperCase()}\n\nSPECIES: ${character.species}\nOCCUPATION: ${character.occupation}\nAFFILIATION: ${character.affiliation}\nSTATUS: ${character.status}\n\nHISTORY:\n${character.history}\n\nFIRST APPEARANCE: ${character.first_appearance}`;
    };

    const formatOrganizationDetails = (organization: Organization): string => {
    return `ORGANIZATION ANALYSIS: ${organization.name.toUpperCase()}\n\nTYPE: ${organization.type}\nHEADQUARTERS: ${organization.headquarters}\nLEADER: ${organization.leader}\n\nHISTORY:\n${organization.history}\n\nFIRST APPEARANCE: ${organization.first_appearance}`;
    };

    const formatSpaceshipDetails = (spaceship: Spaceship): string => {
    return `SPACESHIP ANALYSIS: ${spaceship.name.toUpperCase()}\n\nCLASS: ${spaceship.class}\nREGISTRY: ${spaceship.registry}\nOWNER: ${spaceship.owner}\nOPERATOR: ${spaceship.operator}\nSTATUS: ${spaceship.status}\n\nHISTORY:\n${spaceship.history}\n\nFIRST APPEARANCE: ${spaceship.first_appearance}`;
    };

    const formatMovieDetails = (movie: Movie): string => {
        return `MOVIE ANALYSIS: ${movie.name.toUpperCase()}\n\nDIRECTOR: ${movie.director}\nRELEASE YEAR: ${movie.release_year}\n\nPLOT SUMMARY:\n${movie.plot_summary}\n\nCHARACTERS:\n${movie.characters?.join(', ')}\n\nSETTING: ${movie.setting}`;
    };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const sendMessage = async () => {
    if (!input.trim() || isBooting) return;

    // Add command to history
    if (input.trim() && !commandHistory.includes(input.trim())) {
      setCommandHistory(prev => [...prev.slice(-19), input.trim()]); // Keep last 20 commands
    }
    setHistoryIndex(-1);
    setSuggestions([]);

    // Check for special commands
    if (input.toLowerCase() === 'clear' || input.toLowerCase() === 'cls') {
      if (settings.enableSounds) playBeep();
      clearChat();
      return;
    }
    
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
      setTypingMessageId(settingsMessage.id);
      typewriterEffect(settingsMessage.id, settingsMessage.content, 20);
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

    // Check for wiki commands
    if (input.toLowerCase().startsWith('/planets') || input.toLowerCase().startsWith('/aliens') || input.toLowerCase().startsWith('/characters') || input.toLowerCase().startsWith('/organizations') || input.toLowerCase().startsWith('/spaceships') || input.toLowerCase().startsWith('/movies') ||
        input.toLowerCase().startsWith('/wiki')) {
      if (settings.enableSounds) playBeep();
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      const wikiResponse = handleWikiCommand(input.toLowerCase());
      const motherMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: wikiResponse,
        sender: 'mother',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, motherMessage]);
      setTypingMessageId(motherMessage.id);
      typewriterEffect(motherMessage.id, motherMessage.content, 30);
      return;
    }

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

      const delay = Math.random() * 1000 + 500; // Random delay between 500ms and 1500ms
      setTimeout(() => {
        setMessages(prev => [...prev, motherMessage]);
        setIsTyping(false);
        setTypingMessageId(motherMessage.id);
        typewriterEffect(motherMessage.id, motherMessage.content);
      }, delay);
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
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div className="h-screen w-full crt p-8">
      <div className="h-full flex flex-col">
        <header className="mb-6 flex justify-between items-start">
          <div className="text-left">
            <h1 className="text-alien-green font-mono text-3xl text-glow tracking-wider">
              MU/TH/UR 6000
            </h1>
            <p className="text-alien-green font-mono text-sm opacity-70 mt-2">
              INTERFACE 2037 - WEYLAND-YUTANI CORP
            </p>
          </div>
          <div className="text-right">
            <div className="flex gap-2 mb-2">
              <button
                onClick={clearChat}
                className="px-3 py-1 border-2 border-alien-green bg-black/80 font-mono text-xs text-alien-green hover:border-alien-green hover:bg-alien-green/5 hover:text-glow transition-all relative group"
                title="Clear chat (or type 'clear)')"
              >
                <span className="relative z-10">◦ CLEAR ◦</span>
                <div className="absolute inset-0 border border-alien-green/20 rounded opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-1 border-2 border-alien-green bg-black/80 font-mono text-xs text-alien-green hover:border-alien-green hover:bg-alien-green/5 hover:text-glow transition-all relative group"
              >
                <span className="relative z-10">◦ CONFIG ◦</span>
                <div className="absolute inset-0 border border-alien-green/20 rounded opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              </button>
            </div>
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

        <div className="flex-1 overflow-y-auto mb-4 border-2 border-alien-green rounded p-4 bg-black/50">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`font-mono text-base ${ 
                  message.sender === 'user' 
                    ? 'pl-4 border-l-2 border-alien-green/50 text-alien-green' 
                    : 'text-alien-green text-glow'
                }`}
              >
                {message.sender === 'user' ? (
                  <>
                    <span className="text-sm opacity-70">
                      [CREW]
                    </span>
                    <span className="text-alien-green/60 ml-2">&gt;&gt; </span>
                    <span className="uppercase tracking-wider">{message.content}</span>
                  </>
                ) : (
                  <>
                    <div className="group relative">
                      <span className="text-alien-green text-glow">{'> '}</span>
                      <span className={`${message.sender === 'mother' && isBooting ? 'animate-pulse' : ''} text-glow whitespace-pre-wrap`}>
                        {typingMessageId === message.id 
                          ? displayedText[message.id] || ''
                          : message.content}
                        {typingMessageId === message.id && (
                          <span className="terminal-cursor animate-pulse ml-1">_</span>
                        )}
                      </span>
                      {/* Copy button - only show when not typing */}
                      {typingMessageId !== message.id && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs text-alien-green/60 hover:text-alien-green border border-alien-green/30 hover:border-alien-green/60 rounded bg-black/50 hover:bg-alien-green/5"
                          title="Copy response"
                        >
                          COPY
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="text-alien-green font-mono text-base text-glow">
                <span className="opacity-50">[MOTHER]</span>
                {' > '}
                <span className="terminal-cursor">PROCESSING</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-2 border-alien-green rounded bg-black/80">
          <div className="flex items-center p-3">
            <div className="flex items-center gap-2 mr-3">
              <div className="w-2 h-2 bg-alien-green rounded-full animate-pulse"></div>
              <span className="text-alien-green font-mono text-base uppercase tracking-wider">
                CREW
              </span>
            </div>
            <span className="text-alien-green/50 font-mono text-base mr-2">&gt;&gt;</span>
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
              className="flex-1 bg-transparent text-alien-green font-mono text-base outline-none placeholder-alien-green/30 uppercase tracking-wider"
              placeholder={isBooting ? "SYSTEM BOOTING..." : "ENTER COMMAND..."}
              style={{ textTransform: 'uppercase' }}
            />
            {input && (
              <span className="text-alien-green/30 text-xs font-mono ml-2">
                [{input.length} CHARS]
              </span>
            )}
          </div>
        </div>
        <Suggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />

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