import { earlierWork, experiences } from "@/components/experience/data";
import { projects } from "@/components/projects/data";
import { publications } from "@/components/research/data";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * llms.txt, generated at build time from the same data modules the
 * pages render from — there is no second copy of any of this content
 * to keep in sync.
 */
export function GET() {
  const lines = [
    "# Adam Stankiewicz",
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## Experience",
    "",
    ...experiences.map(
      (experience) =>
        `- ${experience.company} (${experience.period}), ${experience.positions[0]?.title}: ${experience.description}`
    ),
    `- ${earlierWork.description} (${earlierWork.period})`,
    "",
    "## Selected work",
    "",
    ...projects.map(
      (project) =>
        `- ${project.title}${project.href ? ` (${project.href})` : ""}: ${project.description}`
    ),
    "",
    "## Publications",
    "",
    ...publications.map(
      (publication) =>
        `- ${publication.title} — ${publication.authors}, ${publication.venue} ${publication.year}${publication.href ? ` (${publication.href})` : ""}`
    ),
    "",
    "## Links",
    "",
    `- [Site](${SITE_URL})`,
    `- [Résumé (PDF)](${SITE_URL}/pdfs/Adam_Stankiewicz_Resume.pdf)`,
    "- [GitHub](https://github.com/adamstankiewicz)",
    "- [LinkedIn](https://linkedin.com/in/stankiewiczadam)",
    "- [Google Scholar](https://scholar.google.com/citations?user=lJSHz8QAAAAJ)",
    "- [Site source](https://github.com/adamstankiewicz/personal-site)",
    "",
    "Contact: agstanki@gmail.com",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
