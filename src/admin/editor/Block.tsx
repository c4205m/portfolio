import type { Lang, ProjectSection } from "../../types/content";
import { blockFor } from "../blocks";
import { Icon, IconButton } from "../components";
import type { DragBinding } from "../hooks";
import type { Selection } from "../types";

interface BlockProps {
  section: ProjectSection;
  index: number;
  total: number;
  lang: Lang;
  selection: Selection;
  drag: DragBinding;
  dropping: boolean;
  onSelect: (selection: Selection) => void;
  onChange: (section: ProjectSection) => void;
  onMove: (to: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function Block({ section, index, total, lang, selection, drag, dropping, onSelect, onChange, onMove, onDuplicate, onDelete }: BlockProps) {
  const { icon: KindIcon, label, Canvas } = blockFor(section);
  const selected = selection?.section === index;

  return (
    <div
      className={`wp-block${selected ? " selected" : ""}${dropping ? " drop" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect({ section: index });
      }}
    >
      <div className="wp-block-toolbar">
        <span className="wp-block-kind">
          <KindIcon size={14} /> {label}
        </span>
        <span className="wp-block-grip" {...drag} title="Drag to reorder">
          <Icon.drag size={14} />
        </span>
        <IconButton label="Move up" icon={<Icon.up size={14} />} disabled={index === 0} onClick={() => onMove(index - 1)} />
        <IconButton label="Move down" icon={<Icon.down size={14} />} disabled={index === total - 1} onClick={() => onMove(index + 1)} />
        <IconButton label="Duplicate block" icon={<Icon.copy size={14} />} onClick={onDuplicate} />
        <IconButton label="Delete block" danger icon={<Icon.trash size={14} />} onClick={onDelete} />
      </div>

      <Canvas section={section} lang={lang} index={index} selection={selection} onSelect={onSelect} onChange={onChange} />
    </div>
  );
}
