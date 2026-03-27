import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIService } from '@/lib/services/AIService';
import { checkAndIncrement } from '@/lib/services/quotaService';
import { SYSTEM_PROMPT_CHAT } from '@/lib/constants/ai';
import { DAILY_LIMIT } from '@/lib/constants/quota';

const MSG_START_RE = /"message"\s*:\s*"/;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { messages, profile } = await req.json();

  let quota;
  try {
    quota = await checkAndIncrement(session.user.id);
  } catch (err) {
    console.error('[chat] Quota check error:', err);
    return NextResponse.json({ error: 'db_error', message: 'Service temporarily unavailable. Please try again.' }, { status: 503 });
  }

  if (!quota.allowed) {
    return NextResponse.json(
      { error: 'quota_exceeded', remaining: 0, message: `You've used all ${DAILY_LIMIT} messages for today. Your quota resets at midnight UTC — come back tomorrow!` },
      { status: 429 }
    );
  }

  const ai = new AIService();
  const contextMessage = profile ? `\n\nCurrent profile state: ${JSON.stringify(profile, null, 2)}` : '';
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = await ai.chatStream(SYSTEM_PROMPT_CHAT + contextMessage, messages, { temperature: 0.7, maxTokens: 1000 });

        let fullText = '';
        let prefixBuf = '';
        let inMessage = false;
        let inEscape = false;

        const unescape = (c: string, next: string) =>
          next === 'n' ? '\n' : next === '"' ? '"' : next === '\\' ? '\\' : next === 't' ? '\t' : next === 'r' ? '\r' : next;

        for await (const chunk of aiStream) {
          const delta = chunk.choices[0]?.delta?.content ?? '';
          if (!delta) continue;
          fullText += delta;

          if (!inMessage) {
            prefixBuf += delta;
            const match = MSG_START_RE.exec(prefixBuf);
            if (match) {
              inMessage = true;
              const afterMatch = prefixBuf.slice(match.index + match[0].length);
              prefixBuf = '';
              let text = '';
              for (let i = 0; i < afterMatch.length; i++) {
                const c = afterMatch[i];
                if (inEscape) { text += unescape(c, c); inEscape = false; }
                else if (c === '\\') { inEscape = true; }
                else if (c === '"') { inMessage = false; break; }
                else { text += c; }
              }
              if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'delta', text })}\n\n`));
            }
          } else {
            let text = '';
            for (let i = 0; i < delta.length; i++) {
              const c = delta[i];
              if (inEscape) { text += unescape(c, c); inEscape = false; }
              else if (c === '\\') { inEscape = true; }
              else if (c === '"') { inMessage = false; break; }
              else { text += c; }
            }
            if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'delta', text })}\n\n`));
          }
        }

        const result = ai.parseJSON(fullText, { message: fullText, update: {} });
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', update: result.update ?? {}, remaining: quota.remaining })}\n\n`));
        controller.close();
      } catch (err) {
        console.error('[chat] Stream error:', err);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'AI service unavailable. Please try again.' })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
