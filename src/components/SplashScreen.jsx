import React, { useState, useEffect, useCallback } from "react";
import { bootstrapCameraKit, createMediaStreamSource } from "@snap/camera-kit";
import smileLoaded from "../../src/assets/smile_loaded.png";
import chamkingSmile from "../../src/assets/chamking-smile-logo.png";

// Camera Manager class
class CameraManager {
  constructor() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    this.isBackFacing = false;
    this.mediaStream = null;
  }

  async initializeCamera() {
    if (!this.isMobile) {
      document.body.classList.add("desktop");
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia(
      this.getConstraints()
    );
    return this.mediaStream;
  }

  getConstraints() {
    const settings = {
      camera: {
        constraints: {
          front: {
            video: {
              facingMode: "user",
            },
            audio: true,
          },
          back: {
            video: {
              facingMode: "environment",
            },
            audio: true,
          },
          desktop: {
            video: {
              facingMode: "user",
            },
            audio: true,
          },
        },
      },
    };

    return this.isMobile
      ? this.isBackFacing
        ? settings.camera.constraints.back
        : settings.camera.constraints.front
      : settings.camera.constraints.desktop;
  }
}

// Global preload cache
window.snapARPreloadCache = {
  cameraKit: null,
  lenses: null,
  cameraManager: null,
  mediaStream: null,
  isPreloaded: false,
  preloadProgress: 0,
};

const SplashScreen = ({ onComplete }) => {
  const [loadingState, setLoadingState] = useState("preloading"); // 'preloading', 'animating', 'complete'
  const [currentFrame, setCurrentFrame] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState({});
  const [isPreloadingAR, setIsPreloadingAR] = useState(false);

  const TOTAL_FRAMES = 31; // 0 to 30
  const ANIMATION_DURATION = 2000; // 2 seconds
  const FRAME_INTERVAL = ANIMATION_DURATION / (TOTAL_FRAMES - 1);

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const images = {};
      const loadPromises = [];

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const promise = new Promise((resolve, reject) => {
          const img = new Image();
          const fileName = `Comp 1_${i.toString().padStart(5, "0")}.png`;
          const src = `/assets/smile/${fileName}`;

          img.onload = () => {
            images[i] = src;
            resolve();
          };
          img.onerror = reject;
          img.src = src;
        });

        loadPromises.push(promise);
      }

      try {
        await Promise.all(loadPromises);
        setPreloadedImages(images);
        setLoadingState("animating");
      } catch (error) {
        console.error("Failed to preload images:", error);
        // Fallback: still proceed with animation
        setPreloadedImages(images);
        setLoadingState("animating");
      }
    };

    preloadImages();
  }, []);

  // Handle animation sequence
  useEffect(() => {
    if (loadingState !== "animating") return;

    let frameIndex = 0;
    const interval = setInterval(() => {
      setCurrentFrame(frameIndex);

      if (frameIndex >= TOTAL_FRAMES - 1) {
        // Animation complete - stay on last frame
        setLoadingState("complete");
        clearInterval(interval);
        return;
      }

      frameIndex++;
    }, FRAME_INTERVAL);

    return () => clearInterval(interval);
  }, [loadingState, FRAME_INTERVAL, TOTAL_FRAMES]);

  // Preload Snap AR dependencies
  const preloadSnapAR = useCallback(async () => {
    if (window.snapARPreloadCache.isPreloaded) {
      console.log("✅ Snap AR already preloaded");
      return;
    }

    try {
      setIsPreloadingAR(true);
      console.log("🚀 Starting Snap AR preload...");

      // Step 1: Initialize Camera Kit
      const actualApiToken =
        "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUwMjUxNDQ5LCJzdWIiOiJmZDFmZDkyMi01NWI1LTQ3ZTQtOTlmOS1kMjQ1YzIyNzZjZWZ-UFJPRFVDVElPTn4wYTBiZDg4OC0zYzJkLTQ2NTQtOWJhZS04NWNkZjIwZGZkM2MifQ.DXp0F3LA8ZqxuB0UH4TCaQT2iMbCsc9xrT8xbuoYOJg";

      const cameraKit = await bootstrapCameraKit({
        apiToken: actualApiToken,
      });
      window.snapARPreloadCache.cameraKit = cameraKit;

      // Step 2: Initialize Camera Manager and get permissions
      const cameraManager = new CameraManager();
      const mediaStream = await cameraManager.initializeCamera();
      window.snapARPreloadCache.cameraManager = cameraManager;
      window.snapARPreloadCache.mediaStream = mediaStream;

      // Step 3: Preload lens assets
      const actualLensGroupId = "b2aafdd8-cb11-4817-9df9-835b36d9d5a7";
      const { lenses } = await cameraKit.lensRepository.loadLensGroups([
        actualLensGroupId,
      ]);
      window.snapARPreloadCache.lenses = lenses;

      // Mark as complete
      window.snapARPreloadCache.isPreloaded = true;
      window.snapARPreloadCache.preloadProgress = 100;
      console.log("🎉 Snap AR preload complete!");
    } catch (error) {
      console.error("❌ Snap AR preload failed:", error);
    } finally {
      setIsPreloadingAR(false);
    }
  }, []);

  const handleTapToBegin = async () => {
    // Start AR preloading immediately when user clicks
    await preloadSnapAR();

    if (onComplete) {
      onComplete();
    }
  };

  const getCurrentProgress = () => {
    if (loadingState === "preloading") return 0;
    if (loadingState === "complete") return 100;
    return Math.round((currentFrame / (TOTAL_FRAMES - 1)) * 100);
  };

  const shouldShowLoadingText =
    loadingState === "preloading" || loadingState === "animating";
  const shouldShowProgress = loadingState === "animating";
  const shouldShowButton = loadingState === "complete" && !isPreloadingAR;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto">
      {/* HAPPYDENT Logo */}
      <img
        src="/assets/happydent-logo.png"
        alt="HAPPYDENT"
        className="w-64 h-32 object-contain mb-8"
      />

      {/* Chamking Smile Logo */}
      <img
        className="chamking-smile-logo"
        src={chamkingSmile}
        alt="Chamking Smile"
      />

      {/* Loading Text - Hidden but maintains space */}
      <div
        className={`font-gotham font-light italic my-2 transition-opacity duration-300 ${
          shouldShowLoadingText ? "opacity-100" : "opacity-0"
        }`}
      >
        Loading...
      </div>

      {/* Animation Container */}
      <div className="mb-8 flex flex-col items-center">
        {/* Image Sequence */}
        {loadingState !== "preloading" && preloadedImages[currentFrame] && (
          <div className="mb-4">
            <img
              src={preloadedImages[currentFrame]}
              alt="Loading animation"
              className="w-42 h-42 object-contain"
              style={{ imageRendering: "auto" }}
            />
          </div>
        )}

        {/* Progress Percentage */}
        {shouldShowProgress && (
          <p className="text-center text-xl font-bold transition-opacity duration-300">
            {getCurrentProgress()}%
          </p>
        )}

        {/* Initial Loading State */}
        {loadingState === "preloading" && (
          <div className="w-42 h-42 flex items-center justify-center">
            <p className="text-center text-lg">Preparing...</p>
          </div>
        )}
      </div>

      {/* Button */}
      {shouldShowButton && (
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <button
            onClick={handleTapToBegin}
            disabled={isPreloadingAR}
            className={`text-white text-[18px] ctaBtn font-gotham font-medium italic transition-all duration-300 ${
              isPreloadingAR
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
            }`}
            style={{
              background: isPreloadingAR
                ? "rgba(128, 128, 128, 0.5)"
                : "radial-gradient(40% 40% at 80% 100%, rgb(255 255 255 / 31%) 0%, rgb(0 51 255 / 31%) 59%, rgb(0 13 255 / 31%) 100%)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.52)",
              boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {isPreloadingAR ? "PREPARING..." : "TAP TO BEGIN!"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
