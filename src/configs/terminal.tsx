import type { TerminalData } from "~/types";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "about-me",
        title: "intro.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>
              Hi, this is Nishant Kumar. I am a B.Tech student at the Computer Science and
              Engineering department of Dr. B.R. Ambedkar National Institute of Technology, Jalandhar (NIT Jalandhar).
            </div>
          </div>
        )
      },
      {
        id: "about-interests",
        title: "interests.txt",
        type: "file",
        content: "Full Stack Development / React & Node.js / DSA (300+ problems) / Cloud & DevOps"
      },
      {
        id: "about-who-cares",
        title: "who-cares.txt",
        type: "file",
        content:
          "I'm looking for an SDE internship. I'm open to collaboration on full stack projects."
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            <li>
              Email:{" "}
              <a
                className="text-blue-300"
                href="mailto:nishant64563@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                nishant64563@gmail.com
              </a>
            </li>
            <li>
              Github:{" "}
              <a
                className="text-blue-300"
                href="https://github.com/Nishantkumar012"
                target="_blank"
                rel="noreferrer"
              >
                @Nishantkumar012
              </a>
            </li>
            <li>
              Linkedin:{" "}
              <a
                className="text-blue-300"
                href="https://www.linkedin.com/in/nishant-kumar-534434352/"
                target="_blank"
                rel="noreferrer"
              >
                nishant-kumar
              </a>
            </li>
            <li>
              LeetCode:{" "}
              <a
                className="text-blue-300"
                href="https://leetcode.com/u/paradoxmr123/"
                target="_blank"
                rel="noreferrer"
              >
                paradoxmr123
              </a>
            </li>
            <li>
              X:{" "}
              <a
                className="text-blue-300"
                href="https://x.com/Nishant82407675"
                target="_blank"
                rel="noreferrer"
              >
                find me on x.com
              </a>
            </li>
          </ul>
        )
      }
    ]
  },
  {
    id: "about-dream",
    title: "my-dream.cpp",
    type: "file",
    content: (
      <div className="py-1">
        <div>
          <span className="text-yellow-400">while</span>(
          <span className="text-blue-400">sleeping</span>) <span>{"{"}</span>
        </div>
        <div>
          <span className="text-blue-400 ml-9">money</span>
          <span className="text-yellow-400">++</span>;
        </div>
        <div>
          <span>{"}"}</span>
        </div>
      </div>
    )
  }
];

export default terminal;
