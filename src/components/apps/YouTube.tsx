import React from "react";
import { useStore } from "~/stores";

export default function YouTube() {
  const dark = useStore((state) => state.dark);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        fontFamily:
          "'SF Pro Text', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Inter', 'Helvetica Neue', sans-serif",
        backgroundColor: dark ? "#1c1c1e" : "#ffffff", // Standard macOS app backgrounds
      }}
    >
      <iframe
        src="https://streamifyhub.vercel.app/"
        title="YouTube"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          backgroundColor: "transparent",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
