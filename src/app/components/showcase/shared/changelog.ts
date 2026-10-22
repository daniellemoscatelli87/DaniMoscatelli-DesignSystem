export type ChangeKind = "New" | "Updated" | "Removed";

export type ChangeEntry = {
  date: string;
  kind: ChangeKind;
  title: string;
  desc: string;
  page?: string;
  anchor?: string;
};

// Newest first. Add every new DS inclusion at the TOP of this list.
export const changelog: ChangeEntry[] = [
  {
    date: "Oct 2026", kind: "New", title: "What's New on Home",
    desc: "This log. Every addition to the design system is recorded here, newest first.",
    page: "overview", anchor: "whats-new",
  },
  {
    date: "Oct 2026", kind: "Updated", title: "Home refreshed",
    desc: "Rewritten for vibe coders and AI tools, with a map of every section in the system.",
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: "Design Principles as a timeline",
    desc: "A vertical timeline with cards alternating left and right on desktop, and a single rail on mobile.",
    page: "principles",
  },
  {
    date: "Oct 2026", kind: "New", title: "Home in the sidebar",
    desc: "Home is now the first item in the Start group, above Get Started.",
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Removed", title: "Posts & Carousels",
    desc: "Removed from the menu to keep the system focused on product interfaces.",
  },
  {
    date: "Oct 2026", kind: "Updated", title: "Single-line header",
    desc: "Icon, Dani Moscatelli, a divider and a shimmering Design System label on one line.",
  },
  {
    date: "Oct 2026", kind: "New", title: "Guidelines: Usability and Accessibility",
    desc: "Action hierarchy, target sizes, microcopy, contrast, focus, keyboard and ARIA, each with a checklist.",
    page: "usability",
  },
  {
    date: "Oct 2026", kind: "New", title: "Start group",
    desc: "Get Started, Design Principles and Develop sit at the top of the menu, above Brand.",
    page: "get-started",
  },
];
