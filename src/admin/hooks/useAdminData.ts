import { useCallback, useEffect, useMemo, useState } from "react";
import type { ExternalProject, Project } from "../../types/content";
import type { Resume } from "../../types/resume";
import { deleteProject, fetchData, saveExternal, saveOrder, saveProject, saveResume } from "../api";
import { move, removeAt, replaceAt, uniqueSlug } from "../utils";

interface Baseline {
  projects: string[];
  slugs: string[];
  external: string;
  resume: string;
}

const EMPTY_BASELINE: Baseline = { projects: [], slugs: [], external: "", resume: "" };

const stamp = (value: unknown) => JSON.stringify(value);

function blankProject(): Project {
  return { slug: "new-project", title: "New project", tags: [], blurb: { en: "", tr: "" }, sections: [] };
}

export function useAdminData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [external, setExternal] = useState<ExternalProject[]>([]);
  const [resume, setResume] = useState<Resume>();
  const [baseline, setBaseline] = useState<Baseline>(EMPTY_BASELINE);

  const [loadError, setLoadError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData()
      .then((data) => {
        setProjects(data.projects);
        setExternal(data.externalProjects);
        setResume(data.resume);
        setBaseline({
          projects: data.projects.map(stamp),
          slugs: data.projects.map((p) => p.slug),
          external: stamp(data.externalProjects),
          resume: stamp(data.resume),
        });
      })
      .catch((e) => setLoadError(e.message));
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(undefined), 4000);
    return () => clearTimeout(id);
  }, [notice]);

  const dirtyProjects = useMemo(() => {
    const set = new Set<number>();
    projects.forEach((project, index) => {
      if (stamp(project) !== baseline.projects[index]) set.add(index);
    });
    return set;
  }, [projects, baseline.projects]);

  const externalDirty = resume !== undefined && stamp(external) !== baseline.external;
  const resumeDirty = resume !== undefined && stamp(resume) !== baseline.resume;
  const anyDirty = dirtyProjects.size > 0 || externalDirty || resumeDirty;

  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

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

  const persistOrder = useCallback(
    (next: Project[]) => {
      const order = next.map((p) => p.slug);
      void run("Order", async () => {
        await saveOrder(order);
        setBaseline((base) => ({ ...base, slugs: order }));
      });
    },
    [run],
  );

  const updateProject = useCallback((index: number, project: Project) => {
    setProjects((current) => replaceAt(current, index, project));
  }, []);

  const persistProject = useCallback(
    (index: number) => {
      const project = projects[index];
      const order = projects.map((p) => p.slug);
      const previous = baseline.slugs[index];
      void run("Project", async () => {
        await saveProject(project.slug, project, order);
        if (previous && previous !== project.slug) await deleteProject(previous, order);
        setBaseline((base) => ({ ...base, projects: projects.map(stamp), slugs: order }));
      });
    },
    [projects, baseline.slugs, run],
  );

  const reorderProjects = useCallback(
    (from: number, to: number) => {
      const next = move(projects, from, to);
      setProjects(next);
      setBaseline((base) => ({
        ...base,
        projects: move(base.projects, from, to),
        slugs: move(base.slugs, from, to),
      }));
      persistOrder(next);
    },
    [projects, persistOrder],
  );

  const createProject = useCallback(
    (source?: Project) => {
      const taken = projects.map((p) => p.slug);
      const base = source ? structuredClone(source) : blankProject();
      const project: Project = {
        ...base,
        slug: uniqueSlug(source ? `${source.slug}-copy` : base.slug, taken),
        title: source ? `${source.title} (copy)` : base.title,
      };
      setProjects([...projects, project]);
      setBaseline((current) => ({ ...current, projects: [...current.projects, ""], slugs: [...current.slugs, ""] }));
      return projects.length;
    },
    [projects],
  );

  const deleteProjectAt = useCallback(
    (index: number) => {
      const saved = baseline.slugs[index];
      const next = removeAt(projects, index);
      const order = next.map((p) => p.slug);
      setProjects(next);
      setBaseline((base) => ({
        ...base,
        projects: removeAt(base.projects, index),
        slugs: removeAt(base.slugs, index),
      }));
      void run("Project deleted", async () => {
        if (saved) await deleteProject(saved, order);
        else await saveOrder(order);
      });
    },
    [projects, baseline.slugs, run],
  );

  const persistExternal = useCallback(() => {
    void run("External links", async () => {
      await saveExternal(external);
      setBaseline((base) => ({ ...base, external: stamp(external) }));
    });
  }, [external, run]);

  const persistResume = useCallback(() => {
    if (!resume) return;
    void run("Resume", async () => {
      await saveResume(resume);
      setBaseline((base) => ({ ...base, resume: stamp(resume) }));
    });
  }, [resume, run]);

  return {
    projects,
    external,
    resume,
    loadError,
    notice,
    saving,
    dirtyProjects,
    externalDirty,
    resumeDirty,
    tagSuggestions,
    updateProject,
    persistProject,
    reorderProjects,
    createProject,
    deleteProjectAt,
    setExternal,
    persistExternal,
    setResume,
    persistResume,
  };
}
