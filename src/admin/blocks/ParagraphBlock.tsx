import { AutoTextarea, Icon, LocalizedInput, Select } from "../components";
import { ALIGNMENTS } from "./constants";
import type { BlockCanvasProps, BlockDefinition, BlockSettingsProps, SectionOfKind } from "./types";

type ParagraphSection = SectionOfKind<"paragraph">;

function Canvas({ section, lang, onChange }: BlockCanvasProps<ParagraphSection>) {
  return (
    <AutoTextarea
      className={`wp-block-paragraph align-${section.className ?? "center"}`}
      value={section.text[lang]}
      placeholder="Write a paragraph…"
      onChange={(value) => onChange({ ...section, text: { ...section.text, [lang]: value } })}
    />
  );
}

function Settings({ section, onChange }: BlockSettingsProps<ParagraphSection>) {
  return (
    <>
      <LocalizedInput label="Text" value={section.text} multiline onChange={(text) => onChange({ ...section, text })} />
      <Select
        label="Alignment"
        value={(section.className ?? "center") as (typeof ALIGNMENTS)[number]}
        options={ALIGNMENTS}
        onChange={(className) => onChange({ ...section, className })}
      />
    </>
  );
}

export const paragraphBlock: BlockDefinition<ParagraphSection> = {
  label: "paragraph",
  icon: Icon.paragraph,
  blank: () => ({ kind: "paragraph", text: { en: "", tr: "" }, className: "center" }),
  Canvas,
  Settings,
};
