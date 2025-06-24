import React, { useState, useEffect } from "react";
import smileLoaded from "../../src/assets/smile_loaded.png";
import chamkingSmile from "../../src/assets/chamking-smile-logo.png";

const SplashScreen = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState({});

  // Preload all images
  useEffect(() => {
    const images = {};
    let loadedCount = 0;
    const totalImages = 31; // 0 to 40 = 31 images

    for (let i = 0; i <= 30; i++) {
      const img = new Image();
      const fileName = `Comp 1_${i.toString().padStart(5, "0")}.png`;
      const src = `/assets/smile/${fileName}`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };

      img.src = src;
      images[i] = src;
    }

    setPreloadedImages(images);
  }, []);

  // Start progress animation after images are loaded
  useEffect(() => {
    if (!imagesLoaded) return;

    let step = 0;
    const totalSteps = 31; // One step per frame

    const interval = setInterval(() => {
      if (step >= totalSteps) {
        setLoadingProgress(100);
        setShowButton(true);
        clearInterval(interval);
        return;
      }

      const progress = (step / (totalSteps - 1)) * 100; // precise 0–100%
      setLoadingProgress(progress);
      step++;
    }, 50); // ~2 seconds total

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  // Calculate which image to show based on progress
  const getCurrentImageIndex = () => {
    return Math.min(Math.floor((loadingProgress / 100) * 30), 30);
  };

  const handleTapToBegin = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto">
      {/* Image */}

      <img
        src="/assets/happydent-logo.png"
        alt="HAPPYDENT"
        className="w-64 h-32 object-contain mb-8"
      />

      <img className="chamking-smile-logo" src={chamkingSmile} alt="" />
      {/* Image Sequence Loader */}
      {!showButton && imagesLoaded && (
        <div className="mb-8 flex flex-col items-center">
          <div className="font-gotham font-light italic">Loading...</div>
          <div className="mb-4">
            <img
              src={preloadedImages[getCurrentImageIndex()]}
              alt="Loading animation"
              className="w-42 h-42 object-contain"
            />
          </div>
          <p className="text-center text-xl font-bold">
            {Math.round(loadingProgress)}%
          </p>
        </div>
      )}

      {/* Loading message while preloading images */}
      {!imagesLoaded && (
        <div className="mb-8">
          <p className="text-center text-lg">Loading...</p>
        </div>
      )}

      {/* Button */}

      {showButton && (
        <div className="flex flex-col items-center space-y-4">
          <img src={smileLoaded} alt="Final Smile Frame" />
          <button
            onClick={handleTapToBegin}
            className="text-white text-[18px] ctaBtn font-gotham font-medium italic"
            style={{
              background:
                "radial-gradient(40% 40% at 80% 100%, rgb(255 255 255 / 31%) 0%, rgb(0 51 255 / 31%) 59%, rgb(0 13 255 / 31%) 100%)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.52)",
              borderStyle: "inside",
              boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              opacity: "100%",
            }}
          >
            TAP TO BEGIN!
          </button>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
