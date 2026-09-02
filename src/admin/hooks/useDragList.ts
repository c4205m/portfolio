import { useCallback, useRef, useState } from "react";

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
