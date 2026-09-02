import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { site, useLang } from "../i18n";
import { useModal } from "../context/ModalContext";
import { LangSwitcher } from "./LangSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Header() {
  const lang = useLang();
  const location = useLocation();
  const { activeKey, close } = useModal();

  const [detailsOpen, setDetailsOpen] = useState(true);
  const detailsRef = useRef<HTMLDetailsElement>(null);

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

  useEffect(() => {
    if (!detailsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(e.target as Node) &&
        window.innerWidth < 640
      ) {
        setDetailsOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [detailsOpen]);

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
          <LangSwitcher />
          <ThemeSwitcher />
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
