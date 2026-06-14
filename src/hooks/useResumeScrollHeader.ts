import { useEffect, type RefObject } from "react";

/**
 * On the resume page, hide the site header and shrink the resume header once
 * the user scrolls past it. Mirrors the original rAF-throttled scroll handler.
 */
export function useResumeScrollHeader(resumeHeaderRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const resumeHeader = resumeHeaderRef.current;
    const siteHeader = document.querySelector("header");
    if (!resumeHeader || !siteHeader) return;

    const threshold = resumeHeader.offsetTop;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const triggered = window.scrollY > threshold;
        siteHeader.classList.toggle("header-hidden", triggered);
        document.documentElement.classList.toggle("resume-scrolled", triggered);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      siteHeader.classList.remove("header-hidden");
      document.documentElement.classList.remove("resume-scrolled");
    };
  }, [resumeHeaderRef]);
}
