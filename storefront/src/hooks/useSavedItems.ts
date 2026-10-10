import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface SavedItems {
  savedIds: ReadonlySet<string>;
  savedCount: number;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

function parseIds(raw: unknown): string[] | null {
  return Array.isArray(raw) && raw.every((entry): entry is string => typeof entry === "string") ? raw : null;
}

/** Wishlist of quick-saved listings, persisted per browser. */
export function useSavedItems(): SavedItems {
  const [ids, setIds] = useLocalStorage<string[]>("ebuy:saved", [], parseIds);
  const savedIds = useMemo(() => new Set(ids), [ids]);

  const toggleSaved = useCallback(
    (id: string) => setIds((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id])),
    [setIds],
  );
  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  return { savedIds, savedCount: ids.length, isSaved, toggleSaved };
}
