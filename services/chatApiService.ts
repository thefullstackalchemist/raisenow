import { Profile, ChatMessage } from '@/lib/types';

export interface ChatResponse {
  message:   string;
  update?:   Partial<Profile>;
  remaining?: number;
  error?:    string;
}

export interface GreetingResponse {
  message: string;
}

export interface StreamCallbacks {
  onDelta:    (text: string) => void;
  onDone:     (update: Partial<Profile>, remaining: number) => void;
  onError:    (message: string) => void;
}

export async function sendMessageStream(
  messages: ChatMessage[],
  profile: Profile,
  callbacks: StreamCallbacks,
): Promise<void> {
  const res = await fetch('/api/chat', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      profile,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as ChatResponse).message || `API error ${res.status}`);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const evt = JSON.parse(line.slice(6));
        if (evt.type === 'delta') callbacks.onDelta(evt.text);
        else if (evt.type === 'done') callbacks.onDone(evt.update ?? {}, evt.remaining ?? 0);
        else if (evt.type === 'error') callbacks.onError(evt.message);
      } catch { /* ignore malformed lines */ }
    }
  }
}

export async function fetchGreeting(profile: Profile, recentMessages: ChatMessage[]): Promise<GreetingResponse> {
  const res = await fetch('/api/greeting', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ profile, recentMessages }),
  });
  return res.json();
}
