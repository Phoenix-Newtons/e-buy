import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export interface HorizontalScroller<T extends HTMLElement> {
  ref: RefObject<T | null>;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollByPage: (direction: -1 | 1) => void;
}

/** Tracks overflow at both ends of a horizontal scroll container and offers paged scrolling. */
export function useHorizontalScroller<T extends HTMLElement>(watch?: unknown): HorizontalScroller<T> {
  const ref = useRef<T | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const update = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    setCanScrollPrev(node.scrollLeft > 4);
    setCanScrollNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    update();
    node.addEventListener("scroll", update, { passive: true });
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    resizeObserver?.observe(node);
    return () => {
      node.removeEventListener("scroll", update);
      resizeObserver?.disconnect();
    };
  // `watch` lets callers re-measure when the number of children changes.
  }, [update, watch]);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const node = ref.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  return { ref, canScrollPrev, canScrollNext, scrollByPage };
}
