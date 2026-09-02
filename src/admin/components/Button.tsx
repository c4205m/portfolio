import type { ReactNode } from "react";

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

interface SaveButtonProps {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
}

export function SaveButton({ dirty, saving, onSave }: SaveButtonProps) {
  return (
    <Button variant="primary" onClick={onSave} disabled={saving || !dirty}>
      {saving ? "Saving…" : dirty ? "Save" : "Saved"}
    </Button>
  );
}
