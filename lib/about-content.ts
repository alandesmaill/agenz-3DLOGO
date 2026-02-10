// Content data for About page sections

export interface Stat {
  value: string;
  label: string;
}

export const aboutContent = {
  hero: {
    welcomeText: "WELCOME TO",
    brandName: "AGENZ",
    headline: "WE MASTER EVERYTHING FROM A TO Z!",
    subheading: "Award-winning agency specializing in advertising, video production, and strategic media.",
  },
  mission: {
    statement: "To create purposeful creative work that drives real business results through innovative storytelling and strategic execution.",
    stats: [
      { value: "10+", label: "Years Experience" },
      { value: "100+", label: "Projects Completed" },
      { value: "20+", label: "Happy Clients" },
      { value: "15+", label: "Industry Awards" },
    ] as Stat[],
  },
  cta: {
    headline: "Let's Create Something Amazing",
    buttonText: "Get in Touch",
  },
};
