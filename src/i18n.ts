import { useParams } from "react-router-dom";
import siteData from "./data/site.json";
import type { Lang } from "./types/content";

export const site = siteData;
export const languages = siteData.languages as Lang[];
export const defaultLang = siteData.defaultLang as Lang;

export function isLang(value: string | undefined): value is Lang {
  return value === "en" || value === "tr";
}

export const LANG_KEY = "lang";

/** Pick the best language: a saved choice, else the browser's, else default. */
export function resolveInitialLang(): Lang {
  const stored = localStorage.getItem(LANG_KEY) ?? undefined;
  if (isLang(stored)) return stored;

  const prefix = navigator.language?.toLowerCase().split("-")[0];
  if (isLang(prefix)) return prefix;

  return defaultLang;
}

/** Current language from the `/:lang/...` route segment. */
export function useLang(): Lang {
  const { lang } = useParams();
  return isLang(lang) ? lang : defaultLang;
}
