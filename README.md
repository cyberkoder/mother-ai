# 🛸 MU/TH/UR 6000 - AI Interface & Knowledge Database

A retro-futuristic AI chatbot interface inspired by the MU/TH/UR 6000 computer from the *Alien* franchise. Experience the cold, calculated responses of an AI mainframe with authentic CRT monitor aesthetics, multiple AI provider support, and an integrated sci-fi knowledge database.

![Mother AI Interface](https://img.shields.io/badge/Status-Operational-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178c6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?style=for-the-badge&logo=tailwindcss)

## 🎬 Features

### 🤖 Multi-AI Provider Support
- **Ollama** (Local/Remote servers with model dropdown)
- **OpenAI** (GPT-3.5, GPT-4, etc.)
- **Google Gemini** (Gemini Pro, Gemini Pro Vision)
- **Anthropic Claude** (Claude 3 Sonnet, Haiku, etc.)

### 📚 Integrated Knowledge Database
- **Sci-Fi Wiki** - Comprehensive database of planets and alien species
- **Search Functionality** - Query planets and aliens from popular franchises
- **Detailed Analysis** - Full planetary and xenobiological information
- **Sample Database** - Pre-loaded with entries from Star Wars, Star Trek, Alien, Alien: Earth and more

### 🎨 Authentic Retro Aesthetics
- **CRT Monitor Effects** - Scanlines, phosphor glow, and screen flicker
- **7 Color Themes** - Alien Green, Amber Terminal, Cyber Blue, HAL Red, Void Purple, Matrix Cyan, and Alien Earth
- **Retro Typography** - Monospace fonts with authentic terminal styling
- **Boot Sequence** - Classic computer startup animation with knowledge database loading

### ⚙️ Advanced Configuration
- **Settings Modal** - Easy-to-use configuration interface
- **Model Selection** - Dynamic model dropdown for Ollama
- **Sound Effects** - Optional retro computer sounds
- **Command History** - Arrow key navigation through previous commands
- **Persistent Settings** - All configurations saved locally

### 🛡️ Security & Privacy
- **Local Storage** - All settings stored in browser localStorage
- **No Server Storage** - API keys never leave your browser
- **Git Safe** - Sensitive data automatically excluded from version control

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Optional: Ollama server (local or remote)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/mother-ai.git
cd mother-ai

# Install dependencies
npm install

# Start the development server
npm start
```

The interface will open at `http://localhost:3000`

## 🔧 Configuration

### Initial Setup
1. **Open Settings** - Click the `◦ CONFIG ◦` button or type `settings`
2. **Choose AI Provider** - Select from Ollama, OpenAI, Google, or Anthropic
3. **Configure Credentials** - Add your API keys or Ollama server URL
4. **Select Model** - Choose from available models
5. **Customize Theme** - Pick your preferred color scheme

### AI Provider Setup

#### Ollama (Recommended for Local Use)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3.1:8b

# Start Ollama server
ollama serve
```
Default URL: `http://localhost:11434`

#### OpenAI
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Enter key in settings: `sk-...`
3. Available models: `gpt-4`, `gpt-3.5-turbo`

#### Google Gemini
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Enter key in settings: `AI...`
3. Available models: `gemini-pro`, `gemini-pro-vision`

#### Anthropic Claude
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Enter key in settings: `sk-ant-...`
3. Available models: `claude-3-sonnet-20240229`, `claude-3-haiku-20240307`

## 🎮 Usage

### Chat Commands
- **Normal Chat** - Type any message to interact with the AI
- **`clear`/`cls`** - Clear the chat screen
- **`settings`** - Open configuration panel
- **`show models`** - List available models for current provider

### Knowledge Database Commands
- **`/wiki`** - Show knowledge database help and status
- **`/planets`** - List all planets in the database
- **`/planets [search]`** - Search for specific planets (e.g., `/planets Tatooine`)
- **`/aliens`** - List all alien species in the database
- **`/aliens [search]`** - Search for specific aliens (e.g., `/aliens Xenomorph`)

### Interface Features
- **Boot Sequence** - Authentic startup animation with knowledge database initialization
- **Sound Effects** - Toggle retro computer sounds in settings
- **Theme Switching** - Real-time color theme changes
- **Model Switching** - Dynamic model selection with size information
- **Command History** - Use arrow keys to navigate through previous commands
- **Copy Messages** - Hover over messages to reveal copy button

### Knowledge Database Examples
```bash
# Get help
/wiki

# Search planets
/planets Tatooine
/planets desert
/planets

# Search aliens
/aliens Xenomorph
/aliens humanoid
/aliens
```

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── ChatInterface.tsx    # Main chat interface
│   └── SettingsModal.tsx    # Configuration modal
├── contexts/            # React contexts
│   └── SettingsContext.tsx  # Settings state management
├── services/            # API services
│   ├── aiService.ts         # AI provider integrations
│   └── wikiDatabase.ts      # Knowledge database service
├── types/              # TypeScript types
│   └── wiki.ts             # Wiki data types
├── hooks/              # Custom React hooks
│   └── useSoundEffects.ts   # Audio effects
└── index.css           # Global styles and themes
```

### Available Scripts
```bash
npm start      # Development server
npm run build  # Production build
npm test       # Run tests
npm run lint   # Code linting
```

### Adding New Knowledge Entries
1. Update sample data in `wikiDatabase.ts`
2. Add new planet/alien objects following the interface types
3. Entries will be automatically indexed and searchable

### Adding New Themes
1. Update `colorThemes` in `SettingsModal.tsx`
2. Add color values to `themeColors` in `ChatInterface.tsx`
3. Update CSS variables in `tailwind.config.js`

### Adding New AI Providers
1. Add provider type to `SettingsContext.tsx`
2. Implement API integration in `aiService.ts`
3. Add provider configuration in `SettingsModal.tsx`

## 🔒 Security Notes

- **API Keys** are stored in browser localStorage only
- **Settings** are never transmitted to external servers
- **Git Ignore** automatically excludes sensitive files
- **No Telemetry** - All processing happens locally
- **Knowledge Database** runs entirely in-memory with no external dependencies

## 📱 Browser Support

- **Chrome/Edge** 90+ (Recommended)
- **Firefox** 88+
- **Safari** 14+
- **Mobile** - Responsive design supports mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📋 Roadmap

### Current Features ✅
- [x] Multiple AI provider support
- [x] Retro CRT aesthetics with 7 themes
- [x] Command history navigation
- [x] Knowledge database with wiki commands
- [x] Copy message functionality
- [x] Sound effects and boot sequence

### Planned Features 🚧
- [ ] Voice input/output
- [ ] Conversation history persistence
- [ ] Export chat transcripts
- [ ] Custom AI provider support
- [ ] PWA support
- [ ] Docker deployment
- [ ] Knowledge database expansion
- [ ] AI-powered content generation for wiki

## 📜 Changelog

**v0.2.0 - August 18, 2025**
- **New Theme:** Added "Alien Earth" theme inspired by the Prodigy Corporation aesthetic from the "Alien: Earth" TV show.
- **Expanded Knowledge Base:** Added new entries for "Earth (Alien: Earth)", "Xenomorph (Alien: Earth)", and "Hybrid (Alien: Earth)" to the wiki.
- **Improved AI Interaction:** Added a random delay to the AI's responses to simulate processing time.
- **UI/UX Improvements:**
    - Improved the "clear" button to match the "config" button's UI/UX.
    - Fixed an issue where the user prompt `[CREW] >>` was on a different line than the message.
    - Improved formatting of numbered lists in AI responses.
    - Fixed various styling issues in the settings modal.

## 🐛 Troubleshooting

### Common Issues

**"No models detected"**
- Verify Ollama server is running: `ollama serve`
- Check server URL in settings
- Ensure models are pulled: `ollama pull llama3.1:8b`

**"API Key Invalid"**
- Verify API key format and permissions
- Check provider documentation for correct format
- Ensure API key has sufficient credits/quota

**"CORS Errors"**
- For Ollama: Add CORS headers to server config
- For other providers: Use HTTPS URLs only

**Knowledge Database Commands Not Working**
- Ensure commands start with `/` (e.g., `/wiki`, `/planets`)
- Commands are case-sensitive
- Check browser console for any JavaScript errors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ridley Scott** - For creating the Alien universe
- **H.R. Giger** - For the iconic aesthetic inspiration
- **Weyland-Yutani Corporation** - For the fictional computer systems
- **Gene Roddenberry** - For Star Trek's rich universe
- **George Lucas** - For the Star Wars galaxy

## 👨‍💻 Created By

**Andrew Leonenko** - [https://a.leonenko.me/](https://a.leonenko.me/)

*Last Updated: August 18, 2025*

---

*"I can't lie to you about your chances, but... you have my sympathies."* - MU/TH/UR 6000

*"NOSTROMO KNOWLEDGE DATABASE ACTIVE"* - MU/TH/UR 6000
