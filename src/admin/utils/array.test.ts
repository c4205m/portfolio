import { describe, expect, it } from "vitest";
import { insertAt, move, removeAt, replaceAt } from "./array";

describe("move", () => {
  it("moves an item forward", () => {
    expect(move(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
  });

  it("moves an item backward", () => {
    expect(move(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });

  it("returns the same array when the target is out of range or unchanged", () => {
    const items = ["a", "b"];
    expect(move(items, 0, 0)).toBe(items);
    expect(move(items, 0, -1)).toBe(items);
    expect(move(items, 0, 2)).toBe(items);
  });

  it("does not mutate the input", () => {
    const items = ["a", "b", "c"];
    move(items, 0, 2);
    expect(items).toEqual(["a", "b", "c"]);
  });
});

describe("replaceAt", () => {
  it("replaces the item at the index", () => {
    expect(replaceAt(["a", "b"], 1, "z")).toEqual(["a", "z"]);
  });

  it("ignores an index outside the array", () => {
    expect(replaceAt(["a"], 5, "z")).toEqual(["a"]);
  });
});

describe("removeAt", () => {
  it("removes the item at the index", () => {
    expect(removeAt(["a", "b", "c"], 1)).toEqual(["a", "c"]);
  });
});

describe("insertAt", () => {
  it("inserts before the index", () => {
    expect(insertAt(["a", "c"], 1, "b")).toEqual(["a", "b", "c"]);
  });

  it("appends when the index is the length", () => {
    expect(insertAt(["a"], 1, "b")).toEqual(["a", "b"]);
  });
});
