import { useEffect, useId, type CSSProperties } from "react";
import { GalleryItem } from "./GalleryItem";
import { InfiniteCarousel } from "./InfiniteCarousel";
import { useInView } from "../hooks/useInView";
import { useModal } from "../context/ModalContext";
import type { Gallery as GalleryData, Lang } from "../types/content";

interface GalleryProps {
  gallery: GalleryData;
  lang: Lang;
}

export function Gallery({ gallery, lang }: GalleryProps) {
  const { type, attr, items } = gallery;
  const key = useId();
  const { activeKey, open, close } = useModal();
  const { ref, inView } = useInView<HTMLElement>({
    once: true,
    rootMargin: "200px 0px 200px 0px",
  });

  const tokens = type.split(/\s+/);
  const isCarousel = tokens.includes("infinite-carousel");
  const direction = tokens.includes("slide-right") ? "right" : "left";
  const ratio = attr.ratio ?? "";
  const isModalSection = activeKey === key;

  // Restore scroll on close handled by caller; close on Escape for accessibility.
  useEffect(() => {
    if (!isModalSection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isModalSection, close]);

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!attr.igmodal || window.innerWidth >= 640 || activeKey) return;
    open(key);
    const el = e.currentTarget;
    requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  const itemNodes = items.map((item, i) => {
    const classes = ["gallery-item", ratio];
    if (item.type === "webm" && item.class) classes.push(...item.class);
    return (
      <div
        key={i}
        className={classes.filter(Boolean).join(" ")}
        onClick={attr.igmodal ? handleItemClick : undefined}
      >
        <GalleryItem item={item} lang={lang} load={inView} />
      </div>
    );
  });

  const sectionClass = [
    "gallery-section",
    `gallery-${type}`,
    isModalSection ? "modal-active-section" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = {
    // CSS custom property for flex item sizing.
    ["--item-size" as string]: attr.size ?? "0 0 200px",
  };

  return (
    <section
      ref={ref}
      className={sectionClass}
      style={style}
      data-speed={attr.speed ?? undefined}
    >
      {isCarousel ? (
        <InfiniteCarousel direction={direction} speed={attr.speed ?? 0} items={itemNodes} />
      ) : (
        <div className={`gallery-items${isModalSection ? " modal-mode" : ""}`}>{itemNodes}</div>
      )}
    </section>
  );
}
