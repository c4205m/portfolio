import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import type { Lang, Localized } from "../types/content";
import type { Resume } from "../types/resume";
import { richText } from "./richText";
import { styles } from "./resumePdfStyles";

const headings: Record<string, Localized> = {
  work: { en: "Work Experience", tr: "Profesyonel Deneyim" },
  projects: { en: "Shipped Projects", tr: "Projeler" },
  education: { en: "Education", tr: "Eğitim" },
  skills: { en: "Toolkit", tr: "Yetkinlikler" },
};

const present: Localized = { en: "Present", tr: "Halen" };

interface Props {
  resume: Resume;
  lang: Lang;
  siteOrigin: string;
}

export function ResumeDocument({ resume, lang, siteOrigin }: Props) {
  const { basics } = resume;
  const summary = basics.summary[lang];

  return (
    <Document
      title={`${basics.name} – ${basics.label}`}
      author={basics.name}
      language={lang}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed={false}>
          <View>
            <Text style={styles.name}>{basics.name}</Text>
            <Text style={styles.label}>{basics.label}</Text>
          </View>
          <View style={styles.contact}>
            <Link src={`tel:${basics.phone}`} style={styles.contactLink}>
              {basics.phone}
            </Link>
            <Link src={`mailto:${basics.email}`} style={styles.contactLink}>
              {basics.email}
            </Link>
            {basics.website && (
              <Link src={basics.website} style={styles.contactLink}>
                {basics.website}
              </Link>
            )}
            <Text>{basics.location}</Text>
          </View>
        </View>

        {summary && (
          <View style={styles.summary}>
            <Text>{summary}</Text>
          </View>
        )}

        <Text style={styles.heading}>{headings.work[lang]}</Text>
        {resume.work.map((job, i) => (
          <View style={styles.item} key={i} wrap={false}>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>
                {job.position} – {job.company}
              </Text>
              <Text style={styles.rowMeta}>
                {job.startDate} – {job.endDate ?? present[lang]}
              </Text>
            </View>
            <Text style={styles.metaLine}>{job.location}</Text>
            {job.highlights?.[lang].map((highlight, j) => (
              <View style={styles.bullet} key={j}>
                <Text style={styles.bulletMark}>•</Text>
                <Text style={styles.bulletText}>{highlight}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.heading}>{headings.projects[lang]}</Text>
        {resume.projects.map((project, i) => (
          <View style={styles.item} key={i} wrap={false}>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>{project.name}</Text>
              <Link
                src={project.href ? `${siteOrigin}/${lang}${project.href}` : project.url}
                style={styles.link}
              >
                {project.label[lang]}
              </Link>
            </View>
            <Text style={styles.description}>{richText(project.description[lang])}</Text>
          </View>
        ))}

        <Text style={styles.heading}>{headings.education[lang]}</Text>
        {resume.education.map((edu, i) => (
          <View style={styles.item} key={i} wrap={false}>
            <View style={styles.row}>
              <Text style={styles.rowTitle}>
                {edu.studyType[lang]} – {edu.institution[lang]}
              </Text>
              <Text style={styles.rowMeta}>
                {edu.startDate} – {edu.endDate}
              </Text>
            </View>
            <Text style={styles.metaLine}>{edu.area[lang]}</Text>
          </View>
        ))}

        <Text style={styles.heading}>{headings.skills[lang]}</Text>
        <View wrap={false}>
          {resume.skills.map((skill, i) => (
            <View style={styles.bullet} key={i}>
              <Text style={styles.bulletMark}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={{ fontWeight: 700 }}>{skill.name[lang]}: </Text>
                {skill.keywords.join(", ")}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
