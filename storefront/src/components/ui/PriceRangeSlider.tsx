import { useEffect, useState, type ChangeEvent, type ReactElement } from "react";
import { PRICE_CEILING } from "../../data/constants";
import { cn } from "../../lib/cn";
import { formatUGX } from "../../lib/format";

export interface PriceRangeSliderProps {
  min: number;
  /** `null` means "no upper limit". */
  max: number | null;
  onChange: (min: number, max: number | null) => void;
  idPrefix: string;
}

const STEPS = 1000;
const CURVE = 3;

/**
 * Listing prices span phones (UGX 80,000) to land (UGX 60M+). A linear slider would make
 * the common range unusable, so slider positions map to prices on a cubic curve.
 */
function positionToPrice(position: number): number {
  const raw = PRICE_CEILING * Math.pow(position / STEPS, CURVE);
  const rounding = raw < 100_000 ? 5_000 : raw < 1_000_000 ? 10_000 : raw < 5_000_000 ? 50_000 : 100_000;
  return Math.min(PRICE_CEILING, Math.round(raw / rounding) * rounding);
}

function priceToPosition(price: number): number {
  return Math.round(STEPS * Math.pow(Math.min(price, PRICE_CEILING) / PRICE_CEILING, 1 / CURVE));
}

function parseDigits(value: string): number | null {
  const digits = value.replace(/\D/g, "");
  return digits.length === 0 ? null : Number.parseInt(digits, 10);
}

export function PriceRangeSlider({ min, max, onChange, idPrefix }: PriceRangeSliderProps): ReactElement {
  const effectiveMax = max ?? PRICE_CEILING;
  const lowPosition = priceToPosition(min);
  const highPosition = priceToPosition(effectiveMax);

  // Text inputs hold draft strings so the user can type freely; they commit on blur / Enter.
  const [minDraft, setMinDraft] = useState(min === 0 ? "" : String(min));
  const [maxDraft, setMaxDraft] = useState(max === null ? "" : String(max));
  useEffect(() => setMinDraft(min === 0 ? "" : String(min)), [min]);
  useEffect(() => setMaxDraft(max === null ? "" : String(max)), [max]);

  const commitLow = (event: ChangeEvent<HTMLInputElement>): void => {
    const position = Math.min(Number(event.target.value), highPosition);
    onChange(positionToPrice(position), max);
  };

  const commitHigh = (event: ChangeEvent<HTMLInputElement>): void => {
    const position = Math.max(Number(event.target.value), lowPosition);
    onChange(min, position >= STEPS ? null : positionToPrice(position));
  };

  const commitDrafts = (): void => {
    const nextMin = parseDigits(minDraft) ?? 0;
    const nextMax = parseDigits(maxDraft);
    if (nextMax !== null && nextMax < nextMin) onChange(nextMax, nextMin);
    else onChange(nextMin, nextMax);
  };

  const trackStart = (lowPosition / STEPS) * 100;
  const trackEnd = (highPosition / STEPS) * 100;

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-content" aria-live="polite">
        {formatUGX(min)} <span className="font-normal text-content-subtle">to</span>{" "}
        {max === null ? `${formatUGX(PRICE_CEILING)}+` : formatUGX(max)}
      </p>

      <div className="relative mx-2.5 h-6">
        <div aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-muted" />
        <div
          aria-hidden="true"
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand"
          style={{ left: `${trackStart}%`, width: `${Math.max(0, trackEnd - trackStart)}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          aria-valuetext={formatUGX(min)}
          min={0}
          max={STEPS}
          step={1}
          value={lowPosition}
          onChange={commitLow}
          className={cn("range-thumb", lowPosition > STEPS - 40 && "z-10")}
          id={`${idPrefix}-min-range`}
        />
        <input
          type="range"
          aria-label="Maximum price"
          aria-valuetext={max === null ? `${formatUGX(PRICE_CEILING)} or more` : formatUGX(max)}
          min={0}
          max={STEPS}
          step={1}
          value={highPosition}
          onChange={commitHigh}
          className="range-thumb"
          id={`${idPrefix}-max-range`}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="block" htmlFor={`${idPrefix}-min-input`}>
          <span className="mb-1 block text-xs font-medium text-content-muted">Min (UGX)</span>
          <input
            id={`${idPrefix}-min-input`}
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={minDraft}
            onChange={(event) => setMinDraft(event.target.value)}
            onBlur={commitDrafts}
            onKeyDown={(event) => event.key === "Enter" && commitDrafts()}
            className="w-full rounded-xl border border-line bg-surface-muted px-3 py-2 text-sm font-medium text-content placeholder:text-content-subtle focus:border-brand"
          />
        </label>
        <label className="block" htmlFor={`${idPrefix}-max-input`}>
          <span className="mb-1 block text-xs font-medium text-content-muted">Max (UGX)</span>
          <input
            id={`${idPrefix}-max-input`}
            inputMode="numeric"
            autoComplete="off"
            placeholder="No limit"
            value={maxDraft}
            onChange={(event) => setMaxDraft(event.target.value)}
            onBlur={commitDrafts}
            onKeyDown={(event) => event.key === "Enter" && commitDrafts()}
            className="w-full rounded-xl border border-line bg-surface-muted px-3 py-2 text-sm font-medium text-content placeholder:text-content-subtle focus:border-brand"
          />
        </label>
      </div>
    </div>
  );
}
