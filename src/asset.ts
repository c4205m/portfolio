const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * Resolve a root-relative media path against the Vite base path so assets
 * load correctly under GitHub Pages (`/portfolio/`). External URLs pass through.
 */
export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path}`;
}

export function externalUrl(url: string): string {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
}

export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
