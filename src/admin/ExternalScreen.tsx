import type { ExternalProject } from "../types/content";
import { LocalizedInput } from "./Inspector";
import { Button, Empty, Icon, IconButton, Panel, TextInput, TokenInput, move, removeAt, replaceAt, useDragList } from "./ui";

const BLANK: ExternalProject = {
  slug: "",
  title: "",
  blurb: { en: "", tr: "" },
  tags: [],
  url: "",
  label: { en: "View project", tr: "Projeyi Görüntüle" },
};

interface ExternalScreenProps {
  projects: ExternalProject[];
  tagSuggestions: string[];
  dirty: boolean;
  saving: boolean;
  onChange: (projects: ExternalProject[]) => void;
  onSave: () => void;
}

export function ExternalScreen({ projects, tagSuggestions, dirty, saving, onChange, onSave }: ExternalScreenProps) {
  const { bind, over } = useDragList((from, to) => onChange(move(projects, from, to)));

  return (
    <div className="wp-screen">
      <header className="wp-screen-head">
        <h1>External links</h1>
        <div className="wp-head-actions">
          <Button onClick={() => onChange([...projects, structuredClone(BLANK)])}>
            <Icon.plus size={15} /> Add link
          </Button>
          <Button variant="primary" onClick={onSave} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save" : "Saved"}
          </Button>
        </div>
      </header>

      {projects.length === 0 ? (
        <Empty title="No external links" hint="These appear on the projects index as outbound links." />
      ) : (
        <div className="wp-cards">
          {projects.map((project, index) => {
            const update = (next: ExternalProject) => onChange(replaceAt(projects, index, next));
            return (
              <article key={index} className={over === index ? "wp-card drop" : "wp-card"} {...bind(index)}>
                <header className="wp-card-head">
                  <span className="wp-grip" title="Drag to reorder">
                    <Icon.drag size={16} />
                  </span>
                  <h2>{project.title || project.slug || "(untitled)"}</h2>
                  <IconButton label={`Delete ${project.slug || "entry"}`} danger icon={<Icon.trash size={15} />} onClick={() => onChange(removeAt(projects, index))} />
                </header>

                <div className="wp-card-grid">
                  <TextInput label="Title" value={project.title} onChange={(title) => update({ ...project, title })} />
                  <TextInput label="Slug" value={project.slug} onChange={(slug) => update({ ...project, slug })} />
                  <TextInput label="URL" value={project.url} onChange={(url) => update({ ...project, url })} />
                  <TokenInput label="Tags" value={project.tags} suggestions={tagSuggestions} onChange={(tags) => update({ ...project, tags })} />
                </div>

                <Panel title="Copy" defaultOpen={false}>
                  <LocalizedInput label="Blurb" value={project.blurb} multiline onChange={(blurb) => update({ ...project, blurb })} />
                  <LocalizedInput label="Link label" value={project.label} onChange={(label) => update({ ...project, label })} />
                </Panel>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
