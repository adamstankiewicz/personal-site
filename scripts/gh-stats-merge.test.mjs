import { strict as assert } from "node:assert";
import { test } from "node:test";
import { mergeStats } from "./gh-stats-merge.mjs";

const floor = {
  opened: 1970,
  reviewed: 3083,
  scope: "all",
  years: [
    { y: 2023, opened: 300 },
    { y: 2024, opened: 250 },
  ],
};

test("fresh results win when higher", () => {
  const merged = mergeStats(
    {
      opened: 2100,
      reviewed: 3200,
      scope: "all",
      years: [
        { y: 2023, opened: 300 },
        { y: 2024, opened: 260 },
        { y: 2025, opened: 40 },
      ],
    },
    floor
  );
  assert.equal(merged.opened, 2100);
  assert.equal(merged.reviewed, 3200);
  assert.deepEqual(merged.years, [
    { y: 2023, opened: 300 },
    { y: 2024, opened: 260 },
    { y: 2025, opened: 40 },
  ]);
});

test("the floor holds when visibility shrinks (access lost)", () => {
  const merged = mergeStats(
    {
      opened: 900, // public-only token sees far less
      reviewed: 1200,
      scope: "all",
      years: [
        { y: 2023, opened: 80 },
        { y: 2024, opened: 60 },
        { y: 2025, opened: 10 },
      ],
    },
    floor
  );
  assert.equal(merged.opened, 1970);
  assert.equal(merged.reviewed, 3083);
  assert.deepEqual(merged.years, [
    { y: 2023, opened: 300 },
    { y: 2024, opened: 250 },
    { y: 2025, opened: 10 }, // new year still comes through
  ]);
});

test("a token-less bake passes the floor through", () => {
  const merged = mergeStats(
    { opened: null, reviewed: null, scope: null, years: [] },
    floor
  );
  assert.equal(merged.opened, 1970);
  assert.equal(merged.scope, "all");
  assert.equal(merged.years.length, 2);
});

test("no floor yet: fresh stats are used as-is", () => {
  const fresh = { opened: 10, reviewed: 5, scope: "all", years: [] };
  assert.deepEqual(mergeStats(fresh, null), fresh);
});

test("both empty stays empty", () => {
  const merged = mergeStats(
    { opened: null, reviewed: null, scope: null, years: [] },
    { opened: null, reviewed: null, scope: null, years: [] }
  );
  assert.equal(merged.opened, null);
  assert.equal(merged.scope, null);
});
