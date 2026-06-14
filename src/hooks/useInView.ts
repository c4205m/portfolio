import { useEffect, useRef, useState } from "react";

interface Options extends IntersectionObserverInit {
  /** Stay true after the first intersection (used for lazy loading). */
  once?: boolean;
}

/**
 * Observe an element's visibility. Returns a ref to attach and the current
 * in-view state. With `once`, the state latches to true on first intersection.
 */
export function useInView<T extends Element = HTMLElement>(
  { once = false, root = null, rootMargin, threshold }: Options = {},
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, root, rootMargin, threshold]);

  return { ref, inView };
}
