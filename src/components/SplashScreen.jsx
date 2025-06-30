// import React, { useState, useEffect } from "react";
// import smileLoaded from "../../src/assets/smile_loaded.png";
// import chamkingSmile from "../../src/assets/chamking-smile-logo.png";

// const SplashScreen = ({ onComplete }) => {
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [showButton, setShowButton] = useState(false);
//   const [imagesLoaded, setImagesLoaded] = useState(false);
//   const [preloadedImages, setPreloadedImages] = useState({});

//   // Preload all images
//   useEffect(() => {
//     const images = {};
//     let loadedCount = 0;
//     const totalImages = 31; // 0 to 40 = 31 images

//     for (let i = 0; i <= 30; i++) {
//       const img = new Image();
//       const fileName = `Comp 1_${i.toString().padStart(5, "0")}.png`;
//       const src = `/assets/smile/${fileName}`;

//       img.onload = () => {
//         loadedCount++;
//         if (loadedCount === totalImages) {
//           setImagesLoaded(true);
//         }
//       };

//       img.src = src;
//       images[i] = src;
//     }

//     setPreloadedImages(images);
//   }, []);

//   // Start progress animation after images are loaded
//   useEffect(() => {
//     if (!imagesLoaded) return;

//     let step = 0;
//     const totalSteps = 31; // One step per frame

//     const interval = setInterval(() => {
//       if (step >= totalSteps) {
//         setLoadingProgress(100);
//         setShowButton(true);
//         clearInterval(interval);
//         return;
//       }

//       const progress = (step / (totalSteps - 1)) * 100; // precise 0–100%
//       setLoadingProgress(progress);
//       step++;
//     }, 50); // ~2 seconds total

//     return () => clearInterval(interval);
//   }, [imagesLoaded]);

//   // Calculate which image to show based on progress
//   const getCurrentImageIndex = () => {
//     return Math.min(Math.floor((loadingProgress / 100) * 30), 30);
//   };

//   const handleTapToBegin = () => {
//     if (onComplete) {
//       onComplete();
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto">
//       {/* Image */}

//       <img
//         src="/assets/happydent-logo.png"
//         alt="HAPPYDENT"
//         className="w-64 h-32 object-contain mb-8"
//       />

//       <img className="chamking-smile-logo" src={chamkingSmile} alt="" />
//       {/* Image Sequence Loader */}
//       {!showButton && imagesLoaded && (
//         <div className="mb-8 flex flex-col items-center">
//           <div className="font-gotham font-light italic">Loading...</div>
//           <div className="mb-4">
//             <img
//               src={preloadedImages[getCurrentImageIndex()]}
//               alt="Loading animation"
//               className="w-42 h-42 object-contain"
//             />
//           </div>
//           <p className="text-center text-xl font-bold">
//             {Math.round(loadingProgress)}%
//           </p>
//         </div>
//       )}

//       {/* Loading message while preloading images */}
//       {!imagesLoaded && (
//         <div className="mb-8">
//           <p className="text-center text-lg">Loading...</p>
//         </div>
//       )}

//       {/* Button */}

//       {showButton && (
//         <div className="flex flex-col items-center space-y-4">
//           <img src={smileLoaded} alt="Final Smile Frame" />
//           <button
//             onClick={handleTapToBegin}
//             className="text-white text-[18px] ctaBtn font-gotham font-medium italic"
//             style={{
//               background:
//                 "radial-gradient(40% 40% at 80% 100%, rgb(255 255 255 / 31%) 0%, rgb(0 51 255 / 31%) 59%, rgb(0 13 255 / 31%) 100%)",
//               borderRadius: "4px",
//               border: "1px solid rgba(255, 255, 255, 0.52)",
//               borderStyle: "inside",
//               boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
//               backdropFilter: "blur(20px)",
//               WebkitBackdropFilter: "blur(20px)",
//               opacity: "100%",
//             }}
//           >
//             TAP TO BEGIN!
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SplashScreen;

import React, { useState, useEffect } from "react";
import { bootstrapCameraKit, createMediaStreamSource } from "@snap/camera-kit";
import smileLoaded from "../../src/assets/smile_loaded.png";
import chamkingSmile from "../../src/assets/chamking-smile-logo.png";

// Camera Manager class (same as your AR component)
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState({});
  const [arPreloadProgress, setArPreloadProgress] = useState(0);
  const [isPreloadingAR, setIsPreloadingAR] = useState(false);

  // Preload all images
  useEffect(() => {
    const images = {};
    let loadedCount = 0;
    const totalImages = 31;

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
    const totalSteps = 31;

    const interval = setInterval(() => {
      if (step >= totalSteps) {
        setLoadingProgress(100);
        setShowButton(true);
        clearInterval(interval);
        return;
      }

      const progress = (step / (totalSteps - 1)) * 100;
      setLoadingProgress(progress);
      step++;
    }, 50);

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  // Preload Snap AR dependencies
  const preloadSnapAR = async () => {
    if (window.snapARPreloadCache.isPreloaded) {
      console.log("✅ Snap AR already preloaded");
      return;
    }

    try {
      setIsPreloadingAR(true);
      setArPreloadProgress(10);
      console.log("🚀 Starting Snap AR preload...");

      // Step 1: Initialize Camera Kit
      console.log("📱 Initializing Camera Kit...");
      const actualApiToken =
        "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUwMjUxNDQ5LCJzdWIiOiJmZDFmZDkyMi01NWI1LTQ3ZTQtOTlmOS1kMjQ1YzIyNzZjZWZ-UFJPRFVDVElPTn4wYTBiZDg4OC0zYzJkLTQ2NTQtOWJhZS04NWNkZjIwZGZkM2MifQ.DXp0F3LA8ZqxuB0UH4TCaQT2iMbCsc9xrT8xbuoYOJg";

      const cameraKit = await bootstrapCameraKit({
        apiToken: actualApiToken,
      });
      window.snapARPreloadCache.cameraKit = cameraKit;
      setArPreloadProgress(30);
      console.log("✅ Camera Kit initialized");

      // Step 2: Initialize Camera Manager and get permissions
      console.log("📷 Setting up camera...");
      const cameraManager = new CameraManager();
      const mediaStream = await cameraManager.initializeCamera();
      window.snapARPreloadCache.cameraManager = cameraManager;
      window.snapARPreloadCache.mediaStream = mediaStream;
      setArPreloadProgress(60);
      console.log("✅ Camera permissions granted and stream ready");

      // Step 3: Preload lens assets
      console.log("🎭 Loading lens assets...");
      const actualLensGroupId = "b2aafdd8-cb11-4817-9df9-835b36d9d5a7";
      const { lenses } = await cameraKit.lensRepository.loadLensGroups([
        actualLensGroupId,
      ]);
      window.snapARPreloadCache.lenses = lenses;
      setArPreloadProgress(90);
      console.log("✅ Lens assets loaded");

      // Mark as complete
      window.snapARPreloadCache.isPreloaded = true;
      window.snapARPreloadCache.preloadProgress = 100;
      setArPreloadProgress(100);
      console.log("🎉 Snap AR preload complete!");

      // Small delay to show 100% progress
      setTimeout(() => {
        setIsPreloadingAR(false);
      }, 500);
    } catch (error) {
      console.error("❌ Snap AR preload failed:", error);
      setArPreloadProgress(0);
      setIsPreloadingAR(false);
      // Don't block the user, they can still try the AR experience
    }
  };

  const getCurrentImageIndex = () => {
    return Math.min(Math.floor((loadingProgress / 100) * 30), 30);
  };

  const handleTapToBegin = async () => {
    // Start AR preloading immediately when user clicks
    await preloadSnapAR();

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto">
      {/* HAPPYDENT Logo */}
      <img
        src="/assets/happydent-logo.png"
        alt="HAPPYDENT"
        className="w-64 h-32 object-contain mb-8"
      />

      <img className="chamking-smile-logo" src={chamkingSmile} alt="" />
      <div className="font-gotham font-light italic opacity-0 my-[8px]">
        Loading...
      </div>

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

      {/* AR Preloading Indicator */}
      {/* {isPreloadingAR && (
        <div className="mb-4 w-full max-w-xs">
          <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 text-center">
            <p className="text-blue-300 text-sm mb-2">Preparing AR Experience...</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${arPreloadProgress}%` }}
              ></div>
            </div>
            <p className="text-blue-300 text-xs mt-1">{arPreloadProgress}%</p>
          </div>
        </div>
      )} */}

      {/* Button */}
      {showButton && (
        <div className="flex flex-col items-center space-y-4">
          <img src={smileLoaded} alt="Final Smile Frame" />
          <button
            onClick={handleTapToBegin}
            disabled={isPreloadingAR}
            className={`text-white text-[18px] ctaBtn font-gotham font-medium italic transition-all ${
              isPreloadingAR ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{
              background: isPreloadingAR
                ? "rgba(128, 128, 128, 0.5)"
                : "radial-gradient(40% 40% at 80% 100%, rgb(255 255 255 / 31%) 0%, rgb(0 51 255 / 31%) 59%, rgb(0 13 255 / 31%) 100%)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.52)",
              borderStyle: "inside",
              boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              opacity: "100%",
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
