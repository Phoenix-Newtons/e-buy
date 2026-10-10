import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from "react";
import { Check, ChevronDown, type LucideIcon } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../lib/cn";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export type SelectVariant = "field" | "pill";

export interface SelectProps<T extends string> {
  /** Visible caption (field variant) and the accessible name. */
  label: string;
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  icon?: LucideIcon;
  variant?: SelectVariant;
  /** Which edge of the trigger the popover aligns to. */
  align?: "left" | "right";
  className?: string;
}

/**
 * Accessible, fully custom single-select. Implements the ARIA "select-only combobox"
 * pattern: focus stays on the trigger and `aria-activedescendant` tracks the highlighted option.
 */
export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
  icon: Icon,
  variant = "field",
  align = "left",
  className,
}: SelectProps<T>): ReactElement {
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number): string => `${baseId}-option-${index}`;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [open, setOpen] = useState(false);

  const selectedIndex = useMemo(() => Math.max(0, options.findIndex((option) => option.value === value)), [options, value]);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const selected = options[selectedIndex];

  const close = useCallback(() => setOpen(false), []);
  useClickOutside(rootRef, open, close);

  const openList = useCallback(() => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  }, [selectedIndex]);

  const commit = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) onChange(option.value);
      setOpen(false);
    },
    [onChange, options],
  );

  // Keep the highlighted option visible while navigating with the keyboard.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList();
        else setActiveIndex((index) => Math.min(last, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else setActiveIndex((index) => Math.max(0, index - 1));
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(last);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) commit(activeIndex);
        else openList();
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const isField = variant === "field";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={cn(
          "group flex w-full items-center gap-3 text-left transition-colors",
          isField
            ? "rounded-xl px-3 py-2 hover:bg-surface-muted focus-visible:ring-offset-0"
            : "rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold shadow-card hover:border-line-strong",
          open && (isField ? "bg-surface-muted" : "border-brand"),
        )}
      >
        {Icon && (
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg",
              isField ? "h-9 w-9 bg-brand-soft text-brand-soft-content" : "text-content-subtle",
            )}
          >
            <Icon className={isField ? "h-[18px] w-[18px]" : "h-4 w-4"} />
          </span>
        )}
        <span className="min-w-0 flex-1">
          {isField && <span className="block text-[11px] font-semibold uppercase tracking-wide text-content-subtle">{label}</span>}
          <span className={cn("block truncate text-content", isField ? "text-sm font-semibold" : "text-sm font-semibold")}>
            {selected?.label}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-4 w-4 shrink-0 text-content-subtle transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          className={cn(
            "absolute z-50 mt-2 max-h-72 w-max min-w-full max-w-[min(22rem,calc(100vw-2rem))] animate-pop-in overflow-y-auto rounded-2xl border border-line bg-surface-raised p-1.5 shadow-float",
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const OptionIcon = option.icon;
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => commit(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                  index === activeIndex ? "bg-surface-muted" : "bg-transparent",
                  isSelected ? "font-semibold text-brand-soft-content" : "text-content",
                )}
              >
                {OptionIcon && <OptionIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-content-subtle" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.description && <span className="block truncate text-xs font-normal text-content-subtle">{option.description}</span>}
                </span>
                {isSelected && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
