import { useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

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
