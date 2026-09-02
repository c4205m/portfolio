import { useState } from "react";
import { BLOCKS, BLOCK_KINDS } from "../blocks";
import type { SectionKind } from "../blocks";
import { Icon } from "../components";

export function Inserter({ onInsert }: { onInsert: (kind: SectionKind) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? "wp-inserter open" : "wp-inserter"}>
      <button type="button" className="wp-inserter-btn" aria-label="Add block" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon.plus size={16} />
      </button>
      {open && (
        <div className="wp-inserter-menu" role="menu">
          {BLOCK_KINDS.map((kind) => {
            const { icon: KindIcon, label } = BLOCKS[kind];
            return (
              <button
                key={kind}
                type="button"
                role="menuitem"
                onClick={() => {
                  onInsert(kind);
                  setOpen(false);
                }}
              >
                <KindIcon size={16} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
