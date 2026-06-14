import { useRef, useState } from "react";
import { site, useLang } from "../i18n";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PageTransition } from "../components/PageTransition";

const FORMSPREE = "https://formspree.io/f/xgolgevd";
const EMAIL_RE = /^\S+@\S+\.\S+$/;

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

export function ContactPage() {
  const lang = useLang();
  const tr = site.componentTranslations.contact;
  useDocumentTitle(`${tr.title[lang]} | c4205M`);

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"" | "success" | "error">("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validate = (values: Record<FieldName, string>): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = tr.errors.name[lang];
    if (!values.email.trim()) next.email = tr.errors.emailEmpty[lang];
    else if (!EMAIL_RE.test(values.email)) next.email = tr.errors.emailInvalid[lang];
    if (!values.message.trim()) next.message = tr.errors.message[lang];
    return next;
  };

  const clearFieldError = (field: FieldName) =>
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("");

    if ((form.elements.namedItem("_gotcha") as HTMLInputElement)?.value) return;

    const values: Record<FieldName, string> = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0] as FieldName;
      (form.elements.namedItem(first) as HTMLElement)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSent(true);
      setStatus("success");
      form.reset();
      setErrors({});
      setTimeout(() => {
        setSent(false);
        setSubmitting(false);
        setStatus("");
      }, 4000);
    } catch {
      setSubmitting(false);
      setStatus("error");
    }
  };

  const field = (name: FieldName) => ({
    onInput: () => clearFieldError(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    required: true,
    "aria-required": true,
  });

  return (
    <PageTransition>
      <section className="contact no-print">
        <h2>{tr.title[lang]}</h2>

        <div className="contact-card">
          <p className="contact-intro">{tr.intro[lang]}</p>

          <form ref={formRef} className="contact-form" noValidate onSubmit={handleSubmit}>
            <input
              type="text"
              name="_gotcha"
              className="hidden-field"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className={`field${errors.name ? " error" : ""}`}>
              <label htmlFor="name">{tr.name[lang]}</label>
              <input id="name" type="text" name="name" {...field("name")} />
              {errors.name && (
                <div id="name-error" className="field-error-message" role="alert">
                  {errors.name}
                </div>
              )}
            </div>

            <div className={`field${errors.email ? " error" : ""}`}>
              <label htmlFor="email">{tr.mail[lang]}</label>
              <input id="email" type="email" name="email" {...field("email")} />
              {errors.email && (
                <div id="email-error" className="field-error-message" role="alert">
                  {errors.email}
                </div>
              )}
            </div>

            <div className={`field${errors.message ? " error" : ""}`}>
              <label htmlFor="message">{tr.message[lang]}</label>
              <textarea id="message" name="message" rows={4} {...field("message")} />
              {errors.message && (
                <div id="message-error" className="field-error-message" role="alert">
                  {errors.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={sent ? "sent" : undefined}
              disabled={submitting}
              aria-label={sent ? tr.sent[lang] : undefined}
              data-sent-label={sent ? tr.sent[lang] : undefined}
            >
              <span className="btn-text">{tr.button[lang]}</span>
            </button>

            <p className={`form-status${status ? " visible" : ""}`} aria-live="polite">
              {status === "success" ? tr.statusSuccess[lang] : status === "error" ? tr.statusError[lang] : ""}
            </p>
          </form>
        </div>
      </section>
    </PageTransition>
  );
}
