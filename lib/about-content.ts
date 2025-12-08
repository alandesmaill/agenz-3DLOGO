// Content data for About page sections

export interface Stat {
  value: string;
  label: string;
}

export const aboutContent = {
  hero: {
    headline: "WE CREATE PURPOSEFUL CREATIVE WORK THAT WORKS",
    subheading: "Award-winning agency specializing in advertising, video production, and strategic media.",
  },
  mission: {
    statement: "To create purposeful creative work that drives real business results through innovative storytelling and strategic execution.",
    stats: [
      { value: "15+", label: "Years Experience" },
      { value: "500+", label: "Projects Completed" },
      { value: "200+", label: "Happy Clients" },
      { value: "50+", label: "Industry Awards" },
    ] as Stat[],
  },
  team: {
    headline: "Meet Our Team",
    subheading: "Coming soon - our talented team members.",
  },
  cta: {
    headline: "Let's Create Something Amazing",
    buttonText: "Get in Touch",
  },
};
