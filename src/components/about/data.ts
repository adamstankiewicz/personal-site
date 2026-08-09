/**
 * About's prose — the single source of truth for both the page and
 * llms.txt. Links are written as [label](url), already valid
 * markdown, so llms.txt uses these strings as-is; the page parses the
 * same syntax into real ProseLink components. Mirrors the *emphasis*
 * convention Experience's descriptions already use for the same
 * reason: one string, two renderers, never a second copy to drift.
 */
export const aboutParagraphs = [
  "Shipping features on a product team, and building the design system, the design tokens, and the accessibility tooling that team builds with.",
  "I started out in research. A video learning platform I built as an undergrad turned into published papers and two years of a Ph.D. at Carnegie Mellon before I traded the lab for industry. Seven years at [edX](https://edx.org) / [2U](https://2u.com) came first, leading [Paragon](https://paragon-openedx-v22.netlify.app) for the [Open edX](https://openedx.org) ecosystem while building edX for Business. Now it’s [MagicSchool AI](https://magicschool.ai): shipping features on a product squad, stewarding the design system, and leading the accessibility work — including teaching AI coding agents to respect all of it.",
];
