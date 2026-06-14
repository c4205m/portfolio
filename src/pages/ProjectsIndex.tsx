import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { projects, allTags } from "../data/projects";
import { useLang } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { PageTransition } from "../components/PageTransition";
import type { Localized } from "../types/content";

const heading: Localized = { en: "Projects", tr: "Projeler" };
const allLabel: Localized = { en: "All", tr: "Tümü" };

export function ProjectsIndex() {
  const lang = useLang();
  const reduced = usePrefersReducedMotion();
  useDocumentTitle(`${heading[lang]} | c4205M`);

  const [active, setActive] = useState<string | null>(null);
  const shown = active ? projects.filter((p) => p.tags.includes(active)) : projects;

  return (
    <PageTransition>
      <h2 className="section-h2 center" lang={lang}>
        {heading[lang]}
      </h2>

      <div className="project-filters" role="tablist" aria-label={heading[lang]}>
        <button
          className={`filter-chip${active === null ? " active" : ""}`}
          onClick={() => setActive(null)}
          aria-pressed={active === null}
        >
          {allLabel[lang]}
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
            <motion.article
              key={project.slug}
              className="project-card"
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Link to={`/${lang}/projects/${project.slug}/`} className="project-card-link">
                <h3>{project.title}</h3>
                <p>{project.blurb[lang]}</p>
                <div className="project-card-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </PageTransition>
  );
}
