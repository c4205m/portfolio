import { useEffect, useRef } from "react";
import { asset } from "../asset";

interface LazyVideoProps {
  src: string;
  /** Raw HTML attribute tokens from the data, e.g. ["autoplay","muted","loop"]. */
  attrs?: string[];
  className?: string;
  /** When true, the <source> is attached and the video starts loading. */
  load: boolean;
}

/** Mirrors the original section-level lazy video loader: no network until in view. */
export function LazyVideo({ src, attrs = [], className, load }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const has = (a: string) => attrs.includes(a);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // `muted` must be set as a property for autoplay to work in most browsers.
    if (has("muted")) video.muted = true;
    if (load) video.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  return (
    <video
      ref={ref}
      className={className}
      preload="none"
      autoPlay={has("autoplay")}
      loop={has("loop")}
      muted={has("muted")}
      playsInline={has("playsinline")}
      controls={has("controls")}
    >
      {load && <source src={asset(src)} type="video/webm" />}
    </video>
  );
}
