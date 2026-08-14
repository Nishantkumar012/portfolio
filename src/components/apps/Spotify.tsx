import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import user from "~/configs/user";

// ─── Song data ──────────────────────────────────────────────────────────────
// Same tracks as Akash's clone, stored locally in public/songs/
const SONGS = [
  {
    id: "1",
    title: "Opening 1 - Hero's Come Back",
    artist: "Naruto Shippuden",
    album: "Naruto Shippuden OST",
    cover: "/songs/heros-cover.jpg",
    src: "/songs/heros-come-back.mp3",
  },
  {
    id: "2",
    title: "Sadness and Sorrow (Full Version)",
    artist: "Naruto Soundtrack",
    album: "Naruto Soundtrack",
    cover: "/songs/sadness-cover.jpg",
    src: "/songs/sadness-and-sorrow.mp3",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const fmtPercent = (pct: number, dur: number) => {
  const sec = Math.floor((pct / 100) * dur);
  return fmt(sec);
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function Spotify() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const song = SONGS[activeIdx];

  // Sync audio element state
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      if (el.duration && el.duration !== Infinity) {
        setDuration(el.duration);
        setCurrentTime(el.currentTime);
        setProgress((el.currentTime / el.duration) * 100);
      }
    };
    const onEnd = () => goNext();
    const onLoaded = () => { if (el.duration && el.duration !== Infinity) setDuration(el.duration); };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    el.addEventListener("loadedmetadata", onLoaded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  // Change song src when activeIdx changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.src = song.src;
    el.load();
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    if (playing) el.play().catch(() => {});
  }, [activeIdx]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); }
    else { el.play().catch(() => {}); }
    setPlaying(!playing);
  };

  const goNext = () => {
    const next = (activeIdx + 1) % SONGS.length;
    setActiveIdx(next);
    setPlaying(true);
  };

  const goPrev = () => {
    if (currentTime > 3) {
      // restart current song
      if (audioRef.current) { audioRef.current.currentTime = 0; }
      setCurrentTime(0);
      setProgress(0);
      return;
    }
    const prev = (activeIdx - 1 + SONGS.length) % SONGS.length;
    setActiveIdx(prev);
    setPlaying(true);
  };

  const seek = (pct: number) => {
    const el = audioRef.current;
    if (!el || !el.duration || el.duration === Infinity) return;
    el.currentTime = (pct / 100) * el.duration;
    setProgress(pct);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#121212",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
        color: "#fff",
        fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto" />

      {/* ── Main content area ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            background: "#000000",
            display: "flex",
            flexDirection: "column",
            padding: "12px 8px",
            gap: 4,
          }}
        >
          {/* Navigation */}
          {[
            { icon: "i-ph:house-fill", label: "Home" },
            { icon: "i-ph:magnifying-glass", label: "Search" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: label === "Home" ? "#fff" : "#a7a7a7",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 6,
                width: "100%",
                textAlign: "left",
              }}
            >
              <span className={icon} style={{ width: 22, height: 22, flexShrink: 0 }} />
              {label}
            </button>
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: "#282828", margin: "8px 8px" }} />

          {/* Your Library header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 12px 8px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#a7a7a7", letterSpacing: 0.3 }}>
              Your Library
            </span>
            <span className="i-ph:plus" style={{ width: 18, height: 18, color: "#a7a7a7", cursor: "pointer" }} />
          </div>

          {/* Playlists */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, padding: "0 4px" }}>
            {/* Profile-based playlist */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveIdx(0)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px",
                borderRadius: 6,
                cursor: "pointer",
                background: "rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 4,
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #1ed760 0%, #169c46 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={user.avatar}
                  alt=""
                  style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.name.split(" ")[0]}'s Favorites
                </div>
                <div style={{ fontSize: 11, color: "#a7a7a7", marginTop: 2 }}>Playlist</div>
              </div>
            </motion.div>

            {/* Liked Songs (static, like Akash's) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px",
                borderRadius: 6,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 4,
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #450af5, #c4efd9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="i-ph:heart-fill" style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Liked Songs
                </div>
                <div style={{ fontSize: 11, color: "#a7a7a7", marginTop: 2 }}>Playlist</div>
              </div>
            </div>
          </div>

          {/* Profile at bottom */}
          <div style={{ borderTop: "1px solid #282828", padding: "10px 8px 4px", display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={user.avatar}
              alt=""
              style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", background: "#282828" }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{user.name}</span>
          </div>
        </div>

        {/* ── Main ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {/* Playlist header */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 28 }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                flexShrink: 0,
                background: "linear-gradient(135deg, #1ed760 0%, #169c46 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src={user.avatar}
                alt=""
                style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Playlist
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginTop: 4 }}>
                {user.name.split(" ")[0]}'s Favorites
              </div>
              <div style={{ fontSize: 13, color: "#a7a7a7", marginTop: 6 }}>
                {user.name} &middot; {SONGS.length} songs
              </div>
            </div>
          </div>

          {/* Play button row */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { if (!playing) togglePlay(); else { audioRef.current?.pause(); setPlaying(false); } }}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#1ed760",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(30,215,96,0.3)",
              }}
            >
              <span
                className={playing ? "i-ph:pause-fill" : "i-ph:play-fill"}
                style={{ width: 22, height: 22, color: "#000", marginLeft: playing ? 0 : 2 }}
              />
            </motion.button>
          </div>

          {/* Track list header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 1fr 60px",
              gap: 12,
              padding: "0 12px 8px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              fontSize: 11,
              fontWeight: 500,
              color: "#a7a7a7",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span style={{ textAlign: "right" }}>
              <span className="i-ph:clock" style={{ width: 14, height: 14 }} />
            </span>
          </div>

          {/* Tracks */}
          {SONGS.map((track, i) => {
            const isActive = i === activeIdx;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { setActiveIdx(i); setPlaying(true); }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr 1fr 60px",
                  gap: 12,
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* # or playing indicator */}
                <span
                  style={{
                    fontSize: 14,
                    color: isActive ? "#1ed760" : "#a7a7a7",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isActive && playing ? (
                    <span className="i-ph:speaker-simple-high" style={{ width: 14, height: 14 }} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </span>

                {/* Title + cover */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <img
                    src={track.cover}
                    alt=""
                    style={{ width: 40, height: 40, borderRadius: 4, objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: isActive ? "#1ed760" : "#fff",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {track.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#a7a7a7",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginTop: 2,
                      }}
                    >
                      {track.artist}
                    </div>
                  </div>
                </div>

                {/* Album */}
                <span style={{ fontSize: 13, color: "#a7a7a7", display: "flex", alignItems: "center" }}>
                  {track.album}
                </span>

                {/* Duration */}
                <span style={{ fontSize: 13, color: "#a7a7a7", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  {/* Will show actual duration once loaded */}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom player bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 16px",
          background: "#181818",
          borderTop: "1px solid #282828",
          height: 72,
          flexShrink: 0,
        }}
      >
        {/* Track info (left) */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, width: 200, minWidth: 0 }}>
          <img
            src={song.cover}
            alt=""
            style={{ width: 44, height: 44, borderRadius: 4, objectFit: "cover", flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {song.title}
            </div>
            <div style={{ fontSize: 11, color: "#a7a7a7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {song.artist}
            </div>
          </div>
        </div>

        {/* Controls + progress (center) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={goPrev}
              style={{ background: "none", border: "none", color: "#a7a7a7", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
            >
              <span className="i-ph:skip-back-fill" style={{ width: 18, height: 18 }} />
            </button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className={playing ? "i-ph:pause-fill" : "i-ph:play-fill"}
                style={{ width: 16, height: 16, color: "#000", marginLeft: playing ? 0 : 1.5 }}
              />
            </motion.button>
            <button
              onClick={goNext}
              style={{ background: "none", border: "none", color: "#a7a7a7", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
            >
              <span className="i-ph:skip-forward-fill" style={{ width: 18, height: 18 }} />
            </button>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 500 }}>
            <span style={{ fontSize: 10, color: "#a7a7a7", minWidth: 36, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              {fmt(currentTime)}
            </span>
            <div
              style={{ flex: 1, height: 4, background: "#4d4d4d", borderRadius: 2, cursor: "pointer", position: "relative" }}
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                seek(Math.max(0, Math.min(100, pct)));
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: playing ? "#1ed760" : "#fff",
                  borderRadius: 2,
                  transition: "width 0.2s linear",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: -5,
                    top: -3,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: 0,
                    transition: "opacity 0.15s",
                  }}
                  className="progress-dot"
                />
              </div>
            </div>
            <span style={{ fontSize: 10, color: "#a7a7a7", minWidth: 36, fontVariantNumeric: "tabular-nums" }}>
              {duration ? fmt(duration) : "0:00"}
            </span>
          </div>
        </div>

        {/* Volume (right) */}
        <div style={{ width: 140, display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setVolume(volume === 0 ? 80 : 0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
          >
            <span
              className={volume === 0 ? "i-ph:speaker-simple-slash" : volume < 50 ? "i-ph:speaker-simple-low" : "i-ph:speaker-simple-high"}
              style={{ width: 16, height: 16, color: "#a7a7a7" }}
            />
          </button>
          <div
            style={{ flex: 1, height: 4, background: "#4d4d4d", borderRadius: 2, cursor: "pointer" }}
            onClick={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setVolume(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
            }}
          >
            <div style={{ width: `${volume}%`, height: "100%", background: "#fff", borderRadius: 2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
