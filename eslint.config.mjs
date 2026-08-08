import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [".next/**", "out/**", "src/generated/**", "next-env.d.ts"],
  },
  ...coreWebVitals,
  ...typescript,
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
