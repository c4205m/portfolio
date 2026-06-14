const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * Resolve a root-relative media path against the Vite base path so assets
 * load correctly under GitHub Pages (`/portfolio/`). External URLs pass through.
 */
export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path}`;
}
