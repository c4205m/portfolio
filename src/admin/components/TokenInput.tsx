import { useState } from "react";
import { FieldGroup } from "./Field";
import { Icon } from "./Icon";

interface TokenInputProps {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  suggestions?: string[];
  hint?: string;
}

export function TokenInput({ label, value, onChange, suggestions, hint }: TokenInputProps) {
  const [draft, setDraft] = useState("");
  const listId = `tokens-${label.replace(/\W+/g, "-").toLowerCase()}`;
  const available = (suggestions ?? []).filter((s) => !value.includes(s));

  const add = (token: string) => {
    const clean = token.trim();
    if (clean && !value.includes(clean)) onChange([...value, clean]);
    setDraft("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <FieldGroup label={label} hint={hint}>
      {value.length > 0 && (
        <div className="wp-pills">
          {value.map((token) => (
            <span key={token} className="wp-pill wp-pill-on">
              {token}
              <button type="button" className="wp-pill-x" aria-label={`Remove ${token}`} onClick={() => onChange(value.filter((v) => v !== token))}>
                <Icon.close size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        className="wp-input"
        type="text"
        value={draft}
        placeholder="Add and press Enter"
        list={available.length ? listId : undefined}
        onChange={(e) => {
          const next = e.target.value;
          if (available.includes(next)) add(next);
          else setDraft(next);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
      />
      {available.length > 0 && (
        <>
          <div className="wp-pills">
            {available.map((s) => (
              <button key={s} type="button" className="wp-pill wp-pill-add" onClick={() => add(s)}>
                <Icon.plus size={11} />
                {s}
              </button>
            ))}
          </div>
          <datalist id={listId}>
            {available.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </>
      )}
    </FieldGroup>
  );
}
