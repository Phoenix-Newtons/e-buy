import type { Dispatch, ReactElement } from "react";
import { X } from "lucide-react";
import type { ActiveFilterChip, FilterAction } from "../../types";

export interface ActiveFilterChipsProps {
  chips: readonly ActiveFilterChip[];
  dispatch: Dispatch<FilterAction>;
}

/** Removable summary of every active filter, so users always know why results are narrowed. */
export function ActiveFilterChips({ chips, dispatch }: ActiveFilterChipsProps): ReactElement | null {
  if (chips.length === 0) return null;
  return (
    <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={() => dispatch(chip.action)}
            className="group flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft py-1.5 pl-3 pr-2 text-xs font-bold text-brand-soft-content transition hover:border-brand"
          >
            {chip.label}
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand/15 group-hover:bg-brand group-hover:text-brand-contrast">
              <X aria-hidden="true" className="h-3 w-3" />
            </span>
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => dispatch({ type: "reset" })}
          className="rounded-full px-3 py-1.5 text-xs font-bold text-content-muted underline-offset-4 hover:text-content hover:underline"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}
