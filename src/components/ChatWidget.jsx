'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getSessionId } from '@/lib/analytics';
import '@/styles/chat-widget.css';

const T = {
  en: {
    title: 'St. Mary Assistant',
    subtitle: 'Ask me anything about our parish',
    placeholder: 'Type your question…',
    hello:
      'Selam! 🙏 Welcome to Bihere Tsige Mekane Selam St. Mary. I can help you find services, register for classes, request prayers, or anything else on our website. How may I help you?',
    error: 'Sorry, something went wrong. Please try again.',
    busy: 'I am receiving many questions right now — please try again in a moment.',
    suggestions: [
      'When is the liturgy schedule?',
      'How do I find a father confessor?',
      'How can I donate?',
      'How do I register for catechism?',
    ],
  },
  am: {
    title: 'የቅድስት ማርያም ረዳት',
    subtitle: 'ስለ ደብራችን ማንኛውንም ጥያቄ ይጠይቁ',
    placeholder: 'ጥያቄዎን ይጻፉ…',
    hello:
      'ሰላም! 🙏 እንኳን ወደ ብሔረ ጽጌ መካነ ሰላም ቅድስት ማርያም በደህና መጡ። አገልግሎቶችን ማግኘት፣ ለትምህርት መመዝገብ፣ ጸሎት መጠየቅ ወይም ሌላ ማንኛውንም ነገር እንዲያገኙ እረዳዎታለሁ። እንዴት ልርዳዎት?',
    error: 'ይቅርታ፣ ችግኝ ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
    busy: 'በአሁኑ ጊዜ ብዙ ጥያቄዎች እየደረሱኝ ነው — እባክዎ ትንሽ ቆይተው ይሞክሩ።',
    suggestions: [
      'የቅዳሴ መርሃ ግብር መቼ ነው?',
      'የንስሐ አባት እንዴት ማግኘት እችላለሁ?',
      'እንዴት መለገስ እችላለሁ?',
      'ለትምህርተ ሃይማኖት እንዴት እመዘገባለሁ?',
    ],
  },
};

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="22" height="22" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default function ChatWidget() {
  const { lang } = useLanguage();
  const t = T[lang === 'en' ? 'en' : 'am'];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // Restore this tab's conversation.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('parish-chat');
      if (saved) setMessages(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('parish-chat', JSON.stringify(messages.slice(-30)));
    } catch { /* ignore */ }
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text) => {
    const clean = text.trim();
    if (!clean || busy) return;
    const next = [...messages, { role: 'user', text: clean }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, sessionId: getSessionId() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.reply) {
        setMessages((m) => [...m, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: 'assistant', text: res.status === 429 ? t.busy : t.error, isError: true },
        ]);
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: t.error, isError: true }]);
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label={t.title}>
          <div className="chat-header">
            <img className="chat-header-logo" src="/assets/logo-footer.png" alt={t.title} />
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <CloseIcon />
            </button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            <div className="chat-msg chat-msg-bot">{t.hello}</div>

            {messages.length === 0 && (
              <div className="chat-suggestions">
                {t.suggestions.map((s) => (
                  <button key={s} className="chat-suggestion" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-msg ${m.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'} ${m.isError ? 'chat-msg-error' : ''}`}
              >
                {m.text}
              </div>
            ))}

            {busy && (
              <div className="chat-msg chat-msg-bot chat-typing" aria-label="Typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={submit}>
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              placeholder={t.placeholder}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send" disabled={busy || !input.trim()} aria-label="Send">
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      <button
        className={`chat-fab ${open ? 'chat-fab-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </>
  );
}
