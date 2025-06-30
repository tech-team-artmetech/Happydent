// import React, { useRef, useEffect, useState } from "react";
// import { createMediaStreamSource, Transform2D } from "@snap/camera-kit";

// const SnapARExperience = ({ onComplete, userData, lensGroupId, apiToken }) => {
//   const canvasRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [autoCapturing, setAutoCapturing] = useState(false);
//   const sessionRef = useRef(null);
//   const captureTimeoutRef = useRef(null);
//   const [showCaptureButton, setShowCaptureButton] = useState(false);
//   const buttonTimeoutRef = useRef(null);

//   useEffect(() => {
//     initializeCameraKitFromCache();
//     return () => {
//       cleanup();
//     };
//   }, []);

//   // AR state monitoring (same as before)
//   useEffect(() => {
//     const checkARState = async () => {
//       if (!userData?.phone) return;

//       try {
//         const response = await fetch(`http://localhost:3001/api/ar-end/${userData.phone}`);
//         const data = await response.json();

//         if (data.success && data.data.arEnded) {
//           console.log("🎭 AR session ended by server - triggering capture");
//           captureAndUpload();
//         }
//       } catch (error) {
//         console.error("❌ Failed to check AR state:", error);
//       }
//     };

//     let stateCheckInterval;
//     if (!isLoading && userData?.phone) {
//       stateCheckInterval = setInterval(checkARState, 3000);
//       console.log("🎭 Started AR state monitoring every 3 seconds");
//     }

//     return () => {
//       if (stateCheckInterval) {
//         clearInterval(stateCheckInterval);
//         console.log("🎭 Stopped AR state monitoring");
//       }
//     };
//   }, [isLoading, userData?.phone]);

//   const initializeCameraKitFromCache = async () => {
//     try {
//       setIsLoading(true);
//       setError("");

//       console.log("⚡ Initializing AR from preloaded cache...");

//       // Check if everything is preloaded
//       if (!window.snapARPreloadCache?.isPreloaded) {
//         console.warn(
//           "⚠️ AR not preloaded, falling back to regular initialization"
//         );
//         await fallbackInitialization();
//         return;
//       }

//       const cache = window.snapARPreloadCache;
//       console.log("✅ Using preloaded Camera Kit and assets");

//       // Get canvas element for live render target
//       const liveRenderTarget = canvasRef.current;

//       // Create session using preloaded camera kit
//       const session = await cache.cameraKit.createSession({ liveRenderTarget });
//       sessionRef.current = session;

//       // Use preloaded media stream
//       const source = createMediaStreamSource(cache.mediaStream, {
//         cameraType: "user",
//         disableSourceAudio: false,
//       });

//       await session.setSource(source);
//       source.setTransform(Transform2D.MirrorX);
//       await source.setRenderSize(window.innerWidth, window.innerHeight);
//       await session.setFPSLimit(60);
//       await session.play();

//       // Apply preloaded lens
//       if (cache.lenses && cache.lenses.length > 0) {
//         await session.applyLens(cache.lenses[0]);
//         console.log("✅ Applied preloaded lens");
//       }

//       console.log("🚀 AR Experience ready instantly!");
//       setIsLoading(false);

//       // Show capture button after 5 seconds (reduced from 10)
//       console.log("⏰ Starting 5-second countdown for capture button...");
//       buttonTimeoutRef.current = setTimeout(() => {
//         console.log("🔲 Showing capture button after 5 seconds");
//         setShowCaptureButton(true);
//       }, 5000);
//     } catch (err) {
//       console.error("❌ Failed to use cached AR, falling back:", err);
//       await fallbackInitialization();
//     }
//   };

//   // Fallback to original initialization if preload failed
//   const fallbackInitialization = async () => {
//     try {
//       console.log("🔄 Starting fallback AR initialization...");

//       // Your original initialization code here
//       const actualApiToken =
//         "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUwMjUxNDQ5LCJzdWIiOiJmZDFmZDkyMi01NWI1LTQ3ZTQtOTlmOS1kMjQ1YzIyNzZjZWZ-UFJPRFVDVElPTn4wYTBiZDg4OC0zYzJkLTQ2NTQtOWJhZS04NWNkZjIwZGZkM2MifQ.DXp0F3LA8ZqxuB0UH4TCaQT2iMbCsc9xrT8xbuoYOJg";
//       const actualLensGroupId = "b2aafdd8-cb11-4817-9df9-835b36d9d5a7";

//       // Import the bootstrap function dynamically to avoid loading if cached
//       const { bootstrapCameraKit } = await import("@snap/camera-kit");

//       // Initialize Camera Kit
//       const cameraKit = await bootstrapCameraKit({
//         apiToken: actualApiToken,
//       });

//       // Get canvas element
//       const liveRenderTarget = canvasRef.current;

//       // Create session
//       const session = await cameraKit.createSession({ liveRenderTarget });
//       sessionRef.current = session;

//       // Initialize camera
//       const constraints = {
//         video: { facingMode: "user" },
//         audio: true,
//       };
//       const mediaStream = await navigator.mediaDevices.getUserMedia(
//         constraints
//       );

//       const source = createMediaStreamSource(mediaStream, {
//         cameraType: "user",
//         disableSourceAudio: false,
//       });

//       await session.setSource(source);
//       source.setTransform(Transform2D.MirrorX);
//       await source.setRenderSize(window.innerWidth, window.innerHeight);
//       await session.setFPSLimit(60);
//       await session.play();

//       // Load and apply lens
//       const { lenses } = await cameraKit.lensRepository.loadLensGroups([
//         actualLensGroupId,
//       ]);
//       if (lenses && lenses.length > 0) {
//         await session.applyLens(lenses[0]);
//       }

//       setIsLoading(false);

//       // Show capture button after 5 seconds
//       buttonTimeoutRef.current = setTimeout(() => {
//         setShowCaptureButton(true);
//       }, 5000);
//     } catch (err) {
//       console.error("❌ Fallback initialization failed:", err);
//       setError(`Failed to initialize AR: ${err.message}`);
//       setIsLoading(false);
//     }
//   };

//   const cleanup = () => {
//     if (captureTimeoutRef.current) {
//       clearTimeout(captureTimeoutRef.current);
//       captureTimeoutRef.current = null;
//     }

//     if (buttonTimeoutRef.current) {
//       clearTimeout(buttonTimeoutRef.current);
//       buttonTimeoutRef.current = null;
//     }

//     // Don't stop the media stream if it's from cache (other components might need it)
//     if (!window.snapARPreloadCache?.isPreloaded) {
//       // Only clean up if we created our own stream
//       if (sessionRef.current) {
//         // Stop tracks if we created them in fallback mode
//         try {
//           const tracks = sessionRef.current.source?.getAllTracks?.() || [];
//           tracks.forEach((track) => track.stop());
//         } catch (e) {
//           console.log("Could not stop tracks:", e);
//         }
//       }
//     }
//   };

//   const skipToEnd = () => {
//     cleanup();
//     onComplete({
//       ...userData,
//       photo: "test-photo-url",
//       timestamp: new Date().toISOString(),
//       lensGroupId: lensGroupId,
//       testMode: true,
//     });
//   };

//   const handleManualCapture = () => {
//     console.log("🎯 Manual capture button clicked");
//     setShowCaptureButton(false);
//     captureAndUpload();
//   };

//   const captureAndUpload = async () => {
//     if (!canvasRef.current || !userData?.phone || isCapturing) {
//       console.log(
//         "❌ Cannot capture: missing canvas, phone, or already capturing"
//       );
//       return;
//     }

//     try {
//       setIsCapturing(true);
//       setAutoCapturing(true);
//       console.log("📸 Starting polaroid capture process...");

//       const canvas = canvasRef.current;
//       const canvasWidth = canvas.width;
//       const canvasHeight = canvas.height;

//       // Define polaroid area
//       const polaroidArea = {
//         x: 3,
//         y: 0,
//         width: 94,
//         height: 85,
//       };

//       // Convert percentages to pixels
//       const captureArea = {
//         x: Math.floor((canvasWidth * polaroidArea.x) / 100),
//         y: Math.floor((canvasHeight * polaroidArea.y) / 100),
//         width: Math.floor((canvasWidth * polaroidArea.width) / 100),
//         height: Math.floor((canvasHeight * polaroidArea.height) / 100),
//       };

//       // Create temporary canvas with 30% larger dimensions
//       const tempCanvas = document.createElement("canvas");
//       const tempCtx = tempCanvas.getContext("2d");
//       const enlargedWidth = Math.floor(captureArea.width * 1.3);
//       const enlargedHeight = Math.floor(captureArea.height * 1.3);

//       tempCanvas.width = enlargedWidth;
//       tempCanvas.height = enlargedHeight;

//       // Draw cropped and scaled image
//       tempCtx.drawImage(
//         canvas,
//         captureArea.x,
//         captureArea.y,
//         captureArea.width,
//         captureArea.height,
//         0,
//         0,
//         enlargedWidth,
//         enlargedHeight
//       );

//       // Convert to blob
//       const blob = await new Promise((resolve, reject) => {
//         tempCanvas.toBlob(
//           (result) => {
//             if (result) {
//               resolve(result);
//             } else {
//               reject(new Error("Failed to create blob"));
//             }
//           },
//           "image/jpeg",
//           0.9
//         );
//       });

//       // Upload
//       const formData = new FormData();
//       formData.append("photo", blob, `polaroid_${userData.phone}.jpg`);
//       formData.append("phone", userData.phone);
//       formData.append("source", "snapchat_polaroid");

//       const response = await fetch("http://localhost:3001/api/upload-photo", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.success) {
//         console.log("✅ Upload successful:", result.data.imageUrl);
//         setTimeout(() => {
//           onComplete({
//             ...userData,
//             photo: result.data.imageUrl,
//             timestamp: new Date().toISOString(),
//             lensGroupId: lensGroupId,
//             captureMode: "polaroid",
//             uploadSuccess: true,
//           });
//         }, 0);
//       } else {
//         console.error("❌ Upload failed:", result.message);
//         setTimeout(() => {
//           onComplete({
//             ...userData,
//             photo: "upload-failed",
//             timestamp: new Date().toISOString(),
//             lensGroupId: lensGroupId,
//             captureMode: "polaroid",
//             uploadSuccess: false,
//             errorMessage: result.message,
//           });
//         }, 2400);
//       }
//     } catch (error) {
//       console.error("❌ Capture and upload error:", error);
//       setTimeout(() => {
//         onComplete({
//           ...userData,
//           photo: "capture-failed",
//           timestamp: new Date().toISOString(),
//           lensGroupId: lensGroupId,
//           captureMode: "polaroid",
//           uploadSuccess: false,
//           errorMessage: error.message,
//         });
//       }, 2400);
//     } finally {
//       setIsCapturing(false);
//       setAutoCapturing(false);
//     }
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto bg-black">
//         <div className="text-center p-6">
//           <p className="text-red-300 text-sm mb-4">{error}</p>
//           <button
//             onClick={skipToEnd}
//             className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
//           >
//             Skip to End (Test Mode)
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* CSS styles - same as before */}
//       <style jsx>{`
//         #canvas {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         @media screen and (min-width: 768px) and (max-width: 1024px) {
//           #canvas {
//             width: 100% !important;
//             height: 100% !important;
//             object-fit: contain !important;
//             aspect-ratio: 9 / 16 !important;
//             background: linear-gradient(180deg, #0c1f59, #0b3396) !important;
//           }

//           .canvas-container {
//             display: flex !important;
//             align-items: center !important;
//             justify-content: center !important;
//           }
//         }

//         @media screen and (device-width: 768px) and (device-height: 1024px),
//           screen and (device-width: 1024px) and (device-height: 768px),
//           screen and (device-width: 820px) and (device-height: 1180px),
//           screen and (device-width: 1180px) and (device-height: 820px) {
//           #canvas {
//             width: 100% !important;
//             height: 100% !important;
//             object-fit: contain !important;
//             aspect-ratio: 9 / 16 !important;
//             background: linear-gradient(180deg, #0c1f59, #0b3396) !important;
//           }

//           .canvas-container {
//             display: flex !important;
//             align-items: center !important;
//             justify-content: center !important;
//           }
//         }
//       `}</style>

//       <div className="min-h-screen flex flex-col bg-black text-white max-w-[768px] mx-auto">
//         {/* AR Canvas Container */}
//         <div className="flex-1 relative canvas-container">
//           {isLoading && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//                 <p className="text-white">
//                   {window.snapARPreloadCache?.isPreloaded
//                     ? "Starting AR experience..."
//                     : "Loading AR experience..."}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Canvas */}
//           <canvas ref={canvasRef} id="canvas" />

//           {/* Auto-Capture Status Overlay */}
//           {autoCapturing && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
//               <div className="text-center">
//                 <div className="animate-pulse text-white text-lg font-medium">
//                   📸 Capturing your moment...
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Manual Capture Button */}
//         {showCaptureButton && !isCapturing && (
//           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
//             <button
//               style={{
//                 background:
//                   "radial-gradient(40% 40% at 80% 100%, rgb(255 255 255 / 31%) 0%, rgb(0 51 255 / 31%) 59%, rgb(0 13 255 / 31%) 100%)",
//                 borderRadius: "4px",
//                 border: "1px solid rgba(255, 255, 255, 0.52)",
//                 borderStyle: "inside",
//                 boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
//                 backdropFilter: "blur(20px)",
//                 WebkitBackdropFilter: "blur(20px)",
//                 opacity: "100%",
//               }}
//               onClick={handleManualCapture}
//               className="font-bold py-4 px-8 transition-all duration-200 hover:scale-105"
//             >
//               PROCEED
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default SnapARExperience;
import React, { useRef, useEffect, useState } from "react";

// Error Boundary to catch DOM manipulation errors
class ARErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if it's the specific DOM manipulation error we expect
    if (error.message && error.message.includes('removeChild')) {
      console.log('🛡️ Caught expected DOM manipulation error, suppressing:', error.message);
      return { hasError: false }; // Don't show error UI for this
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (!error.message || !error.message.includes('removeChild')) {
      console.error('❌ Unexpected AR error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto bg-black">
          <div className="text-center p-6">
            <p className="text-red-300 text-sm mb-4">AR experience encountered an error</p>
            <button
              onClick={this.props.onError}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Skip to End (Test Mode)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const SnapARExperience = ({ onComplete, userData, lensGroupId, apiToken }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null); // Add back canvasRef for capture
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [autoCapturing, setAutoCapturing] = useState(false);
  const sessionRef = useRef(null);
  const captureTimeoutRef = useRef(null);
  const [showCaptureButton, setShowCaptureButton] = useState(false);
  const buttonTimeoutRef = useRef(null);

  useEffect(() => {
    movePreloadedCanvas();
    return () => {
      cleanup();
    };
  }, []);

  // AR state monitoring
  // useEffect(() => {
  //   const checkARState = async () => {
  //     if (!userData?.phone) return;

  //     try {
  //       const response = await fetch(`http://localhost:3001/api/ar-end/${userData.phone}`);
  //       const data = await response.json();

  //       if (data.success && data.data.arEnded) {
  //         console.log("🎭 AR session ended by server - triggering capture");
  //         captureAndUpload();
  //       }
  //     } catch (error) {
  //       console.error("❌ Failed to check AR state:", error);
  //     }
  //   };

  //   let stateCheckInterval;
  //   if (!isLoading && userData?.phone) {
  //     stateCheckInterval = setInterval(checkARState, 3000);
  //     console.log("🎭 Started AR state monitoring every 3 seconds");
  //   }

  //   return () => {
  //     if (stateCheckInterval) {
  //       clearInterval(stateCheckInterval);
  //       console.log("🎭 Stopped AR state monitoring");
  //     }
  //   };
  // }, [isLoading, userData?.phone]);

  // 🚀 INSTANT CANVAS DISPLAY - Use React ref to avoid DOM conflicts
  const movePreloadedCanvas = async () => {
    try {
      console.log("⚡ Setting up preloaded AR canvas...");

      const cache = window.snapARPreloadCache;

      // Wait for session to be ready if still preloading
      if (cache?.isPreloading) {
        console.log("⏳ Waiting for session preload to complete...");
        await waitForSessionReady();
      }

      // Check if we have a complete session with canvas
      if (!cache?.sessionReady || !cache.session?.output?.live) {
        throw new Error("No preloaded AR session with canvas available");
      }

      console.log("🎯 Getting Camera Kit's canvas...");
      console.log("📊 Cache debug info:", {
        sessionExists: !!cache.session,
        sessionOutput: !!cache.session?.output,
        liveCanvas: !!cache.session?.output?.live,
        canvasTagName: cache.session?.output?.live?.tagName,
        canvasParent: cache.session?.output?.live?.parentNode?.tagName || 'none'
      });

      // Get the canvas that Camera Kit created
      const arCanvas = cache.session.output.live;

      if (!arCanvas) {
        throw new Error("Camera Kit session has no live canvas output");
      }

      if (arCanvas.tagName !== 'CANVAS') {
        throw new Error(`Expected canvas element, got: ${arCanvas.tagName}`);
      }

      // Store reference to the session
      sessionRef.current = cache.session;

      // Style the canvas for our layout
      arCanvas.id = "canvas";
      arCanvas.style.width = "100%";
      arCanvas.style.height = "100%";
      arCanvas.style.objectFit = "cover";

      // Instead of moving the canvas, let's replace our container with it
      const container = containerRef.current;
      if (container && container.parentNode) {
        // Replace our container with the AR canvas
        container.parentNode.replaceChild(arCanvas, container);
        // Update our refs to point to the canvas
        containerRef.current = arCanvas;
        canvasRef.current = arCanvas; // Also set canvasRef for capture function
      }

      // NOW start the session (this is when AR actually becomes visible)
      console.log("▶️ Starting AR session...");
      await cache.session.play();

      console.log("🎉 AR canvas displayed and session started - ZERO API calls!");
      setIsLoading(false);
      startCaptureTimer();

    } catch (err) {
      console.error("❌ Canvas setup failed:", err);
      setError(`Failed to display AR: ${err.message}`);
      setIsLoading(false);
    }
  };

  // Wait for preloaded session to be ready
  const waitForSessionReady = async () => {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const cache = window.snapARPreloadCache;

        if (cache?.sessionReady || !cache?.isPreloading) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 15 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 15000);
    });
  };

  const startCaptureTimer = () => {
    buttonTimeoutRef.current = setTimeout(() => {
      setShowCaptureButton(true);
    }, 5000);
  };

  const cleanup = () => {
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }

    if (buttonTimeoutRef.current) {
      clearTimeout(buttonTimeoutRef.current);
      buttonTimeoutRef.current = null;
    }

    // Don't destroy the session - it might be reused
    console.log("🧹 Cleaned up AR component (session preserved)");
  };

  const skipToEnd = () => {
    cleanup();
    onComplete({
      ...userData,
      photo: "test-photo-url",
      timestamp: new Date().toISOString(),
      lensGroupId: lensGroupId,
      testMode: true,
    });
  };

  const handleManualCapture = () => {
    console.log("🎯 Manual capture button clicked");
    setShowCaptureButton(false);
    captureAndUpload();
  };

  // const captureAndUpload = async () => {
  //   // Get the AR canvas (it should be our container now)
  //   const canvas = containerRef.current ||
  //     window.snapARPreloadCache?.session?.output?.live;

  //   if (!canvas || !userData?.phone || isCapturing) {
  //     console.log("❌ Cannot capture: missing canvas, phone, or already capturing");
  //     return;
  //   }

  //   try {
  //     setIsCapturing(true);
  //     setAutoCapturing(true);
  //     console.log("📸 Starting polaroid capture process...");

  //     const canvasWidth = canvas.width;
  //     const canvasHeight = canvas.height;

  //     const polaroidArea = {
  //       x: 3,
  //       y: 0,
  //       width: 94,
  //       height: 85,
  //     };

  //     const captureArea = {
  //       x: Math.floor((canvasWidth * polaroidArea.x) / 100),
  //       y: Math.floor((canvasHeight * polaroidArea.y) / 100),
  //       width: Math.floor((canvasWidth * polaroidArea.width) / 100),
  //       height: Math.floor((canvasHeight * polaroidArea.height) / 100),
  //     };

  //     const tempCanvas = document.createElement("canvas");
  //     const tempCtx = tempCanvas.getContext("2d");
  //     const enlargedWidth = Math.floor(captureArea.width * 1.3);
  //     const enlargedHeight = Math.floor(captureArea.height * 1.3);

  //     tempCanvas.width = enlargedWidth;
  //     tempCanvas.height = enlargedHeight;

  //     tempCtx.drawImage(
  //       canvas,
  //       captureArea.x,
  //       captureArea.y,
  //       captureArea.width,
  //       captureArea.height,
  //       0,
  //       0,
  //       enlargedWidth,
  //       enlargedHeight
  //     );

  //     const blob = await new Promise((resolve, reject) => {
  //       tempCanvas.toBlob(
  //         (result) => {
  //           if (result) {
  //             resolve(result);
  //           } else {
  //             reject(new Error("Failed to create blob"));
  //           }
  //         },
  //         "image/jpeg",
  //         0.9
  //       );
  //     });

  //     const formData = new FormData();
  //     formData.append("photo", blob, `polaroid_${userData.phone}.jpg`);
  //     formData.append("phone", userData.phone);
  //     formData.append("source", "snapchat_polaroid");

  //     const response = await fetch("http://localhost:3001/api/upload-photo", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();

  //     if (result.success) {
  //       console.log("✅ Upload successful:", result.data.imageUrl);
  //       setTimeout(() => {
  //         onComplete({
  //           ...userData,
  //           photo: result.data.imageUrl,
  //           timestamp: new Date().toISOString(),
  //           lensGroupId: lensGroupId,
  //           captureMode: "polaroid",
  //           uploadSuccess: true,
  //         });
  //       }, 0);
  //     } else {
  //       console.error("❌ Upload failed:", result.message);
  //       setTimeout(() => {
  //         onComplete({
  //           ...userData,
  //           photo: "upload-failed",
  //           timestamp: new Date().toISOString(),
  //           lensGroupId: lensGroupId,
  //           captureMode: "polaroid",
  //           uploadSuccess: false,
  //           errorMessage: result.message,
  //         });
  //       }, 2400);
  //     }
  //   } catch (error) {
  //     console.error("❌ Capture and upload error:", error);
  //     setTimeout(() => {
  //       onComplete({
  //         ...userData,
  //         photo: "capture-failed",
  //         timestamp: new Date().toISOString(),
  //         lensGroupId: lensGroupId,
  //         captureMode: "polaroid",
  //         uploadSuccess: false,
  //         errorMessage: error.message,
  //       });
  //     }, 2400);
  //   } finally {
  //     setIsCapturing(false);
  //     setAutoCapturing(false);
  //   }
  // };

  const captureAndUpload = async () => {
    // Try multiple ways to get the AR canvas
    let canvas = null;

    // Method 1: Use the container ref (since canvas was moved there)
    if (containerRef.current) {
      // If canvas was replaced into containerRef
      if (containerRef.current.tagName === 'CANVAS') {
        canvas = containerRef.current;
      } else {
        // Look for canvas inside the container
        canvas = containerRef.current.querySelector('canvas');
      }
    }

    // Method 2: Use canvasRef if it exists
    if (!canvas && canvasRef.current) {
      canvas = canvasRef.current;
    }

    // Method 3: Get from cache session
    if (!canvas && window.snapARPreloadCache?.session?.output?.live) {
      canvas = window.snapARPreloadCache.session.output.live;
    }

    // Method 4: Find any canvas with ID
    if (!canvas) {
      canvas = document.getElementById('canvas') || document.querySelector('#canvas');
    }

    if (!canvas || !userData?.phone || isCapturing) {
      console.log("❌ Cannot capture:", {
        hasCanvas: !!canvas,
        canvasType: canvas?.tagName,
        hasPhone: !!userData?.phone,
        isCapturing: isCapturing,
        containerRefType: containerRef.current?.tagName,
        containerHasCanvas: !!containerRef.current?.querySelector('canvas')
      });
      return;
    }

    try {
      setIsCapturing(true);
      setAutoCapturing(true);
      console.log("📸 Starting polaroid capture process...");
      console.log("📊 Using canvas:", {
        tagName: canvas.tagName,
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight
      });

      // Wait a moment for canvas to be stable
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get canvas dimensions - try both width/height and clientWidth/clientHeight
      const canvasWidth = canvas.width || canvas.clientWidth || 0;
      const canvasHeight = canvas.height || canvas.clientHeight || 0;

      if (canvasWidth === 0 || canvasHeight === 0) {
        throw new Error(`Canvas has invalid dimensions: ${canvasWidth}x${canvasHeight}`);
      }

      const polaroidArea = {
        x: 3,
        y: 0,
        width: 94,
        height: 85,
      };

      const captureArea = {
        x: Math.floor((canvasWidth * polaroidArea.x) / 100),
        y: Math.floor((canvasHeight * polaroidArea.y) / 100),
        width: Math.floor((canvasWidth * polaroidArea.width) / 100),
        height: Math.floor((canvasHeight * polaroidArea.height) / 100),
      };

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      const enlargedWidth = Math.floor(captureArea.width * 1.3);
      const enlargedHeight = Math.floor(captureArea.height * 1.3);

      tempCanvas.width = enlargedWidth;
      tempCanvas.height = enlargedHeight;

      // Try to draw the image - wrap in try-catch for better error handling
      try {
        tempCtx.drawImage(
          canvas,
          captureArea.x,
          captureArea.y,
          captureArea.width,
          captureArea.height,
          0,
          0,
          enlargedWidth,
          enlargedHeight
        );
      } catch (drawError) {
        console.error("❌ Failed to draw canvas image:", drawError);
        throw new Error(`Canvas drawing failed: ${drawError.message}`);
      }

      const blob = await new Promise((resolve, reject) => {
        tempCanvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/jpeg",
          0.9
        );
      });

      if (blob.size === 0) {
        throw new Error("Generated blob is empty");
      }

      console.log("✅ Blob created successfully, size:", blob.size);

      const formData = new FormData();
      formData.append("photo", blob, `polaroid_${userData.phone}.jpg`);
      formData.append("phone", userData.phone);
      formData.append("source", "snapchat_polaroid");

      const response = await fetch("http://localhost:3001/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("✅ Upload successful:", result.data.imageUrl);
        setTimeout(() => {
          onComplete({
            ...userData,
            photo: result.data.imageUrl,
            timestamp: new Date().toISOString(),
            lensGroupId: lensGroupId,
            captureMode: "polaroid",
            uploadSuccess: true,
          });
        }, 0);
      } else {
        console.error("❌ Upload failed:", result.message);
        setTimeout(() => {
          onComplete({
            ...userData,
            photo: "upload-failed",
            timestamp: new Date().toISOString(),
            lensGroupId: lensGroupId,
            captureMode: "polaroid",
            uploadSuccess: false,
            errorMessage: result.message,
          });
        }, 2400);
      }
    } catch (error) {
      console.error("❌ Capture and upload error:", error);
      setTimeout(() => {
        onComplete({
          ...userData,
          photo: "capture-failed",
          timestamp: new Date().toISOString(),
          lensGroupId: lensGroupId,
          captureMode: "polaroid",
          uploadSuccess: false,
          errorMessage: error.message,
        });
      });
    } finally {
      setIsCapturing(false);
      setAutoCapturing(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto bg-black">
        <div className="text-center p-6">
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={skipToEnd}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
          >
            Skip to End (Test Mode)
          </button>
        </div>
      </div>
    );
  }

  return (
    <ARErrorBoundary onError={skipToEnd}>
      <style jsx>{`
        #canvas {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media screen and (min-width: 768px) and (max-width: 1024px) {
          #canvas {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            aspect-ratio: 9 / 16 !important;
            background: linear-gradient(180deg, #0c1f59, #0b3396) !important;
          }

          .canvas-container {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-black text-white max-w-[768px] mx-auto">
        <div className="flex-1 relative canvas-container" ref={containerRef}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Moving AR experience...</p>
              </div>
            </div>
          )}

          {/* Canvas will be moved here by JavaScript */}

          {autoCapturing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
              <div className="text-center">
                <div className="animate-pulse text-white text-lg font-medium">
                  📸 Capturing your moment...
                </div>
              </div>
            </div>
          )}
        </div>

        {showCaptureButton && !isCapturing && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <button
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
              onClick={handleManualCapture}
              className="font-bold py-4 px-8 transition-all duration-200 hover:scale-105"
            >
              PROCEED
            </button>
          </div>
        )}
      </div>
    </ARErrorBoundary>
  );
};

export default SnapARExperience;