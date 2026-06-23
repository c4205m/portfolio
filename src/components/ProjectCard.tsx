import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ExternalProject, Lang, Project } from "../types/content";

export type ProjectCardData =
  | (Project & { external: false })
  | (ExternalProject & { external: true });

export function ProjectCard({
  project,
  lang,
  reduced,
}: {
  project: ProjectCardData;
  lang: Lang;
  reduced: boolean;
}) {
  const inner = (
    <>
      <h3>{project.title}</h3>
      <p>{project.blurb[lang]}</p>
      <div className="project-card-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="project-tag">
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <motion.article
      className="project-card"
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {project.external ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card-link"
        >
          {inner}
        </a>
      ) : (
        <Link to={`/${lang}/projects/${project.slug}/`} className="project-card-link">
          {inner}
        </Link>
      )}
    </motion.article>
  );
}
