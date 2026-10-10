import { useId, useState, type ReactElement, type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

export interface AccordionPanelProps {
  title: string;
  icon: LucideIcon;
  /** Number of active filters inside this panel, shown as a badge. */
  activeCount?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Stateful expandable panel. The height animates with a CSS grid-rows transition,
 * so no JavaScript measuring is required and content never gets clipped.
 */
export function AccordionPanel({
  title,
  icon: Icon,
  activeCount = 0,
  defaultOpen = false,
  children,
}: AccordionPanelProps): ReactElement {
  const [open, setOpen] = useState(defaultOpen);
  const headingId = useId();
  const regionId = useId();

  return (
    <section className="border-b border-line last:border-b-0" aria-labelledby={headingId}>
      <h3 id={headingId}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={regionId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center gap-3 rounded-lg py-4 text-left"
        >
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-soft-content">
            <Icon className="h-4 w-4" />
          </span>
          <span className="flex-1 text-sm font-bold text-content">{title}</span>
          {activeCount > 0 && (
            <span
              className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-brand-contrast"
              aria-label={`${activeCount} selected`}
            >
              {activeCount}
            </span>
          )}
          <ChevronDown
            aria-hidden="true"
            className={cn("h-4 w-4 text-content-subtle transition-transform duration-300", open && "rotate-180")}
          />
        </button>
      </h3>
      <div
        id={regionId}
        role="region"
        aria-labelledby={headingId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        {/* `inert` keeps collapsed content out of the tab order and accessibility tree. */}
        <div className="overflow-hidden" inert={!open}>
          <div className="px-1 pb-5 pt-1">{children}</div>
        </div>
      </div>
    </section>
  );
}
