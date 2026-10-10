import { useEffect, type RefObject } from "react";

/** Calls `onOutside` for any pointer press outside `ref` while `active` is true. */
export function useClickOutside(ref: RefObject<HTMLElement | null>, active: boolean, onOutside: () => void): void {
  useEffect(() => {
    if (!active) return;
    const handler = (event: PointerEvent): void => {
      const node = ref.current;
      if (node && event.target instanceof Node && !node.contains(event.target)) onOutside();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [ref, active, onOutside]);
}
