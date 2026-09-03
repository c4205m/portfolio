import { useState } from "react";
import type { Lang, Localized } from "../types/content";
import type { Resume } from "../types/resume";
import { asset } from "../asset";

const copy: Record<string, Localized> = {
  idle: { en: "Download PDF", tr: "PDF İndir" },
  busy: { en: "Preparing…", tr: "Hazırlanıyor…" },
  failed: { en: "Failed, retry", tr: "Başarısız, tekrar dene" },
};

type Status = "idle" | "busy" | "failed";

interface Props {
  resume: Resume;
  lang: Lang;
}

function fileName(name: string, lang: Lang) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${lang}.pdf`;
}

export function DownloadResumeButton({ resume, lang }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  async function download() {
    setStatus("busy");
    try {
      const [{ pdf }, { ResumeDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ResumeDocument"),
      ]);
      const siteOrigin = `${window.location.origin}${asset("")}`;
      const blob = await pdf(
        <ResumeDocument resume={resume} lang={lang} siteOrigin={siteOrigin} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName(resume.basics.name, lang);
      link.click();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      setStatus("failed");
    }
  }

  const title = copy[status][lang];

  return (
    <button
      type="button"
      className={`resume-download ${status}`}
      onClick={download}
      disabled={status === "busy"}
      aria-label={title}
      title={title}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M12 18v-6" />
        <path d="m9 15 3 3 3-3" />
      </svg>
    </button>
  );
}
