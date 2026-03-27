'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useProfile } from '@/lib/ProfileContext';
import { ChatMessage } from '@/lib/types';
import { useSession } from 'next-auth/react';
import styles from './ChatPanel.module.css';
import { detectField } from '@/utils/chat/fieldDetection';
import { renderMarkdown } from '@/utils/chat/markdown';
import { sendMessageStream, fetchGreeting } from '@/services/chatApiService';
import { fetchQuotaStatus } from '@/services/quotaApiService';
import { DAILY_LIMIT } from '@/utils/resume/constants';

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ChatPanel() {
  const { profile, addMessage, messages, setActiveField, applyAIUpdate, dataLoaded, pendingTrigger, setPendingTrigger } = useProfile();
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [greetingLoading, setGreetingLoading] = useState(false);
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const greetingFetched = useRef(false);

  // Once data is loaded and messages are empty, fetch a smart greeting
  useEffect(() => {
    if (!dataLoaded || greetingFetched.current) return;
    if (messages.length > 0) {
      greetingFetched.current = true;
      return;
    }
    greetingFetched.current = true;
    setGreetingLoading(true);

    fetchGreeting(profile, [])
      .then(data => {
        const greetMsg: ChatMessage = {
          id: 'greeting-' + genId(),
          role: 'assistant',
          content: data.message || "Hi! I'm RAISE. Let's build your resume. What's your name and current role?",
          timestamp: new Date(),
        };
        addMessage(greetMsg);
      })
      .catch(() => {})
      .finally(() => setGreetingLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded]);

  // Fetch today's quota once data is loaded
  useEffect(() => {
    if (!dataLoaded) return;
    fetchQuotaStatus()
      .then(data => { if (typeof data.remaining === 'number') setQuotaRemaining(data.remaining); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded]);

  // Fire a trigger message from the completeness panel
  useEffect(() => {
    if (!pendingTrigger || !dataLoaded || loading) return;
    if (quotaRemaining !== null && quotaRemaining <= 0) {
      setPendingTrigger(null);
      return;
    }
    const msg = pendingTrigger;
    setPendingTrigger(null);
    setInput('');

    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: msg,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setLoading(true);

    const field = detectField(msg);
    if (field) setActiveField(field);

    const allMessages: ChatMessage[] = [
      ...messages,
      userMsg,
    ];

    let accumulated = '';
    sendMessageStream(allMessages, profile, {
      onDelta: (text) => {
        accumulated += text;
        setLoading(false);
        setStreamingContent(accumulated);
      },
      onDone: (update, remaining) => {
        if (typeof remaining === 'number') setQuotaRemaining(remaining);
        const finalContent = accumulated || 'I encountered an issue. Please try again.';
        const assistantMsg: ChatMessage = {
          id: genId(),
          role: 'assistant',
          content: finalContent,
          timestamp: new Date(),
          fieldHighlight: detectField(finalContent) ?? undefined,
        };
        setStreamingContent(null);
        addMessage(assistantMsg);
        if (update && Object.keys(update).length > 0) {
          applyAIUpdate(update);
          if (assistantMsg.fieldHighlight) {
            setActiveField(assistantMsg.fieldHighlight as import('@/lib/types').ActiveField);
            setTimeout(() => setActiveField(null), 3000);
          }
        }
        setLoading(false);
        inputRef.current?.focus();
      },
      onError: (message) => {
        setStreamingContent(null);
        addMessage({ id: genId(), role: 'assistant', content: message, timestamp: new Date() });
        setLoading(false);
        inputRef.current?.focus();
      },
    }).catch(() => {
      setStreamingContent(null);
      addMessage({ id: genId(), role: 'assistant', content: 'Something went wrong. Please try again.', timestamp: new Date() });
      setLoading(false);
      inputRef.current?.focus();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTrigger, dataLoaded]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, greetingLoading, streamingContent, scrollToBottom]);

  const clearChat = async () => {
    if (!session?.user?.id || clearing) return;
    setClearing(true);
    await fetch('/api/messages', { method: 'DELETE' }).catch(() => {});
    window.location.reload();
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    if (quotaRemaining !== null && quotaRemaining <= 0) return;

    const userMsg: ChatMessage = {
      id: genId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    addMessage(userMsg);
    setInput('');
    setLoading(true);

    const field = detectField(trimmed);
    if (field) setActiveField(field);

    const allMessages: ChatMessage[] = [...messages, userMsg];
    let accumulated = '';

    try {
      await sendMessageStream(allMessages, profile, {
        onDelta: (text) => {
          accumulated += text;
          setLoading(false);
          setStreamingContent(accumulated);
        },
        onDone: (update, remaining) => {
          if (typeof remaining === 'number') setQuotaRemaining(remaining);
          const finalContent = accumulated || 'I encountered an issue. Please try again.';
          const assistantMsg: ChatMessage = {
            id: genId(),
            role: 'assistant',
            content: finalContent,
            timestamp: new Date(),
            fieldHighlight: detectField(finalContent) ?? undefined,
          };
          setStreamingContent(null);
          addMessage(assistantMsg);
          if (update && Object.keys(update).length > 0) {
            applyAIUpdate(update);
            if (assistantMsg.fieldHighlight) {
              setActiveField(assistantMsg.fieldHighlight as import('@/lib/types').ActiveField);
              setTimeout(() => setActiveField(null), 3000);
            }
          }
        },
        onError: (message) => {
          setStreamingContent(null);
          addMessage({ id: genId(), role: 'assistant', content: message, timestamp: new Date() });
        },
      });
    } catch (err) {
      setStreamingContent(null);
      addMessage({
        id: genId(),
        role: 'assistant',
        content: err instanceof Error ? err.message : 'Something went wrong. Please check your connection and try again.',
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const showTyping   = loading || greetingLoading;
  const quotaBlocked = quotaRemaining !== null && quotaRemaining <= 0;
  const quotaWarn    = quotaRemaining !== null && quotaRemaining > 0 && quotaRemaining <= 3;

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.aiAvatar}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
            <path d="M9 21h6"/><path d="M12 17v4"/>
          </svg>
        </div>
        <div>
          <div className={styles.headerTitle}>RAISE Assistant</div>
          <div className={styles.headerSub}>Socratic AI Resume Coach</div>
        </div>
        <div className={styles.headerRight}>
          {messages.length > 0 && (
            <button
              className={styles.clearBtn}
              onClick={clearChat}
              disabled={clearing}
              title="Clear chat history"
            >
              {clearing ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.spinning}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              )}
              Clear
            </button>
          )}
          <div className={styles.statusDot} />
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {/* Skeleton while initial data loads */}
        {!dataLoaded && (
          <div className={styles.skeletonWrap}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonLines}>
              <div className={styles.skeletonLine} style={{ width: '75%' }} />
              <div className={styles.skeletonLine} style={{ width: '55%' }} />
              <div className={styles.skeletonLine} style={{ width: '65%' }} />
            </div>
          </div>
        )}

        {dataLoaded && messages.map(msg => (
          <div key={msg.id} className={`${styles.msgRow} ${msg.role === 'user' ? styles.userRow : styles.aiRow}`}>
            {msg.role === 'assistant' && (
              <div className={styles.aiAvatarSmall}>R</div>
            )}
            <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
              <div
                className={styles.bubbleText}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              />
              <div className={styles.bubbleTime}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {streamingContent !== null && (
          <div className={`${styles.msgRow} ${styles.aiRow}`}>
            <div className={styles.aiAvatarSmall}>R</div>
            <div className={`${styles.bubble} ${styles.aiBubble}`}>
              <div
                className={`${styles.bubbleText} ${styles.streaming}`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingContent) }}
              />
            </div>
          </div>
        )}

        {showTyping && streamingContent === null && (
          <div className={`${styles.msgRow} ${styles.aiRow}`}>
            <div className={styles.aiAvatarSmall}>R</div>
            <div className={`${styles.bubble} ${styles.aiBubble} ${styles.typingBubble}`}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quota banner */}
      {(quotaWarn || quotaBlocked) && (
        <div className={`${styles.quotaBanner} ${quotaBlocked ? styles.blocked : styles.warn}`}>
          <span className={styles.quotaIcon}>{quotaBlocked ? '🚫' : '⚠️'}</span>
          {quotaBlocked
            ? `Daily limit reached (${DAILY_LIMIT}/${DAILY_LIMIT}). Quota resets at midnight UTC.`
            : `${quotaRemaining} of ${DAILY_LIMIT} messages remaining today`}
          <span className={styles.quotaPips} aria-hidden>
            {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
              <span
                key={i}
                className={`${styles.pip} ${i < (DAILY_LIMIT - (quotaRemaining ?? DAILY_LIMIT)) ? styles.filled : ''}`}
              />
            ))}
          </span>
        </div>
      )}

      {/* Input */}
      <div className={styles.inputArea}>
        <textarea
          ref={inputRef}
          className={styles.input}
          placeholder={quotaBlocked ? 'Daily message limit reached — come back tomorrow' : 'Reply to RAISE… (Shift+Enter for newline)'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
          disabled={!dataLoaded || quotaBlocked}
        />
        <button
          className={`${styles.sendBtn} ${(!input.trim() || loading || !dataLoaded || quotaBlocked) ? styles.disabled : ''}`}
          onClick={send}
          disabled={!input.trim() || loading || !dataLoaded || quotaBlocked}
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22,2 15,22 11,13 2,9"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
