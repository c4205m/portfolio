import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";

type IconProps = { size?: number };

function Svg({ size = 18, children }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const Icon = {
  projects: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  ),
  link: (p: IconProps) => (
    <Svg {...p}>
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.4 4.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.4-1.4" />
    </Svg>
  ),
  media: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4 17 5-4 4 3 3-2 4 3" />
    </Svg>
  ),
  resume: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </Svg>
  ),
  plus: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  trash: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M9 7V4h6v3" />
    </Svg>
  ),
  copy: (p: IconProps) => (
    <Svg {...p}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </Svg>
  ),
  drag: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="9" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="18" r="1" />
    </Svg>
  ),
  up: (p: IconProps) => (
    <Svg {...p}>
      <path d="m6 15 6-6 6 6" />
    </Svg>
  ),
  down: (p: IconProps) => (
    <Svg {...p}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  ),
  back: (p: IconProps) => (
    <Svg {...p}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </Svg>
  ),
  close: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  ),
  heading: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 4v16M18 4v16M6 12h12" />
    </Svg>
  ),
  paragraph: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 6h14M5 11h14M5 16h9" />
    </Svg>
  ),
  gallery: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 15l4-3 4 3 3-4 7 5" />
    </Svg>
  ),
  video: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 11 6-3v8l-6-3z" />
    </Svg>
  ),
  text: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 6h14M12 6v12M9 18h6" />
    </Svg>
  ),
  embed: (p: IconProps) => (
    <Svg {...p}>
      <path d="m9 8-5 4 5 4M15 8l5 4-5 4" />
    </Svg>
  ),
  upload: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </Svg>
  ),
};

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  title?: string;
}

export function Button({ children, onClick, variant = "secondary", disabled, title }: ButtonProps) {
  return (
    <button type="button" className={`wp-btn wp-btn-${variant}`} onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  );
}

interface IconButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export function IconButton({ label, icon, onClick, disabled, danger }: IconButtonProps) {
  return (
    <button
      type="button"
      className={danger ? "wp-icon-btn wp-icon-btn-danger" : "wp-icon-btn"}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

export function Panel({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="wp-panel">
      <button type="button" className="wp-panel-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        {open ? <Icon.up size={16} /> : <Icon.down size={16} />}
      </button>
      {open && <div className="wp-panel-body">{children}</div>}
    </section>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="wp-field">
      <span className="wp-field-label">{label}</span>
      {children}
      {hint && <span className="wp-field-hint">{hint}</span>}
    </label>
  );
}

function FieldGroup({ label, hint, children }: FieldProps) {
  return (
    <div className="wp-field" role="group" aria-label={label}>
      <span className="wp-field-label">{label}</span>
      {children}
      {hint && <span className="wp-field-hint">{hint}</span>}
    </div>
  );
}

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

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean | undefined; onChange: (v: boolean | undefined) => void }) {
  return (
    <label className="wp-checkbox">
      <input type="checkbox" checked={checked ?? false} onChange={(e) => onChange(e.target.checked || undefined)} />
      <span>{label}</span>
    </label>
  );
}

export function Select<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <Field label={label}>
      <select className="wp-input" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function PillSelect({ label, value, options, onChange, hint }: { label: string; value: string[]; options: readonly string[]; onChange: (v: string[]) => void; hint?: string }) {
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

export function TokenInput({ label, value, onChange, suggestions, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; suggestions?: string[]; hint?: string }) {
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

export function Empty({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="wp-empty">
      <p className="wp-empty-title">{title}</p>
      {hint && <p className="wp-empty-hint">{hint}</p>}
      {action}
    </div>
  );
}

export function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function replaceAt<T>(items: T[], index: number, item: T): T[] {
  return items.map((existing, i) => (i === index ? item : existing));
}

export function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, i) => i !== index);
}

export interface DragBinding {
  draggable: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export function useDragList(onReorder: (from: number, to: number) => void) {
  const source = useRef<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const bind = useCallback(
    (index: number): DragBinding => ({
      draggable: true,
      onDragStart: (e) => {
        source.current = index;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
      },
      onDragOver: (e) => {
        if (source.current === null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setOver(index);
      },
      onDrop: (e) => {
        e.preventDefault();
        const from = source.current;
        source.current = null;
        setOver(null);
        if (from !== null && from !== index) onReorder(from, index);
      },
      onDragEnd: () => {
        source.current = null;
        setOver(null);
      },
    }),
    [onReorder],
  );

  return { bind, over };
}
