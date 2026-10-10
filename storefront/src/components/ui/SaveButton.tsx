import { useState, type ReactElement } from "react";
import { Heart } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SaveButtonProps {
  saved: boolean;
  onToggle: () => void;
  itemTitle: string;
  className?: string;
}

/** Quick-save heart. Announces its state through `aria-pressed` and plays a small pulse when saving. */
export function SaveButton({ saved, onToggle, itemTitle, className }: SaveButtonProps): ReactElement {
  const [pulsing, setPulsing] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${itemTitle} from saved items` : `Save ${itemTitle}`}
      onClick={() => {
        if (!saved) setPulsing(true);
        onToggle();
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 shadow-card backdrop-blur-sm transition hover:scale-110 active:scale-95",
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        onAnimationEnd={() => setPulsing(false)}
        className={cn(
          "h-[18px] w-[18px] transition-colors",
          saved ? "fill-danger text-danger" : "text-content-muted",
          pulsing && "animate-heart-beat",
        )}
      />
    </button>
  );
}
