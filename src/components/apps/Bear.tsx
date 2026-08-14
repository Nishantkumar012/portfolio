import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import bear from "~/configs/bear";
import type { BearMdData } from "~/types";

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
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '12px',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <span
          className="i-ph:cloud-slash"
          style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'color 0.15s' }}
        />
        <span
          className="i-ph:sliders-horizontal"
          style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'color 0.15s' }}
        />
      </div>

      {/* Category List */}
      <ul style={{ listStyle: 'none', margin: 0, padding: '4px 8px', flex: 1, overflowY: 'auto' }}>
        {bear.map((item, index) => {
          const isActive = cur === index;
          return (
            <li
              key={`bear-sidebar-${item.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: '36px',
                padding: '0 10px',
                borderRadius: '8px',
                cursor: 'default',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(255,59,48,0.85), rgba(255,59,48,0.6))'
                  : 'transparent',
                transition: 'all 0.15s ease',
                marginBottom: '2px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
              onClick={() => setMidBar(item.md, index)}
            >
              <span className={item.icon} style={{ fontSize: '16px', flexShrink: 0 }} />
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
    <div style={{ padding: '6px', height: '100%', overflowY: 'auto' }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item: BearMdData, index: number) => {
          const isActive = cur === index;
          return (
            <li
              key={`bear-midbar-${item.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '12px 14px 10px',
                borderRadius: '10px',
                cursor: 'default',
                background: isActive
                  ? 'var(--c-bg, white)'
                  : 'transparent',
                boxShadow: isActive
                  ? '0 1px 4px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)'
                  : 'none',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--c-bg, white) 60%, transparent)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
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
                    height: '20px',
                    borderRadius: '0 3px 3px 0',
                    background: 'var(--system-red, #FF3B30)',
                  }}
                />
              )}

              {/* Title row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                {/* Icon in subtle circle */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive
                      ? 'var(--system-red, #FF3B30)'
                      : 'var(--c-bg-tertiary, rgba(0,0,0,0.05))',
                    flexShrink: 0,
                  }}
                >
                  <span
                    className={item.icon}
                    style={{
                      fontSize: '14px',
                      color: isActive ? 'white' : 'var(--c-text-secondary, rgba(0,0,0,0.45))',
                    }}
                  />
                </div>

                {/* Title */}
                <span
                  style={{
                    flex: 1,
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'var(--c-text, #1c1c1e)',
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
                      width: '22px',
                      height: '22px',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--c-text-tertiary, rgba(0,0,0,0.3))',
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--c-bg-tertiary, rgba(0,0,0,0.05))';
                      e.currentTarget.style.color = 'var(--c-text, #1c1c1e)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--c-text-tertiary, rgba(0,0,0,0.3))';
                    }}
                  >
                    <span className="i-ph:arrow-up-right" style={{ fontSize: '13px' }} />
                  </a>
                )}
              </div>

              {/* Excerpt */}
              <div
                style={{
                  fontSize: '12px',
                  lineHeight: 1.45,
                  color: 'var(--c-text-secondary, rgba(0,0,0,0.45))',
                  marginLeft: '36px',
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

  return (
    <div
      className="markdown"
      style={{
        width: '66.666%',
        maxWidth: '700px',
        margin: '0 auto',
        padding: '24px 32px',
        color: 'var(--c-text-secondary, rgba(0,0,0,0.65))',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
        ]}
        components={Highlighter(dark as boolean)}
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
      {/* Sidebar */}
      <div
        style={{
          width: '176px',
          flexShrink: 0,
          overflowY: 'auto',
          background: 'var(--lg-bg-tinted)',
          backdropFilter: 'var(--lg-blur-menu)',
          WebkitBackdropFilter: 'var(--lg-blur-menu)',
          borderRight: '0.5px solid var(--c-border, rgba(0,0,0,0.1))',
        }}
      >
        <Sidebar cur={state.curSidebar} setMidBar={setMidBar} />
      </div>

      {/* Middlebar */}
      <div
        style={{
          width: '240px',
          flexShrink: 0,
          overflowY: 'auto',
          background: 'var(--c-bg-secondary, #f5f5f7)',
          borderRight: '0.5px solid var(--c-border, rgba(0,0,0,0.08))',
        }}
      >
        <Middlebar
          items={state.midbarList}
          cur={state.curMidbar}
          setContent={setContent}
        />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--c-bg, white)',
        }}
      >
        <Content contentID={state.contentID} contentURL={state.contentURL} />
      </div>
    </div>
  );
};

export default Bear;
