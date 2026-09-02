import { useState } from "react";
import type { Lang } from "../types/content";
import { AdminNav } from "./components/AdminNav";
import { useAdminData } from "./hooks";
import { ExternalScreen, MediaLibraryScreen, ProjectEditorScreen, ProjectsScreen, ResumeScreen } from "./screens";
import type { Screen } from "./types";
import "./admin.css";

export function AdminApp() {
  const data = useAdminData();
  const [screen, setScreen] = useState<Screen>("projects");
  const [editing, setEditing] = useState<number | null>(null);
  const [lang, setLang] = useState<Lang>("en");

  if (data.loadError) {
    return (
      <div className="wp-root">
        <p className="wp-error wp-pad" role="alert">
          Could not reach the admin API: {data.loadError}
        </p>
      </div>
    );
  }

  function go(next: Screen) {
    setEditing(null);
    setScreen(next);
  }

  function confirmDelete(index: number) {
    const project = data.projects[index];
    if (!confirm(`Delete "${project.title || project.slug}"?\n\nThis removes src/data/projects/${project.slug}.ts.`)) return;
    data.deleteProjectAt(index);
  }

  const current = editing !== null ? data.projects[editing] : undefined;

  return (
    <div className="wp-root">
      <AdminNav
        screen={screen}
        dirty={{ projects: data.dirtyProjects.size > 0, external: data.externalDirty, resume: data.resumeDirty }}
        onNavigate={go}
      />

      <div className="wp-content">
        {data.notice && (
          <p className="wp-notice" role="status" aria-live="polite">
            {data.notice}
          </p>
        )}

        {screen === "projects" &&
          (editing !== null && current ? (
            <ProjectEditorScreen
              project={current}
              lang={lang}
              dirty={data.dirtyProjects.has(editing)}
              saving={data.saving}
              tagSuggestions={data.tagSuggestions}
              onLang={setLang}
              onChange={(next) => data.updateProject(editing, next)}
              onSave={() => data.persistProject(editing)}
              onBack={() => setEditing(null)}
            />
          ) : (
            <ProjectsScreen
              projects={data.projects}
              dirty={data.dirtyProjects}
              onOpen={setEditing}
              onCreate={() => setEditing(data.createProject())}
              onDuplicate={(index) => setEditing(data.createProject(data.projects[index]))}
              onDelete={confirmDelete}
              onReorder={data.reorderProjects}
            />
          ))}

        {screen === "external" && (
          <ExternalScreen
            projects={data.external}
            tagSuggestions={data.tagSuggestions}
            dirty={data.externalDirty}
            saving={data.saving}
            onChange={data.setExternal}
            onSave={data.persistExternal}
          />
        )}

        {screen === "media" && <MediaLibraryScreen />}

        {screen === "resume" && data.resume && (
          <ResumeScreen
            resume={data.resume}
            dirty={data.resumeDirty}
            saving={data.saving}
            onChange={data.setResume}
            onSave={data.persistResume}
          />
        )}
      </div>
    </div>
  );
}
