import type { Lang, Localized } from "../../types/content";

export function localizedText(text: string | Localized, lang: Lang): string {
  return typeof text === "string" ? text : text[lang];
}

export function withLang(text: string | Localized, lang: Lang, value: string): string | Localized {
  if (typeof text === "string") return value;
  return { ...text, [lang]: value };
}
