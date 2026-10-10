import { useEffect, useState, type ChangeEvent, type ReactElement } from "react";
import { PRICE_BRACKETS, PRICE_CEILING, PRICE_FLOOR } from "../../data/constants";
import { cn } from "../../lib/cn";
import { formatAmountDraft, formatUGX, formatUGXCompact, parseUgxInput } from "../../lib/format";

export interface PriceRangeSliderProps {
  /** `0` means "no minimum". */
  min: number;
  /** `null` means "no upper limit". */
  max: number | null;
  onChange: (min: number, max: number | null) => void;
  idPrefix: string;
}

const STEPS = 1000;
const CURVE = 3;
const SPAN = PRICE_CEILING - PRICE_FLOOR;

/**
 * Listings run from UGX 180,000 to UGX 42,000,000. A linear slider would squash the
 * everyday range (phones, shoes, laptops) into the first few pixels, so slider positions
 * map to prices on a cubic curve between the floor and the ceiling.
 */
function positionToPrice(position: number): number {
  const raw = PRICE_FLOOR + SPAN * Math.pow(position / STEPS, CURVE);
  const rounding = raw < 500_000 ? 10_000 : raw < 2_000_000 ? 50_000 : raw < 10_000_000 ? 100_000 : 500_000;
  return Math.min(PRICE_CEILING, Math.max(PRICE_FLOOR, Math.round(raw / rounding) * rounding));
}

function priceToPosition(price: number): number {
  const clamped = Math.min(PRICE_CEILING, Math.max(PRICE_FLOOR, price));
  return Math.round(STEPS * Math.pow((clamped - PRICE_FLOOR) / SPAN, 1 / CURVE));
}

function toDraft(value: number | null): string {
  return value === null || value === 0 ? "" : formatAmountDraft(String(value));
}

/** Ordered slider presets, taken from the shared price brackets (minus "Any price"). */
const QUICK_BRACKETS = PRICE_BRACKETS.filter((bracket) => bracket.id !== "any");

export function PriceRangeSlider({ min, max, onChange, idPrefix }: PriceRangeSliderProps): ReactElement {
  const lowPosition = min <= PRICE_FLOOR ? 0 : priceToPosition(min);
  const highPosition = max === null || max >= PRICE_CEILING ? STEPS : priceToPosition(max);

  // The text boxes hold draft strings so people can type "1.5m" or "500k" freely;
  // they are parsed and committed on blur or Enter.
  const [minDraft, setMinDraft] = useState(() => toDraft(min));
  const [maxDraft, setMaxDraft] = useState(() => toDraft(max));
  const [inputError, setInputError] = useState<string | null>(null);
  useEffect(() => setMinDraft(toDraft(min)), [min]);
  useEffect(() => setMaxDraft(toDraft(max)), [max]);

  const commitLow = (event: ChangeEvent<HTMLInputElement>): void => {
    const position = Math.min(Number(event.target.value), highPosition);
    setInputError(null);
    onChange(position <= 0 ? 0 : positionToPrice(position), max);
  };

  const commitHigh = (event: ChangeEvent<HTMLInputElement>): void => {
    const position = Math.max(Number(event.target.value), lowPosition);
    setInputError(null);
    onChange(min, position >= STEPS ? null : positionToPrice(position));
  };

  const commitDrafts = (): void => {
    const parsedMin = minDraft.trim() === "" ? 0 : parseUgxInput(minDraft);
    const parsedMax = maxDraft.trim() === "" ? null : parseUgxInput(maxDraft);

    if (parsedMin === null || (maxDraft.trim() !== "" && parsedMax === null)) {
      setInputError("Enter an amount like 500000, 500,000, 500k or 1.5m.");
      return;
    }
    setInputError(null);

    const nextMax = parsedMax !== null && parsedMax >= PRICE_CEILING ? null : parsedMax;
    if (nextMax !== null && nextMax < parsedMin) onChange(nextMax, parsedMin);
    else onChange(parsedMin, nextMax);
  };

  const trackStart = (lowPosition / STEPS) * 100;
  const trackEnd = (highPosition / STEPS) * 100;
  const shownMin = Math.max(min, PRICE_FLOOR);

  const inputClass =
    "w-full min-w-0 rounded-xl border bg-surface-muted py-2 pl-10 pr-2 text-[13px] font-semibold text-content placeholder:font-normal placeholder:text-content-subtle focus:border-brand";

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-content" aria-live="polite">
        {formatUGX(shownMin)} <span className="font-normal text-content-subtle">to</span>{" "}
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
          aria-valuetext={min === 0 ? "No minimum" : formatUGX(min)}
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
      <div aria-hidden="true" className="mx-0.5 mt-1 flex justify-between text-[11px] font-medium text-content-subtle">
        <span>{formatUGXCompact(PRICE_FLOOR)}</span>
        <span>{formatUGXCompact(PRICE_CEILING)}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {(
          [
            { id: `${idPrefix}-min-input`, label: "Minimum", value: minDraft, set: setMinDraft, placeholder: PRICE_FLOOR.toLocaleString("en-UG") },
            { id: `${idPrefix}-max-input`, label: "Maximum", value: maxDraft, set: setMaxDraft, placeholder: PRICE_CEILING.toLocaleString("en-UG") },
          ] as const
        ).map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="mb-1 block text-xs font-medium text-content-muted">
              {field.label}
            </label>
            <div className="relative">
              <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-content-subtle">
                UGX
              </span>
              <input
                id={field.id}
                inputMode="decimal"
                autoComplete="off"
                placeholder={field.placeholder}
                value={field.value}
                aria-invalid={inputError !== null}
                aria-describedby={inputError !== null ? `${idPrefix}-price-error` : undefined}
                onChange={(event) => field.set(formatAmountDraft(event.target.value))}
                onBlur={commitDrafts}
                onKeyDown={(event) => event.key === "Enter" && commitDrafts()}
                className={cn(inputClass, inputError !== null ? "border-danger" : "border-line")}
              />
            </div>
          </div>
        ))}
      </div>
      {inputError !== null && (
        <p id={`${idPrefix}-price-error`} role="alert" className="mt-2 text-xs font-medium text-danger">
          {inputError}
        </p>
      )}
      <p className="mt-2 text-[11px] leading-snug text-content-subtle">Tip: type shortcuts like 500k or 1.5m.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_BRACKETS.map((bracket) => {
          const active = bracket.min === min && bracket.max === max;
          return (
            <button
              key={bracket.id}
              type="button"
              aria-pressed={active}
              onClick={() => (active ? onChange(0, null) : onChange(bracket.min, bracket.max))}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300",
                active
                  ? "border-brand bg-brand text-brand-contrast"
                  : "border-line bg-surface text-content-muted hover:border-brand hover:text-brand-soft-content",
              )}
            >
              {bracket.label.replace("UGX ", "")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
