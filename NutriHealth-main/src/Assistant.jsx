import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Lightbulb, ShieldCheck } from 'lucide-react';
import { useReport } from './context/ReportContext';
import { sendChatMessage } from './api/apiClient';

const PROMPT_SUGGESTIONS = [
  'Explain my blood report summary in detail',
  'What foods should I eat to improve my levels?',
  'What exercise routine is safest for my markers?',
  'Should I re-test my blood panel in 3 months?',
];

export default function Assistant() {
  const { analysisResult, chatHistory, setChatHistory } = useReport();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: analysisResult
        ? `Hi, I'm NutriCare's offline report assistant. Your report context is available${analysisResult.disease ? ` (${analysisResult.disease})` : ''}. What would you like to understand?`
        : "Hi, I'm NutriCare's offline report assistant. Upload a report to ask about its values and pipeline flags.",
    },
    ...chatHistory.map((item, index) => ({
      id: `history-${index}`,
      sender: item.role === 'user' ? 'user' : 'ai',
      text: item.text,
    })),
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (userText) => {
    const textToSend = typeof userText === 'string' ? userText : input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = { id: Date.now(), sender: 'user', text: textToSend.trim() };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(textToSend.trim(), analysisResult, chatHistory);

      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: reply };
      setMessages((prev) => [...prev, aiMsg]);

      setChatHistory((prev) => [
        ...prev,
        { role: 'user', text: textToSend.trim() },
        { role: 'model', text: reply },
      ]);
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        sender: 'error',
        text: `Sorry, I couldn't process that right now. ${err.message || 'Please try again.'}`,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-start py-2 sm:py-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="nc-surface flex h-[min(740px,calc(100dvh-150px))] min-h-[430px] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--nc-line)] bg-[var(--nc-paper)]/90 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--nc-green)] text-white shadow-md shadow-[var(--nc-green)]/20 sm:h-11 sm:w-11">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--nc-green-light)] opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--nc-green)]" />
              </span>
            </div>
            <div>
              <h3 className="flex items-center gap-1.5 text-sm font-extrabold tracking-tight text-[var(--nc-ink)] sm:text-base" style={{ fontFamily: 'var(--nc-font-display)' }}>
                NutriCare assistant <Sparkles className="h-4 w-4 text-[var(--nc-green)]" />
              </h3>
              <p className="max-w-[200px] truncate text-[11px] text-[var(--nc-muted)] sm:max-w-none sm:text-xs">
                {analysisResult
                  ? `Report loaded · ${analysisResult.disease || 'Summary available'}`
                  : 'Health and nutrition questions'}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-[var(--nc-line)] bg-[var(--nc-mint)] px-3 py-1 text-xs font-semibold text-[var(--nc-ink-light)] sm:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--nc-green)]" />
            <span>Local report guidance</span>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto scroll-smooth p-4 sm:space-y-6 sm:p-6"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex max-w-[92%] gap-3 sm:max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-bold shadow-sm sm:h-9 sm:w-9 sm:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-[var(--nc-ink)] text-white'
                      : msg.sender === 'error'
                      ? 'bg-[var(--nc-error-bg)] text-[var(--nc-error)]'
                      : 'bg-[var(--nc-mint)] text-[var(--nc-green-dark)]'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : msg.sender === 'error' ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={`whitespace-pre-wrap rounded-3xl p-3.5 text-xs leading-relaxed shadow-sm sm:p-4 sm:text-sm ${
                    msg.sender === 'user'
                      ? 'rounded-tr-sm bg-[var(--nc-green)] font-medium text-white'
                      : msg.sender === 'error'
                      ? 'rounded-tl-sm border border-[var(--nc-error)]/30 bg-[var(--nc-error-bg)] text-[var(--nc-error)]'
                      : 'rounded-tl-sm border border-[var(--nc-line)] bg-[var(--nc-paper-warm)] text-[var(--nc-ink-light)]'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex max-w-[85%] gap-3"
                role="status"
                aria-label="NutriCare is preparing a response"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--nc-green)] text-white shadow-md shadow-[var(--nc-green)]/20 sm:h-9 sm:w-9">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex h-10 items-center gap-1.5 rounded-3xl rounded-tl-sm border border-[var(--nc-line)] bg-[var(--nc-paper-warm)] p-3.5 shadow-sm sm:p-4">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="h-2 w-2 rounded-full bg-[var(--nc-green)]" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="h-2 w-2 rounded-full bg-[var(--nc-green)]" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="h-2 w-2 rounded-full bg-[var(--nc-green)]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {messages.length < 5 && (
          <div className="hide-scrollbar flex shrink-0 gap-2 overflow-x-auto px-4 pb-2 sm:px-6">
            {PROMPT_SUGGESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl border border-[var(--nc-line)] bg-[var(--nc-line)]/40 px-3 py-1.5 text-xs font-semibold text-[var(--nc-ink-light)] transition-all hover:border-[var(--nc-green)]/30 hover:bg-[var(--nc-mint)] hover:text-[var(--nc-green-dark)]"
              >
                <Lightbulb className="h-3 w-3 text-[var(--nc-warning)]" />
                {chip}
              </button>
            ))}
          </div>
        )}

        <div className="shrink-0 border-t border-[var(--nc-line)] bg-[var(--nc-paper)] p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message the NutriCare assistant"
              placeholder={
                analysisResult
                  ? 'Ask about your report, diet plan, or lifestyle...'
                  : 'Ask a health or nutrition question...'
              }
              className="w-full rounded-2xl border border-[var(--nc-line)] bg-[var(--nc-paper-warm)] py-3 pl-4 pr-12 text-xs text-[var(--nc-ink)] shadow-sm transition-all placeholder:text-[var(--nc-muted-light)] focus:border-[var(--nc-green)] focus:outline-none focus:ring-2 focus:ring-[var(--nc-green)]/30 sm:py-3.5 sm:pl-5 sm:pr-14 sm:text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="absolute right-2 cursor-pointer rounded-xl bg-[var(--nc-green)] p-2 text-white transition-all hover:bg-[var(--nc-green-dark)] disabled:cursor-not-allowed disabled:opacity-40 sm:p-2.5"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}