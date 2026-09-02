const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const INLINE_SOFT_LIMIT = 160;
const INLINE_HARD_LIMIT = 220;

export function quote(value: string): string {
  const body = value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
  return body.includes('"') && !body.includes("'")
    ? `'${body}'`
    : `"${body.replace(/"/g, '\\"')}"`;
}

function key(name: string): string {
  return IDENT.test(name) ? name : quote(name);
}

function isContainer(value: unknown): boolean {
  return typeof value === "object" && value !== null;
}

function depth(value: unknown): number {
  if (!isContainer(value)) return 0;
  const children = Array.isArray(value) ? value : Object.values(value as object);
  return 1 + children.reduce<number>((max, child) => Math.max(max, depth(child)), 0);
}

function isFlatChild(value: unknown): boolean {
  if (!isContainer(value)) return true;
  return Array.isArray(value) && value.every((item) => !isContainer(item));
}

function entries(value: object): [string, unknown][] {
  return Object.entries(value).filter(([, v]) => v !== undefined);
}

function inline(value: unknown): string {
  if (!isContainer(value)) return primitive(value);
  if (Array.isArray(value)) return value.length === 0 ? "[]" : `[${value.map(inline).join(", ")}]`;
  const pairs = entries(value as object);
  return pairs.length === 0 ? "{}" : `{ ${pairs.map(([k, v]) => `${key(k)}: ${inline(v)}`).join(", ")} }`;
}

function primitive(value: unknown): string {
  if (typeof value === "string") return quote(value);
  if (value === null) return "null";
  return String(value);
}

function fitsInline(value: object, indent: string): boolean {
  if (depth(value) > 2) return false;
  const width = indent.length + inline(value).length;
  if (width > INLINE_HARD_LIMIT) return false;
  if (width <= INLINE_SOFT_LIMIT) return true;
  const children = Array.isArray(value) ? value : Object.values(value);
  return children.every(isFlatChild);
}

export function serialize(value: unknown, indent = ""): string {
  if (!isContainer(value)) return primitive(value);
  if (fitsInline(value as object, indent)) return inline(value);

  const inner = `${indent}  `;
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((item) => `${inner}${serialize(item, inner)},`);
    return `[\n${items.join("\n")}\n${indent}]`;
  }
  const pairs = entries(value as object);
  if (pairs.length === 0) return "{}";
  const lines = pairs.map(([k, v]) => `${inner}${key(k)}: ${serialize(v, inner)},`);
  return `{\n${lines.join("\n")}\n${indent}}`;
}

export function identFromSlug(slug: string): string {
  const camel = slug
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part, i) => (i === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join("");
  return /^[0-9]/.test(camel) ? `_${camel}` : camel || "project";
}

export function projectModule(slug: string, project: unknown): string {
  const name = identFromSlug(slug);
  return [
    `import type { Project } from "../../types/content";`,
    "",
    `const ${name}: Project = ${serialize(project)};`,
    "",
    `export default ${name};`,
    "",
  ].join("\n");
}

export function externalModule(projects: unknown[]): string {
  return [
    `import type { ExternalProject } from "../../types/content";`,
    "",
    `export const externalProjects: ExternalProject[] = ${serialize(projects)};`,
    "",
  ].join("\n");
}

export function indexModule(slugs: string[]): string {
  const imports = slugs.map((slug) => `import ${identFromSlug(slug)} from "./${slug}";`);
  return [
    `import type { Project } from "../../types/content";`,
    ...imports,
    `import { externalProjects } from "./external";`,
    "",
    `export { externalProjects };`,
    "",
    `/** Projects with dedicated pages, in display order. */`,
    `export const projects: Project[] = [${slugs.map(identFromSlug).join(", ")}];`,
    "",
    `export const projectsBySlug: Record<string, Project> = Object.fromEntries(`,
    `  projects.map((p) => [p.slug, p]),`,
    `);`,
    "",
    `/** Unique tags across all projects, in first-seen order. */`,
    `export const allTags: string[] = [...projects, ...externalProjects].reduce<string[]>(`,
    `  (acc, p) => {`,
    `    for (const tag of p.tags) if (!acc.includes(tag)) acc.push(tag);`,
    `    return acc;`,
    `  },`,
    `  [],`,
    `);`,
    "",
  ].join("\n");
}
