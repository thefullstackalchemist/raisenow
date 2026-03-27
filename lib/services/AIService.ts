import OpenAI from 'openai';
import { AI_BASE_URL, AI_MODEL } from '@/lib/constants/ai';

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

interface AIOptions {
  temperature?: number;
  maxTokens?: number;
}

export class AIService {
  private client: OpenAI;
  private model: string;

  constructor() {
    this.client = new OpenAI({
      baseURL: process.env.OPENROUTER_BASE_URL || AI_BASE_URL,
      apiKey:  process.env.OPENROUTER_API_KEY || '',
    });
    this.model = process.env.OPENROUTER_MODEL || AI_MODEL;
  }

  async complete(systemPrompt: string, userContent: string, opts: AIOptions = {}): Promise<string> {
    const res = await this.client.chat.completions.create({
      model:      this.model,
      messages:   [{ role: 'system', content: systemPrompt }, { role: 'user', content: userContent }],
      temperature: opts.temperature ?? 0.4,
      max_tokens:  opts.maxTokens  ?? 800,
    });
    return res.choices[0]?.message?.content || '';
  }

  async chat(systemPrompt: string, messages: Message[], opts: AIOptions = {}): Promise<string> {
    const res = await this.client.chat.completions.create({
      model:      this.model,
      messages:   [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: opts.temperature ?? 0.7,
      max_tokens:  opts.maxTokens  ?? 1000,
    });
    return res.choices[0]?.message?.content || '';
  }

  async chatStream(systemPrompt: string, messages: Message[], opts: AIOptions = {}) {
    return this.client.chat.completions.create({
      model:      this.model,
      messages:   [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: opts.temperature ?? 0.7,
      max_tokens:  opts.maxTokens  ?? 1000,
      stream:     true as const,
    });
  }

  parseJSON<T>(content: string, fallback: T): T {
    try { return JSON.parse(content) as T; } catch { return fallback; }
  }
}
