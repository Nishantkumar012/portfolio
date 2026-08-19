import React from "react";
import { apps, launchpadApps } from "~/configs";
import { minMarginY, isFullScreen, enterFullScreen, exitFullScreen } from "~/utils";
import type { MacActions } from "~/types";
import DynamicIsland from "~/components/DynamicIsland";
import NotificationCenter from "~/components/NotificationCenter";
import AboutThisMacModal from "~/components/AboutThisMacModal";
import CalendarWidget from "~/components/widgets/CalendarWidget";
import WeatherWidget from "~/components/widgets/WeatherWidget";
import ContextMenu from "~/components/menus/ContextMenu";
import { FolderIcon, FolderHomeIcon, FolderDockIcon, PdfIcon } from "~/components/DesktopIcons";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "~/hooks";

interface DesktopState {
  showApps: { [key: string]: boolean };
  appsZ: { [key: string]: number };
  maxApps: { [key: string]: boolean };
  minApps: { [key: string]: boolean };
  maxZ: number;
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
  showNotificationCenter: boolean;
}

// Build the initial state map from apps config — includes ALL apps
function buildInitialState(): Pick<DesktopState, "showApps" | "appsZ" | "maxApps" | "minApps"> {
  const showApps: { [key: string]: boolean } = {};
  const appsZ: { [key: string]: number } = {};
  const maxApps: { [key: string]: boolean } = {};
  const minApps: { [key: string]: boolean } = {};
  apps.forEach((app) => {
    showApps[app.id] = !!app.show;
    appsZ[app.id] = 2;
    maxApps[app.id] = false;
    minApps[app.id] = false;
  });
  return { showApps, appsZ, maxApps, minApps };
}

const INITIAL = buildInitialState();

export default function Desktop(props: MacActions) {
  const [state, setState] = useState<DesktopState>({
    ...INITIAL,
    maxZ: 2,
    showLaunchpad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false,
    showNotificationCenter: false,
  });

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);
  const [showAboutMac, setShowAboutMac] = useState(false);

  const { isMobile } = useWindowSize();

  const handleLaunchpadAppClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    e.preventDefault();
    useStore.getState().setSafariUrl(link);
    window.dispatchEvent(new CustomEvent("launchpad:openSafari"));
  };

  // Open a URL inside the native Safari window (same mechanism Launchpad uses).
  const openInSafari = (link: string) => {
    useStore.getState().setSafariUrl(link);
    window.dispatchEvent(new CustomEvent("launchpad:openSafari"));
  };

  // Listen for cross-component events and global keyboard shortcuts
  useEffect(() => {
    const handleOpenSafari = () => {
      toggleLaunchpad(false);
      openApp("safari");
    };
    const handleOpenLaunchpad = () => toggleLaunchpad(true);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // System independent Command key (Cmd on Mac, Ctrl on Windows/Linux)
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Spotlight: Cmd/Ctrl + Space
      if (isCmdOrCtrl && e.code === 'Space') {
        e.preventDefault();
        toggleSpotlight();
      }

      // Full screen: Cmd/Ctrl + F OR F11
      if ((isCmdOrCtrl && e.key.toLowerCase() === 'f') || e.key === 'F11') {
        e.preventDefault();
        if (isFullScreen()) {
          exitFullScreen();
          useStore.getState().toggleFullScreen(false);
        } else {
          enterFullScreen();
          useStore.getState().toggleFullScreen(true);
        }
      }

    };

    window.addEventListener("launchpad:openSafari", handleOpenSafari);
    window.addEventListener("siri:openLaunchpad", handleOpenLaunchpad);
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("launchpad:openSafari", handleOpenSafari);
      window.removeEventListener("siri:openLaunchpad", handleOpenLaunchpad);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state]);  // re-bind when state updates so closures are fresh

  const toggleLaunchpad = (target: boolean): void => {
    setState((prev) => ({ ...prev, showLaunchpad: target }));
  };

  const toggleSpotlight = (): void => {
    setState((prev) => ({ ...prev, spotlight: !prev.spotlight }));
  };

  const toggleNotificationCenter = (): void => {
    setState((prev) => ({ ...prev, showNotificationCenter: !prev.showNotificationCenter }));
  };

  const setWindowPosition = (id: string): void => {
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty("--window-transform-x", (window.innerWidth + rect.x).toFixed(1) + "px");
    r.style.setProperty("--window-transform-y", (rect.y - minMarginY).toFixed(1) + "px");
  };

  const setAppMax = (id: string, target?: boolean): void => {
    setState((prev) => {
      const maxApps = { ...prev.maxApps };
      if (target === undefined) target = !maxApps[id];
      maxApps[id] = target!;
      return { ...prev, maxApps, hideDockAndTopbar: target! };
    });
  };

  const minimizeApp = (id: string): void => {
    setWindowPosition(id);
    const dock = document.querySelector(`#dock-${id}`) as HTMLElement;
    const win = document.querySelector(`#window-${id}`) as HTMLElement;
    if (!dock || !win) return;
    const dockRect = dock.getBoundingClientRect();
    const posY = window.innerHeight - win.offsetHeight / 2 - minMarginY;
    const posX = window.innerWidth + dockRect.x - win.offsetWidth / 2 + 25;
    win.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
    win.style.transition = "ease-out 0.3s";
    setState((prev) => ({ ...prev, minApps: { ...prev.minApps, [id]: true } }));
  };

  const closeApp = (id: string): void => {
    setState((prev) => ({
      ...prev,
      showApps: { ...prev.showApps, [id]: false },
      maxApps: { ...prev.maxApps, [id]: false },
      hideDockAndTopbar: false,
    }));
  };

  const openApp = (id: string): void => {
    const appDef = apps.find((a) => a.id === id);
    if (!appDef) {
      console.warn(`openApp: unknown app id "${id}"`);
      return;
    }

    setState((prev) => {
      const maxZ = prev.maxZ + 1;
      const showApps = { ...prev.showApps, [id]: true };
      const appsZ = { ...prev.appsZ, [id]: maxZ };

      // Un-minimize if needed
      const minApps = { ...prev.minApps };
      if (minApps[id]) {
        const win = document.querySelector(`#window-${id}`) as HTMLElement;
        if (win) {
          win.style.transform = `translate(${win.style.getPropertyValue("--window-transform-x")}, ${win.style.getPropertyValue("--window-transform-y")}) scale(1)`;
          win.style.transition = "ease-in 0.3s";
        }
        minApps[id] = false;
      }

      return {
        ...prev,
        showApps,
        appsZ,
        maxZ,
        minApps,
        currentTitle: appDef.title,
      };
    });
  };

  const renderAppWindows = () => {
    return apps.map((app) => {
      if (!app.desktop) return null;

      if (app.id === "siri" && state.showApps[app.id]) {
        return (
          <div
            key={`desktop-app-${app.id}`}
            className="fixed top-8 right-4 z-[1000] drop-shadow-2xl flex items-start justify-end"
          >
            {React.cloneElement(app.content as React.ReactElement, {
              closeSiri: () => closeApp("siri"),
            })}
          </div>
        );
      }

      if (!app.content) return null;

      const windowProps = {
        id: app.id,
        title: app.title,
        width: app.width,
        height: app.height,
        minWidth: app.minWidth,
        minHeight: app.minHeight,
        aspectRatio: app.aspectRatio,
        x: app.x,
        y: app.y,
        z: state.appsZ[app.id] ?? 2,
        max: state.maxApps[app.id] ?? false,
        min: state.minApps[app.id] ?? false,
        titlebar: app.titlebar,
        close: closeApp,
        setMax: setAppMax,
        setMin: minimizeApp,
        focus: openApp,
      };

      return (
        <AnimatePresence key={`desktop-app-${app.id}`}>
          {state.showApps[app.id] && (
            <AppWindow {...windowProps}>
              {app.content}
            </AppWindow>
          )}
        </AnimatePresence>
      );
    });
  };

  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ show: true, x: e.clientX, y: e.clientY });
  };

  // Desktop section shortcuts — About/Projects/Contact/Resume on the right
  // edge (mirrors the reference portfolio's desktop). Each opens the app that
  // best represents that section.
  const DESKTOP_SECTIONS = [
    { id: "about", label: "About Me", icon: "i-ph:user-focus", action: () => openApp("bear") },
    { id: "projects", label: "Projects", icon: "i-ph:briefcase", action: () => openInSafari("https://github.com/Nishantkumar012") },
    { id: "contact", label: "Contact", icon: "i-ph:envelope-simple", action: () => openApp("mail") },
    { id: "resume", label: "Resume", icon: "i-ph:file-text", action: () => openInSafari("/Nishant_nitj_resume.pdf") },
  ];

  return (
    <div
      className="size-full overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* Top Menu Bar */}
      <TopBar
        title={state.currentTitle}
        setLogin={props.setLogin}
        shutMac={props.shutMac}
        sleepMac={props.sleepMac}
        restartMac={props.restartMac}
        toggleSpotlight={toggleSpotlight}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
        openApp={openApp}
        toggleNotificationCenter={toggleNotificationCenter}
        showNotificationCenter={state.showNotificationCenter}
        openAboutMac={() => setShowAboutMac(true)}
      />

      {/* Dynamic Island */}
      <DynamicIsland currentApp={state.currentTitle} />

      {/* Desktop-pinned widgets — top-left, always visible, matches Tahoe ref */}
      <div
        style={{
          position: "fixed",
          top: 48,
          left: 16,
          zIndex: 55,
          display: "flex",
          flexDirection: "row",
          gap: 16,
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <CalendarWidget compact={false} />
        </div>
        <div style={{ pointerEvents: "auto" }}>
          <WeatherWidget compact={false} />
        </div>
      </div>

      {/* Desktop section shortcuts — right edge, vertically centered.
          Styled like macOS desktop icons: frosted tile + white label.
          (Window chrome renders above at zIndex 60.) */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: 24,
          transform: "translateY(-50%)",
          zIndex: 55,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {DESKTOP_SECTIONS.map((s, i) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.3, ease: "easeOut" }}
            onClick={() => s.action()}
            className="group flex flex-col items-center gap-2 w-[80px] p-2 rounded-xl transition-colors cursor-pointer select-none outline-none"
          >
            {/* Icon tile */}
            <div
              className="relative flex items-center justify-center overflow-hidden transition-all duration-200 bg-[rgba(26,27,38,0.6)] group-hover:bg-[rgba(26,27,38,0.85)] border border-white/15 group-hover:border-white/30"
              style={{
                width: 58,
                height: 58,
                borderRadius: 20,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {/* top glass highlight */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: 20,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 55%)",
                }}
              />
              <span
                className={s.icon}
                style={{
                  fontSize: 26,
                  color: "#fff",
                  filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
                  position: "relative",
                }}
              />
            </div>
            {/* Label */}
            <span
              className="px-1 text-center font-medium leading-tight"
              style={{
                fontSize: 13,
                color: "#fff",
                textShadow: "0 1px 3px rgba(0,0,0,0.85)",
              }}
            >
              {s.label}
            </span>
          </motion.button>
        ))}
      </div>

      {isMobile && (
        <div className="absolute top-[48px] left-0 right-0 bottom-24 p-6 grid grid-cols-4 gap-y-6 gap-x-2 content-start z-40">
          {apps.filter(a => !a.hideOnMobile && !a.dockOnMobile && a.id !== "launchpad").map(app => (
            <div key={app.id} className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => openApp(app.id)}>
              <div className="w-[60px] h-[60px] bg-transparent rounded-[22.5%] shadow-sm overflow-hidden flex items-center justify-center border border-black/5 dark:border-white/5">
                <img src={app.mobileImg || app.img} alt={app.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-white text-xs font-light text-center tracking-wide" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                {app.mobileTitle || app.title}
              </span>
            </div>
          ))}
          {launchpadApps.map(app => (
            <div key={app.id} className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={(e) => handleLaunchpadAppClick(e, app.link)}>
              <div className={`w-[60px] h-[60px] rounded-[22.5%] shadow-sm overflow-hidden flex items-center justify-center border border-black/10 dark:border-white/10 ${app.img.includes('skill-exchange') ? 'bg-black' : 'bg-white'}`}>
                <img src={app.mobileImg || app.img} alt={app.title} className="w-[60%] h-[60%] object-contain" />
              </div>
              <span className="text-white text-xs font-light text-center tracking-wide" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                {app.mobileTitle || app.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Desktop App Windows */}
      <div className="window-bound absolute" style={{ top: minMarginY, zIndex: 60, pointerEvents: "none" }}>
        {renderAppWindows()}
      </div>

      {/* About This Mac modal */}
      <AboutThisMacModal show={showAboutMac} onClose={() => setShowAboutMac(false)} />

      {/* Spotlight */}
      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}

      {/* Launchpad */}
      <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />

      {/* Notification Center */}
      <NotificationCenter
        show={state.showNotificationCenter}
        onClose={toggleNotificationCenter}
      />

      {/* Dock */}
      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />

      {/* Context Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        show={contextMenu.show}
        onClose={() => setContextMenu({ ...contextMenu, show: false })}
        openApp={openApp}
      />
    </div>
  );
}
