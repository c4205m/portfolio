import { useLayoutEffect, useRef, useState } from "react";
import type { GalleryItem, Lang, Localized, Project, ProjectSection } from "../types/content";
import { Thumb } from "./MediaLibrary";
import { Icon, IconButton, move, removeAt, replaceAt, useDragList } from "./ui";

export type Selection = { section: number; item?: number } | null;

const SECTION_KINDS = ["heading", "paragraph", "gallery"] as const;

const KIND_ICON = {
  heading: Icon.heading,
  paragraph: Icon.paragraph,
  gallery: Icon.gallery,
};

export function blankSection(kind: (typeof SECTION_KINDS)[number]): ProjectSection {
  if (kind === "heading") return { kind: "heading", text: { en: "", tr: "" }, className: "center" };
  if (kind === "paragraph") return { kind: "paragraph", text: { en: "", tr: "" }, className: "center" };
  return { kind: "gallery", gallery: { type: "ig", attr: { ratio: "square", igmodal: true }, items: [] } };
}

export function blankItem(type: GalleryItem["type"]): GalleryItem {
  if (type === "text") return { type: "text", content: { en: "", tr: "" } };
  if (type === "embed") return { type: "embed", embed: "" };
  if (type === "webp") return { type: "webp", src: "" };
  return { type: "webm", src: "", attrs: ["autoplay", "muted", "playsinline", "loop"] };
}

export function localizedText(text: string | Localized, lang: Lang): string {
  return typeof text === "string" ? text : text[lang];
}

function withLang(text: string | Localized, lang: Lang, value: string): string | Localized {
  if (typeof text === "string") return value;
  return { ...text, [lang]: value };
}

function AutoTextarea({ value, onChange, className, placeholder }: { value: string; onChange: (v: string) => void; className: string; placeholder: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  }, [value]);
  return (
    <textarea ref={ref} className={className} rows={1} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}

function Inserter({ onInsert }: { onInsert: (kind: (typeof SECTION_KINDS)[number]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? "wp-inserter open" : "wp-inserter"}>
      <button type="button" className="wp-inserter-btn" aria-label="Add block" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon.plus size={16} />
      </button>
      {open && (
        <div className="wp-inserter-menu" role="menu">
          {SECTION_KINDS.map((kind) => {
            const KindIcon = KIND_ICON[kind];
            return (
              <button
                key={kind}
                type="button"
                role="menuitem"
                onClick={() => {
                  onInsert(kind);
                  setOpen(false);
                }}
              >
                <KindIcon size={16} />
                <span>{kind}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface GalleryPreviewProps {
  section: Extract<ProjectSection, { kind: "gallery" }>;
  lang: Lang;
  sectionIndex: number;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onChange: (section: ProjectSection) => void;
}

function GalleryPreview({ section, lang, sectionIndex, selection, onSelect, onChange }: GalleryPreviewProps) {
  const items = section.gallery.items;
  const setItems = (next: typeof items) => onChange({ ...section, gallery: { ...section.gallery, items: next } });
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
        {(["webm", "webp", "text", "embed"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setItems([...items, blankItem(type)]);
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

interface BlockCanvasProps {
  project: Project;
  lang: Lang;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onChange: (project: Project) => void;
}

export function BlockCanvas({ project, lang, selection, onSelect, onChange }: BlockCanvasProps) {
  const sections = project.sections;
  const setSections = (next: ProjectSection[]) => onChange({ ...project, sections: next });
  const { bind, over } = useDragList((from, to) => setSections(move(sections, from, to)));

  function insertAt(index: number, kind: (typeof SECTION_KINDS)[number]) {
    const next = [...sections];
    next.splice(index, 0, blankSection(kind));
    setSections(next);
    onSelect({ section: index });
  }

  return (
    <div className="wp-canvas" onClick={() => onSelect(null)}>
      <input
        className="wp-canvas-title"
        value={project.title}
        placeholder="Project title"
        aria-label="Project title"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange({ ...project, title: e.target.value })}
      />

      <Inserter onInsert={(kind) => insertAt(0, kind)} />

      {sections.map((section, index) => {
        const selected = selection?.section === index;
        const KindIcon = KIND_ICON[section.kind];
        return (
          <div key={index}>
            <div
              className={`wp-block${selected ? " selected" : ""}${over === index ? " drop" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect({ section: index });
              }}
            >
              <div className="wp-block-toolbar">
                <span className="wp-block-kind">
                  <KindIcon size={14} /> {section.kind}
                </span>
                <span className="wp-block-grip" {...bind(index)} title="Drag to reorder">
                  <Icon.drag size={14} />
                </span>
                <IconButton label="Move up" icon={<Icon.up size={14} />} disabled={index === 0} onClick={() => setSections(move(sections, index, index - 1))} />
                <IconButton label="Move down" icon={<Icon.down size={14} />} disabled={index === sections.length - 1} onClick={() => setSections(move(sections, index, index + 1))} />
                <IconButton
                  label="Duplicate block"
                  icon={<Icon.copy size={14} />}
                  onClick={() => {
                    const next = [...sections];
                    next.splice(index + 1, 0, structuredClone(section));
                    setSections(next);
                  }}
                />
                <IconButton
                  label="Delete block"
                  danger
                  icon={<Icon.trash size={14} />}
                  onClick={() => {
                    setSections(removeAt(sections, index));
                    onSelect(null);
                  }}
                />
              </div>

              {section.kind === "heading" && (
                <input
                  className={`wp-block-heading align-${section.className ?? "center"}`}
                  value={localizedText(section.text, lang)}
                  placeholder="Heading"
                  aria-label="Heading text"
                  onChange={(e) => setSections(replaceAt(sections, index, { ...section, text: withLang(section.text, lang, e.target.value) }))}
                />
              )}

              {section.kind === "paragraph" && (
                <AutoTextarea
                  className={`wp-block-paragraph align-${section.className ?? "center"}`}
                  value={section.text[lang]}
                  placeholder="Write a paragraph…"
                  onChange={(value) => setSections(replaceAt(sections, index, { ...section, text: { ...section.text, [lang]: value } }))}
                />
              )}

              {section.kind === "gallery" && (
                <GalleryPreview
                  section={section}
                  lang={lang}
                  sectionIndex={index}
                  selection={selection}
                  onSelect={onSelect}
                  onChange={(next) => setSections(replaceAt(sections, index, next))}
                />
              )}
            </div>
            <Inserter onInsert={(kind) => insertAt(index + 1, kind)} />
          </div>
        );
      })}

      {sections.length === 0 && <p className="wp-canvas-hint">Empty project. Use + to add a heading, paragraph, or gallery.</p>}
    </div>
  );
}
