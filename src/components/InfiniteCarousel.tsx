import { Fragment, useEffect, useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface InfiniteCarouselProps {
  direction: "left" | "right";
  speed: number;
  /** Rendered gallery items; duplicated internally for a seamless loop. */
  items: ReactNode[];
}

const DEFAULT_SPEED = 90;

/** Continuously scrolling marquee track, ported from the original rAF loop. */
export function InfiniteCarousel({ direction, speed, items }: InfiniteCarouselProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const inner = innerRef.current;
    const container = sectionRef.current;
    if (!inner || !container) return;

    const SPEED = speed || DEFAULT_SPEED;
    const isLeft = direction === "left";

    let halfWidth = 0;
    let position = 0;
    let paused = false;
    let hidden = document.hidden;
    let lastTime: number | null = null;
    let raf = 0;

    // Items are rendered twice, so half the scroll width is one full set.
    const measure = () => {
      halfWidth = inner.scrollWidth / 2;
    };

    const tick = (ts: number) => {
      if (lastTime === null) lastTime = ts;
      const delta = ts - lastTime;
      lastTime = ts;

      if (!paused && !hidden && halfWidth > 0) {
        const step = (SPEED * delta) / 1000;
        if (isLeft) {
          position -= step;
          if (position <= -halfWidth) position += halfWidth;
        } else {
          position += step;
          if (position >= 0) position -= halfWidth;
        }
        inner.style.transform = `translateX(${position}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
      lastTime = null;
    };
    const onVisibility = () => {
      hidden = document.hidden;
      if (!hidden) lastTime = null;
    };

    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      container.addEventListener("mouseenter", pause, { passive: true });
      container.addEventListener("mouseleave", resume, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    measure();

    if (reduced) {
      inner.style.transform = `translateX(${-halfWidth / 2}px)`;
    } else {
      if (!isLeft) position = -halfWidth;
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (canHover) {
        container.removeEventListener("mouseenter", pause);
        container.removeEventListener("mouseleave", resume);
      }
    };
  }, [direction, speed, reduced, items.length]);

  return (
    <div ref={sectionRef} style={{ overflow: "hidden" }}>
      <div className="gallery-items" ref={innerRef}>
        {items}
        {items.map((node, i) => (
          <Fragment key={`clone-${i}`}>{node}</Fragment>
        ))}
      </div>
    </div>
  );
}
