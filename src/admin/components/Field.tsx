import type { ReactNode } from "react";

export interface FieldProps {
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

export function FieldGroup({ label, hint, children }: FieldProps) {
  return (
    <div className="wp-field" role="group" aria-label={label}>
      <span className="wp-field-label">{label}</span>
      {children}
      {hint && <span className="wp-field-hint">{hint}</span>}
    </div>
  );
}
