import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Emphasize `.link-emphasize` elements while near screen center. Re-runs on navigation. */
export function useLinkEmphasis() {
  const { pathname } = useLocation();

  useEffect(() => {
    const emphasize = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("show", entry.isIntersecting);
        }
      },
      { rootMargin: "-20% 0px -30% 0px", threshold: 0.8 },
    );

    const raf = requestAnimationFrame(() => {
      document.querySelectorAll(".link-emphasize").forEach((el) => emphasize.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      emphasize.disconnect();
    };
  }, [pathname]);
}
