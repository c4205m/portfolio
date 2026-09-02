import type { Lang, ProjectSection } from "../../types/content";
import type { IconComponent } from "../components";
import type { Selection } from "../types";

export type SectionKind = ProjectSection["kind"];

export type SectionOfKind<K extends SectionKind> = Extract<ProjectSection, { kind: K }>;

export interface BlockCanvasProps<S extends ProjectSection> {
  section: S;
  lang: Lang;
  index: number;
  selection: Selection;
  onSelect: (selection: Selection) => void;
  onChange: (section: ProjectSection) => void;
}

export interface BlockSettingsProps<S extends ProjectSection> {
  section: S;
  onChange: (section: ProjectSection) => void;
}

export interface BlockItemSettingsProps<S extends ProjectSection> {
  section: S;
  itemIndex: number;
  folder: string;
  onChange: (section: ProjectSection) => void;
}

export interface BlockItems<S extends ProjectSection> {
  title: (section: S, itemIndex: number) => string;
  hint: string;
  Settings: (props: BlockItemSettingsProps<S>) => JSX.Element | null;
}

export interface BlockDefinition<S extends ProjectSection> {
  label: string;
  icon: IconComponent;
  blank: () => S;
  Canvas: (props: BlockCanvasProps<S>) => JSX.Element;
  Settings: (props: BlockSettingsProps<S>) => JSX.Element;
  items?: BlockItems<S>;
}

export type AnyBlockDefinition = BlockDefinition<ProjectSection>;
