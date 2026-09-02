import type { Lang, Localized, Project, ProjectSection } from "../types/content";
import type { Selection } from "./BlockCanvas";
import { MediaInput } from "./MediaLibrary";
import { Checkbox, Empty, NumberInput, Panel, PillSelect, Select, TextInput, TokenInput, replaceAt } from "./ui";

const GALLERY_TYPES = ["slider", "ig", "infinite-carousel", "slide-left", "slide-right"];
const VIDEO_ATTRS = ["autoplay", "muted", "playsinline", "loop", "controls"];
const RATIOS = ["square", "vertical", "horizontal"] as const;
const ALIGNMENTS = ["center", "left", "right"] as const;

export function LocalizedInput({ label, value, onChange, multiline }: { label: string; value: Partial<Localized> | undefined; onChange: (v: Localized) => void; multiline?: boolean }) {
  const current: Localized = { en: value?.en ?? "", tr: value?.tr ?? "" };
  return (
    <>
      <TextInput label={`${label} (EN)`} value={current.en} multiline={multiline} onChange={(en) => onChange({ ...current, en })} />
      <TextInput label={`${label} (TR)`} value={current.tr} multiline={multiline} onChange={(tr) => onChange({ ...current, tr })} />
    </>
  );
}

function HeadingSettings({ section, onChange }: { section: Extract<ProjectSection, { kind: "heading" }>; onChange: (s: ProjectSection) => void }) {
  const shared = typeof section.text === "string";
  return (
    <>
      <Checkbox
        label="Same text in both languages"
        checked={shared}
        onChange={(checked) =>
          onChange({
            ...section,
            text: checked ? (section.text as Localized).en : { en: section.text as string, tr: section.text as string },
          })
        }
      />
      {shared ? (
        <TextInput label="Text" value={section.text as string} onChange={(text) => onChange({ ...section, text })} />
      ) : (
        <LocalizedInput label="Text" value={section.text as Localized} onChange={(text) => onChange({ ...section, text })} />
      )}
      <Select label="Alignment" value={(section.className ?? "center") as (typeof ALIGNMENTS)[number]} options={ALIGNMENTS} onChange={(className) => onChange({ ...section, className })} />
    </>
  );
}

function GallerySettings({ section, onChange }: { section: Extract<ProjectSection, { kind: "gallery" }>; onChange: (s: ProjectSection) => void }) {
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

function ItemSettings({ section, itemIndex, folder, onChange }: { section: Extract<ProjectSection, { kind: "gallery" }>; itemIndex: number; folder: string; onChange: (s: ProjectSection) => void }) {
  const items = section.gallery.items;
  const item = items[itemIndex];
  if (!item) return null;
  const update = (next: typeof item) => onChange({ ...section, gallery: { ...section.gallery, items: replaceAt(items, itemIndex, next) } });

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

interface InspectorProps {
  project: Project;
  selection: Selection;
  tab: "project" | "block";
  tagSuggestions: string[];
  lang: Lang;
  onTab: (tab: "project" | "block") => void;
  onChange: (project: Project) => void;
}

export function Inspector({ project, selection, tab, tagSuggestions, lang, onTab, onChange }: InspectorProps) {
  const section = selection ? project.sections[selection.section] : undefined;
  const setSection = (next: ProjectSection) => onChange({ ...project, sections: replaceAt(project.sections, selection!.section, next) });

  return (
    <aside className="wp-inspector">
      <div className="wp-inspector-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "project"} className={tab === "project" ? "active" : ""} onClick={() => onTab("project")}>
          Project
        </button>
        <button type="button" role="tab" aria-selected={tab === "block"} className={tab === "block" ? "active" : ""} onClick={() => onTab("block")}>
          Block
        </button>
      </div>

      <div className="wp-inspector-body">
        {tab === "project" ? (
          <>
            <Panel title="Summary">
              <TextInput label="Slug" hint="URL segment and media folder name." value={project.slug} onChange={(slug) => onChange({ ...project, slug })} />
              <TokenInput label="Tags" value={project.tags} suggestions={tagSuggestions} onChange={(tags) => onChange({ ...project, tags })} />
            </Panel>
            <Panel title="Index card blurb">
              <LocalizedInput label="Blurb" value={project.blurb} multiline onChange={(blurb) => onChange({ ...project, blurb })} />
            </Panel>
          </>
        ) : !section ? (
          <Empty title="No block selected" hint="Click a block in the canvas to edit its settings." />
        ) : (
          <>
            <Panel title={`${section.kind} settings`}>
              {section.kind === "heading" && <HeadingSettings section={section} onChange={setSection} />}
              {section.kind === "paragraph" && (
                <>
                  <LocalizedInput label="Text" value={section.text} multiline onChange={(text) => setSection({ ...section, text })} />
                  <Select label="Alignment" value={(section.className ?? "center") as (typeof ALIGNMENTS)[number]} options={ALIGNMENTS} onChange={(className) => setSection({ ...section, className })} />
                </>
              )}
              {section.kind === "gallery" && <GallerySettings section={section} onChange={setSection} />}
            </Panel>

            {section.kind === "gallery" && selection?.item !== undefined && (
              <Panel title={`Item ${selection.item + 1} (${section.gallery.items[selection.item]?.type ?? ""})`}>
                <ItemSettings section={section} itemIndex={selection.item} folder={project.slug} onChange={setSection} />
              </Panel>
            )}

            {section.kind === "gallery" && selection?.item === undefined && (
              <p className="wp-muted wp-pad">Editing in {lang.toUpperCase()}. Click a tile to edit that item.</p>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
