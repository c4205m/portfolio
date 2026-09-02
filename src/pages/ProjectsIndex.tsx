import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, externalProjects, allTags } from "../data/projects";
import { site, useLang } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { PageTransition } from "../components/PageTransition";
import { ProjectCard, type ProjectCardData } from "../components/ProjectCard";

export function ProjectsIndex() {
  const lang = useLang();
  const reduced = usePrefersReducedMotion();
  const tr = site.componentTranslations.projects;
  useDocumentTitle(`${tr.title[lang]} | ${site.brand}`);

  const [active, setActive] = useState<string | null>(null);
  const cards: ProjectCardData[] = [
    ...projects.map((p) => ({ ...p, external: false as const })),
    ...externalProjects.map((p) => ({ ...p, external: true as const })),
  ];
  const shown = active ? cards.filter((p) => p.tags.includes(active)) : cards;

  return (
    <PageTransition>
      <h2 className="section-h2 center" lang={lang}>
        {tr.title[lang]}
      </h2>

      <div className="project-filters" role="tablist" aria-label={tr.title[lang]}>
        <button
          className={`filter-chip${active === null ? " active" : ""}`}
          onClick={() => setActive(null)}
          aria-pressed={active === null}
        >
          {tr.all[lang]}
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`filter-chip${active === tag ? " active" : ""}`}
            onClick={() => setActive(tag)}
            aria-pressed={active === tag}
          >
            {tag}
          </button>
        ))}
      </div>

      <motion.div className="project-grid" layout={!reduced}>
        <AnimatePresence mode="popLayout">
          {shown.map((project) => (
            <ProjectCard key={project.slug} project={project} lang={lang} reduced={reduced} />
          ))}
        </AnimatePresence>
      </motion.div>
    </PageTransition>
  );
}
