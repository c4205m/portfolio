import { useRef } from "react";
import { Link } from "react-router-dom";
import resumeData from "../data/resume.json";
import type { Resume } from "../types/resume";
import type { Lang, Localized } from "../types/content";
import { useLang } from "../i18n";
import { useResumeScrollHeader } from "../hooks/useResumeScrollHeader";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PageTransition } from "../components/PageTransition";
import { DownloadResumeButton } from "../components/DownloadResumeButton";
import { asset, displayUrl, externalUrl } from "../asset";

const resume = resumeData as unknown as Resume;

const headings: Record<string, Localized> = {
  resume: { en: "Resume", tr: "Özgeçmiş" },
  work: { en: "Work Experience", tr: "Profesyonel Deneyim" },
  projects: { en: "Shipped Projects", tr: "Projeler" },
  education: { en: "Education", tr: "Eğitim" },
  skills: { en: "Toolkit", tr: "Yetkinlikler" },
};

function html(value: string) {
  return { __html: value };
}

export function ResumePage() {
  const lang = useLang();
  const headerRef = useRef<HTMLElement>(null);
  useResumeScrollHeader(headerRef);
  useDocumentTitle(`${resume.basics.name} – ${headings.resume[lang]}`);

  const summary = resume.basics.summary[lang as Lang];

  return (
    <PageTransition className="content">
      <section className="resume-header" ref={headerRef}>
        <div className="name">
          <h1>{resume.basics.name}</h1>
          <p>{resume.basics.label}</p>
          <DownloadResumeButton resume={resume} lang={lang} />
        </div>
        <div className="muted">
          <a href={`tel:${resume.basics.phone}`}>{resume.basics.phone}</a>
          <br />
          <a href={`mailto:${resume.basics.email}`}>{resume.basics.email}</a>
          <br />
          {resume.basics.website && (
            <>
              <a href={externalUrl(resume.basics.website)} target="_blank" rel="noopener">
                {displayUrl(resume.basics.website)}
              </a>
              <br />
            </>
          )}
          <p>{resume.basics.location}</p>
        </div>
      </section>

      {summary && (
        <section>
          <p>{summary}</p>
        </section>
      )}

      <h2 lang={lang}>{headings.work[lang]}</h2>
      <section>
        {resume.work.map((job, i) => (
          <div className={`item ${job.classAttr ?? ""}`} key={i}>
            <div className="row">
              <strong>
                {job.position} – {job.company}
              </strong>
              <span className="muted">
                {job.startDate} – {job.endDate ?? "Present"}
              </span>
            </div>
            <p className="muted">{job.location}</p>
            {job.highlights && (
              <ul>
                {job.highlights[lang].map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <h2 lang={lang}>{headings.projects[lang]}</h2>
      <section>
        {resume.projects.map((project, i) => (
          <div className={`item ${project.classAttr ?? ""}`} key={i}>
            <div className="row">
              <strong>{project.name}</strong>
              <div className="link-emphasize">
                {project.href ? (
                  <Link to={`/${lang}${project.href}`}>{project.label[lang]}</Link>
                ) : (
                  <a href={externalUrl(project.url ?? "")} target="_blank" rel="noopener">
                    {project.label[lang]}
                  </a>
                )}
                <img src={asset("/media/tap.webp")} alt="" />
              </div>
            </div>
            <p className="description" lang={lang} dangerouslySetInnerHTML={html(project.description[lang])} />
          </div>
        ))}
      </section>

      <h2 lang={lang}>{headings.education[lang]}</h2>
      <section>
        {resume.education.map((edu, i) => (
          <div className={`item ${edu.classAttr ?? ""}`} key={i}>
            <div className="row">
              <strong>
                {edu.studyType[lang]} – {edu.institution[lang]}
              </strong>
              <span className="muted">
                {edu.startDate} – {edu.endDate}
              </span>
            </div>
            <p className="muted">{edu.area[lang]}</p>
          </div>
        ))}
      </section>

      <h2 lang={lang}>{headings.skills[lang]}</h2>
      <section>
        <ul>
          {resume.skills.map((skill, i) => (
            <li key={i}>
              <strong>{skill.name[lang]}:</strong> {skill.keywords.join(", ")}
            </li>
          ))}
        </ul>
      </section>
    </PageTransition>
  );
}
