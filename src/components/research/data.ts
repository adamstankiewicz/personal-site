export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  href?: string;
}

export const publications: Publication[] = [
  {
    title:
      "Supporting Learners with Distributed Mentorship Teams in Massive Online Classes",
    authors: "A. Stankiewicz",
    venue: "CSCW '16 Workshop",
    year: "2016",
  },
  {
    title:
      "$1 Conversational Turn Detector: Measuring How Video Conversations Affect Student Learning in Online Classes",
    authors: "A. Stankiewicz, C. Kulkarni",
    venue: "ACM Learning @ Scale",
    year: "2016",
    href: "https://dl.acm.org/doi/10.1145/2876034.2876048",
  },
  {
    title:
      "The Evolution of TrACE: Integration of a Collaborative Learning Platform in Flipped Classrooms",
    authors: "S. L. Dazo, A. Stankiewicz, R. M. Gibbs, B. Dorn",
    venue: "CSCL",
    year: "2015",
  },
  {
    title:
      "Piloting TrACE: Exploring Spatiotemporal Anchored Collaboration in Asynchronous Learning",
    authors: "B. Dorn, L. B. Schroeder, A. Stankiewicz",
    venue: "ACM CSCW",
    year: "2015",
    href: "https://dl.acm.org/doi/10.1145/2675133.2675178",
  },
  {
    title:
      "Lost While Searching: Difficulties in Information Seeking Among End-User Programmers",
    authors: "B. Dorn, A. Stankiewicz, C. Roggi",
    venue: "ASIS&T Annual Meeting",
    year: "2013",
  },
];
