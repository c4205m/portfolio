import { useState } from "react";
import type { Lang, Project } from "../../types/content";
import { Icon, IconButton, SaveButton } from "../components";
import { BlockCanvas, Inspector } from "../editor";
import type { InspectorTab, Selection } from "../types";

const LANGS = ["en", "tr"] as const;

interface ProjectEditorScreenProps {
  project: Project;
  lang: Lang;
  dirty: boolean;
  saving: boolean;
  tagSuggestions: string[];
  onLang: (lang: Lang) => void;
  onChange: (project: Project) => void;
  onSave: () => void;
  onBack: () => void;
}

export function ProjectEditorScreen({ project, lang, dirty, saving, tagSuggestions, onLang, onChange, onSave, onBack }: ProjectEditorScreenProps) {
  const [selection, setSelection] = useState<Selection>(null);
  const [tab, setTab] = useState<InspectorTab>("project");

  function select(next: Selection) {
    setSelection(next);
    if (next) setTab("block");
  }

  return (
    <div className="wp-editor">
      <header className="wp-editor-bar">
        <IconButton label="Back to projects" icon={<Icon.back />} onClick={onBack} />
        <span className="wp-editor-title">
          {project.title || "(untitled)"}
          {dirty && <span className="wp-dot" title="Unsaved changes" />}
        </span>

        <div className="wp-lang-toggle" role="group" aria-label="Editing language">
          {LANGS.map((code) => (
            <button key={code} type="button" className={code === lang ? "active" : ""} aria-pressed={code === lang} onClick={() => onLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        <SaveButton dirty={dirty} saving={saving} onSave={onSave} />
      </header>

      <div className="wp-editor-body">
        <div className="wp-canvas-scroll">
          <BlockCanvas project={project} lang={lang} selection={selection} onSelect={select} onChange={onChange} />
        </div>
        <Inspector project={project} selection={selection} tab={tab} lang={lang} tagSuggestions={tagSuggestions} onTab={setTab} onChange={onChange} />
      </div>
    </div>
  );
}
