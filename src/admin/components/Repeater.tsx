import type { ReactNode } from "react";
import { useDragList } from "../hooks/useDragList";
import { move, removeAt, replaceAt } from "../utils/array";
import { Button, IconButton } from "./Button";
import { Icon } from "./Icon";

interface RepeaterProps<T> {
  title: string;
  items: T[];
  blank: T;
  heading: (item: T) => string;
  children: (item: T, update: (next: T) => void) => ReactNode;
  onChange: (items: T[]) => void;
}

export function Repeater<T>({ title, items, blank, heading, children, onChange }: RepeaterProps<T>) {
  const { bind, over } = useDragList((from, to) => onChange(move(items, from, to)));

  return (
    <section className="wp-section">
      <header className="wp-section-head">
        <h2>{title}</h2>
        <Button onClick={() => onChange([...items, structuredClone(blank)])}>
          <Icon.plus size={15} /> Add
        </Button>
      </header>
      <div className="wp-cards">
        {items.map((item, index) => (
          <article key={index} className={over === index ? "wp-card drop" : "wp-card"} {...bind(index)}>
            <header className="wp-card-head">
              <span className="wp-grip" title="Drag to reorder">
                <Icon.drag size={16} />
              </span>
              <h3>{heading(item) || "(untitled)"}</h3>
              <IconButton label="Delete entry" danger icon={<Icon.trash size={15} />} onClick={() => onChange(removeAt(items, index))} />
            </header>
            {children(item, (next) => onChange(replaceAt(items, index, next)))}
          </article>
        ))}
      </div>
    </section>
  );
}
