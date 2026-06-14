import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { languages, site, useLang } from "../i18n";
import { useTheme } from "../context/ThemeContext";
import { useModal } from "../context/ModalContext";
import type { Lang } from "../types/content";

function swapLang(pathname: string, next: Lang): string {
  const segments = pathname.split("/");
  // segments[0] is "" (leading slash); segments[1] is the lang.
  if (segments.length > 1) segments[1] = next;
  return segments.join("/");
}

export function Header() {
  const lang = useLang();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { activeKey, close } = useModal();

  const [detailsOpen, setDetailsOpen] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Collapse the switcher on small screens; keep it open on desktop.
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    setDetailsOpen(!mql.matches);
    const onChange = (e: MediaQueryListEvent) => {
      if (!e.matches) setDetailsOpen(true);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Outside-click closes the popover (mobile) and the language dropdown.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        detailsOpen &&
        detailsRef.current &&
        !detailsRef.current.contains(target) &&
        window.innerWidth < 640
      ) {
        setDetailsOpen(false);
      }
      if (langOpen && langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [detailsOpen, langOpen]);

  const prefix = `/${lang}`;
  const modalActive = activeKey !== null;

  return (
    <header className="site-header">
      <details
        ref={detailsRef}
        className="switcher-details"
        open={detailsOpen}
        onToggle={(e) => setDetailsOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="switcher-summary">···</summary>
        <div className={`language-switcher${modalActive ? " modal-mode" : ""}`}>
          <div className="lang-switcher" ref={langRef}>
            <input
              type="checkbox"
              id="lang-toggle"
              className="lang-toggle-input"
              checked={langOpen}
              onChange={(e) => setLangOpen(e.target.checked)}
            />
            <label htmlFor="lang-toggle" className="lang-trigger">
              {lang}
            </label>
            <div className="lang-options">
              {languages
                .filter((l) => l !== lang)
                .map((l) => (
                  <Link
                    key={l}
                    className="lang-option"
                    to={swapLang(location.pathname, l)}
                    onClick={() => setLangOpen(false)}
                  >
                    {l}
                  </Link>
                ))}
            </div>
          </div>

          <div id="theme" className="theme-switcher">
            <input
              type="radio"
              name="theme-toggle"
              id="theme-dark"
              value="dark"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
            />
            <input
              type="radio"
              name="theme-toggle"
              id="theme-light"
              value="light"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
            />
            <label lang="en" htmlFor="theme-dark">
              dark
            </label>
            <label lang="en" htmlFor="theme-light">
              light
            </label>
          </div>
        </div>
      </details>

      <div className={`site-header-inner${modalActive ? " modal-mode" : ""}`}>
        <Link style={{ borderBottom: "none" }} to={`${prefix}/resume/`} className="site-logo">
          C
        </Link>

        <nav className="site-nav">
          {site.navigation.map((item) => {
            const to = `${prefix}${item.url}`;
            const current = location.pathname === to;
            return (
              <Link key={item.url} to={to} aria-current={current ? "page" : undefined}>
                {item.label[lang]}
              </Link>
            );
          })}
        </nav>

        {modalActive && (
          <button className="gallery-modal-close" onClick={close} aria-label="Close">
            ◄
          </button>
        )}
      </div>
    </header>
  );
}
