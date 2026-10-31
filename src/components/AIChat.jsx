import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChatDotsFill, BsRobot, BsStars, BsX } from "react-icons/bs";
import { FiX, FiSend, FiTrash2 } from "react-icons/fi";

const SYSTEM_INSTRUCTION = `You are Galaxy AI, the friendly, witty, and knowledgeable AI companion for Alexander Maiso's portfolio.
Alexander Maiso is a Computer Engineer and Full-Stack Developer from the Philippines. He specializes in React, Next.js, Tailwind, Node.js, Laravel, PHP, Python, and IoT (Arduino, ESP32, C++).
Notable projects include: three.ws (3D AI agents), Lex Karaoke, and PawLitrax (IoT pet tracker).
Your tone should be natural, conversational, warm, and engaging (like ChatGPT or Claude), with occasional cosmic/space references (✨, 🌌, 🚀).
Always stay in character as his portfolio assistant, and help users explore his background, skills, and projects organically.`;

const INITIAL_MESSAGE = {
  role: "assistant",
  text: "Hey! I'm Alex's AI Galaxy companion. 🌌 Ask me anything about his projects, skills, or just chat with me!",
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
  const [isOpen, setIsOpen] = useState(true);
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
    setInput(query);
    setSuggestionsVisible(false);
    inputRef.current?.focus();
    handleSend();
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setSuggestionsVisible(false);
    setError(null);
    addMessage("user", text);
    setLoading(true);

    try {
      const history = messages
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

      if (!response.ok || data.error) {
        throw new Error(data.error || "Something went wrong.");
      }

      addMessage("assistant", data.reply || "I'm not sure how to respond to that. 🌠");
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Failed to connect. Please try again.");
      addMessage("assistant", "Sorry, I'm having trouble connecting right now. 🚀 Try again in a moment!");
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chat"
          className="fixed bottom-6 right-6 z-[1000] w-14 h-14 bg-gradient-to-br from-teal-500 via-purple-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <BsRobot size={24} className="text-white" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[1000] w-full max-w-md h-[85vh] flex flex-col lg:h-[70vh]"
          >
            <div className="bg-gradient-to-br from-teal-500 via-purple-500 to-orange-500 rounded-t-3xl p-5 flex items-center gap-3 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <BsStars size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm leading-tight">Galaxy AI</h3>
                <p className="text-teal-100 text-xs opacity-90">Alex's portfolio assistant</p>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/10 backdrop-blur-sm" aria-label="Conversation">
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
              <div className="p-3 space-y-2 border-t border-white/10 bg-black/20 backdrop-blur-sm">
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

            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  disabled={loading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  aria-label="Your message"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-teal-400"
                  aria-label="Send message"
                >
                  <FiSend size={18} />
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