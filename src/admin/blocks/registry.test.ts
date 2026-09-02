import { describe, expect, it } from "vitest";
import { BLOCKS, BLOCK_KINDS, blockFor } from "./registry";

describe("block registry", () => {
  it("registers every section kind", () => {
    expect(BLOCK_KINDS).toEqual(["heading", "paragraph", "gallery"]);
  });

  it("produces a blank section matching its own kind", () => {
    for (const kind of BLOCK_KINDS) {
      expect(BLOCKS[kind].blank().kind).toBe(kind);
    }
  });

  it("resolves a definition from a section", () => {
    expect(blockFor({ kind: "gallery", gallery: { type: "ig", attr: {}, items: [] } })).toBe(BLOCKS.gallery);
  });

  it("gives gallery blocks per-item settings and the others none", () => {
    expect(BLOCKS.gallery.items).toBeDefined();
    expect(BLOCKS.heading.items).toBeUndefined();
    expect(BLOCKS.paragraph.items).toBeUndefined();
  });
});
