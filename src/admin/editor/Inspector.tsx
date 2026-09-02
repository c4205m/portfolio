import type { Lang, Project, ProjectSection } from "../../types/content";
import { blockFor } from "../blocks";
import { Empty, LocalizedInput, Panel, TextInput, TokenInput } from "../components";
import type { InspectorTab, Selection } from "../types";
import { replaceAt } from "../utils";

interface InspectorProps {
  project: Project;
  selection: Selection;
  tab: InspectorTab;
  tagSuggestions: string[];
  lang: Lang;
  onTab: (tab: InspectorTab) => void;
  onChange: (project: Project) => void;
}

function ProjectPanels({ project, tagSuggestions, onChange }: Pick<InspectorProps, "project" | "tagSuggestions" | "onChange">) {
  return (
    <>
      <Panel title="Summary">
        <TextInput label="Slug" hint="URL segment and media folder name." value={project.slug} onChange={(slug) => onChange({ ...project, slug })} />
        <TokenInput label="Tags" value={project.tags} suggestions={tagSuggestions} onChange={(tags) => onChange({ ...project, tags })} />
      </Panel>
      <Panel title="Index card blurb">
        <LocalizedInput label="Blurb" value={project.blurb} multiline onChange={(blurb) => onChange({ ...project, blurb })} />
      </Panel>
    </>
  );
}

interface BlockPanelsProps {
  section: ProjectSection;
  itemIndex: number | undefined;
  folder: string;
  lang: Lang;
  onChange: (section: ProjectSection) => void;
}

function BlockPanels({ section, itemIndex, folder, lang, onChange }: BlockPanelsProps) {
  const { label, Settings, items } = blockFor(section);

  return (
    <>
      <Panel title={`${label} settings`}>
        <Settings section={section} onChange={onChange} />
      </Panel>

      {items && itemIndex !== undefined && (
        <Panel title={items.title(section, itemIndex)}>
          <items.Settings section={section} itemIndex={itemIndex} folder={folder} onChange={onChange} />
        </Panel>
      )}

      {items && itemIndex === undefined && (
        <p className="wp-muted wp-pad">
          Editing in {lang.toUpperCase()}. {items.hint}
        </p>
      )}
    </>
  );
}

export function Inspector({ project, selection, tab, tagSuggestions, lang, onTab, onChange }: InspectorProps) {
  const section = selection ? project.sections[selection.section] : undefined;

  return (
    <aside className="wp-inspector">
      <div className="wp-inspector-tabs" role="tablist">
        {(["project", "block"] as const).map((id) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "active" : ""} onClick={() => onTab(id)}>
            {id === "project" ? "Project" : "Block"}
          </button>
        ))}
      </div>

      <div className="wp-inspector-body">
        {tab === "project" ? (
          <ProjectPanels project={project} tagSuggestions={tagSuggestions} onChange={onChange} />
        ) : !section ? (
          <Empty title="No block selected" hint="Click a block in the canvas to edit its settings." />
        ) : (
          <BlockPanels
            section={section}
            itemIndex={selection?.item}
            folder={project.slug}
            lang={lang}
            onChange={(next) => onChange({ ...project, sections: replaceAt(project.sections, selection!.section, next) })}
          />
        )}
      </div>
    </aside>
  );
}
