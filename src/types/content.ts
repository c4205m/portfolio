export type Lang = "en" | "tr";

export type Localized = Record<Lang, string>;

export interface GalleryAttr {
  size?: string;
  ratio?: string;
  speed?: number;
  igmodal?: boolean;
}

export type GalleryItem =
  | {
      type: "webm";
      src: string;
      href?: string;
      attrs?: string[];
      class?: string[];
    }
  | {
      type: "webp";
      src: string;
      dark?: string;
      invert?: boolean;
      alt?: string;
      href?: string;
    }
  | {
      type: "text";
      title?: Localized;
      content: Localized;
    }
  | {
      type: "embed";
      embed: string;
    };

export interface Gallery {
  /** Space-separated tokens, e.g. "slider infinite-carousel slide-left" or "ig". */
  type: string;
  attr: GalleryAttr;
  items: GalleryItem[];
}

export type ProjectSection =
  | { kind: "heading"; text: string | Localized; className?: string }
  | { kind: "paragraph"; text: Localized; className?: string }
  | { kind: "gallery"; gallery: Gallery };

export interface Project {
  slug: string;
  title: string;
  /** Short bilingual blurb for the projects index card. */
  blurb: Localized;
  tags: string[];
  sections: ProjectSection[];
}

export interface ExternalProject {
  slug: string;
  title: string;
  blurb: Localized;
  tags: string[];
  url: string;
  label: Localized;
}
