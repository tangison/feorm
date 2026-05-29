"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, Sparkles, Zap, ChevronDown } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  provider?: string;
}

interface StreamEvent {
  type: "delta" | "done";
  text?: string;
  provider?: string;
  model?: string;
}

const PROVIDER_LABELS: Record<string, string> = {
  groq: "Groq",
  gemini: "Gemini",
  openrouter: "OpenRouter",
  zai: "ZAI",
  fallback: "Offline",
};

const QUICK_PROMPTS = [
  "How does escrow work?",
  "Find farm stays in Oshana",
  "Equipment rental prices",
  "What is Feorm?",
];

export default function TangisonChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey there. I'm Tangison — your Feorm assistant. I can help you find listings, understand our escrow protocol, or learn about Namibian agriculture. What do you need?",
      provider: "system",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (overrideMessage?: string) => {
    const userMessage = (overrideMessage || input).trim();
    if (!userMessage || isLoading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setStreamingText("");
    setActiveProvider(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          context: {
            currentPage: typeof window !== "undefined" ? window.location.pathname : "",
          },
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let provider = "unknown";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          try {
            const event: StreamEvent = JSON.parse(trimmed.slice(6));

            if (event.type === "delta" && event.text) {
              fullText += event.text;
              setStreamingText(fullText);
              if (event.provider) {
                provider = event.provider;
                setActiveProvider(provider);
              }
            } else if (event.type === "done") {
              if (event.provider) provider = event.provider;
            }
          } catch {
            // Skip malformed SSE
          }
        }
      }

      // Finalize — move streaming text to messages
      if (fullText) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullText, provider },
        ]);
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection issue. Please try again or reach out on WhatsApp for immediate help.",
          provider: "fallback",
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingText("");
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hey there. I'm Tangison — your Feorm assistant. What can I help you with?",
        provider: "system",
      },
    ]);
    setStreamingText("");
  };

  // ─── FAB (closed state) ───
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 z-30 w-14 h-14 rounded-full bg-earth text-white-feorm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 active:scale-[0.98]"
        aria-label="Open Tangison AI assistant"
      >
        <Sparkles
          size={20}
          className="text-harvest group-hover:rotate-12 transition-transform"
        />
      </button>
    );
  }

  // ─── Chat panel ───
  const isFullWidth = isExpanded;

  return (
    <div
      className={`fixed z-50 flex flex-col overflow-hidden shadow-2xl border border-earth/8 bg-white-feorm transition-all duration-300 ${
        isFullWidth
          ? "inset-0 lg:inset-auto lg:bottom-8 lg:right-8 lg:w-[440px] lg:h-[600px] lg:rounded-[16px]"
          : "bottom-24 right-5 w-[360px] max-w-[calc(100vw-48px)] h-[480px] max-h-[calc(100vh-160px)] lg:bottom-8 lg:right-8 rounded-[12px]"
      }`}
    >
      {/* Header */}
      <div className="bg-earth text-white-feorm px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-harvest/20 flex items-center justify-center">
            <Sparkles size={16} className="text-harvest" />
          </div>
          <div>
            <h4 className="text-sm font-medium leading-tight">Tangison</h4>
            <p className="font-mono-feorm text-[8px] uppercase tracking-widest text-sand">
              {isLoading && activeProvider
                ? `${PROVIDER_LABELS[activeProvider] || activeProvider} · Thinking...`
                : "Feorm AI Assistant"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Expand/collapse toggle (desktop) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex w-7 h-7 rounded-full hover:bg-white-feorm/10 transition-colors items-center justify-center"
            aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
          <button
            onClick={handleClear}
            className="w-7 h-7 rounded-full hover:bg-white-feorm/10 transition-colors flex items-center justify-center"
            aria-label="Clear chat"
            title="Clear conversation"
          >
            <span className="text-[10px] font-mono-feorm uppercase">Clear</span>
          </button>
          <button
            onClick={() => {
              abortRef.current?.abort();
              setIsOpen(false);
              setIsExpanded(false);
            }}
            className="w-7 h-7 rounded-full hover:bg-white-feorm/10 transition-colors flex items-center justify-center"
            aria-label="Close chat"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-grow overflow-y-auto p-4 space-y-3 bg-fog"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-[10px] px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-earth text-white-feorm rounded-br-sm"
                  : "bg-white-feorm border border-soil/8 text-earth rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" && i === 0 && (
                <span className="font-mono-feorm text-[8px] uppercase tracking-widest text-harvest block mb-1">
                  Tangison
                </span>
              )}
              {msg.content}
              {msg.role === "assistant" && msg.provider && msg.provider !== "system" && (
                <span className="font-mono-feorm text-[7px] text-sand block mt-1.5">
                  via {PROVIDER_LABELS[msg.provider] || msg.provider}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Streaming text */}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-white-feorm border border-soil/8 rounded-[10px] rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed text-earth">
              <span className="font-mono-feorm text-[8px] uppercase tracking-widest text-harvest block mb-1">
                Tangison
              </span>
              {streamingText}
              {activeProvider && (
                <span className="font-mono-feorm text-[7px] text-sand block mt-1.5">
                  via {PROVIDER_LABELS[activeProvider] || activeProvider}
                </span>
              )}
              <span className="inline-block w-1.5 h-4 bg-harvest/60 ml-0.5 animate-pulse align-text-bottom" />
            </div>
          </div>
        )}

        {/* Loading dots (when no streaming yet) */}
        {isLoading && !streamingText && (
          <div className="flex justify-start">
            <div className="bg-white-feorm border border-soil/8 rounded-[10px] rounded-bl-sm px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-harvest animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-harvest animate-bounce [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-harvest animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts (show when conversation just started) */}
      {messages.length <= 1 && !isLoading && !streamingText && (
        <div className="px-3 py-2 bg-fog border-t border-soil/5 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1.5 rounded-full bg-white-feorm border border-soil/10 text-earth hover:bg-cream hover:border-earth/20 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-soil/10 bg-white-feorm p-3 shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            id="tangison-input"
            name="tangison-message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Tangison anything..."
            className="flex-grow bg-fog border border-soil/10 rounded-full px-4 py-2.5 text-sm outline-none focus:border-earth transition-colors placeholder:text-sand min-h-[44px]"
            disabled={isLoading}
            aria-label="Type a message to Tangison"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-earth text-white-feorm flex items-center justify-center shrink-0 hover:bg-bark transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.95]"
            aria-label="Send message"
          >
            {isLoading ? (
              <Zap size={14} className="animate-pulse" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
