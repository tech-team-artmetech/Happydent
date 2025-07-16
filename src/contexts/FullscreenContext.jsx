import React, { createContext, useContext, useState, useEffect } from "react";

const FullscreenContext = createContext();

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error("useFullscreen must be used within a FullscreenProvider");
  }
  return context;
};

export const FullscreenProvider = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  };

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error("Enter fullscreen failed:", error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Exit fullscreen failed:", error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        toggleFullscreen,
        enterFullscreen,
        exitFullscreen,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
};
