import type { ReactElement } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

export interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps): ReactElement {
  return (
    <div role="alert" className="flex flex-col items-center rounded-3xl border border-danger/30 bg-danger-soft px-6 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-danger shadow-card">
        <WifiOff aria-hidden="true" className="h-8 w-8" />
      </span>
      <h3 className="mt-5 text-xl font-extrabold text-content">We couldn&apos;t load the marketplace</h3>
      <p className="mt-2 max-w-md text-sm text-content-muted">{message} Please check your internet connection and try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-brand-contrast shadow-card hover:bg-brand-hover"
      >
        <RefreshCw aria-hidden="true" className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
