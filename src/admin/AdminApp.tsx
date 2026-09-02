import { useCallback, useEffect, useMemo, useState } from "react";
import type { ExternalProject, Lang, Project } from "../types/content";
import type { Resume } from "../types/resume";
import { deleteProject, fetchData, saveExternal, saveOrder, saveProject, saveResume } from "./api";
import { ExternalScreen } from "./ExternalScreen";
import { MediaLibraryScreen } from "./MediaLibrary";
import { ProjectEditorScreen } from "./ProjectEditorScreen";
import { ProjectsScreen } from "./ProjectsScreen";
import { ResumeScreen } from "./ResumeScreen";
import { Icon, move } from "./ui";
import "./admin.css";

type Screen = "projects" | "external" | "media" | "resume";

const NAV: { id: Screen; label: string; icon: (p: { size?: number }) => JSX.Element }[] = [
  { id: "projects", label: "Projects", icon: Icon.projects },
  { id: "external", label: "External links", icon: Icon.link },
  { id: "media", label: "Media", icon: Icon.media },
  { id: "resume", label: "Resume", icon: Icon.resume },
];

const stamp = (value: unknown) => JSON.stringify(value);

function blankProject(): Project {
  return { slug: "new-project", title: "New project", tags: [], blurb: { en: "", tr: "" }, sections: [] };
}

function uniqueSlug(slug: string, taken: string[]): string {
  let candidate = slug;
  let n = 2;
  while (taken.includes(candidate)) candidate = `${slug}-${n++}`;
  return candidate;
}

export function AdminApp() {
  const [screen, setScreen] = useState<Screen>("projects");
  const [editing, setEditing] = useState<number | null>(null);
  const [lang, setLang] = useState<Lang>("en");

  const [projects, setProjects] = useState<Project[]>([]);
  const [external, setExternal] = useState<ExternalProject[]>([]);
  const [resume, setResume] = useState<Resume>();

  const [baseProjects, setBaseProjects] = useState<string[]>([]);
  const [baseSlugs, setBaseSlugs] = useState<string[]>([]);
  const [baseExternal, setBaseExternal] = useState("");
  const [baseResume, setBaseResume] = useState("");

  const [loadError, setLoadError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData()
      .then((data) => {
        setProjects(data.projects);
        setExternal(data.externalProjects);
        setResume(data.resume);
        setBaseProjects(data.projects.map(stamp));
        setBaseSlugs(data.projects.map((p) => p.slug));
        setBaseExternal(stamp(data.externalProjects));
        setBaseResume(stamp(data.resume));
      })
      .catch((e) => setLoadError(e.message));
  }, []);

  const dirtyProjects = useMemo(() => {
    const set = new Set<number>();
    projects.forEach((project, index) => {
      if (stamp(project) !== baseProjects[index]) set.add(index);
    });
    return set;
  }, [projects, baseProjects]);

  const externalDirty = resume !== undefined && stamp(external) !== baseExternal;
  const resumeDirty = resume !== undefined && stamp(resume) !== baseResume;
  const anyDirty = dirtyProjects.size > 0 || externalDirty || resumeDirty;

  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(undefined), 4000);
    return () => clearTimeout(id);
  }, [notice]);

  const tagSuggestions = useMemo(
    () => [...new Set([...projects, ...external].flatMap((p) => p.tags))].sort(),
    [projects, external],
  );

  const run = useCallback(async (label: string, action: () => Promise<void>) => {
    setSaving(true);
    try {
      await action();
      setNotice(`${label} saved`);
    } catch (e) {
      setNotice(`${label} failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSaving(false);
    }
  }, []);

  function persistProject(index: number) {
    const project = projects[index];
    const order = projects.map((p) => p.slug);
    const previous = baseSlugs[index];
    void run("Project", async () => {
      await saveProject(project.slug, project, order);
      if (previous && previous !== project.slug) await deleteProject(previous, order);
      setBaseProjects(projects.map(stamp));
      setBaseSlugs(order);
    });
  }

  function persistOrder(next: Project[]) {
    void run("Order", async () => {
      await saveOrder(next.map((p) => p.slug));
      setBaseSlugs(next.map((p) => p.slug));
    });
  }

  function reorderProjects(from: number, to: number) {
    const next = move(projects, from, to);
    setProjects(next);
    setBaseProjects(move(baseProjects, from, to));
    setBaseSlugs(move(baseSlugs, from, to));
    persistOrder(next);
  }

  function createProject(source?: Project) {
    const taken = projects.map((p) => p.slug);
    const base = source ? structuredClone(source) : blankProject();
    const project: Project = {
      ...base,
      slug: uniqueSlug(source ? `${source.slug}-copy` : base.slug, taken),
      title: source ? `${source.title} (copy)` : base.title,
    };
    setProjects([...projects, project]);
    setBaseProjects([...baseProjects, ""]);
    setBaseSlugs([...baseSlugs, ""]);
    setEditing(projects.length);
  }

  function removeProject(index: number) {
    const project = projects[index];
    const saved = baseSlugs[index];
    if (!confirm(`Delete "${project.title || project.slug}"?\n\nThis removes src/data/projects/${project.slug}.ts.`)) return;
    const next = projects.filter((_, i) => i !== index);
    setProjects(next);
    setBaseProjects(baseProjects.filter((_, i) => i !== index));
    setBaseSlugs(baseSlugs.filter((_, i) => i !== index));
    void run("Project deleted", async () => {
      if (saved) await deleteProject(saved, next.map((p) => p.slug));
      else await saveOrder(next.map((p) => p.slug));
    });
  }

  function go(next: Screen) {
    setEditing(null);
    setScreen(next);
  }

  if (loadError) {
    return (
      <div className="wp-root">
        <p className="wp-error wp-pad" role="alert">
          Could not reach the admin API: {loadError}
        </p>
      </div>
    );
  }

  const current = editing !== null ? projects[editing] : undefined;

  return (
    <div className="wp-root">
      <nav className="wp-menu" aria-label="Admin sections">
        <span className="wp-menu-brand">Portfolio CMS</span>
        {NAV.map(({ id, label, icon: NavIcon }) => (
          <button key={id} type="button" className={id === screen ? "active" : ""} aria-current={id === screen} onClick={() => go(id)}>
            <NavIcon size={17} />
            <span>{label}</span>
            {id === "projects" && dirtyProjects.size > 0 && <span className="wp-dot" />}
            {id === "external" && externalDirty && <span className="wp-dot" />}
            {id === "resume" && resumeDirty && <span className="wp-dot" />}
          </button>
        ))}
        <a className="wp-menu-link" href="/portfolio/en/projects" target="_blank" rel="noreferrer">
          View site
        </a>
      </nav>

      <div className="wp-content">
        {notice && (
          <p className="wp-notice" role="status" aria-live="polite">
            {notice}
          </p>
        )}

        {screen === "projects" &&
          (current ? (
            <ProjectEditorScreen
              project={current}
              lang={lang}
              dirty={dirtyProjects.has(editing!)}
              saving={saving}
              tagSuggestions={tagSuggestions}
              onLang={setLang}
              onChange={(next) => setProjects(projects.map((p, i) => (i === editing ? next : p)))}
              onSave={() => persistProject(editing!)}
              onBack={() => setEditing(null)}
            />
          ) : (
            <ProjectsScreen
              projects={projects}
              dirty={dirtyProjects}
              onOpen={setEditing}
              onCreate={() => createProject()}
              onDuplicate={(index) => createProject(projects[index])}
              onDelete={removeProject}
              onReorder={reorderProjects}
            />
          ))}

        {screen === "external" && (
          <ExternalScreen
            projects={external}
            tagSuggestions={tagSuggestions}
            dirty={externalDirty}
            saving={saving}
            onChange={setExternal}
            onSave={() => void run("External links", async () => {
              await saveExternal(external);
              setBaseExternal(stamp(external));
            })}
          />
        )}

        {screen === "media" && <MediaLibraryScreen />}

        {screen === "resume" && resume && (
          <ResumeScreen
            resume={resume}
            dirty={resumeDirty}
            saving={saving}
            onChange={setResume}
            onSave={() => void run("Resume", async () => {
              await saveResume(resume);
              setBaseResume(stamp(resume));
            })}
          />
        )}
      </div>
    </div>
  );
}
