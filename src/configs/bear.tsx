import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-ph:paw-print",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-ph:shield-star",
        excerpt: "Hey there! I'm Nishant Kumar, a full stack developer..."
      },
      {
        id: "github-stats",
        title: "Github Stats",
        file: "markdown/github-stats.md",
        icon: "i-fa6-brands:github",
        excerpt: "Here are some stats about my github account..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-ph:browser",
        excerpt: "Something about this personal portfolio site..."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-ph:git-branch",
    md: [
      {
        id: "wedraw",
        title: "WeDraw",
        file: "https://raw.githubusercontent.com/Nishantkumar012/wedraw/main/README.md",
        icon: "i-ph:pen",
        excerpt: "A real-time collaborative whiteboard application...",
        link: "https://github.com/Nishantkumar012/wedraw"
      },
      {
        id: "splitzy",
        title: "Splitzy",
        file: "https://raw.githubusercontent.com/Nishantkumar012/split-free/main/README.md",
        icon: "i-ph:calculator",
        excerpt: "A full-stack group expense management application...",
        link: "https://github.com/Nishantkumar012/split-free"
      },
      {
        id: "portfolio-macos",
        title: "Portfolio macOS",
        file: "https://raw.githubusercontent.com/Nishantkumar012/macOS-Portfolio/main/README.md",
        icon: "i-ph:desktop",
        excerpt: "My portfolio website simulating macOS's GUI...",
        link: "https://github.com/Nishantkumar012/macOS-Portfolio"
      }
    ]
  }
];

export default bear;
