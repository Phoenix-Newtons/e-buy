import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Reports whether a `position: sticky` element is currently pinned at `top` px from the
 * viewport top. A passive scroll listener is used because IntersectionObserver cannot
 * observe an element's own sticky transition reliably.
 */
export function useIsStuck<T extends HTMLElement>(top: number): { ref: RefObject<T | null>; isStuck: boolean } {
  const ref = useRef<T | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const check = (): void => {
      const node = ref.current;
      if (!node) return;
      const stuck = node.getBoundingClientRect().top <= top + 0.5 && window.scrollY > 0;
      setIsStuck((previous) => (previous === stuck ? previous : stuck));
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [top]);

  return { ref, isStuck };
}
