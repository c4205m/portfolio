import { FieldGroup } from "./Field";

interface PillSelectProps {
  label: string;
  value: string[];
  options: readonly string[];
  onChange: (v: string[]) => void;
  hint?: string;
}

export function PillSelect({ label, value, options, onChange, hint }: PillSelectProps) {
  const extras = value.filter((v) => !options.includes(v));
  const all = [...options, ...extras];

  const toggle = (option: string) => {
    const next = value.includes(option) ? value.filter((v) => v !== option) : [...value, option];
    onChange(all.filter((o) => next.includes(o)));
  };

  return (
    <FieldGroup label={label} hint={hint}>
      <div className="wp-pills">
        {all.map((option) => {
          const selected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={selected ? "wp-pill wp-pill-on" : "wp-pill"}
              aria-pressed={selected}
              onClick={() => toggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </FieldGroup>
  );
}
