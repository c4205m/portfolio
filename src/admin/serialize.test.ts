import { describe, expect, it } from "vitest";
import { externalProjects, projects } from "../data/projects";
import { externalModule, identFromSlug, indexModule, projectModule, quote, serialize } from "./serialize";

function evaluate(source: string): unknown {
  return new Function(`return (${source});`)();
}

describe("quote", () => {
  it("prefers double quotes", () => {
    expect(quote("hello")).toBe('"hello"');
  });

  it("switches to single quotes when the value contains a double quote", () => {
    expect(quote('say "hi"')).toBe("'say \"hi\"'");
  });

  it("escapes double quotes when both quote styles appear", () => {
    expect(quote(`it's "fine"`)).toBe(`"it's \\"fine\\""`);
  });

  it("escapes backslashes and newlines", () => {
    expect(quote("a\\b\nc")).toBe('"a\\\\b\\nc"');
  });
});

describe("serialize", () => {
  it("round-trips every project unchanged", () => {
    for (const project of projects) {
      expect(evaluate(serialize(project))).toEqual(project);
    }
  });

  it("round-trips external projects unchanged", () => {
    expect(evaluate(serialize(externalProjects))).toEqual(externalProjects);
  });

  it("round-trips awkward strings", () => {
    const value = { a: 'quote "x"', b: "apostrophe 's", c: "back\\slash", d: "tab\there" };
    expect(evaluate(serialize(value))).toEqual(value);
  });

  it("keeps shallow objects on one line", () => {
    expect(serialize({ type: "webp", src: "/media/a.png" })).toBe('{ type: "webp", src: "/media/a.png" }');
  });

  it("expands nested structures", () => {
    const source = serialize({ kind: "gallery", gallery: { type: "ig", attr: {}, items: [{ type: "embed", embed: "x" }] } });
    expect(source).toContain("\n");
    expect(source).toContain('items: [');
  });

  it("drops undefined properties", () => {
    expect(serialize({ a: 1, b: undefined })).toBe("{ a: 1 }");
  });

  it("quotes keys that are not identifiers", () => {
    expect(serialize({ "my-key": 1 })).toBe('{ "my-key": 1 }');
  });

  it("handles empty containers", () => {
    expect(serialize({ a: [], b: {} })).toBe("{ a: [], b: {} }");
  });
});

describe("identFromSlug", () => {
  it("camel-cases hyphenated slugs", () => {
    expect(identFromSlug("nla-batch-editor")).toBe("nlaBatchEditor");
  });

  it("prefixes slugs that start with a digit", () => {
    expect(identFromSlug("0-days-without-accidents")).toBe("_0DaysWithoutAccidents");
  });
});

describe("modules", () => {
  it("emits a project module that re-exports the same data", () => {
    const source = projectModule("azuki", projects[1]);
    expect(source).toContain('import type { Project } from "../../types/content";');
    expect(source).toContain("const azuki: Project = {");
    expect(source.trimEnd().endsWith("export default azuki;")).toBe(true);
  });

  it("emits an external module", () => {
    const source = externalModule(externalProjects);
    expect(source).toContain("export const externalProjects: ExternalProject[] = [");
  });

  it("emits an index module in the given order", () => {
    const source = indexModule(["thorn", "azuki", "lenses"]);
    expect(source).toContain('import thorn from "./thorn";');
    expect(source).toContain("export const projects: Project[] = [thorn, azuki, lenses];");
  });
});
