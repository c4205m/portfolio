import type { ReactNode } from "react";

export function Empty({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="wp-empty">
      <p className="wp-empty-title">{title}</p>
      {hint && <p className="wp-empty-hint">{hint}</p>}
      {action}
    </div>
  );
}
