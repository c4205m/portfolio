import type { Screen } from "../types";
import { Icon } from "./Icon";
import type { IconComponent } from "./Icon";

const NAV: { id: Screen; label: string; icon: IconComponent }[] = [
  { id: "projects", label: "Projects", icon: Icon.projects },
  { id: "external", label: "External links", icon: Icon.link },
  { id: "media", label: "Media", icon: Icon.media },
  { id: "resume", label: "Resume", icon: Icon.resume },
];

interface AdminNavProps {
  screen: Screen;
  dirty: Partial<Record<Screen, boolean>>;
  onNavigate: (screen: Screen) => void;
}

export function AdminNav({ screen, dirty, onNavigate }: AdminNavProps) {
  return (
    <nav className="wp-menu" aria-label="Admin sections">
      <span className="wp-menu-brand">Portfolio CMS</span>
      {NAV.map(({ id, label, icon: NavIcon }) => (
        <button key={id} type="button" className={id === screen ? "active" : ""} aria-current={id === screen} onClick={() => onNavigate(id)}>
          <NavIcon size={17} />
          <span>{label}</span>
          {dirty[id] && <span className="wp-dot" />}
        </button>
      ))}
      <a className="wp-menu-link" href="/portfolio/en/projects" target="_blank" rel="noreferrer">
        View site
      </a>
    </nav>
  );
}
