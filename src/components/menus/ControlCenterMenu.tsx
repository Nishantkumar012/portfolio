import React from "react";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import { motion } from "framer-motion";
import music from "~/configs/music";

interface SliderProps {
  icon: string;
  value: number;
  setValue: (value: number) => void;
}

const SliderComponent = ({ icon, value, setValue }: SliderProps) => (
  <div className="slider flex">
    <div className="size-7 flex-center bg-c-100" border="t l b c-300 rounded-l-full">
      <span className={icon} text="xs c-500" />
    </div>
    <Slider
      min={1}
      max={100}
      value={value}
      tooltip={false}
      orientation="horizontal"
      onChange={(v: number) => setValue(v)}
    />
  </div>
);

interface CCMProps {
  toggleControlCenter: () => void;
  toggleAudio: (target: boolean) => void;
  setBrightness: (value: number) => void;
  setVolume: (value: number) => void;
  playing: boolean;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function ControlCenterMenu({
  toggleControlCenter,
  toggleAudio,
  setBrightness,
  setVolume,
  playing,
  btnRef
}: CCMProps) {
  const controlCenterRef = useRef<HTMLDivElement>(null);
  const { dark, wifi, brightness, bluetooth, airdrop, fullscreen, volume, focusMode } = useStore(
    (state) => ({
      dark: state.dark,
      wifi: state.wifi,
      brightness: state.brightness,
      bluetooth: state.bluetooth,
      airdrop: state.airdrop,
      fullscreen: state.fullscreen,
      volume: state.volume,
      focusMode: state.focusMode
    })
  );

  const { toggleWIFI, toggleBluetooth, toggleAirdrop, toggleDark, toggleFullScreen, toggleFocus } =
    useStore((state) => ({
      toggleWIFI: state.toggleWIFI,
      toggleBluetooth: state.toggleBluetooth,
      toggleAirdrop: state.toggleAirdrop,
      toggleDark: state.toggleDark,
      toggleFullScreen: state.toggleFullScreen,
      toggleFocus: state.toggleFocus
    }));

  useClickOutside(controlCenterRef, toggleControlCenter, [btnRef]);

  return (
    <motion.div
      className="w-80 h-auto max-w-full p-2.5 text-c-black"
      pos="fixed top-8 right-0 sm:right-1.5"
      grid="~ cols-4 rows-auto gap-2"
      ref={controlCenterRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.7 }}
      style={{
        borderRadius: 'var(--radius-menu)',
        background: 'var(--lg-bg-menu)',
        backdropFilter: 'var(--lg-blur-menu)',
        WebkitBackdropFilter: 'var(--lg-blur-menu)',
        border: 'var(--lg-border)',
        boxShadow: 'var(--shadow-menu), var(--lg-inner-highlight)',
      }}
    >
      {/* Connectivity tile — Wi-Fi, Bluetooth, AirDrop */}
      <div className="cc-grid row-span-2 col-span-2 p-2.5 flex flex-col justify-around space-y-1">
        <div className="hstack space-x-2">
          <div className={`${wifi ? "cc-btn" : "cc-btn-active"}`} onClick={toggleWIFI}>
            <span className="i-ph:wifi-high text-base" />
          </div>
          <div p="t-0.5">
            <div className="font-medium leading-4" style={{ fontSize: '12px' }}>Wi-Fi</div>
            <div className="cc-text">{wifi ? "Home" : "Off"}</div>
          </div>
        </div>
        <div className="hstack space-x-2">
          <div
            className={`${bluetooth ? "cc-btn" : "cc-btn-active"}`}
            onClick={toggleBluetooth}
          >
            <span className="i-ph:bluetooth text-base" />
          </div>
          <div p="t-0.5">
            <div className="font-medium leading-4" style={{ fontSize: '12px' }}>Bluetooth</div>
            <div className="cc-text">{bluetooth ? "On" : "Off"}</div>
          </div>
        </div>
        <div className="hstack space-x-2">
          <div
            className={`${airdrop ? "cc-btn" : "cc-btn-active"}`}
            onClick={toggleAirdrop}
          >
            <span className="i-ph:rss text-base" />
          </div>
          <div p="t-0.5">
            <div className="font-medium leading-4" style={{ fontSize: '12px' }}>AirDrop</div>
            <div className="cc-text">{airdrop ? "Everyone" : "Off"}</div>
          </div>
        </div>
      </div>

      {/* Focus */}
      <div className="cc-grid col-span-2 p-2.5 flex flex-col justify-around space-y-2">
        <div className="hstack space-x-2.5 cursor-pointer" onClick={toggleFocus}>
          <div className={`${focusMode ? "cc-btn" : "cc-btn-active"}`}>
            <span className="i-ph:moon text-base" />
          </div>
          <div p="t-0.5">
            <div className="font-medium leading-4" style={{ fontSize: '12px' }}>Focus</div>
            <div className="cc-text">{focusMode ? "Do Not Disturb" : "Off"}</div>
          </div>
        </div>
        <div className="hstack space-x-2.5 cursor-pointer" onClick={toggleDark}>
          <div className={`${dark ? "cc-btn" : "cc-btn-active"}`}>
            {dark ? (
              <span className="i-ph:moon text-base" />
            ) : (
              <span className="i-ph:sun text-base" />
            )}
          </div>
          <div font-medium style={{ fontSize: '12px' }}>{dark ? "Dark Mode" : "Light Mode"}</div>
        </div>
      </div>

      {/* Keyboard Brightness + Fullscreen */}
      <div className="cc-grid flex-center flex-col cursor-pointer py-2">
        <span className="i-ph:sun text-xl" />
        <span text="xs center" font="leading-3.5" style={{ marginTop: '4px' }}>
          Keyboard Brightness
        </span>
      </div>
      <div
        className="cc-grid flex-center flex-col cursor-pointer py-2"
        onClick={() => toggleFullScreen(!fullscreen)}
      >
        {fullscreen ? (
          <span className="i-ph:arrows-in text-base" />
        ) : (
          <span className="i-ph:arrows-out text-base" />
        )}
        <span text="xs center" font="leading-3.5" m="t-1.5">
          {fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </span>
      </div>

      {/* Stage Manager + Screen Mirroring */}
      <div className="cc-grid flex-center flex-col cursor-pointer py-2">
        <span className="i-ph:squares-four text-base" />
        <span text="xs center" font="leading-3.5" m="t-1.5">
          Stage Manager
        </span>
      </div>
      <div className="cc-grid flex-center flex-col cursor-pointer py-2">
        <span className="i-ph:screencast text-base" />
        <span text="xs center" font="leading-3.5" m="t-1.5">
          Screen Mirroring
        </span>
      </div>

      {/* Display Slider */}
      <div className="cc-grid col-span-4 px-2.5 py-2 space-y-1 flex flex-col justify-around">
        <span className="font-medium ml-0.5" style={{ fontSize: '12px' }}>Display</span>
        <SliderComponent icon="i-ph:sun" value={brightness} setValue={setBrightness} />
      </div>

      {/* Sound Slider */}
      <div className="cc-grid col-span-4 px-2.5 py-2 space-y-1 flex flex-col justify-around">
        <span className="font-medium ml-0.5" style={{ fontSize: '12px' }}>Sound</span>
        <SliderComponent icon="i-ph:speaker-high" value={volume} setValue={setVolume} />
      </div>

      {/* Now Playing */}
      <div className="player cc-grid col-span-4 hstack space-x-2.5" p="y-2 l-2 r-4">
        <img
          className="w-12 rounded-lg"
          src={music.cover}
          alt="cover art"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
        />
        <div flex-1>
          <div className="font-medium" style={{ fontSize: '12px' }}>{music.title}</div>
          <div className="cc-text">{music.artist}</div>
        </div>
        {playing ? (
          <span className="i-ph:pause-fill text-2xl play cursor-pointer" onClick={() => toggleAudio(false)} />
        ) : (
          <span className="i-ph:play-fill text-2xl pause cursor-pointer" onClick={() => toggleAudio(true)} />
        )}
      </div>

      {/* Edit Controls */}
      <div className="col-span-4 flex-center pt-0.5 pb-0.5">
        <button
          className="hstack space-x-1 cursor-pointer"
          style={{
            background: "none",
            border: "none",
            color: "var(--color-c-500, rgba(0,0,0,0.45))",
            fontSize: "11px",
            padding: "2px 8px",
          }}
        >
          <span className="i-ph:sliders text-sm" />
          <span>Edit Controls</span>
        </button>
      </div>
    </motion.div>
  );
}
