import { LazyVideo } from "./LazyVideo";
import { asset } from "../asset";
import { useTheme } from "../context/ThemeContext";
import type { GalleryItem as Item, Lang } from "../types/content";

interface GalleryItemProps {
  item: Item;
  lang: Lang;
  load: boolean;
}

function Image({
  src,
  dark,
  invert,
  alt,
}: {
  src: string;
  dark?: string;
  invert?: boolean;
  alt?: string;
}) {
  const { theme } = useTheme();
  const invertAttr = invert ? { "data-invert": "" } : {};

  if (dark) {
    if (theme === "dark")
      return <img src={asset(dark)} alt={alt ?? ""} loading="lazy" {...invertAttr} />;
    if (theme === "light")
      return <img src={asset(src)} alt={alt ?? ""} loading="lazy" {...invertAttr} />;
    return (
      <picture>
        <source srcSet={asset(dark)} media="(prefers-color-scheme: dark)" />
        <img src={asset(src)} alt={alt ?? ""} loading="lazy" {...invertAttr} />
      </picture>
    );
  }
  return <img src={asset(src)} alt={alt ?? ""} loading="lazy" {...invertAttr} />;
}

export function GalleryItem({ item, lang, load }: GalleryItemProps) {
  if (item.type === "webm") {
    const video = <LazyVideo src={item.src} attrs={item.attrs} load={load} />;
    if (item.href) {
      return (
        <a href={item.href} className="gallery-link" target="_blank" rel="noopener">
          {video}
        </a>
      );
    }
    return video;
  }

  if (item.type === "webp") {
    const img = <Image src={item.src} dark={item.dark} invert={item.invert} alt={item.alt} />;
    if (item.href) {
      return (
        <a href={item.href} className="gallery-link" target="_blank" rel="noopener">
          {img}
        </a>
      );
    }
    return img;
  }

  if (item.type === "text") {
    const title = item.title?.[lang];
    return (
      <div className="gallery-text">
        {title && (
          <span className="gallery-title" dangerouslySetInnerHTML={{ __html: title }} />
        )}
        <span
          className={title ? undefined : "center"}
          dangerouslySetInnerHTML={{ __html: item.content[lang] }}
        />
      </div>
    );
  }

  // embed
  return (
    <div className="gallery-embed" dangerouslySetInnerHTML={{ __html: item.embed }} />
  );
}
