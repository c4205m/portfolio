import { describe, expect, it } from "vitest";
import { uniqueSlug } from "./slug";

describe("uniqueSlug", () => {
  it("keeps a free slug", () => {
    expect(uniqueSlug("thorn", ["other"])).toBe("thorn");
  });

  it("suffixes until free", () => {
    expect(uniqueSlug("thorn", ["thorn", "thorn-2"])).toBe("thorn-3");
  });
});
