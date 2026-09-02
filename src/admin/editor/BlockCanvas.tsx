import type { Lang, Project, ProjectSection } from "../../types/content";
import { BLOCKS } from "../blocks";
import type { SectionKind } from "../blocks";
import { useDragList } from "../hooks";
import type { Selection } from "../types";
import { insertAt, move, removeAt, replaceAt } from "../utils";
import { Block } from "./Block";
import { Inserter } from "./Inserter";

interface BlockCanvasProps {
  project: Project;
  lang: Lang;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onChange: (project: Project) => void;
}

export function BlockCanvas({ project, lang, selection, onSelect, onChange }: BlockCanvasProps) {
  const sections = project.sections;
  const setSections = (next: ProjectSection[]) => onChange({ ...project, sections: next });
  const { bind, over } = useDragList((from, to) => setSections(move(sections, from, to)));

  function insertBlock(index: number, kind: SectionKind) {
    setSections(insertAt(sections, index, BLOCKS[kind].blank()));
    onSelect({ section: index });
  }

  return (
    <div className="wp-canvas" onClick={() => onSelect(null)}>
      <input
        className="wp-canvas-title"
        value={project.title}
        placeholder="Project title"
        aria-label="Project title"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange({ ...project, title: e.target.value })}
      />

      <Inserter onInsert={(kind) => insertBlock(0, kind)} />

      {sections.map((section, index) => (
        <div key={index}>
          <Block
            section={section}
            index={index}
            total={sections.length}
            lang={lang}
            selection={selection}
            drag={bind(index)}
            dropping={over === index}
            onSelect={onSelect}
            onChange={(next) => setSections(replaceAt(sections, index, next))}
            onMove={(to) => setSections(move(sections, index, to))}
            onDuplicate={() => setSections(insertAt(sections, index + 1, structuredClone(section)))}
            onDelete={() => {
              setSections(removeAt(sections, index));
              onSelect(null);
            }}
          />
          <Inserter onInsert={(kind) => insertBlock(index + 1, kind)} />
        </div>
      ))}

      {sections.length === 0 && <p className="wp-canvas-hint">Empty project. Use + to add a heading, paragraph, or gallery.</p>}
    </div>
  );
}
