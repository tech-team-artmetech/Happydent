import React, { useRef, useEffect, useState } from "react";
import { createMediaStreamSource, Transform2D } from "@snap/camera-kit";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isTablet =
  /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;

// ⚡ ULTRA-FAST Demon Detection - NO AR Slowdown!
const FastDemonDetection = {
  isDemonDetected: false,
  checkCounter: 0,
  lastCheckTime: 0,
  canvas: null,

  // Initialize with canvas reference
  init: function (canvasElement) {
    this.canvas = canvasElement;
    this.isDemonDetected = false;
    this.checkCounter = 0;
    this.lastCheckTime = 0;
    console.log("👹 Demon detection initialized");
  },

  // 🚀 SUPER LIGHTWEIGHT detection
  checkForDemonFast: function () {
    if (!this.canvas) return false;

    var currentTime = Date.now();

    // Only check every 500ms (not every frame!)
    if (currentTime - this.lastCheckTime < 500) {
      return false; // Skip this check
    }

    this.lastCheckTime = currentTime;
    this.checkCounter++;

    // Quick red pixel check
    var hasRedDemon = this.fastRedCheck();

    if (hasRedDemon) {
      this.isDemonDetected = true;
      console.log(
        "👹 Demon detected in " +
        this.checkCounter +
        " checks - DETECTION COMPLETE"
      );
      return true;
    }

    return false;
  },

  // ⚡ ENHANCED red detection with Claude's visual logic
  fastRedCheck: function () {
    if (!this.canvas) return false;

    try {
      console.log(
        "👹 Checking for demon... (Check #" + this.checkCounter + ")"
      );

      // Focus on the EXACT area where the red demon appears
      var redCount = 0;
      var samplePoints = [
        // Upper demon area (where the red figure clearly is)
        { x: 0.15, y: 0.15 },
        { x: 0.25, y: 0.15 },
        { x: 0.35, y: 0.15 },
        { x: 0.15, y: 0.2 },
        { x: 0.25, y: 0.2 },
        { x: 0.35, y: 0.2 },
        { x: 0.15, y: 0.25 },
        { x: 0.25, y: 0.25 },
        { x: 0.35, y: 0.25 },

        // Middle demon body area
        { x: 0.15, y: 0.3 },
        { x: 0.25, y: 0.3 },
        { x: 0.35, y: 0.3 },
        { x: 0.15, y: 0.35 },
        { x: 0.25, y: 0.35 },
        { x: 0.35, y: 0.35 },

        // Lower demon area
        { x: 0.15, y: 0.4 },
        { x: 0.25, y: 0.4 },
        { x: 0.35, y: 0.4 },

        // Extra focused samples where demon is most visible
        { x: 0.2, y: 0.18 },
        { x: 0.3, y: 0.18 },
        { x: 0.2, y: 0.28 },
        { x: 0.3, y: 0.28 },
      ];

      // Check each sample point
      for (var i = 0; i < samplePoints.length; i++) {
        if (this.isPixelRed(samplePoints[i])) {
          redCount++;
        }
      }

      var redPercentage = redCount / samplePoints.length;

      console.log(
        "👹 Detection result:",
        redCount,
        "of",
        samplePoints.length,
        "pixels are red (",
        (redPercentage * 100).toFixed(1),
        "%)"
      );

      // Lower threshold - works perfectly at 8%
      var demonDetected = redPercentage > 0.06;

      if (demonDetected) {
        console.log(
          "🔥 DEMON DETECTED! Red pixels:",
          redCount,
          "of",
          samplePoints.length,
          "(",
          (redPercentage * 100).toFixed(1),
          "%)"
        );
      } else {
        console.log("👻 No demon detected this check");
      }

      return demonDetected;
    } catch (error) {
      console.warn("Demon detection error:", error);
      return false;
    }
  },

  // Check if specific pixel coordinate is red - ENHANCED DETECTION
  isPixelRed: function (point) {
    try {
      // Get pixel color at this point
      var color = this.getPixelColor(point.x, point.y);

      // Enhanced red detection - more flexible thresholds
      var isRed =
        color.r > 120 && // Red must be strong
        color.r > color.g + 30 && // Red significantly higher than green
        color.r > color.b + 30 && // Red significantly higher than blue
        color.g + color.b < color.r; // Combined G+B less than Red

      if (isRed) {
        console.log(
          "🔴 RED DETECTED at",
          point.x.toFixed(2),
          point.y.toFixed(2),
          "→ RGB:",
          color
        );
      }

      return isRed;
    } catch (error) {
      return false;
    }
  },

  // Get pixel color from WebGL canvas (AR canvas) - WORKING METHOD
  getPixelColor: function (x, y) {
    if (!this.canvas) return { r: 0, g: 0, b: 0 };

    try {
      // METHOD 1: Convert WebGL canvas to 2D canvas for pixel reading
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;

      // Draw the AR canvas onto temp canvas
      tempCtx.drawImage(this.canvas, 0, 0);

      // Now read pixel from the temp canvas
      const pixelX = Math.floor(x * tempCanvas.width);
      const pixelY = Math.floor(y * tempCanvas.height);

      const imageData = tempCtx.getImageData(pixelX, pixelY, 1, 1);
      const data = imageData.data;

      return {
        r: data[0],
        g: data[1],
        b: data[2],
      };
    } catch (error) {
      console.warn("Canvas pixel read failed:", error);
      return { r: 0, g: 0, b: 0 };
    }
  },

  // Reset detection state
  reset: function () {
    this.isDemonDetected = false;
    this.checkCounter = 0;
    this.lastCheckTime = 0;
    console.log("👹 Demon detection reset");
  },
};

const enhanceCanvas = (canvas) => {
  if (!canvas) return;

  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 🚀 MAXIMUM QUALITY SETTINGS
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    console.log("🎨 Canvas quality enhanced");
  } catch (error) {
    console.warn("Canvas enhancement failed:", error);
  }
};

// Error Boundary to catch DOM manipulation errors
class ARErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if it's the specific DOM manipulation error we expect
    if (error.message && error.message.includes("removeChild")) {
      console.log(
        "🛡️ Caught expected DOM manipulation error, suppressing:",
        error.message
      );
      return { hasError: false }; // Don't show error UI for this
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (!error.message || !error.message.includes("removeChild")) {
      console.error("❌ Unexpected AR error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto bg-black">
          <div className="text-center p-6">
            <p className="text-red-300 text-sm mb-4">
              AR experience encountered an error
            </p>
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
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [autoCapturing, setAutoCapturing] = useState(false);
  const sessionRef = useRef(null);
  const captureTimeoutRef = useRef(null);
  const [showCaptureButton, setShowCaptureButton] = useState(false);
  const demonDetectionIntervalRef = useRef(null);

  // 📡 SSE State Management
  const [sseConnected, setSseConnected] = useState(false);
  const [arSessionEnded, setArSessionEnded] = useState(false);
  const sseRef = useRef(null);
  const currentSessionId = useRef(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    initializeARSession();
    return () => {
      cleanup();
    };
  }, []);

  // 📡 SSE Effect - Connect to AR events when sessionId state changes
  useEffect(() => {
    console.log(
      "📡 SSE useEffect triggered - sessionId:",
      sessionId,
      "sseConnected:",
      sseConnected
    );

    if (sessionId && !sseRef.current) {
      console.log("📡 Setting up SSE connection for session:", sessionId);
      setupSSEConnection(sessionId);
    }

    return () => {
      if (sseRef.current) {
        console.log("📡 Cleaning up SSE connection");
        sseRef.current.close();
        sseRef.current = null;
        setSseConnected(false);
      }
    };
  }, [sessionId]);

  // 🎯 Show PROCEED button logic - includes demon detection
  useEffect(() => {
    console.log(
      "🎯 Button logic - arSessionEnded:",
      arSessionEnded,
      "isLoading:",
      isLoading
    );

    if (arSessionEnded) {
      console.log(
        "🎯 AR Session ended via SSE - showing PROCEED button, stopping detection"
      );
      setShowCaptureButton(true);
      stopDemonDetection();
    } else if (!isLoading && !showCaptureButton) {
      console.log(
        "🎯 AR Session active - hiding button, detection will continue until demon found"
      );
      setShowCaptureButton(false);
    }
  }, [arSessionEnded, isLoading]);

  // 👹 START DEMON DETECTION
  const startDemonDetection = () => {
    // ONLY start if not already running
    if (demonDetectionIntervalRef.current) {
      console.log("👹 Detection already running, skipping");
      return;
    }

    console.log("👹 Starting demon detection (one time only)...");

    // Reset detection state
    FastDemonDetection.reset();

    // Start detection loop - ONLY IF we have canvas
    if (!FastDemonDetection.canvas) {
      console.log("👹 No canvas, waiting...");
      return;
    }

    demonDetectionIntervalRef.current = setInterval(() => {
      // Keep checking as long as we have canvas and AR session hasn't ended
      if (FastDemonDetection.canvas && !arSessionEnded) {
        const demonDetected = FastDemonDetection.checkForDemonFast();

        if (demonDetected) {
          console.log(
            "👹 DEMON DETECTED! Showing PROCEED button and stopping detection"
          );
          setShowCaptureButton(true);
          stopDemonDetection();
        }
      }
    }, 3000); // Check every 3 seconds

    console.log("👹 Detection started successfully");
  };

  // 👹 STOP DEMON DETECTION
  const stopDemonDetection = () => {
    if (demonDetectionIntervalRef.current) {
      clearInterval(demonDetectionIntervalRef.current);
      demonDetectionIntervalRef.current = null;
      console.log(
        "👹 Demon detection stopped - either demon found or AR ended"
      );
    }
  };

  // 📡 SETUP SSE CONNECTION FOR AR END DETECTION
  const setupSSEConnection = (sessionId) => {
    try {
      console.log("📡 Connecting to SSE endpoint for session:", sessionId);

      const eventSource = new EventSource(`/api/ar-events/${sessionId}`);
      sseRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("📡 SSE connection established");
        setSseConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📡 SSE message received:", data);

          switch (data.type) {
            case "connected":
              console.log("📡 SSE connected confirmation");
              setSseConnected(true);
              break;

            case "ar_ended":
              console.log("🎯 AR End detected via SSE!", data);
              if (
                data.sessionId === sessionId ||
                data.phone === userData?.phone
              ) {
                setArSessionEnded(true);
              }
              break;

            case "heartbeat":
              // Silent heartbeat
              break;

            default:
              console.log("📡 Unknown SSE message type:", data.type);
          }
        } catch (parseError) {
          console.warn("📡 Failed to parse SSE message:", event.data);
        }
      };

      eventSource.onerror = (error) => {
        console.error("📡 SSE connection error:", error);
        setSseConnected(false);

        if (eventSource.readyState === EventSource.CLOSED) {
          console.log("📡 SSE connection closed");
          sseRef.current = null;
        }
      };
    } catch (error) {
      console.error("📡 Failed to setup SSE connection:", error);
    }
  };

  // 🔍 CHECK AR SESSION STATUS FROM BACKEND
  const checkARSessionStatus = async (sessionId) => {
    try {
      const response = await fetch(`/api/snap/session-status/${sessionId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        console.log("📊 Session status:", data.data.arState);
        return data.data.arState.ended;
      }
      return false;
    } catch (error) {
      console.error("❌ Failed to check session status:", error);
      return false;
    }
  };

  // 🚀 UNIFIED AR SESSION INITIALIZATION
  const initializeARSession = async () => {
    try {
      console.log("🚀 Initializing AR session...");
      setIsLoading(true);
      setError("");

      // 🔍 Try multiple sources for session ID
      let retrievedSessionId = null;

      // Method 1: From userData prop
      if (userData?.sessionId) {
        retrievedSessionId = userData.sessionId;
        console.log("📝 Got session ID from userData:", retrievedSessionId);
      }

      // Method 2: From localStorage with correct key
      if (!retrievedSessionId) {
        retrievedSessionId = localStorage.getItem("snapARSessionId");
        if (retrievedSessionId) {
          console.log(
            "📝 Got session ID from localStorage (snapARSessionId):",
            retrievedSessionId
          );
        }
      }

      // Method 3: Fallback to old key
      if (!retrievedSessionId) {
        retrievedSessionId = localStorage.getItem("currentSessionId");
        if (retrievedSessionId) {
          console.log(
            "📝 Got session ID from localStorage (currentSessionId):",
            retrievedSessionId
          );
        }
      }

      // Method 4: Try to fetch from phone if available
      if (!retrievedSessionId && userData?.phone) {
        console.log(
          "📱 No session ID found, checking for existing session by phone:",
          userData.phone
        );
        try {
          const checkResponse = await fetch(
            `/api/snap/check-session/${userData.phone}`
          );
          const checkData = await checkResponse.json();

          if (
            checkResponse.ok &&
            checkData.success &&
            checkData.data.hasExistingSession
          ) {
            retrievedSessionId = checkData.data.session.sessionId;
            console.log(
              "📝 Found existing session ID for phone:",
              retrievedSessionId
            );

            localStorage.setItem("snapARSessionId", retrievedSessionId);
            localStorage.setItem("currentSessionId", retrievedSessionId);
          }
        } catch (error) {
          console.warn("❌ Failed to check existing session:", error);
        }
      }

      // Method 5: Create new session if still no ID found
      if (!retrievedSessionId && userData?.phone) {
        console.log(
          "🆕 No session found, creating new session for phone:",
          userData.phone
        );
        try {
          const createResponse = await fetch("/api/snap/create-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: userData.phone,
              forceNew: false,
            }),
          });

          const createData = await createResponse.json();

          if (createResponse.ok && createData.success) {
            retrievedSessionId = createData.data.sessionId;
            console.log("✅ Created new session ID:", retrievedSessionId);

            localStorage.setItem("snapARSessionId", retrievedSessionId);
            localStorage.setItem("currentSessionId", retrievedSessionId);

            // Associate phone with session
            if (userData.phone) {
              console.log("📱 Associating phone with new session");
              await fetch("/api/snap/associate-phone", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  sessionId: retrievedSessionId,
                  phone: userData.phone,
                  userInfo: {
                    userId: userData.userId,
                    userName: userData.userName,
                    phone: userData.phone,
                  },
                }),
              });
            }
          }
        } catch (error) {
          console.error("❌ Failed to create new session:", error);
        }
      }

      // Set session ID if found
      if (retrievedSessionId) {
        console.log("✅ Final session ID:", retrievedSessionId);
        currentSessionId.current = retrievedSessionId;
        setSessionId(retrievedSessionId);

        // 🔍 Check initial AR session status
        const isEnded = await checkARSessionStatus(retrievedSessionId);
        setArSessionEnded(isEnded);
        console.log(`📊 Initial AR session status - Ended: ${isEnded}`);
      } else {
        console.warn("⚠️ No session ID could be obtained");
      }

      const cache = window.snapARPreloadCache;
      const isRetry = userData?.isRetry;
      const needsCompleteRestart = userData?.needsCompleteRestart;

      console.log("📊 Session check:", {
        isRetry,
        needsCompleteRestart,
        hasCache: !!cache,
        sessionReady: cache?.sessionReady,
        hasSession: !!cache?.session,
        hasCanvas: !!cache?.session?.output?.live,
      });

      // 🔥 COMPLETE RESTART: Recreate everything from scratch
      if (needsCompleteRestart || (isRetry && cache?.needsCompleteRestart)) {
        console.log(
          "🔥 Complete restart requested - recreating entire AR session"
        );
        await createCompletelyFreshARSession();
        return;
      }

      // 🆕 FRESH INITIALIZATION: Wait for preloaded session or create new
      if (cache?.sessionReady && cache.session?.output?.live) {
        console.log("✅ Using preloaded session");
        await setupCanvasAndStart(cache.session.output.live, cache.session);
      } else if (cache?.isPreloading) {
        console.log("⏳ Waiting for preload to complete...");
        await waitForSessionReady();

        if (cache.session?.output?.live) {
          await setupCanvasAndStart(cache.session.output.live, cache.session);
        } else {
          throw new Error("Preload completed but no canvas available");
        }
      } else {
        console.log("🔧 No preloaded session, creating fresh one...");
        await createCompletelyFreshARSession();
      }
    } catch (err) {
      console.error("❌ AR initialization failed:", err);
      setError(`Failed to initialize AR: ${err.message}`);
      setIsLoading(false);
    }
  };

  // 🔥 CREATE COMPLETELY FRESH AR SESSION
  const createCompletelyFreshARSession = async () => {
    try {
      console.log("🔥 Creating completely fresh AR session...");

      // Clear any existing cache completely
      if (window.snapARPreloadCache) {
        const cache = window.snapARPreloadCache;

        // Stop everything properly
        if (cache.session) {
          try {
            await cache.session.pause();
            console.log("🛑 Previous session paused");
          } catch (e) {
            console.log("Session already stopped");
          }
        }

        if (cache.mediaStream) {
          cache.mediaStream.getTracks().forEach((track) => {
            track.stop();
            console.log("🛑 Media track stopped:", track.kind);
          });
        }

        // Add a small delay to ensure cleanup is complete
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 🆕 RECREATE ENTIRE CACHE AND SESSION
      window.snapARPreloadCache = {
        cameraKit: null,
        lenses: null,
        cameraManager: null,
        mediaStream: null,
        session: null,
        source: null,
        appliedLens: null,
        isPreloaded: false,
        isPreloading: false,
        preloadProgress: 0,
        error: null,
        sessionReady: false,
        needsCompleteRestart: false,
      };

      const cache = window.snapARPreloadCache;
      cache.isPreloading = true;

      console.log("🔥 Step 1: Initialize Camera Kit...");
      const { bootstrapCameraKit } = await import("@snap/camera-kit");
      cache.cameraKit = await bootstrapCameraKit({
        apiToken: apiToken,
      });

      console.log("🔥 Step 2: Get camera stream...");
      // Create camera manager with better error handling
      class CameraManager {
        constructor() {
          this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          this.isBackFacing = false;
          this.mediaStream = null;
        }

        async initializeCamera() {
          try {
            if (!this.isMobile) {
              document.body.classList.add("desktop");
            }

            console.log("📹 Requesting camera access...");
            this.mediaStream = await navigator.mediaDevices.getUserMedia(
              this.getConstraints()
            );

            // Verify the stream is active
            if (!this.mediaStream || !this.mediaStream.active) {
              throw new Error("Media stream is not active after creation");
            }

            console.log("✅ Camera stream active:", this.mediaStream.active);
            return this.mediaStream;
          } catch (error) {
            console.error("❌ Camera initialization failed:", error);
            throw new Error(`Camera access failed: ${error.message}`);
          }
        }

        getConstraints() {
          const settings = {
            camera: {
              constraints: {
                front: {
                  video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  },
                  audio: false,
                },
                back: {
                  video: {
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  },
                  audio: false,
                },
                desktop: {
                  video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  },
                  audio: false,
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

      cache.cameraManager = new CameraManager();
      cache.mediaStream = await cache.cameraManager.initializeCamera();

      console.log("🔥 Step 3: Load lenses...");
      const { lenses } = await cache.cameraKit.lensRepository.loadLensGroups([
        lensGroupId,
      ]);
      cache.lenses = lenses;

      console.log("🔥 Step 4: Create session...");
      cache.session = await cache.cameraKit.createSession();

      console.log("🔥 Step 5: Create and configure source...");
      const { createMediaStreamSource, Transform2D } = await import(
        "@snap/camera-kit"
      );

      // Verify media stream is still active before creating source
      if (!cache.mediaStream || !cache.mediaStream.active) {
        throw new Error("Media stream became inactive before source creation");
      }

      cache.source = createMediaStreamSource(cache.mediaStream, {
        cameraType: "user",
        disableSourceAudio: true, // Disable audio to avoid issues
      });

      console.log("🔥 Step 6: Configure session...");
      await cache.session.setSource(cache.source);
      cache.source.setTransform(Transform2D.MirrorX);
      await cache.source.setRenderSize(window.innerWidth, window.innerHeight);
      await cache.session.setFPSLimit(60);

      if (cache.lenses && cache.lenses.length > 0) {
        console.log("🔥 Step 7: Apply lens...");
        await cache.session.applyLens(cache.lenses[0]);
        cache.appliedLens = cache.lenses[0];
      }

      cache.isPreloaded = true;
      cache.sessionReady = true;
      cache.isPreloading = false;

      console.log("🔥 Step 8: Setup canvas and start...");
      if (cache.session.output?.live) {
        await setupCanvasAndStart(cache.session.output.live, cache.session);
      } else {
        throw new Error("No canvas after fresh session creation");
      }
    } catch (error) {
      console.error("❌ Fresh AR session creation failed:", error);

      // Clean up on error
      if (window.snapARPreloadCache?.mediaStream) {
        window.snapARPreloadCache.mediaStream
          .getTracks()
          .forEach((track) => track.stop());
      }

      throw new Error(`Fresh session creation failed: ${error.message}`);
    }
  };

  // 🎯 SETUP CANVAS AND START SESSION
  const setupCanvasAndStart = async (arCanvas, session) => {
    try {
      console.log("🎯 Setting up canvas and starting session...");

      if (!arCanvas || arCanvas.tagName !== "CANVAS") {
        throw new Error(`Invalid canvas: ${arCanvas?.tagName || "null"}`);
      }

      // Store session reference
      sessionRef.current = session;

      // Style the canvas for our layout
      arCanvas.id = "canvas";
      arCanvas.style.width = "100%";
      arCanvas.style.height = "100%";
      arCanvas.style.objectFit = "cover";

      // 🎨 ENHANCE CANVAS QUALITY
      enhanceCanvas(arCanvas);

      // 👹 INITIALIZE DEMON DETECTION WITH CANVAS
      FastDemonDetection.init(arCanvas);

      // Replace our container with the AR canvas
      const container = containerRef.current;
      if (container && container.parentNode) {
        container.parentNode.replaceChild(arCanvas, container);
        containerRef.current = arCanvas;
        canvasRef.current = arCanvas;
      }

      // Start the session
      console.log("▶️ Starting AR session...");
      await session.play();

      console.log("🎉 AR session started successfully!");
      setIsLoading(false);

      // 👹 START DEMON DETECTION ONCE - ONLY HERE
      if (!arSessionEnded) {
        console.log("👹 Canvas ready, starting demon detection...");
        startDemonDetection();
      }
    } catch (err) {
      throw new Error(`Canvas setup failed: ${err.message}`);
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

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 10000);
    });
  };

  const cleanup = () => {
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }

    // 👹 STOP DEMON DETECTION
    stopDemonDetection();

    // 📡 Close SSE connection
    if (sseRef.current) {
      console.log("📡 Closing SSE connection during cleanup");
      sseRef.current.close();
      sseRef.current = null;
      setSseConnected(false);
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

  // 🚀 Debug function to manually trigger SSE connection
  const debugSSEConnection = () => {
    console.log("🐛 Debug: Manual SSE connection trigger");
    console.log("SessionId state:", sessionId);
    console.log("CurrentSessionId ref:", currentSessionId.current);
    console.log("SSE connected:", sseConnected);
    console.log("SSE ref:", sseRef.current);

    if (!sessionId && currentSessionId.current) {
      console.log("🐛 Setting sessionId state from ref");
      setSessionId(currentSessionId.current);
    }

    if (sessionId && !sseRef.current) {
      console.log("🐛 Manually setting up SSE connection");
      setupSSEConnection(sessionId);
    }
  };

  // 🚀 Force SSE connection if sessionId exists but no connection
  useEffect(() => {
    // Fallback check every 3 seconds to ensure SSE connection
    const fallbackTimer = setInterval(() => {
      if (sessionId && !sseRef.current && !sseConnected) {
        console.log("🔄 Fallback: Attempting to reconnect SSE");
        setupSSEConnection(sessionId);
      }
    }, 3000);

    return () => clearInterval(fallbackTimer);
  }, [sessionId, sseConnected]);

  const captureAndUpload = async () => {
    // Try multiple ways to get the AR canvas
    let canvas = null;

    // Method 1: Use the container ref (since canvas was moved there)
    if (containerRef.current) {
      if (containerRef.current.tagName === "CANVAS") {
        canvas = containerRef.current;
      } else {
        canvas = containerRef.current.querySelector("canvas");
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
      canvas =
        document.getElementById("canvas") || document.querySelector("#canvas");
    }

    if (!canvas || !userData?.phone || isCapturing) {
      console.log("❌ Cannot capture:", {
        hasCanvas: !!canvas,
        canvasType: canvas?.tagName,
        hasPhone: !!userData?.phone,
        isCapturing: isCapturing,
        containerRefType: containerRef.current?.tagName,
        containerHasCanvas: !!containerRef.current?.querySelector("canvas"),
      });
      return;
    }

    try {
      setIsCapturing(true);
      setAutoCapturing(true);
      console.log("📸 Starting enhanced polaroid capture process...");

      // 🎨 ENHANCE CANVAS ONE MORE TIME BEFORE CAPTURE
      enhanceCanvas(canvas);

      // Wait a moment for canvas to be stable
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Get canvas dimensions
      const canvasWidth = canvas.width || canvas.clientWidth || 0;
      const canvasHeight = canvas.height || canvas.clientHeight || 0;

      if (canvasWidth === 0 || canvasHeight === 0) {
        throw new Error(
          `Canvas has invalid dimensions: ${canvasWidth}x${canvasHeight}`
        );
      }

      let polaroidArea = {
        x: 2,
        y: 2,
        width: 96,
        height: 88,
      };

      if (isTablet) {
        polaroidArea = {
          x: 5,
          y: 0,
          width: 90,
          height: 90,
        };
      } else {
        polaroidArea = {
          x: 2,
          y: 12,
          width: 96,
          height: 68,
        };
      }

      const captureArea = {
        x: Math.floor((canvasWidth * polaroidArea.x) / 100),
        y: Math.floor((canvasHeight * polaroidArea.y) / 100),
        width: Math.floor((canvasWidth * polaroidArea.width) / 100),
        height: Math.floor((canvasHeight * polaroidArea.height) / 100),
      };

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      // 🚀 ENHANCE TEMPORARY CANVAS TOO
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = "high";

      const enlargedWidth = Math.floor(captureArea.width * 1.3);
      const enlargedHeight = Math.floor(captureArea.height * 1.3);

      tempCanvas.width = enlargedWidth;
      tempCanvas.height = enlargedHeight;

      // Draw the image
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

      // 🏆 CAPTURE WITH HIGHER QUALITY
      const blob = await new Promise((resolve, reject) => {
        tempCanvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/png",
          1.0
        );
      });

      if (blob.size === 0) {
        throw new Error("Generated blob is empty");
      }

      console.log("✅ Enhanced blob created successfully, size:", blob.size);

      const formData = new FormData();
      formData.append("photo", blob, `enhanced_polaroid_${userData.phone}.png`);
      formData.append("phone", userData.phone);
      formData.append("source", "snapchat_polaroid");

      const response = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log("✅ Enhanced upload successful:", result.data.imageUrl);
        onComplete({
          ...userData,
          photo: result.data.imageUrl,
          timestamp: new Date().toISOString(),
          lensGroupId: lensGroupId,
          captureMode: "enhanced_polaroid",
          uploadSuccess: true,
          demonDetected: FastDemonDetection.isDemonDetected,
        });
      } else {
        console.error("❌ Upload failed:", result.message);
        setTimeout(() => {
          onComplete({
            ...userData,
            photo: "upload-failed",
            timestamp: new Date().toISOString(),
            lensGroupId: lensGroupId,
            captureMode: "enhanced_polaroid",
            uploadSuccess: false,
            errorMessage: result.message,
            demonDetected: FastDemonDetection.isDemonDetected,
          });
        }, 2400);
      }
    } catch (error) {
      console.error("❌ Enhanced capture and upload error:", error);
      setTimeout(() => {
        onComplete({
          ...userData,
          photo: "capture-failed",
          timestamp: new Date().toISOString(),
          lensGroupId: lensGroupId,
          captureMode: "enhanced_polaroid",
          uploadSuccess: false,
          errorMessage: error.message,
          demonDetected: FastDemonDetection.isDemonDetected,
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
                <p className="text-white">🚀 Loading AR experience...</p>
              </div>
            </div>
          )}

          {autoCapturing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
              <div className="text-center">
                <div className="animate-pulse text-white text-lg font-medium">
                  📸 Capturing your moment...
                </div>
              </div>
            </div>
          )}

          {/* 📡 SSE Connection Indicator and Demon Detection Status (optional debug info) */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <div
                className={`w-3 h-3 rounded-full ${sseConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                title={`SSE: ${sseConnected ? "Connected" : "Disconnected"}`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${arSessionEnded ? "bg-red-500" : "bg-green-500"
                  }`}
                title={`AR: ${arSessionEnded ? "Ended" : "Active"}`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${FastDemonDetection.isDemonDetected
                  ? "bg-red-500"
                  : "bg-gray-500"
                  }`}
                title={`Demon: ${FastDemonDetection.isDemonDetected
                  ? "Detected"
                  : "Not Detected"
                  }`}
              ></div>
              {/* Debug button */}
              <button
                onClick={debugSSEConnection}
                className="text-xs bg-gray-700 px-2 py-1 rounded"
                title="Debug SSE Connection"
              >
                SSE
              </button>
            </div>
          )}
        </div>

        {/* 🚀 Show PROCEED button when AR has ended OR demon detected */}
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
              {FastDemonDetection.isDemonDetected ? "PROCEED" : "PROCEED"}
            </button>
          </div>
        )}
      </div>
    </ARErrorBoundary>
  );
};

export default SnapARExperience;
