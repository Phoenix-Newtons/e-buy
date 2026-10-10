import { useCallback, useEffect, useRef, useState } from "react";
import { answer } from "../lib/assistant";
import type { ChatMessage, Product } from "../types";

const WELCOME_TEXT =
  "Hi, I'm your E-Buy shopping assistant. Tell me what you're looking for, where, and your budget, and I'll find matching listings. Tap a suggestion below to try it.";

/** How long the assistant "thinks", scaled slightly to the answer length so it feels natural. */
function typingDelay(replyLength: number): number {
  return Math.min(1_400, 650 + replyLength * 3);
}

function createId(): string {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function welcomeMessage(): ChatMessage {
  return { id: "welcome", role: "assistant", text: WELCOME_TEXT, products: [], totalMatches: 0, patch: null, createdAt: new Date().toISOString() };
}

export interface AssistantChat {
  messages: readonly ChatMessage[];
  isTyping: boolean;
  send: (text: string) => void;
  reset: () => void;
}

/**
 * Chat state for the shopping assistant. Replies are generated locally from the current
 * listings and delivered after a short simulated typing delay.
 */
export function useAssistant(products: readonly Product[]): AssistantChat {
  const [messages, setMessages] = useState<readonly ChatMessage[]>(() => [welcomeMessage()]);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<number | null>(null);
  const productsRef = useRef(products);
  productsRef.current = products;

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const send = useCallback((rawText: string) => {
    const text = rawText.trim();
    if (text.length === 0 || timerRef.current !== null) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      text,
      products: [],
      totalMatches: 0,
      patch: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((previous) => [...previous, userMessage]);
    setIsTyping(true);

    const reply = answer(text, productsRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setIsTyping(false);
      setMessages((previous) => [
        ...previous,
        { id: createId(), role: "assistant", ...reply, createdAt: new Date().toISOString() },
      ]);
    }, typingDelay(reply.text.length));
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsTyping(false);
    setMessages([welcomeMessage()]);
  }, []);

  return { messages, isTyping, send, reset };
}
