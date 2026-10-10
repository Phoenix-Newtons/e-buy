import { useEffect, useRef, type ReactElement } from "react";
import { X } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { cn } from "../../lib/cn";
import type { LegalDocument } from "../../types";

export interface InfoDialogProps {
  document: LegalDocument | null;
  onClose: () => void;
}

/** Centered modal for the Terms, Privacy and Safety documents opened from the footer. */
export function InfoDialog({ document: doc, onClose }: InfoDialogProps): ReactElement {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const open = doc !== null;
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const opener = window.document.activeElement instanceof HTMLElement ? window.document.activeElement : null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    window.document.addEventListener("keydown", onKeyDown);
    return () => {
      window.document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6", open ? "pointer-events-auto" : "pointer-events-none")}
      inert={!open}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn("absolute inset-0 bg-black/60 transition-opacity duration-300", open ? "opacity-100 backdrop-blur-sm" : "opacity-0")}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-dialog-title"
        className={cn(
          "relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-surface-raised shadow-float transition-all duration-300 sm:rounded-3xl",
          open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 id="info-dialog-title" className="text-xl font-extrabold text-content">
              {doc?.title}
            </h2>
            <p className="mt-1 text-sm text-content-muted">{doc?.summary}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-content-muted hover:bg-surface-muted"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>
        <div className="space-y-6 overflow-y-auto px-6 py-6">
          {doc?.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-brand-soft-content">{section.heading}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-sm leading-relaxed text-content-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
