import type { ExternalProject, Project } from "../types/content";
import type { Resume } from "../types/resume";

const PREFIX = "/__admin";

export interface AdminData {
  projects: Project[];
  externalProjects: ExternalProject[];
  resume: Resume;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PREFIX}${path}`, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `${res.status} ${res.statusText}`);
  return body as T;
}

function json(body: unknown): RequestInit {
  return { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export function fetchData(): Promise<AdminData> {
  return request<AdminData>("/data");
}

export function fetchMedia(): Promise<string[]> {
  return request<{ files: string[] }>("/media").then((r) => r.files);
}

export function uploadMedia(folder: string, file: File): Promise<string> {
  const query = new URLSearchParams({ folder, name: file.name });
  return request<{ path: string }>(`/media?${query}`, { method: "POST", body: file }).then((r) => r.path);
}

export function deleteMedia(path: string): Promise<void> {
  return request(`/media?${new URLSearchParams({ path })}`, { method: "DELETE" }).then(() => undefined);
}

export function saveProject(slug: string, project: Project, order: string[]): Promise<void> {
  return request(`/project`, { method: "PUT", ...json({ slug, project, order }) }).then(() => undefined);
}

export function deleteProject(slug: string, order: string[]): Promise<void> {
  return request(`/project`, { method: "DELETE", ...json({ slug, order }) }).then(() => undefined);
}

export function saveOrder(order: string[]): Promise<void> {
  return request(`/order`, { method: "PUT", ...json({ order }) }).then(() => undefined);
}

export function saveExternal(projects: ExternalProject[]): Promise<void> {
  return request(`/external`, { method: "PUT", ...json({ projects }) }).then(() => undefined);
}

export function saveResume(resume: Resume): Promise<void> {
  return request(`/resume`, { method: "PUT", ...json({ resume }) }).then(() => undefined);
}
