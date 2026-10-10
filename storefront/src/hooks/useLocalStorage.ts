import { useCallback, useEffect, useState } from "react";

/**
 * `useState` that persists to localStorage. `parse` validates stored JSON so
 * corrupted or outdated values fall back to `initialValue` instead of crashing.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  parse: (raw: unknown) => T | null,
): readonly [T, (next: T | ((previous: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return parse(JSON.parse(raw)) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be full or blocked (private mode). The in-memory value still works.
    }
  }, [key, value]);

  const set = useCallback((next: T | ((previous: T) => T)) => setValue(next), []);
  return [value, set] as const;
}
