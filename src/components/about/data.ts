/**
 * About's prose — the single source of truth for both the page and
 * llms.txt. Links are written as [label](url), already valid
 * markdown, so llms.txt uses these strings as-is; the page parses the
 * same syntax into real ProseLink components. Mirrors the *emphasis*
 * convention Experience's descriptions already use for the same
 * reason: one string, two renderers, never a second copy to drift.
 */
export const aboutParagraphs = [
  "Day to day, it’s product work, and the design system underneath it: the tokens, the components, the accessibility tooling that team leans on.",
  "Every job in industry has had the same shape: ship the thing, and make sure the system under it holds. It started with research: a video learning platform from undergrad turned into papers and two years of a Ph.D. at Carnegie Mellon, before I traded academia for industry. Seven years at [edX](https://edx.org) / [2U](https://2u.com) followed, leading [Paragon](https://paragon-openedx-v22.netlify.app) across the [Open edX](https://openedx.org) ecosystem and building edX for Business alongside it. Now it’s [MagicSchool AI](https://magicschool.ai), shipping product features, stewarding the design system, leading the accessibility work, and teaching AI coding agents to respect all of it.",
];
