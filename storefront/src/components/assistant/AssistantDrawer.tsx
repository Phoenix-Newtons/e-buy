import { useEffect, useRef, useState, type FormEvent, type ReactElement } from "react";
import { ArrowRight, Bot, RotateCcw, SendHorizontal, Sparkles, X } from "lucide-react";
import { ASSISTANT_SUGGESTIONS } from "../../data/constants";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import type { AssistantChat } from "../../hooks/useAssistant";
import { cn } from "../../lib/cn";
import { pluralize } from "../../lib/format";
import type { ChatMessage, FilterPatch } from "../../types";
import { AssistantProductRow } from "./AssistantProductRow";

export interface AssistantDrawerProps {
  open: boolean;
  onClose: () => void;
  chat: AssistantChat;
  /** Applies the assistant's search to the main catalog filters. */
  onApplyPatch: (patch: FilterPatch) => void;
}

const timeFormat = new Intl.DateTimeFormat("en-UG", { hour: "numeric", minute: "2-digit" });

function TypingBubble(): ReactElement {
  return (
    <li className="flex items-end gap-2" aria-label="The assistant is typing">
      <BotAvatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-surface-muted px-4 py-3.5" aria-hidden="true">
        {[0, 150, 300].map((delay) => (
          <span key={delay} className="h-2 w-2 animate-bounce rounded-full bg-content-subtle" style={{ animationDelay: `${delay}ms` }} />
        ))}
      </div>
    </li>
  );
}

function BotAvatar(): ReactElement {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-lime-500 text-brand-contrast shadow-card"
    >
      <Bot className="h-4 w-4" />
    </span>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  onApplyPatch: (patch: FilterPatch) => void;
}

function MessageBubble({ message, onApplyPatch }: MessageBubbleProps): ReactElement {
  const isUser = message.role === "user";
  const patch = message.patch;
  const hasMore = message.totalMatches > message.products.length;

  return (
    <li className={cn("flex animate-fade-up items-end gap-2", isUser && "flex-row-reverse")}>
      {!isUser && <BotAvatar />}
      <div className={cn("flex max-w-[86%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        <p
          className={cn(
            "whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card",
            isUser ? "rounded-br-md bg-brand text-brand-contrast" : "rounded-bl-md bg-surface-muted text-content",
          )}
        >
          <span className="sr-only">{isUser ? "You: " : "Assistant: "}</span>
          {message.text}
        </p>

        {message.products.length > 0 && (
          <ul className="w-full space-y-2" aria-label="Recommended listings">
            {message.products.map((product) => (
              <li key={product.id}>
                <AssistantProductRow product={product} />
              </li>
            ))}
          </ul>
        )}

        {patch !== null && message.totalMatches > 0 && (
          <button
            type="button"
            onClick={() => onApplyPatch(patch)}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand-soft px-3.5 py-2 text-xs font-bold text-brand-soft-content transition hover:border-brand"
          >
            {hasMore
              ? `See all ${message.totalMatches} ${pluralize(message.totalMatches, "result")} in the catalog`
              : "Open these in the catalog"}
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        )}

        <time dateTime={message.createdAt} className="px-1 text-[10px] font-medium text-content-subtle">
          {timeFormat.format(new Date(message.createdAt))}
        </time>
      </div>
    </li>
  );
}

/**
 * Right-hand slide-out chat panel for the AI Shopping Assistant. Traps Escape,
 * locks background scroll, focuses the input on open and restores focus on close.
 */
export function AssistantDrawer({ open, onClose, chat, onApplyPatch }: AssistantDrawerProps): ReactElement {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLLIElement | null>(null);
  const { messages, isTyping, send, reset } = chat;
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // Wait for the slide-in transition to start so focus does not cause a scroll jump.
    const focusTimer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120);
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isTyping, open]);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (draft.trim().length === 0 || isTyping) return;
    send(draft);
    setDraft("");
  };

  return (
    <div className={cn("fixed inset-0 z-[70]", open ? "pointer-events-auto" : "pointer-events-none")} inert={!open}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn("absolute inset-0 bg-black/55 transition-opacity duration-300", open ? "opacity-100 backdrop-blur-sm" : "opacity-0")}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-heading"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface-raised shadow-float transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center gap-3 border-b border-line bg-surface-inverse px-4 py-4 text-content-inverse">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-lime-500 text-brand-contrast shadow-card">
            <Sparkles aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="assistant-heading" className="text-base font-extrabold leading-tight">
              Shopping Assistant
            </h2>
            <p className="flex items-center gap-1.5 text-xs text-white/70">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-lime-400" />
              Searches live E-Buy listings
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            aria-label="Start a new conversation"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw aria-hidden="true" className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain bg-canvas px-4 py-5">
          <ul role="log" aria-live="polite" aria-label="Conversation" className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} onApplyPatch={onApplyPatch} />
            ))}
            {isTyping && <TypingBubble />}
            <li ref={endRef} aria-hidden="true" className="h-px" />
          </ul>
        </div>

        <footer className="border-t border-line bg-surface-raised pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="px-4 pt-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-content-subtle">Try asking</p>
            <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {ASSISTANT_SUGGESTIONS.map((suggestion) => (
                <li key={suggestion} className="shrink-0">
                  <button
                    type="button"
                    disabled={isTyping}
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-content shadow-card transition-all duration-300 hover:border-brand hover:bg-brand-soft hover:text-brand-soft-content disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="flex items-center gap-2 px-4 pt-3">
            <label htmlFor="assistant-input" className="sr-only">
              Ask the shopping assistant
            </label>
            <input
              id="assistant-input"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="e.g. laptops in Entebbe under 5M"
              autoComplete="off"
              enterKeyHint="send"
              className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface-muted px-4 text-sm font-medium text-content placeholder:text-content-subtle focus-visible:ring-offset-0"
            />
            <button
              type="submit"
              disabled={draft.trim().length === 0 || isTyping}
              aria-label="Send message"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-contrast shadow-card transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendHorizontal aria-hidden="true" className="h-5 w-5" />
            </button>
          </form>
          <p className="px-4 pt-2 text-center text-[10px] text-content-subtle">
            Automated assistant. Always inspect an item before you pay.
          </p>
        </footer>
      </aside>
    </div>
  );
}
