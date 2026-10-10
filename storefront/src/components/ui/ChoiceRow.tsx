import type { ChangeEventHandler, ReactElement, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";

export interface ChoiceRowProps {
  type: "checkbox" | "radio";
  /** Required for radios so they form one native group. */
  name?: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  label: string;
  description?: string;
  /** Optional trailing text, e.g. a listing count. */
  trailing?: ReactNode;
  leading?: ReactNode;
}

/** A large, touch-friendly checkbox or radio row built on a real native input. */
export function ChoiceRow({ type, name, checked, onChange, label, description, trailing, leading }: ChoiceRowProps): ReactElement {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-surface-muted",
        checked && "bg-brand-soft/60 hover:bg-brand-soft",
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface",
          type === "radio" ? "rounded-full" : "rounded-md",
          checked ? "border-brand bg-brand text-brand-contrast" : "border-line-strong bg-surface",
        )}
      >
        {checked && (type === "radio" ? <span className="h-2 w-2 rounded-full bg-brand-contrast" /> : <Check className="h-3.5 w-3.5" strokeWidth={3} />)}
      </span>
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-content">{label}</span>
        {description && <span className="block truncate text-xs text-content-subtle">{description}</span>}
      </span>
      {trailing !== undefined && <span className="shrink-0 text-xs font-medium text-content-subtle">{trailing}</span>}
    </label>
  );
}
