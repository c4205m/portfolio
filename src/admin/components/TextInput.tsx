import { Field } from "./Field";

interface TextInputProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  list?: string;
}

export function TextInput({ label, value, onChange, hint, placeholder, multiline, list }: TextInputProps) {
  return (
    <Field label={label} hint={hint}>
      {multiline ? (
        <textarea className="wp-input" rows={4} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="wp-input" type="text" value={value ?? ""} placeholder={placeholder} list={list} onChange={(e) => onChange(e.target.value)} />
      )}
    </Field>
  );
}

export function NumberInput({ label, value, onChange }: { label: string; value: number | undefined; onChange: (v: number | undefined) => void }) {
  return (
    <Field label={label}>
      <input
        className="wp-input"
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    </Field>
  );
}
