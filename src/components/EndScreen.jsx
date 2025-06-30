import React, { useState, useEffect } from "react";

const EndScreen = ({ onRetry, onRetryAR }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [photoInfo, setPhotoInfo] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "";

  useEffect(() => {
    // Get user info from localStorage
    const phone = localStorage.getItem("userPhone");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    if (phone && userId && userName) {
      setUserInfo({ phone, userId, userName });
      fetchUserPhoto(phone);
    }
  }, []);

  // Fetch user photo from server
  const fetchUserPhoto = async (phone) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/user/${phone}/photo`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setPhotoInfo(data.data);
        if (data.data.hasPhoto) {
          setUserPhoto(data.data.imageUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Download photo function
  const downloadPhoto = async () => {
    if (!userInfo?.phone) {
      setError("User information not found. Please register again.");
      return;
    }

    if (!photoInfo?.hasPhoto) {
      setError("No photo available to download.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log(`📥 Downloading photo for ${userInfo.phone}`);

      const response = await fetch(
        `/api/download-photo/${userInfo.phone}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Download failed");
      }

      // Get the blob data
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Set filename
      const fileName = `${userInfo.userName.replace(
        /\s+/g,
        "_"
      )}_happydent_photo.jpg`;
      link.download = fileName;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`✅ Photo downloaded successfully: ${fileName}`);
    } catch (error) {
      console.error("Download error:", error);
      setError(error.message || "Failed to download photo. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (photoInfo?.hasPhoto) {
      // Download the photo instead of printing the page
      downloadPhoto();
    }
  };

  // 🚀 NEW: Smart retry function that checks for existing AR session
  const handleRetry = () => {
    console.log("🔄 Retry button clicked");

    // Check if AR session is still available and ready
    const cache = window.snapARPreloadCache;
    const hasValidARSession = cache?.sessionReady && cache?.session;

    console.log("📊 AR Session Status:", {
      hasCache: !!cache,
      sessionReady: cache?.sessionReady,
      hasSession: !!cache?.session,
      canReuseAR: hasValidARSession
    });

    if (hasValidARSession && onRetryAR) {
      // AR session is available - go directly to AR experience
      console.log("✅ Reusing existing AR session - no reload needed!");

      // Don't clear localStorage - keep user info for retry
      // Just trigger AR experience with existing session
      onRetryAR({
        phone: userInfo.phone,
        userId: userInfo.userId,
        userName: userInfo.userName
      });
    } else {
      // AR session not available - do full restart
      console.log("🔄 AR session not available - doing full restart");

      // Clear localStorage for full restart
      localStorage.removeItem("userPhone");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");

      if (onRetry) {
        onRetry();
      }
    }
  };

  // 🚀 NEW: Reset AR session function (optional - for troubleshooting)
  const resetARSession = () => {
    console.log("🧹 Resetting AR session cache");

    if (window.snapARPreloadCache) {
      // Stop the session if it's playing
      if (window.snapARPreloadCache.session) {
        try {
          window.snapARPreloadCache.session.pause();
        } catch (e) {
          console.log("Session already paused or stopped");
        }
      }

      // Reset cache flags but keep the session for potential reuse
      window.snapARPreloadCache.sessionReady = false;
      window.snapARPreloadCache.isPreloaded = false;
    }

    // Now do full restart
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    if (onRetry) {
      onRetry();
    }
  };

  const buttonStyle = {
    width: "208px",
    height: "38px",
    background:
      "radial-gradient(31% 31% at 50% 50%, #FFFFFF 0%, #0033FF 59%, #000DFF 100%)",
    borderRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.52)",
    boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
    backdropFilter: "blur(20px)",
    opacity: "100%",
    zIndex: 10,
    position: "relative",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto relative z-10">
      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded p-3 text-center z-20">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Loading Message */}
      {isLoading && (
        <div className="mb-4 bg-blue-500/20 border border-blue-500/50 rounded p-3 text-center z-20">
          <p className="text-blue-300 text-sm">
            {userPhoto ? "Downloading your photo..." : "Loading your photo..."}
          </p>
        </div>
      )}

      {/* Image */}
      <div className="mb-8 z-10">
        <img
          src={userPhoto || "/assets/enddummy.png"}
          alt="Result"
          className="w-80 h-80 object-contain rounded-lg"
          onError={(e) => {
            // Fallback to dummy image if user photo fails to load
            e.target.src = "/assets/enddummy.png";
          }}
        />

        {/* Photo Status Indicator */}
        {userInfo && (
          <div className="text-center mt-2">
            {photoInfo?.hasPhoto ? (
              <p className="text-green-300 text-xs"></p>
            ) : (
              <p className="text-yellow-300 text-xs"></p>
            )}
          </div>
        )}
      </div>

      {/* Buttons Container */}
      <div className="flex flex-col space-y-4 items-center z-20 relative">
        {/* Print/Download Button */}
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="text-white text-xl font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed py-3 w-[180px]"
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
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              DOWNLOADING...
            </div>
          ) : photoInfo?.hasPhoto ? (
            "DOWNLOAD"
          ) : (
            "PRINT"
          )}
        </button>

        {/* Smart Retry Button */}
        <button
          onClick={handleRetry}
          disabled={isLoading}
          className="text-white text-xl font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed py-3 w-[180px]"
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
          {window.snapARPreloadCache?.sessionReady ? "RETRY" : "RETRY"}
        </button>
      </div>

    </div>
  );
};

export default EndScreen;