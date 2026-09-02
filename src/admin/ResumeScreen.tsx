import type { ReactNode } from "react";
import type { Lang } from "../types/content";
import type { Resume, ResumeEducation, ResumeJob, ResumeProject, ResumeSkill } from "../types/resume";
import { LocalizedInput } from "./Inspector";
import { Button, Field, Icon, IconButton, Panel, TextInput, TokenInput, move, removeAt, replaceAt, useDragList } from "./ui";

const LANGS: Lang[] = ["en", "tr"];

const BLANK_JOB: ResumeJob = { company: "", position: "", location: "", startDate: "", endDate: "", highlights: { en: [], tr: [] } };
const BLANK_PROJECT: ResumeProject = { name: "", description: { en: "", tr: "" }, url: "", label: { en: "", tr: "" } };
const BLANK_EDUCATION: ResumeEducation = { institution: { en: "", tr: "" }, area: { en: "", tr: "" }, studyType: { en: "", tr: "" }, startDate: "", endDate: "" };
const BLANK_SKILL: ResumeSkill = { name: { en: "", tr: "" }, keywords: [] };

function Highlights({ value, onChange }: { value: Record<Lang, string[]> | undefined; onChange: (v: Record<Lang, string[]>) => void }) {
  const current = { en: value?.en ?? [], tr: value?.tr ?? [] };
  return (
    <>
      {LANGS.map((lang) => (
        <Field key={lang} label={`Highlights (${lang.toUpperCase()})`} hint="One bullet per line.">
          <textarea
            className="wp-input"
            rows={6}
            value={current[lang].join("\n")}
            onChange={(e) => onChange({ ...current, [lang]: e.target.value.split("\n").filter((line) => line.trim() !== "") })}
          />
        </Field>
      ))}
    </>
  );
}

interface RepeaterProps<T> {
  title: string;
  items: T[];
  blank: T;
  heading: (item: T) => string;
  children: (item: T, update: (next: T) => void) => ReactNode;
  onChange: (items: T[]) => void;
}

function Repeater<T>({ title, items, blank, heading, children, onChange }: RepeaterProps<T>) {
  const { bind, over } = useDragList((from, to) => onChange(move(items, from, to)));

  return (
    <section className="wp-section">
      <header className="wp-section-head">
        <h2>{title}</h2>
        <Button onClick={() => onChange([...items, structuredClone(blank)])}>
          <Icon.plus size={15} /> Add
        </Button>
      </header>
      <div className="wp-cards">
        {items.map((item, index) => (
          <article key={index} className={over === index ? "wp-card drop" : "wp-card"} {...bind(index)}>
            <header className="wp-card-head">
              <span className="wp-grip" title="Drag to reorder">
                <Icon.drag size={16} />
              </span>
              <h3>{heading(item) || "(untitled)"}</h3>
              <IconButton label="Delete entry" danger icon={<Icon.trash size={15} />} onClick={() => onChange(removeAt(items, index))} />
            </header>
            {children(item, (next) => onChange(replaceAt(items, index, next)))}
          </article>
        ))}
      </div>
    </section>
  );
}

interface ResumeScreenProps {
  resume: Resume;
  dirty: boolean;
  saving: boolean;
  onChange: (resume: Resume) => void;
  onSave: () => void;
}

export function ResumeScreen({ resume, dirty, saving, onChange, onSave }: ResumeScreenProps) {
  const { basics } = resume;
  const setBasics = (next: Partial<typeof basics>) => onChange({ ...resume, basics: { ...basics, ...next } });

  return (
    <div className="wp-screen">
      <header className="wp-screen-head">
        <h1>Resume</h1>
        <Button variant="primary" onClick={onSave} disabled={saving || !dirty}>
          {saving ? "Saving…" : dirty ? "Save" : "Saved"}
        </Button>
      </header>

      <Panel title="Basics">
        <div className="wp-card-grid">
          <TextInput label="Name" value={basics.name} onChange={(name) => setBasics({ name })} />
          <TextInput label="Label" value={basics.label} onChange={(label) => setBasics({ label })} />
          <TextInput label="Email" value={basics.email} onChange={(email) => setBasics({ email })} />
          <TextInput label="Phone" value={basics.phone} onChange={(phone) => setBasics({ phone })} />
          <TextInput label="Location" value={basics.location} onChange={(location) => setBasics({ location })} />
          <TextInput label="Website" value={basics.website} onChange={(website) => setBasics({ website: website || undefined })} />
        </div>
        <LocalizedInput label="Summary" value={basics.summary} multiline onChange={(summary) => setBasics({ summary })} />
      </Panel>

      <Repeater
        title="Work"
        items={resume.work}
        blank={BLANK_JOB}
        heading={(job) => [job.position, job.company].filter(Boolean).join(" — ")}
        onChange={(work) => onChange({ ...resume, work })}
      >
        {(job, update) => (
          <>
            <div className="wp-card-grid">
              <TextInput label="Company" value={job.company} onChange={(company) => update({ ...job, company })} />
              <TextInput label="Position" value={job.position} onChange={(position) => update({ ...job, position })} />
              <TextInput label="Location" value={job.location} onChange={(location) => update({ ...job, location })} />
              <TextInput label="Start" value={job.startDate} onChange={(startDate) => update({ ...job, startDate })} />
              <TextInput label="End" value={job.endDate} onChange={(endDate) => update({ ...job, endDate: endDate || undefined })} />
              <TextInput label="CSS class" value={job.classAttr} onChange={(classAttr) => update({ ...job, classAttr: classAttr || undefined })} />
            </div>
            <Highlights value={job.highlights} onChange={(highlights) => update({ ...job, highlights })} />
          </>
        )}
      </Repeater>

      <Repeater
        title="Projects"
        items={resume.projects}
        blank={BLANK_PROJECT}
        heading={(project) => project.name}
        onChange={(projects) => onChange({ ...resume, projects })}
      >
        {(project, update) => (
          <>
            <div className="wp-card-grid">
              <TextInput label="Name" value={project.name} onChange={(name) => update({ ...project, name })} />
              <TextInput label="URL" value={project.url} onChange={(url) => update({ ...project, url: url || undefined })} />
              <TextInput label="Internal href" value={project.href} onChange={(href) => update({ ...project, href: href || undefined })} />
              <TextInput label="CSS class" value={project.classAttr} onChange={(classAttr) => update({ ...project, classAttr: classAttr || undefined })} />
            </div>
            <LocalizedInput label="Description" value={project.description} multiline onChange={(description) => update({ ...project, description })} />
            <LocalizedInput label="Link label" value={project.label} onChange={(label) => update({ ...project, label })} />
          </>
        )}
      </Repeater>

      <Repeater
        title="Education"
        items={resume.education}
        blank={BLANK_EDUCATION}
        heading={(entry) => entry.institution.en}
        onChange={(education) => onChange({ ...resume, education })}
      >
        {(entry, update) => (
          <>
            <div className="wp-card-grid">
              <TextInput label="Start" value={entry.startDate} onChange={(startDate) => update({ ...entry, startDate })} />
              <TextInput label="End" value={entry.endDate} onChange={(endDate) => update({ ...entry, endDate })} />
              <TextInput label="CSS class" value={entry.classAttr} onChange={(classAttr) => update({ ...entry, classAttr: classAttr || undefined })} />
            </div>
            <LocalizedInput label="Institution" value={entry.institution} onChange={(institution) => update({ ...entry, institution })} />
            <LocalizedInput label="Area" value={entry.area} onChange={(area) => update({ ...entry, area })} />
            <LocalizedInput label="Study type" value={entry.studyType} onChange={(studyType) => update({ ...entry, studyType })} />
          </>
        )}
      </Repeater>

      <Repeater
        title="Skills"
        items={resume.skills}
        blank={BLANK_SKILL}
        heading={(skill) => skill.name.en}
        onChange={(skills) => onChange({ ...resume, skills })}
      >
        {(skill, update) => (
          <>
            <LocalizedInput label="Name" value={skill.name} onChange={(name) => update({ ...skill, name })} />
            <TokenInput label="Keywords" value={skill.keywords} onChange={(keywords) => update({ ...skill, keywords })} />
          </>
        )}
      </Repeater>
    </div>
  );
}
