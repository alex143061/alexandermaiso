import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsStars } from "react-icons/bs";
import { FiX, FiSend, FiTrash2 } from "react-icons/fi";
import { logo_white } from "../assets";

const INITIAL_MESSAGE = {
  role: "assistant",
  text: "Hey! I'm Alex's AI assistant. Ask me anything about his projects, skills, or just chat with me!",
  time: new Date(),
};

const SUGGESTIONS = [
  { label: "🚀 Projects", query: "What have you built lately?" },
  { label: "⚡ Skills", query: "What's in your tech stack?" },
  { label: "💼 Career", query: "Tell me about your work experience." },
  { label: "📬 Contact", query: "How do I hire you?" },
];

const MAX_HISTORY = 10;
const API_ENDPOINT = "/api/chat";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text, time: new Date() }]);
  };

  const handleSuggestion = (query) => {
    setSuggestionsVisible(false);
    inputRef.current?.focus();
    handleSend(undefined, query);
  };

  const handleSend = async (e, submittedText = input) => {
    if (e?.preventDefault) e.preventDefault();
    const text = submittedText.trim();
    if (!text || loading) return;

    setInput("");
    setSuggestionsVisible(false);
    setError(null);
    addMessage("user", text);
    setLoading(true);

    try {
      const history = messages
        .slice(1)
        .slice(-MAX_HISTORY)
        .map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        }))
        .filter((h) => h.role !== "system");

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status}).`);
      }
      if (data.error) {
        throw new Error(data.error);
      }

      addMessage("assistant", data.reply || "I'm not sure how to respond to that. 🌠");
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    setSuggestionsVisible(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <>
      {!isOpen && (
        <motion.button
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          aria-label="Chat with Alex's AI assistant"
          className="fixed bottom-4 right-4 z-[1000] flex items-center gap-3 rounded-full border border-white/20 bg-[#10131d]/95 py-2 pl-2 pr-5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors hover:border-purple-300/60 hover:bg-[#171a27] focus:outline-none focus:ring-2 focus:ring-teal-400 touch-manipulation md:bottom-6 md:right-6"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-full border-[3px] border-teal-300 animate-chat-ring"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-2 rounded-full border-2 border-purple-300 animate-chat-ring [animation-delay:0.8s]"
          />
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 via-purple-500 to-orange-400 p-[2px]">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-[#11131c]">
              <img src={logo_white} alt="" className="h-8 w-8 object-contain" />
            </span>
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-300 text-[#10131d] shadow-md">
              <BsStars size={10} />
            </span>
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-white">Alex's AI Assistant</span>
            <span className="mt-1 text-[11px] leading-tight text-white/65">Curious? Ask me anything!</span>
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 z-[1000] flex h-[min(90dvh,48rem)] max-h-[calc(100dvh-2rem)] w-auto max-w-md flex-col md:bottom-6 md:left-auto md:right-6 md:h-[min(70dvh,48rem)] md:max-h-[calc(100dvh-3rem)] md:w-[min(26rem,calc(100vw-3rem))]"
          >
            <div className="flex shrink-0 items-center gap-3 rounded-t-3xl bg-gradient-to-br from-teal-500 via-purple-500 to-orange-500 p-4 shadow-xl md:p-5">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <img src={logo_white} alt="Alexander Maiso" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm leading-tight">Alex's AI Assistant</h3>
                <p className="text-teal-100 text-xs opacity-90">Curious? Ask me anything!</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  aria-label="Clear chat"
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
                >
                  <FiTrash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-black/10 p-3 backdrop-blur-sm md:space-y-4 md:p-4" aria-label="Conversation">
              <AnimatePresence mode="wait">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`max-w-[85%] ${msg.role === "user" ? "ml-auto text-right" : "mr-auto text-left"}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-2xl ${msg.role === "user" ? "bg-teal-500 text-white rounded-tr-none" : "bg-white/5 text-white rounded-tl-none border border-white/10"}`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-xs block mt-1 ${msg.role === "user" ? "text-teal-400" : "text-white/50"}`}>
                      {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mr-auto text-left max-w-[85%]"
                  >
                    <div className="inline-block p-3 rounded-2xl bg-white/5 text-white rounded-tl-none border border-white/10">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
                      </span>
                    </div>
                  </motion.div>
                )}
                {error && (
                  <div className="mr-auto text-left max-w-[85%]">
                    <div className="inline-block p-3 rounded-2xl bg-rose-500/20 text-rose-200 border border-rose-400/50 rounded-tl-none">
                      {error}
                    </div>
                  </div>
                )}
                <span ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {suggestionsVisible && (
              <div className="shrink-0 space-y-2 border-t border-white/10 bg-black/20 p-2 backdrop-blur-sm md:p-3">
                <p className="text-xs text-white/50 uppercase tracking-wider font-medium px-2">Try asking:</p>
                <div className="flex flex-wrap gap-2 px-2">
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestion(s.query)}
                      className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="shrink-0 border-t border-white/10 bg-black/40 p-3 backdrop-blur-md md:p-4">
              <form onSubmit={handleSend} className="flex min-w-0 gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  disabled={loading}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 transition focus:outline-none focus:ring-2 focus:ring-teal-400"
                  aria-label="Your message"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-12 w-12 min-w-[3rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-purple-500 text-white transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <FiSend className="shrink-0" size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;