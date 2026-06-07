import { motion, AnimatePresence } from "framer-motion";

interface Photo {
  id: string;
  url: string;
  label: string;
  date: string;
  liked?: boolean;
}

// Using Picsum for placeholder photos
const PHOTOS: Photo[] = [
  { id: "1", url: "https://picsum.photos/seed/macos1/400/300", label: "Jodhpur Sunset", date: "Jun 1, 2025" },
  { id: "2", url: "https://picsum.photos/seed/macos2/400/300", label: "Mehrangarh Fort", date: "May 28, 2025", liked: true },
  { id: "3", url: "https://picsum.photos/seed/macos3/400/300", label: "Blue City", date: "May 20, 2025" },
  { id: "4", url: "https://picsum.photos/seed/macos4/400/300", label: "MBM Campus", date: "May 15, 2025", liked: true },
  { id: "5", url: "https://picsum.photos/seed/macos5/400/300", label: "Umaid Bhawan", date: "May 10, 2025" },
  { id: "6", url: "https://picsum.photos/seed/macos6/400/300", label: "Desert View", date: "Apr 30, 2025" },
  { id: "7", url: "https://picsum.photos/seed/macos7/400/300", label: "Portfolio Screenshot", date: "Apr 20, 2025" },
  { id: "8", url: "https://picsum.photos/seed/macos8/400/300", label: "Coding Session", date: "Apr 10, 2025" },
  { id: "9", url: "https://picsum.photos/seed/macos9/400/300", label: "Hackathon", date: "Apr 1, 2025" },
];

const ALBUMS = [
  { id: "recents", label: "Recents", icon: "i-ph:clock", count: 9 },
  { id: "favorites", label: "Favourites", icon: "i-ph:heart-fill", count: 2 },
  { id: "jodhpur", label: "Jodhpur", icon: "i-ph:castle-turret", count: 4 },
  { id: "projects", label: "Projects", icon: "i-ph:laptop", count: 2 },
  { id: "people", label: "People", icon: "i-ph:users", count: 3 },
];

export default function Photos() {
  const [photos, setPhotos] = useState(PHOTOS);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeAlbum, setActiveAlbum] = useState("recents");
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);

  const displayed =
    activeAlbum === "favorites" ? photos.filter((p) => p.liked) : photos;

  const toggleLike = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
    );
    if (viewPhoto?.id === id)
      setViewPhoto((prev) => prev && { ...prev, liked: !prev.liked });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: "var(--c-bg)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "180px",
          flexShrink: 0,
          background: "var(--lg-bg-tinted)",
          backdropFilter: "var(--lg-blur-light)",
          WebkitBackdropFilter: "var(--lg-blur-light)",
          borderRight: "var(--lg-border)",
          overflowY: "auto",
          padding: "8px 0",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "var(--c-text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            padding: "8px 14px 4px",
          }}
        >
          Library
        </div>
        {ALBUMS.map((album) => {
          const active = activeAlbum === album.id;
          return (
            <motion.button
              key={album.id}
              onClick={() => setActiveAlbum(album.id)}
              whileHover={{ x: 1 }}
              transition={{ duration: 0.12 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: active ? "var(--c-bg-tertiary)" : "transparent",
                border: "none",
                cursor: "pointer",
                width: "calc(100% - 12px)",
                margin: "1px 6px",
                borderRadius: "7px",
                transition: "background 0.15s ease",
                position: "relative",
              }}
            >
              {active && (
                <motion.div
                  layoutId="photos-sidebar-indicator"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: "2.5px",
                    borderRadius: "2px",
                    background: "var(--system-blue, #007AFF)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className={album.icon}
                style={{ width: "14px", height: "14px", flexShrink: 0, color: active ? "var(--system-blue, #007AFF)" : "var(--c-text-secondary)" }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: "13px",
                  color: active ? "var(--system-blue, #007AFF)" : "var(--c-text)",
                  fontWeight: active ? 600 : 500,
                  textAlign: "left",
                }}
              >
                {album.label}
              </span>
              <span style={{ fontSize: "11px", color: "var(--c-text-tertiary)" }}>
                {album.count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--c-bg)" }}>
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "0.5px solid var(--c-border)",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--c-text)",
          }}
        >
          {ALBUMS.find((a) => a.id === activeAlbum)?.label}
          <span
            style={{
              marginLeft: 8,
              fontSize: "12px",
              fontWeight: 400,
              color: "var(--c-text-tertiary)",
            }}
          >
            {displayed.length} items
          </span>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
            gap: "6px",
            alignContent: "start",
          }}
        >
          <AnimatePresence mode="popLayout">
          {displayed.map((photo, i) => (
            <motion.div
              key={photo.id}
              layout
              className="photo-thumb"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ delay: i * 0.025, duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => setViewPhoto(photo)}
              style={{
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "default",
                aspectRatio: "4/3",
                outline: selected === photo.id ? "2.5px solid var(--system-blue, #007AFF)" : "2.5px solid transparent",
                outlineOffset: "1px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                transition: "outline-color 0.15s ease",
              }}
              whileHover={{ scale: 1.03, boxShadow: "0 6px 18px rgba(0,0,0,0.2)" }}
              onMouseDown={() => setSelected(photo.id)}
            >
              <img
                src={photo.url}
                alt={photo.label}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
              {/* hover label */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "6px 8px",
                }}
                className="photo-hover-label"
              >
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.9)", fontWeight: 500, lineHeight: 1.2 }}>
                  {photo.label}
                </span>
              </div>
              {photo.liked && (
                <div style={{ position: "absolute", top: 5, right: 5 }}>
                  <span className="i-ph:heart-fill" style={{ width: "13px", height: "13px", color: "var(--system-pink, #FF2D55)", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                </div>
              )}
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {viewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setViewPhoto(null)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              gap: "20px",
            }}
          >
            <motion.img
              src={viewPhoto.url}
              alt={viewPhoto.label}
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "78%",
                maxHeight: "62%",
                objectFit: "contain",
                borderRadius: "14px",
                boxShadow: "0 32px 96px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.3)",
              }}
            />
            {/* Glass info panel */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.06, duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(40px) saturate(160%)",
                WebkitBackdropFilter: "blur(40px) saturate(160%)",
                border: "0.5px solid rgba(255,255,255,0.22)",
                borderRadius: "14px",
                padding: "10px 18px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.28), inset 0 0.5px 0 rgba(255,255,255,0.3)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>
                  {viewPhoto.label}
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  {viewPhoto.date}
                </span>
              </div>
              <div style={{ width: "0.5px", height: "28px", background: "rgba(255,255,255,0.2)" }} />
              <button
                onClick={() => toggleLike(viewPhoto.id)}
                style={{
                  background: viewPhoto.liked ? "rgba(255,45,85,0.2)" : "transparent",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 8px",
                  gap: "5px",
                  transition: "background 0.15s ease",
                }}
              >
                <span
                  className={viewPhoto.liked ? "i-ph:heart-fill" : "i-ph:heart"}
                  style={{ width: "16px", height: "16px", color: viewPhoto.liked ? "var(--system-pink, #FF2D55)" : "rgba(255,255,255,0.7)" }}
                />
              </button>
              <button
                onClick={() => setViewPhoto(null)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "0.5px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  padding: "5px 14px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
