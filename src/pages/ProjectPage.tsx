import { Navigate, useParams } from "react-router-dom";
import { projectsBySlug } from "../data/projects";
import { site, useLang } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PageTransition } from "../components/PageTransition";
import { Gallery } from "../components/Gallery";
import type { Lang, Localized } from "../types/content";

function resolveText(text: string | Localized, lang: Lang): string {
  return typeof text === "string" ? text : text[lang];
}

export function ProjectPage() {
  const lang = useLang();
  const { slug } = useParams();
  const project = slug ? projectsBySlug[slug] : undefined;

  useDocumentTitle(project ? `${project.title} | ${site.brand}` : site.brand);

  if (!project) return <Navigate to={`/${lang}/projects/`} replace />;

  return (
    <PageTransition>
      {project.sections.map((section, i) => {
        if (section.kind === "heading") {
          return (
            <h2 key={i} className={`section-h2 ${section.className ?? ""}`.trim()} lang={lang}>
              {resolveText(section.text, lang)}
            </h2>
          );
        }
        if (section.kind === "paragraph") {
          return (
            <section key={i}>
              <p
                className={section.className}
                lang={lang}
                dangerouslySetInnerHTML={{ __html: section.text[lang] }}
              />
            </section>
          );
        }
        return <Gallery key={i} gallery={section.gallery} lang={lang} />;
      })}
    </PageTransition>
  );
}
