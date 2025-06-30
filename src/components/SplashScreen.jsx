// import React, { useState, useEffect } from "react";
// import { bootstrapCameraKit, createMediaStreamSource } from "@snap/camera-kit";
// import smileLoaded from "../../src/assets/smile_loaded.png";
// import chamkingSmile from "../../src/assets/chamking-smile-logo.png";

// // Camera Manager class (same as your AR component)
// class CameraManager {
//   constructor() {
//     this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//     this.isBackFacing = false;
//     this.mediaStream = null;
//   }

//   async initializeCamera() {
//     if (!this.isMobile) {
//       document.body.classList.add("desktop");
//     }

//     this.mediaStream = await navigator.mediaDevices.getUserMedia(
//       this.getConstraints()
//     );
//     return this.mediaStream;
//   }

//   getConstraints() {
//     const settings = {
//       camera: {
//         constraints: {
//           front: {
//             video: {
//               facingMode: "user",
//             },
//             audio: true,
//           },
//           back: {
//             video: {
//               facingMode: "environment",
//             },
//             audio: true,
//           },
//           desktop: {
//             video: {
//               facingMode: "user",
//             },
//             audio: true,
//           },
//         },
//       },
//     };

//     return this.isMobile
//       ? this.isBackFacing
//         ? settings.camera.constraints.back
//         : settings.camera.constraints.front
//       : settings.camera.constraints.desktop;
//   }
// }

// // Global preload cache
// window.snapARPreloadCache = {
//   cameraKit: null,
//   lenses: null,
//   cameraManager: null,
//   mediaStream: null,
//   isPreloaded: false,
//   preloadProgress: 0,
// };

// const SplashScreen = ({ onComplete }) => {
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [showButton, setShowButton] = useState(false);
//   const [imagesLoaded, setImagesLoaded] = useState(false);
//   const [preloadedImages, setPreloadedImages] = useState({});

//   // Preload all images
//   useEffect(() => {
//     const images = {};
//     let loadedCount = 0;
//     const totalImages = 31;

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
//     const totalSteps = 31;

//     const interval = setInterval(() => {
//       if (step >= totalSteps) {
//         setLoadingProgress(100);
//         setShowButton(true);
//         clearInterval(interval);
//         return;
//       }

//       const progress = (step / (totalSteps - 1)) * 100;
//       setLoadingProgress(progress);
//       step++;
//     }, 50);

//     return () => clearInterval(interval);
//   }, [imagesLoaded]);

//   // Preload Snap AR dependencies
//   const preloadSnapAR = async () => {
//     if (window.snapARPreloadCache.isPreloaded) {
//       console.log("✅ Snap AR already preloaded");
//       return;
//     }

//     try {
//       console.log("🚀 Starting Snap AR preload in background...");

//       // Step 1: Initialize Camera Kit
//       console.log("📱 Initializing Camera Kit...");
//       const actualApiToken =
//         "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUwMjUxNDQ5LCJzdWIiOiJmZDFmZDkyMi01NWI1LTQ3ZTQtOTlmOS1kMjQ1YzIyNzZjZWZ-UFJPRFVDVElPTn4wYTBiZDg4OC0zYzJkLTQ2NTQtOWJhZS04NWNkZjIwZGZkM2MifQ.DXp0F3LA8ZqxuB0UH4TCaQT2iMbCsc9xrT8xbuoYOJg";

//       const cameraKit = await bootstrapCameraKit({
//         apiToken: actualApiToken,
//       });
//       window.snapARPreloadCache.cameraKit = cameraKit;
//       console.log("✅ Camera Kit initialized");

//       // Step 2: Initialize Camera Manager and get permissions
//       console.log("📷 Setting up camera...");
//       const cameraManager = new CameraManager();
//       const mediaStream = await cameraManager.initializeCamera();
//       window.snapARPreloadCache.cameraManager = cameraManager;
//       window.snapARPreloadCache.mediaStream = mediaStream;
//       console.log("✅ Camera permissions granted and stream ready");

//       // Step 3: Preload lens assets
//       console.log("🎭 Loading lens assets...");
//       const actualLensGroupId = "b2aafdd8-cb11-4817-9df9-835b36d9d5a7";
//       const { lenses } = await cameraKit.lensRepository.loadLensGroups([
//         actualLensGroupId,
//       ]);
//       window.snapARPreloadCache.lenses = lenses;
//       console.log("✅ Lens assets loaded");

//       // Mark as complete
//       window.snapARPreloadCache.isPreloaded = true;
//       window.snapARPreloadCache.preloadProgress = 100;
//       console.log("🎉 Snap AR preload complete! Ready for instant AR experience.");

//     } catch (error) {
//       console.error("❌ Snap AR preload failed:", error);
//       // Don't block the user, they can still try the AR experience with fallback
//     }
//   };

//   const getCurrentImageIndex = () => {
//     return Math.min(Math.floor((loadingProgress / 100) * 30), 30);
//   };

//   const handleTapToBegin = () => {
//     // Start AR preloading immediately when user clicks (don't wait for it)
//     preloadSnapAR(); // Remove await - let it run in background

//     // Immediately proceed to registration screen
//     if (onComplete) {
//       onComplete();
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto">
//       {/* HAPPYDENT Logo */}
//       <img
//         src="/assets/happydent-logo.png"
//         alt="HAPPYDENT"
//         className="w-64 h-32 object-contain mb-8"
//       />

//       <img className="chamking-smile-logo" src={chamkingSmile} alt="" />
//       <div className="font-gotham font-light italic opacity-0 my-[8px]">
//         Loading...
//       </div>

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
//             className="text-white text-[18px] ctaBtn font-gotham font-medium italic transition-all"
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
import { bootstrapCameraKit, createMediaStreamSource, Transform2D } from "@snap/camera-kit";
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
            video: { facingMode: "user" },
            audio: true,
          },
          back: {
            video: { facingMode: "environment" },
            audio: true,
          },
          desktop: {
            video: { facingMode: "user" },
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

const SplashScreen = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState({});

  // 🚀 HARD REFRESH ON SPLASH SCREEN LOAD
  useEffect(() => {
    console.log("🔄 SplashScreen mounted - performing hard refresh cleanup");

    // Clear any existing AR cache completely
    if (window.snapARPreloadCache) {
      try {
        // Stop any existing session
        if (window.snapARPreloadCache.session) {
          window.snapARPreloadCache.session.pause();
        }
        // Clear the entire cache
        window.snapARPreloadCache = null;
        delete window.snapARPreloadCache;
        console.log("🧹 Previous AR cache cleared");
      } catch (e) {
        console.log("Cache cleanup:", e.message);
      }
    }

    // Clear any other global state
    sessionStorage.clear();

    // Initialize fresh cache
    window.snapARPreloadCache = {
      // Core components
      cameraKit: null,
      lenses: null,
      cameraManager: null,
      mediaStream: null,

      // 🚀 SESSION WITHOUT CANVAS - This is the key!
      session: null,
      source: null,
      appliedLens: null,

      // State tracking
      isPreloaded: false,
      isPreloading: false,
      preloadProgress: 0,
      error: null,
      sessionReady: false
    };

    console.log("✅ Fresh AR cache initialized");
  }, []); // Only run on mount

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

  // 🔥 COMPLETE AR SESSION PRELOAD - Creates session WITHOUT canvas dependency
  const preloadCompleteARSession = async () => {
    const cache = window.snapARPreloadCache;

    if (cache.sessionReady) {
      console.log("✅ Complete AR session already preloaded and ready");
      return;
    }

    if (cache.isPreloading) {
      console.log("⏳ AR session preload already in progress");
      return;
    }

    try {
      cache.isPreloading = true;
      cache.error = null;

      console.log("🚀 Starting COMPLETE AR session preload...");

      // 🔥 STEP 1: Initialize Camera Kit
      if (!cache.cameraKit) {
        console.log("📱 Initializing Camera Kit...");
        const actualApiToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUwMjUxNDQ5LCJzdWIiOiJmZDFmZDkyMi01NWI1LTQ3ZTQtOTlmOS1kMjQ1YzIyNzZjZWZ-UFJPRFVDVElPTn4wYTBiZDg4OC0zYzJkLTQ2NTQtOWJhZS04NWNkZjIwZGZkM2MifQ.DXp0F3LA8ZqxuB0UH4TCaQT2iMbCsc9xrT8xbuoYOJg";

        cache.cameraKit = await bootstrapCameraKit({
          apiToken: actualApiToken,
        });
        console.log("✅ Camera Kit initialized");
      }

      // 🔥 STEP 2: Get camera permissions and create stream
      if (!cache.mediaStream) {
        console.log("📷 Setting up camera stream...");
        cache.cameraManager = new CameraManager();
        cache.mediaStream = await cache.cameraManager.initializeCamera();
        console.log("✅ Camera stream ready");
      }

      // 🔥 STEP 3: Load lens assets (ALL API calls happen here)
      if (!cache.lenses) {
        console.log("🎭 Loading lens assets and triggering ALL lens APIs...");
        const actualLensGroupId = "b2aafdd8-cb11-4817-9df9-835b36d9d5a7";
        const { lenses } = await cache.cameraKit.lensRepository.loadLensGroups([
          actualLensGroupId,
        ]);
        cache.lenses = lenses;
        console.log("✅ All lens assets and APIs loaded");
      }

      // 🚀 STEP 4: Create session WITHOUT canvas - Let Camera Kit create its own canvas
      if (!cache.session) {
        console.log("🔥 Creating AR session WITHOUT canvas dependency...");

        // Create session without providing a canvas - Camera Kit will create its own
        cache.session = await cache.cameraKit.createSession();

        // Create and configure the source
        cache.source = createMediaStreamSource(cache.mediaStream, {
          cameraType: "user",
          disableSourceAudio: false,
        });

        // Set up the session completely
        await cache.session.setSource(cache.source);
        cache.source.setTransform(Transform2D.MirrorX);
        await cache.source.setRenderSize(window.innerWidth, window.innerHeight);
        await cache.session.setFPSLimit(60);

        // Apply the lens BEFORE starting to play
        if (cache.lenses && cache.lenses.length > 0) {
          await cache.session.applyLens(cache.lenses[0]);
          cache.appliedLens = cache.lenses[0];
          console.log("✅ Lens applied to preloaded session");
        }

        // DON'T start the session yet - wait for AR component to be ready
        console.log("⏸️ Session ready but NOT started - waiting for AR component");

        console.log("🎉 COMPLETE AR session created and READY to play!");
      }

      // 🎯 MARK AS COMPLETELY READY
      cache.isPreloaded = true;
      cache.sessionReady = true;
      cache.preloadProgress = 100;
      cache.isPreloading = false;

      console.log("🎉 COMPLETE AR session preload finished!");
      console.log("📊 Session cache status:", {
        hasCameraKit: !!cache.cameraKit,
        hasMediaStream: !!cache.mediaStream,
        hasLenses: !!cache.lenses && cache.lenses.length > 0,
        hasSession: !!cache.session,
        hasSource: !!cache.source,
        hasAppliedLens: !!cache.appliedLens,
        sessionReady: cache.sessionReady,
        sessionCanvas: cache.session?.output?.live || null
      });

    } catch (error) {
      console.error("❌ Complete AR session preload failed:", error);
      cache.error = error.message;
      cache.isPreloading = false;
      cache.sessionReady = false;
    }
  };

  const getCurrentImageIndex = () => {
    return Math.min(Math.floor((loadingProgress / 100) * 30), 30);
  };

  const handleTapToBegin = () => {
    console.log("👆 User clicked TAP TO BEGIN - starting COMPLETE AR session preload");

    // 🚀 Start COMPLETE AR session preload in background
    preloadCompleteARSession();

    // 🏃‍♂️ Immediately proceed to registration
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

      {/* Button */}
      {showButton && (
        <div className="flex flex-col items-center space-y-4">
          <img src={smileLoaded} alt="Final Smile Frame" />
          <button
            onClick={handleTapToBegin}
            className="text-white text-[18px] ctaBtn font-gotham font-medium italic transition-all"
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