import { Settings } from '../contexts/SettingsContext';

interface AIResponse {
  content: string;
  error?: string;
}

export class AIService {
  static async sendMessage(message: string, settings: Settings): Promise<AIResponse> {
    const systemPrompt = `You are MU/TH/UR 6000, the AI mainframe of the USCSS Nostromo from the Alien franchise. 
                         Respond in a cold, logical manner. Keep responses brief and technical. 
                         Use terminology from the Alien universe when appropriate.`;

    try {
      switch (settings.aiProvider) {
        case 'ollama':
          return await this.callOllama(message, systemPrompt, settings);
        case 'openai':
          return await this.callOpenAI(message, systemPrompt, settings);
        case 'google':
          return await this.callGoogle(message, systemPrompt, settings);
        case 'anthropic':
          return await this.callAnthropic(message, systemPrompt, settings);
        default:
          throw new Error('Unsupported AI provider');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static async callOllama(message: string, systemPrompt: string, settings: Settings): Promise<AIResponse> {
    const response = await fetch(`${settings.ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.currentModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.message?.content || data.response || 'No response from Ollama'
    };
  }

  private static async callOpenAI(message: string, systemPrompt: string, settings: Settings): Promise<AIResponse> {
    if (!settings.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: settings.currentModel || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || 'No response from OpenAI'
    };
  }

  private static async callGoogle(message: string, systemPrompt: string, settings: Settings): Promise<AIResponse> {
    if (!settings.googleApiKey) {
      throw new Error('Google API key not configured');
    }

    const model = settings.currentModel || 'gemini-pro';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Google'
    };
  }

  private static async callAnthropic(message: string, systemPrompt: string, settings: Settings): Promise<AIResponse> {
    if (!settings.anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: settings.currentModel || 'claude-3-sonnet-20240229',
        system: systemPrompt,
        messages: [
          { role: 'user', content: message }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.content?.[0]?.text || 'No response from Anthropic'
    };
  }

  static async fetchOllamaModels(ollamaUrl: string): Promise<any[]> {
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`);
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
      return [];
    }
  }
}