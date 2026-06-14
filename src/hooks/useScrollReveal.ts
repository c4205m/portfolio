import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Reproduces the original scroll-reveal behavior: fade in sections, headings
 * and `.scroll-fade` elements as they enter the viewport, and emphasize
 * `.link-emphasize` elements near the screen center. Re-runs on navigation.
 */
export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const action: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("show", entry.isIntersecting);
      }
    };

    const fadeIn = new IntersectionObserver(action, {
      rootMargin: "-40px 0px 0px 0px",
      threshold: 0,
    });
    const emphasize = new IntersectionObserver(action, {
      rootMargin: "-20% 0px -30% 0px",
      threshold: 0.8,
    });

    // Wait a frame so freshly-mounted route content is in the DOM.
    const raf = requestAnimationFrame(() => {
      document
        .querySelectorAll(".scroll-fade, section, h2")
        .forEach((el) => fadeIn.observe(el));
      document
        .querySelectorAll(".link-emphasize")
        .forEach((el) => emphasize.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      fadeIn.disconnect();
      emphasize.disconnect();
    };
  }, [pathname]);
}
