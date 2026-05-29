"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Send, X, Sparkles } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function TangisonChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I'm Tangison, your Feorm assistant. I can help you find listings, understand our escrow protocol, or learn about Namibian agriculture. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Cancel any in-flight request before sending a new one
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Abort previous request if still in flight
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          context: {
            currentPage: typeof window !== "undefined" ? window.location.pathname : "",
          },
        }),
        signal: controller.signal,
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble connecting. Please try again or contact support via WhatsApp.",
          },
        ]);
      }
    } catch (err: any) {
      // Don't show error for aborted requests
      if (err?.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connection issue. Please try again or reach out on WhatsApp for immediate help.",
        },
      ]);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 z-30 w-14 h-14 rounded-full bg-earth text-white-feorm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 active:scale-[0.98]"
        aria-label="Open Tangison AI assistant"
      >
        <Sparkles size={20} className="text-harvest group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 z-50 w-[360px] max-w-[calc(100vw-48px)] flex flex-col rounded-[12px] overflow-hidden shadow-2xl border border-earth/8 bg-white-feorm">
      {/* Header */}
      <div className="bg-earth text-white-feorm px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white-feorm/10 flex items-center justify-center overflow-hidden">
            <Image
              src="/tangison-avatar.png"
              alt="Tangison"
              width={36}
              height={36}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.innerHTML =
                    '<span style="color: var(--color-harvest); font-weight: 600; font-size: 14px;">T</span>';
                }
              }}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium">Tangison</h4>
            <p className="font-mono-feorm text-[8px] uppercase tracking-widest text-sand">
              Feorm AI Assistant
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            abortRef.current?.abort();
            setIsOpen(false);
          }}
          className="w-8 h-8 rounded-full hover:bg-white-feorm/10 transition-colors flex items-center justify-center"
          aria-label="Close chat"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-grow max-h-[360px] overflow-y-auto p-4 space-y-3 bg-fog"
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
              className={`max-w-[85%] rounded-[8px] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-earth text-white-feorm rounded-br-sm"
                  : "bg-white-feorm border border-soil/10 text-earth rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" && i === 0 && (
                <span className="font-mono-feorm text-[8px] uppercase tracking-widest text-harvest block mb-1">
                  Tangison
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white-feorm border border-soil/10 rounded-[8px] rounded-bl-sm px-4 py-3">
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
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-earth text-white-feorm flex items-center justify-center shrink-0 hover:bg-bark transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.95]"
            aria-label="Send message"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
