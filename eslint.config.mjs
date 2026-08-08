import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  {
    ignores: [".next/**", "out/**", "src/generated/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Static export (`output: "export"`) has no image optimizer;
      // plain <img> with explicit dimensions and hand-built srcsets
      // is the intended pattern here.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
