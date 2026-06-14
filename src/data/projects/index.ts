import type { Project } from "../../types/content";
import thorn from "./thorn";
import azuki from "./azuki";
import lenses from "./lenses";

/** Projects with dedicated pages, in display order. */
export const projects: Project[] = [thorn, azuki, lenses];

export const projectsBySlug: Record<string, Project> = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
);

/** Unique tags across all projects, in first-seen order. */
export const allTags: string[] = projects.reduce<string[]>((acc, p) => {
  for (const tag of p.tags) if (!acc.includes(tag)) acc.push(tag);
  return acc;
}, []);
