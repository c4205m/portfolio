export function uniqueSlug(slug: string, taken: string[]): string {
  let candidate = slug;
  let n = 2;
  while (taken.includes(candidate)) candidate = `${slug}-${n++}`;
  return candidate;
}
