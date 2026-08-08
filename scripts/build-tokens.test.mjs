import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { generateCss } from "./build-tokens.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

test("resolves aliases through primitives", () => {
  const css = generateCss({
    color: { cobalt: { 600: { $type: "color", $value: "#1435e5" } } },
    semantic: {
      accent: { $type: "color", $value: "{color.cobalt.600}" },
    },
  });
  assert.match(css, /--accent: #1435e5;/);
});

test("dark extensions emit into the .dark block only", () => {
  const css = generateCss({
    semantic: {
      paper: {
        $type: "color",
        $value: "#ffffff",
        $extensions: { "dev.adamstankiewicz.dark": "#0d0e11" },
      },
      line: { $type: "color", $value: "#e7e7e9" },
    },
  });
  const [lightBlock, darkBlock] = css.split(".dark {");
  assert.match(lightBlock, /--paper: #ffffff;/);
  assert.match(darkBlock, /--paper: #0d0e11;/);
  assert.doesNotMatch(darkBlock, /--line:/);
});

test("group prefixes map to the right custom-property names", () => {
  const css = generateCss({
    font: { mono: { $type: "fontFamily", $value: "monospace" } },
    radius: { sm: { $type: "dimension", $value: "6px" } },
    duration: { fast: { $type: "duration", $value: "120ms" } },
    easing: { out: { $type: "cubicBezier", $value: "ease-out" } },
  });
  assert.match(css, /--font-mono: monospace;/);
  assert.match(css, /--radius-sm: 6px;/);
  assert.match(css, /--dur-fast: 120ms;/);
  assert.match(css, /--ease-out: ease-out;/);
});

test("unresolvable aliases throw", () => {
  assert.throws(
    () =>
      generateCss({
        semantic: { accent: { $type: "color", $value: "{color.missing}" } },
      }),
    /Unresolvable token alias/
  );
});

test("hc extensions emit into the prefers-contrast media block", () => {
  const css = generateCss({
    semantic: {
      ink: {
        $type: "color",
        $value: "#131316",
        $extensions: {
          "dev.adamstankiewicz.dark": "#f1f1f3",
          "dev.adamstankiewicz.hc": "#000000",
          "dev.adamstankiewicz.dark-hc": "#ffffff",
        },
      },
    },
  });
  const [base, contrastBlock] = css.split("@media (prefers-contrast: more)");
  assert.doesNotMatch(base, /--ink: #000000;/);
  const [hcLight, hcDark] = contrastBlock.split(".dark {");
  assert.match(hcLight, /--ink: #000000;/);
  assert.match(hcDark, /--ink: #ffffff;/);
  // The same variants back the manual toggle classes.
  assert.match(css, /\n\.hc \{\n  --ink: #000000;\n\}/);
  assert.match(css, /\n\.dark\.hc \{\n  --ink: #ffffff;\n\}/);
});

test("shared bases and repeated aliases are not misread as cycles", () => {
  const css = generateCss({
    color: { base: { $type: "color", $value: "#1435e5" } },
    semantic: {
      x: { $type: "color", $value: "{color.base}" },
      y: { $type: "color", $value: "{color.base}" },
      // Diamond: both branches resolve through {color.base}.
      pair: { $type: "shadow", $value: "{semantic.x} {semantic.y}" },
      // The same alias twice within one value.
      twice: { $type: "shadow", $value: "{color.base} {color.base}" },
    },
  });
  assert.match(css, /--pair: #1435e5 #1435e5;/);
  assert.match(css, /--twice: #1435e5 #1435e5;/);
});

test("circular aliases throw instead of recursing forever", () => {
  assert.throws(
    () =>
      generateCss({
        semantic: {
          a: { $type: "color", $value: "{semantic.b}" },
          b: { $type: "color", $value: "{semantic.a}" },
        },
      }),
    /Circular token alias/
  );
});

test("the real token source generates the committed tokens.css (drift gate)", () => {
  const tokens = JSON.parse(
    readFileSync(join(root, "tokens", "tokens.json"), "utf8")
  );
  const committed = readFileSync(
    join(root, "src", "styles", "tokens.css"),
    "utf8"
  );
  assert.equal(generateCss(tokens), committed);
});
