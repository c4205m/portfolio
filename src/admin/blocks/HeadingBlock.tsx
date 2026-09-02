import type { Localized } from "../../types/content";
import { Checkbox, Icon, LocalizedInput, Select, TextInput } from "../components";
import { localizedText, withLang } from "../utils";
import { ALIGNMENTS } from "./constants";
import type { BlockCanvasProps, BlockDefinition, BlockSettingsProps, SectionOfKind } from "./types";

type HeadingSection = SectionOfKind<"heading">;

function Canvas({ section, lang, onChange }: BlockCanvasProps<HeadingSection>) {
  return (
    <input
      className={`wp-block-heading align-${section.className ?? "center"}`}
      value={localizedText(section.text, lang)}
      placeholder="Heading"
      aria-label="Heading text"
      onChange={(e) => onChange({ ...section, text: withLang(section.text, lang, e.target.value) })}
    />
  );
}

function Settings({ section, onChange }: BlockSettingsProps<HeadingSection>) {
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
      <Select
        label="Alignment"
        value={(section.className ?? "center") as (typeof ALIGNMENTS)[number]}
        options={ALIGNMENTS}
        onChange={(className) => onChange({ ...section, className })}
      />
    </>
  );
}

export const headingBlock: BlockDefinition<HeadingSection> = {
  label: "heading",
  icon: Icon.heading,
  blank: () => ({ kind: "heading", text: { en: "", tr: "" }, className: "center" }),
  Canvas,
  Settings,
};
