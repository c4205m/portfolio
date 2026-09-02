import type { Localized } from "../../types/content";
import { TextInput } from "./TextInput";

interface LocalizedInputProps {
  label: string;
  value: Partial<Localized> | undefined;
  onChange: (v: Localized) => void;
  multiline?: boolean;
}

export function LocalizedInput({ label, value, onChange, multiline }: LocalizedInputProps) {
  const current: Localized = { en: value?.en ?? "", tr: value?.tr ?? "" };
  return (
    <>
      <TextInput label={`${label} (EN)`} value={current.en} multiline={multiline} onChange={(en) => onChange({ ...current, en })} />
      <TextInput label={`${label} (TR)`} value={current.tr} multiline={multiline} onChange={(tr) => onChange({ ...current, tr })} />
    </>
  );
}
