import React from "react";
import { useFullscreen } from "../contexts/FullscreenContext";

const FullscreenButton = ({ className = "", style = {} }) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <button
      onClick={toggleFullscreen}
      className={`text-white text-[16px] font-gotham font-medium italic transition-all duration-300 px-4 py-2 ${className}`}
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        borderRadius: "4px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        ...style,
      }}
    >
      {isFullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}
    </button>
  );
};

export default FullscreenButton;
