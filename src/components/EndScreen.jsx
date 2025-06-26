import React, { useState, useEffect } from "react";

const EndScreen = ({ onRetry }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [photoInfo, setPhotoInfo] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "https://artmetech.co.in";

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
      const response = await fetch(`/api/user/${phone}/photo`);
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

      const response = await fetch(`/api/download-photo/${userInfo.phone}`, {
        method: "GET",
      });

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

  const handleRetry = () => {
    // Clear localStorage when retrying
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
          className="text-white text-xl font-bold hover:scale-105 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={buttonStyle}
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

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={isLoading}
          className="text-white text-xl font-bold hover:scale-105 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={buttonStyle}
        >
          RETRY
        </button>
      </div>

      {/* User Info (Optional - Hidden by default) */}
      {userInfo && (
        <div className="mt-8 text-center z-20">
          <p className="text-white/60 text-xs">
            Welcome back, {userInfo.userName}!
          </p>
        </div>
      )}
    </div>
  );
};

export default EndScreen;
