import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import bear from "~/configs/bear";
import type { BearMdData } from "~/types";

/* ------------------------------------------------------------------
 * Bear App — ObsidianOS glassmorphism theme
 * Crimson accents, translucent surfaces, cinematic dark mode
 * ------------------------------------------------------------------ */

const CRIMSON = "#ff5545";
const CRIMSON_SOFT = "#ffb4aa";
const CRIMSON_GLOW = "rgba(255, 85, 69, 0.15)";
const CRIMSON_HEADING = "#ff6b5b"; // slightly lighter for better contrast on dark bg

interface ContentProps {
  contentID: string;
  contentURL: string;
}

interface MiddlebarProps {
  items: BearMdData[];
  cur: number;
  setContent: (id: string, url: string, index: number) => void;
}

interface SidebarProps {
  cur: number;
  setMidBar: (items: BearMdData[], index: number) => void;
}

interface BearState extends ContentProps {
  curSidebar: number;
  curMidbar: number;
  midbarList: BearMdData[];
}

const Highlighter = (dark: boolean): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  return {
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

const Sidebar = ({ cur, setMidBar }: SidebarProps) => {
  return (
    <div style={{ color: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '12px',
          gap: '10px',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <span
          className="i-ph:cloud-slash"
          style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', transition: 'color 0.15s' }}
        />
        <span
          className="i-ph:sliders-horizontal"
          style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', transition: 'color 0.15s' }}
        />
      </div>

      {/* Category List */}
      <ul style={{ listStyle: 'none', margin: 0, padding: '8px 10px', flex: 1, overflowY: 'auto' }}>
        {bear.map((item, index) => {
          const isActive = cur === index;
          return (
            <li
              key={`bear-sidebar-${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '38px',
                padding: '0 12px',
                borderRadius: '10px',
                cursor: 'default',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'white' : 'rgba(255,255,255,0.75)',
                background: isActive
                  ? `linear-gradient(135deg, ${CRIMSON}, rgba(255,85,69,0.7))`
                  : 'transparent',
                boxShadow: isActive
                  ? '0 4px 16px rgba(255,85,69,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                  : 'none',
                transition: 'all 0.2s ease',
                marginBottom: '4px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                }
              }}
              onClick={() => setMidBar(item.md, index)}
            >
              <span className={item.icon} style={{ fontSize: '17px', flexShrink: 0, opacity: isActive ? 1 : 0.8 }} />
              <span>{item.title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Middlebar = ({ items, cur, setContent }: MiddlebarProps) => {
  return (
    <div style={{ padding: '8px', height: '100%', overflowY: 'auto' }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item: BearMdData, index: number) => {
          const isActive = cur === index;
          return (
            <li
              key={`bear-midbar-${item.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '14px 16px 12px',
                borderRadius: '12px',
                cursor: 'default',
                background: isActive
                  ? 'rgba(255,255,255,0.1)'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(255,255,255,0.15)'
                  : '1px solid transparent',
                boxShadow: isActive
                  ? '0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
              onClick={() => setContent(item.id, item.file, index)}
            >
              {/* Active accent bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '24px',
                    borderRadius: '0 3px 3px 0',
                    background: CRIMSON,
                    boxShadow: `0 0 12px ${CRIMSON}`,
                  }}
                />
              )}

              {/* Title row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '6px',
                }}
              >
                {/* Icon in subtle circle */}
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive
                      ? `linear-gradient(135deg, ${CRIMSON}, rgba(255,85,69,0.7))`
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: isActive
                      ? `0 2px 8px rgba(255,85,69,0.3)`
                      : 'none',
                    flexShrink: 0,
                  }}
                >
                  <span
                    className={item.icon}
                    style={{
                      fontSize: '15px',
                      color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                    }}
                  />
                </div>

                {/* Title */}
                <span
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.98)',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </span>

                {/* Link icon */}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.45)',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = CRIMSON_SOFT;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                    }}
                  >
                    <span className="i-ph:arrow-up-right" style={{ fontSize: '14px' }} />
                  </a>
                )}
              </div>

              {/* Excerpt */}
              <div
                style={{
                  fontSize: '12px',
                  lineHeight: 1.5,
                  color: 'rgba(255,255,255,0.6)',
                  marginLeft: '40px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.excerpt}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const getRepoURL = (url: string) => {
  return url.slice(0, -10) + "/";
};

const fixImageURL = (text: string, contentURL: string): string => {
  text = text.replace(/&nbsp;/g, "");
  if (contentURL.indexOf("raw.githubusercontent.com") !== -1) {
    const repoURL = getRepoURL(contentURL);

    const imgReg = /!\[(.*?)\]\((.*?)\)/;
    const imgRegGlobal = /!\[(.*?)\]\((.*?)\)/g;

    const imgList = text.match(imgRegGlobal);

    if (imgList) {
      for (const img of imgList) {
        const imgURL = (img.match(imgReg) as Array<string>)[2];
        if (imgURL.indexOf("http") !== -1) continue;
        const newImgURL = repoURL + imgURL;
        text = text.replace(imgURL, newImgURL);
      }
    }
  }
  return text;
};

const Content = ({ contentID, contentURL }: ContentProps) => {
  const [storeMd, setStoreMd] = useState<{ [key: string]: string }>({});
  const dark = useStore((state) => state.dark);

  const fetchMarkdown = useCallback(
    (id: string, url: string) => {
      if (!storeMd[id]) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            storeMd[id] = fixImageURL(text, url);
            setStoreMd({ ...storeMd });
          })
          .catch((error) => { /* console.error(error) */ });
      }
    },
    [storeMd]
  );

  useEffect(() => {
    fetchMarkdown(contentID, contentURL);
  }, [contentID, contentURL, fetchMarkdown]);

  const headingStyles = {
  h1: { color: CRIMSON_HEADING, fontWeight: 700, marginTop: '1.5em', marginBottom: '0.4em', fontSize: '1.8rem', lineHeight: 1.3 },
  h2: { color: CRIMSON_HEADING, fontWeight: 600, marginTop: '1.4em', marginBottom: '0.35em', fontSize: '1.5rem', lineHeight: 1.35 },
  h3: { color: CRIMSON_SOFT, fontWeight: 600, marginTop: '1.3em', marginBottom: '0.3em', fontSize: '1.25rem', lineHeight: 1.4 },
  h4: { color: CRIMSON_SOFT, fontWeight: 600, marginTop: '1.2em', marginBottom: '0.25em', fontSize: '1.1rem', lineHeight: 1.4 },
};

return (
    <div
      className="markdown"
      style={{
        width: '66.666%',
        maxWidth: '720px',
        margin: '0 auto',
        padding: '32px 40px',
        color: 'rgba(255,255,255,0.88)',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
        ]}
        components={{
          ...Highlighter(dark as boolean),
          h1: ({ children, ...props }) => <h1 style={{ ...headingStyles.h1, ...props }}>{children}</h1>,
          h2: ({ children, ...props }) => <h2 style={{ ...headingStyles.h2, ...props }}>{children}</h2>,
          h3: ({ children, ...props }) => <h3 style={{ ...headingStyles.h3, ...props }}>{children}</h3>,
          h4: ({ children, ...props }) => <h4 style={{ ...headingStyles.h4, ...props }}>{children}</h4>,
        }}
      >
        {storeMd[contentID]}
      </ReactMarkdown>
    </div>
  );
};

const Bear = () => {
  const [state, setState] = useState<BearState>({
    curSidebar: 0,
    curMidbar: 0,
    midbarList: bear[0].md,
    contentID: bear[0].md[0].id,
    contentURL: bear[0].md[0].file
  });

  const setMidBar = (items: BearMdData[], index: number) => {
    setState({
      curSidebar: index,
      curMidbar: 0,
      midbarList: items,
      contentID: items[0].id,
      contentURL: items[0].file
    });
  };

  const setContent = (id: string, url: string, index: number) => {
    setState({
      ...state,
      curMidbar: index,
      contentID: id,
      contentURL: url
    });
  };

  return (
    <div
      className="bear font-avenir"
      style={{ display: 'flex', height: '100%', overflow: 'hidden' }}
    >
      {/* Sidebar - Dark glass */}
      <div
        style={{
          width: '180px',
          flexShrink: 0,
          overflowY: 'auto',
          background: 'rgba(15, 15, 17, 0.9)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Sidebar cur={state.curSidebar} setMidBar={setMidBar} />
      </div>

      {/* Middlebar - Medium glass */}
      <div
        style={{
          width: '260px',
          flexShrink: 0,
          overflowY: 'auto',
          background: 'rgba(22, 22, 24, 0.85)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Middlebar
          items={state.midbarList}
          cur={state.curMidbar}
          setContent={setContent}
        />
      </div>

      {/* Content - Light glass with subtle cosmic feel */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'rgba(14, 14, 16, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <Content contentID={state.contentID} contentURL={state.contentURL} />
      </div>
    </div>
  );
};

export default Bear;
