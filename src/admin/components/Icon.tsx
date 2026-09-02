import type { ReactNode } from "react";

export type IconProps = { size?: number };

export type IconComponent = (props: IconProps) => JSX.Element;

function Svg({ size = 18, children }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const Icon = {
  projects: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  ),
  link: (p: IconProps) => (
    <Svg {...p}>
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.4 4.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.4-1.4" />
    </Svg>
  ),
  media: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m4 17 5-4 4 3 3-2 4 3" />
    </Svg>
  ),
  resume: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </Svg>
  ),
  plus: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  trash: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 7h16M10 11v6M14 11v6" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M9 7V4h6v3" />
    </Svg>
  ),
  copy: (p: IconProps) => (
    <Svg {...p}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </Svg>
  ),
  drag: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="9" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="18" r="1" />
    </Svg>
  ),
  up: (p: IconProps) => (
    <Svg {...p}>
      <path d="m6 15 6-6 6 6" />
    </Svg>
  ),
  down: (p: IconProps) => (
    <Svg {...p}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  ),
  back: (p: IconProps) => (
    <Svg {...p}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </Svg>
  ),
  close: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  ),
  heading: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 4v16M18 4v16M6 12h12" />
    </Svg>
  ),
  paragraph: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 6h14M5 11h14M5 16h9" />
    </Svg>
  ),
  gallery: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 15l4-3 4 3 3-4 7 5" />
    </Svg>
  ),
  video: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 11 6-3v8l-6-3z" />
    </Svg>
  ),
  text: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 6h14M12 6v12M9 18h6" />
    </Svg>
  ),
  embed: (p: IconProps) => (
    <Svg {...p}>
      <path d="m9 8-5 4 5 4M15 8l5 4-5 4" />
    </Svg>
  ),
  upload: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </Svg>
  ),
};
