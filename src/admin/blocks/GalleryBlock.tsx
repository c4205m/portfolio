import type { GalleryItem } from "../../types/content";
import { Checkbox, Icon, IconButton, NumberInput, PillSelect, Select, TextInput, Thumb } from "../components";
import { useDragList } from "../hooks";
import { move, removeAt } from "../utils";
import { GALLERY_ITEM_TYPES, GALLERY_TYPES, RATIOS } from "./constants";
import { GalleryItemSettings, blankGalleryItem } from "./GalleryItemSettings";
import type { BlockCanvasProps, BlockDefinition, BlockSettingsProps, SectionOfKind } from "./types";

type GallerySection = SectionOfKind<"gallery">;

function Canvas({ section, lang, index: sectionIndex, selection, onSelect, onChange }: BlockCanvasProps<GallerySection>) {
  const items = section.gallery.items;
  const setItems = (next: GalleryItem[]) => onChange({ ...section, gallery: { ...section.gallery, items: next } });
  const { bind, over } = useDragList((from, to) => setItems(move(items, from, to)));

  return (
    <div className="wp-gallery-preview" data-ratio={section.gallery.attr.ratio ?? "square"}>
      {items.map((item, index) => {
        const active = selection?.section === sectionIndex && selection.item === index;
        return (
          <div
            key={index}
            className={`wp-tile${active ? " selected" : ""}${over === index ? " drop" : ""}`}
            {...bind(index)}
            onClick={(e) => {
              e.stopPropagation();
              onSelect({ section: sectionIndex, item: index });
            }}
          >
            {(item.type === "webm" || item.type === "webp") && (item.src ? <Thumb path={item.src} /> : <span className="wp-tile-empty">No source</span>)}
            {item.type === "text" && (
              <span className="wp-tile-text">
                {item.title && <strong>{item.title[lang]}</strong>}
                {item.content[lang]}
              </span>
            )}
            {item.type === "embed" && (
              <span className="wp-tile-empty">
                <Icon.embed size={18} /> embed
              </span>
            )}
            <span className="wp-tile-badge">{item.type}</span>
            <span className="wp-tile-actions">
              <IconButton
                label="Remove item"
                danger
                icon={<Icon.trash size={14} />}
                onClick={() => {
                  setItems(removeAt(items, index));
                  onSelect({ section: sectionIndex });
                }}
              />
            </span>
          </div>
        );
      })}

      <div className="wp-tile-add">
        {GALLERY_ITEM_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setItems([...items, blankGalleryItem(type)]);
              onSelect({ section: sectionIndex, item: items.length });
            }}
          >
            <Icon.plus size={14} /> {type}
          </button>
        ))}
      </div>
    </div>
  );
}

function Settings({ section, onChange }: BlockSettingsProps<GallerySection>) {
  const { gallery } = section;
  const set = (next: Partial<typeof gallery>) => onChange({ ...section, gallery: { ...gallery, ...next } });
  const setAttr = (next: Partial<typeof gallery.attr>) => set({ attr: { ...gallery.attr, ...next } });

  return (
    <>
      <PillSelect
        label="Layout tokens"
        hint="Combine tokens, e.g. slider + infinite-carousel + slide-left."
        value={gallery.type ? gallery.type.split(/\s+/).filter(Boolean) : []}
        options={GALLERY_TYPES}
        onChange={(tokens) => set({ type: tokens.join(" ") })}
      />
      <Select label="Ratio" value={(gallery.attr.ratio ?? "square") as (typeof RATIOS)[number]} options={RATIOS} onChange={(ratio) => setAttr({ ratio })} />
      <TextInput label="Item size" hint="Flex shorthand, e.g. 0 0 150px" value={gallery.attr.size} placeholder="0 0 150px" onChange={(size) => setAttr({ size: size || undefined })} />
      <NumberInput label="Carousel speed" value={gallery.attr.speed} onChange={(speed) => setAttr({ speed })} />
      <Checkbox label="Open items in modal" checked={gallery.attr.igmodal} onChange={(igmodal) => setAttr({ igmodal })} />
    </>
  );
}

export const galleryBlock: BlockDefinition<GallerySection> = {
  label: "gallery",
  icon: Icon.gallery,
  blank: () => ({ kind: "gallery", gallery: { type: "ig", attr: { ratio: "square", igmodal: true }, items: [] } }),
  Canvas,
  Settings,
  items: {
    title: (section, itemIndex) => `Item ${itemIndex + 1} (${section.gallery.items[itemIndex]?.type ?? ""})`,
    hint: "Click a tile to edit that item.",
    Settings: GalleryItemSettings,
  },
};
