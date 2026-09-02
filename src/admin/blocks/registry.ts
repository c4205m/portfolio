import type { ProjectSection } from "../../types/content";
import { galleryBlock } from "./GalleryBlock";
import { headingBlock } from "./HeadingBlock";
import { paragraphBlock } from "./ParagraphBlock";
import type { AnyBlockDefinition, SectionKind } from "./types";

export const BLOCKS = {
  heading: headingBlock,
  paragraph: paragraphBlock,
  gallery: galleryBlock,
} as Record<SectionKind, AnyBlockDefinition>;

export const BLOCK_KINDS = Object.keys(BLOCKS) as SectionKind[];

export function blockFor(section: ProjectSection): AnyBlockDefinition {
  return BLOCKS[section.kind];
}
