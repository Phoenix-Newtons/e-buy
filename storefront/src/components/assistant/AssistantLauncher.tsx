import type { ReactElement } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";

export interface AssistantLauncherProps {
  onOpen: () => void;
  hidden: boolean;
}

/** Floating shortcut to the shopping assistant, visible on every screen size. */
export function AssistantLauncher({ onOpen, hidden }: AssistantLauncherProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      className={cn(
        "fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-brand py-3.5 pl-4 pr-5 text-sm font-bold text-brand-contrast shadow-float transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg",
        hidden && "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        {!hidden && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-accent/60 motion-reduce:animate-none" />}
        <Sparkles aria-hidden="true" className="relative h-5 w-5 text-accent" />
      </span>
      Ask Assistant
    </button>
  );
}
