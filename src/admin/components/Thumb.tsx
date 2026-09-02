import { useRef } from "react";
import { asset } from "../../asset";
import { Icon } from "./Icon";

const VIDEO = /\.(webm|mp4)$/i;

export function isVideo(path: string): boolean {
  return VIDEO.test(path);
}

export function Thumb({ path, controls }: { path: string; controls?: boolean }) {
  const src = asset(path);
  const video = useRef<HTMLVideoElement>(null);

  if (!isVideo(path)) return <img src={src} alt="" loading="lazy" />;

  if (controls) return <video src={src} controls muted loop playsInline preload="metadata" />;

  return (
    <span className="wp-video-thumb">
      <video
        ref={video}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={() => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          video.current?.play().catch(() => undefined);
        }}
        onMouseLeave={() => {
          const node = video.current;
          if (!node) return;
          node.pause();
          node.currentTime = 0;
        }}
      />
      <Icon.video size={16} />
    </span>
  );
}
