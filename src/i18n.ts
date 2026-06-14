import { useParams } from "react-router-dom";
import siteData from "./data/site.json";
import type { Lang, Localized } from "./types/content";

export const site = siteData;
export const languages = siteData.languages as Lang[];
export const defaultLang = siteData.defaultLang as Lang;

export function isLang(value: string | undefined): value is Lang {
  return value === "en" || value === "tr";
}

/** Pick the best language: a saved/explicit choice, else the browser's, else default. */
export function resolveInitialLang(): Lang {
  if (typeof navigator !== "undefined" && navigator.language) {
    const prefix = navigator.language.toLowerCase().split("-")[0];
    if (isLang(prefix)) return prefix;
  }
  return defaultLang;
}

/** Current language from the `/:lang/...` route segment. */
export function useLang(): Lang {
  const { lang } = useParams();
  return isLang(lang) ? lang : defaultLang;
}

export function t(value: Localized | Record<string, string>, lang: Lang): string {
  return (value as Record<string, string>)[lang] ?? "";
}
