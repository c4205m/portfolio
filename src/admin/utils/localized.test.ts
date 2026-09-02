import { describe, expect, it } from "vitest";
import { localizedText, withLang } from "./localized";

describe("localizedText", () => {
  it("returns a shared string as-is", () => {
    expect(localizedText("Shared", "tr")).toBe("Shared");
  });

  it("picks the requested language", () => {
    expect(localizedText({ en: "Hello", tr: "Merhaba" }, "tr")).toBe("Merhaba");
  });
});

describe("withLang", () => {
  it("replaces a shared string wholesale", () => {
    expect(withLang("Shared", "tr", "Next")).toBe("Next");
  });

  it("updates only the requested language", () => {
    expect(withLang({ en: "Hello", tr: "Merhaba" }, "tr", "Selam")).toEqual({ en: "Hello", tr: "Selam" });
  });
});
