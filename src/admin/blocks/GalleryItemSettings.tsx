import type { GalleryItem } from "../../types/content";
import { Checkbox, LocalizedInput, MediaInput, PillSelect, TextInput, TokenInput } from "../components";
import { replaceAt } from "../utils";
import { VIDEO_ATTRS } from "./constants";
import type { BlockItemSettingsProps, SectionOfKind } from "./types";

type GallerySection = SectionOfKind<"gallery">;

export function blankGalleryItem(type: GalleryItem["type"]): GalleryItem {
  if (type === "text") return { type: "text", content: { en: "", tr: "" } };
  if (type === "embed") return { type: "embed", embed: "" };
  if (type === "webp") return { type: "webp", src: "" };
  return { type: "webm", src: "", attrs: ["autoplay", "muted", "playsinline", "loop"] };
}

export function GalleryItemSettings({ section, itemIndex, folder, onChange }: BlockItemSettingsProps<GallerySection>) {
  const items = section.gallery.items;
  const item = items[itemIndex];
  if (!item) return null;
  const update = (next: GalleryItem) => onChange({ ...section, gallery: { ...section.gallery, items: replaceAt(items, itemIndex, next) } });

  if (item.type === "webm") {
    return (
      <>
        <MediaInput label="Video" value={item.src} folder={folder} onChange={(src) => update({ ...item, src })} />
        <TextInput label="Link" value={item.href} onChange={(href) => update({ ...item, href: href || undefined })} />
        <PillSelect label="Video attributes" value={item.attrs ?? []} options={VIDEO_ATTRS} onChange={(attrs) => update({ ...item, attrs: attrs.length ? attrs : undefined })} />
        <TokenInput label="CSS classes" value={item.class ?? []} suggestions={["link-emphasize"]} onChange={(cls) => update({ ...item, class: cls.length ? cls : undefined })} />
      </>
    );
  }

  if (item.type === "webp") {
    return (
      <>
        <MediaInput label="Image" value={item.src} folder={folder} onChange={(src) => update({ ...item, src })} />
        <MediaInput label="Dark variant" value={item.dark} folder={folder} onChange={(dark) => update({ ...item, dark: dark || undefined })} />
        <TextInput label="Alt text" value={item.alt} onChange={(alt) => update({ ...item, alt: alt || undefined })} />
        <TextInput label="Link" value={item.href} onChange={(href) => update({ ...item, href: href || undefined })} />
        <Checkbox label="Invert in dark mode" checked={item.invert} onChange={(invert) => update({ ...item, invert })} />
      </>
    );
  }

  if (item.type === "text") {
    return (
      <>
        <LocalizedInput label="Title" value={item.title} onChange={(title) => update({ ...item, title: title.en || title.tr ? title : undefined })} />
        <LocalizedInput label="Content" value={item.content} multiline onChange={(content) => update({ ...item, content })} />
      </>
    );
  }

  return <TextInput label="Embed markup" value={item.embed} multiline onChange={(embed) => update({ ...item, embed })} />;
}
