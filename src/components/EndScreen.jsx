// import React, { useState, useEffect } from "react";

// const EndScreen = ({ onRetry, onRetryAR }) => {
//   const [userInfo, setUserInfo] = useState(null);
//   const [photoInfo, setPhotoInfo] = useState(null);
//   const [userPhoto, setUserPhoto] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🚨 NEW: Store lens selection info
//   const [lensInfo, setLensInfo] = useState({
//     groupSize: null,
//     lensId: null,
//   });

//   const API_BASE_URL = "";

//   // useEffect(() => {
//   //   // Get user info from localStorage
//   //   const phone = localStorage.getItem("userPhone");
//   //   const userId = localStorage.getItem("userId");
//   //   const userName = localStorage.getItem("userName");

//   //   // 🚨 NEW: Get lens selection info
//   //   const selectedGroupSize = localStorage.getItem("selectedGroupSize");
//   //   const selectedLensId = selectedGroupSize === "less" ?
//   //     "bc57c671-4255-423e-9eaf-71daba627ca8" :
//   //     "c4b85218-50a5-4a71-b719-0a1381b4e73e";

//   //   if (phone && userId && userName) {
//   //     setUserInfo({ phone, userId, userName });
//   //     setLensInfo({
//   //       groupSize: selectedGroupSize || "less",
//   //       lensId: selectedLensId,
//   //     });
//   //     fetchUserPhoto(phone);
//   //   }
//   // }, []);

//   // useEffect(() => {
//   //   // Get user info from localStorage
//   //   const phone = localStorage.getItem("userPhone");
//   //   const userId = localStorage.getItem("userId");
//   //   const userName = localStorage.getItem("userName");

//   //   // Get lens selection info
//   //   const selectedGroupSize = localStorage.getItem("selectedGroupSize");
//   //   const selectedLensId = selectedGroupSize === "less"
//   //     ? "bc57c671-4255-423e-9eaf-71daba627ca8"
//   //     : "c4b85218-50a5-4a71-b719-0a1381b4e73e";

//   //   if (phone && userId && userName) {
//   //     setUserInfo({ phone, userId, userName });
//   //     setLensInfo({
//   //       groupSize: selectedGroupSize || "less",
//   //       lensId: selectedLensId,
//   //     });

//   //     // ✅ NEW: Fetch image URL directly from localStorage
//   //     const imageUrl = localStorage.getItem("userPhoto");
//   //     if (imageUrl) {
//   //       setUserPhoto(imageUrl);
//   //       setPhotoInfo({ hasPhoto: true, imageUrl });
//   //     }
//   //   }
//   // }, []);

//   useEffect(() => {
//     // Get user info from localStorage
//     const phone = localStorage.getItem("userPhone");
//     const userId = localStorage.getItem("userId");
//     const userName = localStorage.getItem("userName");

//     // Get lens selection info
//     const selectedGroupSize = localStorage.getItem("selectedGroupSize");
//     const selectedLensId = selectedGroupSize === "less"
//       ? "bc57c671-4255-423e-9eaf-71daba627ca8"
//       : "c4b85218-50a5-4a71-b719-0a1381b4e73e";

//     if (phone && userId && userName) {
//       setUserInfo({ phone, userId, userName });
//       setLensInfo({
//         groupSize: selectedGroupSize || "less",
//         lensId: selectedLensId,
//       });

//       // 🔧 FIX: Get current counter and construct the correct image URL
//       const currentCounter = localStorage.getItem("photoCounter") || "0";
//       console.log("📷 Current photo counter:", currentCounter);

//       // Check if we have a cached URL first
//       const cachedImageUrl = localStorage.getItem("userPhoto");

//       if (cachedImageUrl) {
//         console.log("📷 Using cached image URL:", cachedImageUrl);

//         // 🔧 IMPORTANT: Add cache busting with current counter
//         const cacheBustedUrl = `${cachedImageUrl}?counter=${currentCounter}&t=${Date.now()}`;

//         setUserPhoto(cacheBustedUrl);
//         setPhotoInfo({ hasPhoto: true, imageUrl: cacheBustedUrl });
//       } else {
//         // 🔧 FIX: If no cached URL, construct the expected URL based on counter
//         console.log("📷 No cached URL, constructing expected URL with counter:", currentCounter);

//         // Construct the expected filename based on current counter
//         const expectedImageUrl = `https://artmetech.co.in/api/uploads/enhanced_polaroid_${phone}_${currentCounter}.png?t=${Date.now()}`;

//         console.log("📷 Expected image URL:", expectedImageUrl);

//         // Try to load the expected image
//         const img = new Image();
//         img.onload = () => {
//           console.log("✅ Expected image loaded successfully");
//           setUserPhoto(expectedImageUrl);
//           setPhotoInfo({ hasPhoto: true, imageUrl: expectedImageUrl });
//           // Cache it for next time
//           localStorage.setItem("userPhoto", expectedImageUrl.split('?')[0]); // Store without cache busting params
//         };
//         img.onerror = () => {
//           console.log("❌ Expected image failed, trying API fallback...");
//           fetchUserPhoto(phone);
//         };
//         img.src = expectedImageUrl;
//       }
//     }
//   }, []);

//   // Fetch user photo from server
//   const fetchUserPhoto = async (phone) => {
//     try {
//       setIsLoading(true);
//       console.log("📷 Fetching photo from API for phone:", phone);

//       const response = await fetch(
//         `https://artmetech.co.in/api/user/${phone}/photo`
//       );
//       const data = await response.json();

//       if (response.ok && data.success) {
//         setPhotoInfo(data.data);
//         if (data.data.hasPhoto) {
//           // 🔧 FIX: Add cache busting to API response too
//           const currentCounter = localStorage.getItem("photoCounter") || "0";
//           const cacheBustedUrl = `${data.data.imageUrl}?counter=${currentCounter}&t=${Date.now()}`;

//           console.log("📷 API returned image, adding cache busting:", cacheBustedUrl);

//           setUserPhoto(cacheBustedUrl);
//           // Update localStorage with the base URL (without cache busting)
//           localStorage.setItem("userPhoto", data.data.imageUrl);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching photo:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Download photo function
//   const downloadPhoto = async () => {
//     if (!userInfo?.phone) {
//       setError("User information not found. Please register again.");
//       return;
//     }

//     if (!photoInfo?.hasPhoto) {
//       setError("No photo available to download.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       console.log(`📥 Downloading photo for ${userInfo.phone}`);

//       const response = await fetch(
//         `https://artmetech.co.in/api/download-photo/${userInfo.phone}`,
//         {
//           method: "GET",
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Download failed");
//       }

//       // Get the blob data
//       const blob = await response.blob();

//       // Create download link
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;

//       // Set filename
//       const fileName = `${userInfo.userName.replace(
//         /\s+/g,
//         "_"
//       )}_happydent_photo.jpg`;
//       link.download = fileName;

//       // Trigger download
//       document.body.appendChild(link);
//       link.click();

//       // Cleanup
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       console.log(`✅ Photo downloaded successfully: ${fileName}`);
//     } catch (error) {
//       console.error("Download error:", error);
//       setError(error.message || "Failed to download photo. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     if (photoInfo?.hasPhoto) {
//       // Download the photo instead of printing the page
//       downloadPhoto();
//     }
//   };

//   // 🚀 UPDATED: Smart retry function with lens info
//   const handleSmartRetry = async () => {
//     console.log("🔄 Smart retry initiated");
//     setIsLoading(true);
//     setError("");

//     try {
//       const phone = userInfo?.phone;
//       if (!phone) {
//         throw new Error("User phone not found. Please start over.");
//       }

//       console.log(`📱 Checking existing session for phone: ${phone}`);

//       // Step 1: Check if there's an existing session for this phone
//       const sessionCheckResponse = await fetch(
//         `https://artmetech.co.in/api/snap/check-session/${phone}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const sessionCheckData = await sessionCheckResponse.json();
//       console.log("📊 Session check result:", sessionCheckData);

//       let sessionId = null;
//       let isNewSession = false;

//       if (sessionCheckResponse.ok && sessionCheckData.success) {
//         if (
//           sessionCheckData.data.hasExistingSession &&
//           sessionCheckData.data.session.canReuse
//         ) {
//           // Existing session found and can be reused
//           sessionId = sessionCheckData.data.session.sessionId;
//           console.log(`♻️ Found existing reusable session: ${sessionId}`);

//           // Step 2a: Reset the existing session to ended: false
//           const resetResponse = await fetch(
//             "https://artmetech.co.in/api/snap/reset-session",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 sessionId: sessionId,
//                 phone: phone,
//               }),
//             }
//           );

//           const resetData = await resetResponse.json();

//           if (!resetResponse.ok || !resetData.success) {
//             throw new Error(resetData.message || "Failed to reset session");
//           }

//           console.log(`✅ Session reset successfully:`, resetData.data);
//         } else {
//           // No existing session or not reusable - create new one
//           console.log(`🆕 No reusable session found, creating new session`);
//           isNewSession = true;
//         }
//       } else {
//         console.log(`🆕 Session check failed, creating new session`);
//         isNewSession = true;
//       }

//       // Step 2b: Create new session if needed
//       if (isNewSession) {
//         const createSessionResponse = await fetch(
//           "https://artmetech.co.in/api/snap/create-session",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               phone: phone,
//               forceNew: true, // Force new session
//             }),
//           }
//         );

//         const createSessionData = await createSessionResponse.json();

//         if (!createSessionResponse.ok || !createSessionData.success) {
//           throw new Error(
//             createSessionData.message || "Failed to create new session"
//           );
//         }

//         sessionId = createSessionData.data.sessionId;
//         console.log(`✅ New session created: ${sessionId}`);

//         // Step 3: Associate phone with the new session
//         const associateResponse = await fetch(
//           "https://artmetech.co.in/api/snap/associate-phone",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               sessionId: sessionId,
//               phone: phone,
//               userInfo: {
//                 userId: userInfo.userId,
//                 userName: userInfo.userName,
//                 phone: phone,
//               },
//             }),
//           }
//         );

//         const associateData = await associateResponse.json();

//         if (!associateResponse.ok || !associateData.success) {
//           throw new Error(
//             associateData.message || "Failed to associate phone with session"
//           );
//         }

//         console.log(`✅ Phone associated with session:`, associateData.data);
//       }

//       // Step 4: Reset the phone-based AR state to ended: false
//       const arEndResponse = await fetch("https://artmetech.co.in/api/ar-end", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           phone: phone,
//           ended: false, // Reset to ongoing
//         }),
//       });

//       const arEndData = await arEndResponse.json();

//       if (!arEndResponse.ok || !arEndData.success) {
//         console.warn("⚠️ Failed to reset AR end state:", arEndData.message);
//         // Don't throw error here, as the session is already set up
//       } else {
//         console.log(`✅ AR state reset to ongoing:`, arEndData.data);
//       }

//       // Step 5: Update local storage with session info
//       localStorage.setItem("currentSessionId", sessionId);
//       localStorage.setItem("snapARSessionId", sessionId); // 🚨 NEW: Also set this key
//       localStorage.setItem("arSessionReady", "true");

//       // 🚨 NEW: Ensure lens selection is preserved
//       if (lensInfo.groupSize) {
//         localStorage.setItem("selectedGroupSize", lensInfo.groupSize);
//       }

//       // Step 6: Check if we can reuse AR session from cache
//       const cache = window.snapARPreloadCache;
//       const hasValidARSession = cache?.sessionReady && cache?.session;

//       console.log("📊 Final AR Session Status:", {
//         sessionId: sessionId,
//         hasCache: !!cache,
//         sessionReady: cache?.sessionReady,
//         hasSession: !!cache?.session,
//         canReuseAR: hasValidARSession,
//         lensInfo: lensInfo, // 🚨 NEW: Log lens info
//       });

//       // 🚨 NEW: Force cache to load both lenses if needed
//       if (hasValidARSession && cache && !cache.lenses?.loaded) {
//         console.log("🔄 Cache exists but lenses not loaded, forcing fresh session");

//         // Clear cache to force fresh session creation with both lenses
//         if (cache.session) {
//           try {
//             await cache.session.pause();
//           } catch (e) {
//             console.log("Session already stopped");
//           }
//         }

//         if (cache.mediaStream) {
//           cache.mediaStream.getTracks().forEach((track) => track.stop());
//         }

//         window.snapARPreloadCache = null;
//         hasValidARSession = false;
//       }

//       // Step 7: Execute the appropriate retry action
//       if (hasValidARSession && onRetryAR) {
//         // AR session is available - go directly to AR experience
//         console.log("🎮 Launching AR experience with session:", sessionId);

//         onRetryAR({
//           sessionId: sessionId,
//           phone: userInfo.phone,
//           userId: userInfo.userId,
//           userName: userInfo.userName,
//           groupSize: lensInfo.groupSize, // 🚨 NEW: Pass lens info
//           isRetry: true,
//         });
//       } else {
//         // No AR session in cache - do full restart but keep session info
//         console.log("🔄 Doing full restart with session:", sessionId);

//         // Keep session info but clear other data for fresh registration flow
//         localStorage.removeItem("userPhone");
//         localStorage.removeItem("userId");
//         localStorage.removeItem("userName");
//         // 🚨 NEW: Keep lens selection
//         // localStorage.removeItem("selectedGroupSize"); // Don't remove this

//         if (onRetry) {
//           onRetry({
//             sessionId: sessionId,
//             preserveSession: true,
//             lensInfo: lensInfo, // 🚨 NEW: Pass lens info
//           });
//         }
//       }
//     } catch (error) {
//       console.error("❌ Retry error:", error);
//       setError(error.message || "Failed to restart session. Please try again.");

//       // Fallback: Clear everything and do fresh start
//       localStorage.clear();
//       if (onRetry) {
//         onRetry({ freshStart: true });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Updated handleRetry to use smart retry
//   const handleRetry = () => {
//     console.log("🔄 Retry button clicked - using smart retry");
//     handleSmartRetry();
//   };

//   // 🚀 UPDATED: Debug function with lens info
//   const handleDebug = async () => {
//     const phone = userInfo?.phone;
//     const sessionId = localStorage.getItem("currentSessionId");

//     console.log("🔍 Debug Session State:");
//     console.log("Phone:", phone);
//     console.log("Stored Session ID:", sessionId);
//     console.log("Lens Info:", lensInfo); // 🚨 NEW
//     console.log("Selected Group Size:", localStorage.getItem("selectedGroupSize")); // 🚨 NEW
//     console.log("AR Cache:", window.snapARPreloadCache);

//     if (phone) {
//       try {
//         const arStatus = await fetch(
//           `https://artmetech.co.in/api/snap/ar-status/${phone}`
//         );
//         const arData = await arStatus.json();
//         console.log("Phone AR Status:", arData);
//       } catch (e) {
//         console.log("Could not fetch phone AR status");
//       }
//     }

//     if (sessionId) {
//       try {
//         const sessionStatus = await fetch(
//           `https://artmetech.co.in/api/snap/session-status/${sessionId}`
//         );
//         const sessionData = await sessionStatus.json();
//         console.log("Session Status:", sessionData);
//       } catch (e) {
//         console.log("Could not fetch session status");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[991px] mx-auto relative z-10 overflow-y-hidden">

//       {/* Loading Message */}
//       {isLoading && (
//         <div className="mb-4 bg-blue-500/20 border border-blue-500/50 rounded p-3 text-center z-20">
//           <p className="text-blue-300 text-sm">
//             {userPhoto ? "Processing retry..." : "Loading your photo..."}
//           </p>
//         </div>
//       )}

//       {/* Image */}
//       <div className="mb-8 z-10">
//         <img
//           src={userPhoto || "/assets/enddummy.png"}
//           alt="Result"
//           className="object-contain rounded-lg"
//           onError={(e) => {
//             // Fallback to dummy image if user photo fails to load
//             e.target.src = "/assets/enddummy.png";
//           }}
//         />
//       </div>

//       {/* Buttons Container */}
//       <div className="flex flex-col space-y-4 items-center z-20 relative">
//         {/* Print/Download Button */}
//         <button
//           onClick={handlePrint}
//           disabled={isLoading}
//           className="text-white text-xl font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed py-3 w-80"
//           style={{
//             background:
//               "radial-gradient(40% 40% at 80% 100%, rgb(255 255 255 / 31%) 0%, rgb(0 51 255 / 31%) 59%, rgb(0 13 255 / 31%) 100%)",
//             borderRadius: "4px",
//             border: "1px solid rgba(255, 255, 255, 0.52)",
//             borderStyle: "inside",
//             boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
//             backdropFilter: "blur(20px)",
//             WebkitBackdropFilter: "blur(20px)",
//             opacity: "100%",
//           }}
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               DOWNLOADING
//             </div>
//           ) : photoInfo?.hasPhoto ? (
//             "DOWNLOAD"
//           ) : (
//             "PRINT"
//           )}
//         </button>

//         {/* Smart Retry Button */}
//         <button
//           onClick={handleRetry}
//           disabled={isLoading}
//           className="text-white text-xl font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed py-3 w-80"
//           style={{
//             background:
//               "radial-gradient(40% 40% at 80% 100%, rgb(255 255 255 / 31%) 0%, rgb(0 51 255 / 31%) 59%, rgb(0 13 255 / 31%) 100%)",
//             borderRadius: "4px",
//             border: "1px solid rgba(255, 255, 255, 0.52)",
//             borderStyle: "inside",
//             boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
//             backdropFilter: "blur(20px)",
//             WebkitBackdropFilter: "blur(20px)",
//             opacity: "100%",
//           }}
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center">
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               PROCESSING
//             </div>
//           ) : (
//             "RETRY"
//           )}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default EndScreen;

import React, { useState, useEffect } from "react";

const EndScreen = ({ onRetry, onRetryAR }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [photoInfo, setPhotoInfo] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🚨 NEW: Store lens selection info
  const [lensInfo, setLensInfo] = useState({
    groupSize: null,
    lensId: null,
  });

  const API_BASE_URL = "";

  // 🔊 NEW: Play sound effect when component loads
  useEffect(() => {
    const playEndSound = () => {
      try {
        // Create audio object with your sound file path
        const audio = new Audio("/assets/twinkle.mp3");

        // Optional: Set volume (0.0 to 1.0)
        audio.volume = 0.7;

        // Play the sound
        audio.play().catch((error) => {
          console.log("Sound play failed:", error);
          // This is normal if user hasn't interacted with page yet
        });
      } catch (error) {
        console.log("Audio creation failed:", error);
      }
    };

    // Play sound immediately when component mounts
    playEndSound();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Get user info from localStorage
    const phone = localStorage.getItem("userPhone");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    // Get lens selection info
    const selectedGroupSize = localStorage.getItem("selectedGroupSize");
    const selectedLensId =
      selectedGroupSize === "less"
        ? "bc57c671-4255-423e-9eaf-71daba627ca8"
        : "c4b85218-50a5-4a71-b719-0a1381b4e73e";

    if (phone && userId && userName) {
      setUserInfo({ phone, userId, userName });
      setLensInfo({
        groupSize: selectedGroupSize || "less",
        lensId: selectedLensId,
      });

      // 🔧 FIX: Get current counter and construct the correct image URL
      const currentCounter = localStorage.getItem("photoCounter") || "0";
      console.log("📷 Current photo counter:", currentCounter);

      // Check if we have a cached URL first
      const cachedImageUrl = localStorage.getItem("userPhoto");

      if (cachedImageUrl) {
        console.log("📷 Using cached image URL:", cachedImageUrl);

        // 🔧 IMPORTANT: Add cache busting with current counter
        const cacheBustedUrl = `${cachedImageUrl}?counter=${currentCounter}&t=${Date.now()}`;

        setUserPhoto(cacheBustedUrl);
        setPhotoInfo({ hasPhoto: true, imageUrl: cacheBustedUrl });
      } else {
        // 🔧 FIX: If no cached URL, construct the expected URL based on counter
        console.log(
          "📷 No cached URL, constructing expected URL with counter:",
          currentCounter
        );

        // Construct the expected filename based on current counter
        const expectedImageUrl = `https://artmetech.co.in/api/uploads/enhanced_polaroid_${phone}_${currentCounter}.png?t=${Date.now()}`;

        console.log("📷 Expected image URL:", expectedImageUrl);

        // Try to load the expected image
        const img = new Image();
        img.onload = () => {
          console.log("✅ Expected image loaded successfully");
          setUserPhoto(expectedImageUrl);
          setPhotoInfo({ hasPhoto: true, imageUrl: expectedImageUrl });
          // Cache it for next time
          localStorage.setItem("userPhoto", expectedImageUrl.split("?")[0]); // Store without cache busting params
        };
        img.onerror = () => {
          console.log("❌ Expected image failed, trying API fallback...");
          fetchUserPhoto(phone);
        };
        img.src = expectedImageUrl;
      }
    }
  }, []);

  // Fetch user photo from server
  const fetchUserPhoto = async (phone) => {
    try {
      setIsLoading(true);
      console.log("📷 Fetching photo from API for phone:", phone);

      const response = await fetch(
        `https://artmetech.co.in/api/user/${phone}/photo`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setPhotoInfo(data.data);
        if (data.data.hasPhoto) {
          // 🔧 FIX: Add cache busting to API response too
          const currentCounter = localStorage.getItem("photoCounter") || "0";
          const cacheBustedUrl = `${
            data.data.imageUrl
          }?counter=${currentCounter}&t=${Date.now()}`;

          console.log(
            "📷 API returned image, adding cache busting:",
            cacheBustedUrl
          );

          setUserPhoto(cacheBustedUrl);
          // Update localStorage with the base URL (without cache busting)
          localStorage.setItem("userPhoto", data.data.imageUrl);
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
        `https://artmetech.co.in/api/download-photo/${userInfo.phone}`,
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

  // 🚀 UPDATED: Smart retry function with lens info
  const handleSmartRetry = async () => {
    console.log("🔄 Smart retry initiated");
    setIsLoading(true);
    setError("");

    try {
      const phone = userInfo?.phone;
      if (!phone) {
        throw new Error("User phone not found. Please start over.");
      }

      console.log(`📱 Checking existing session for phone: ${phone}`);

      // Step 1: Check if there's an existing session for this phone
      const sessionCheckResponse = await fetch(
        `https://artmetech.co.in/api/snap/check-session/${phone}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const sessionCheckData = await sessionCheckResponse.json();
      console.log("📊 Session check result:", sessionCheckData);

      let sessionId = null;
      let isNewSession = false;

      if (sessionCheckResponse.ok && sessionCheckData.success) {
        if (
          sessionCheckData.data.hasExistingSession &&
          sessionCheckData.data.session.canReuse
        ) {
          // Existing session found and can be reused
          sessionId = sessionCheckData.data.session.sessionId;
          console.log(`♻️ Found existing reusable session: ${sessionId}`);

          // Step 2a: Reset the existing session to ended: false
          const resetResponse = await fetch(
            "https://artmetech.co.in/api/snap/reset-session",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                sessionId: sessionId,
                phone: phone,
              }),
            }
          );

          const resetData = await resetResponse.json();

          if (!resetResponse.ok || !resetData.success) {
            throw new Error(resetData.message || "Failed to reset session");
          }

          console.log(`✅ Session reset successfully:`, resetData.data);
        } else {
          // No existing session or not reusable - create new one
          console.log(`🆕 No reusable session found, creating new session`);
          isNewSession = true;
        }
      } else {
        console.log(`🆕 Session check failed, creating new session`);
        isNewSession = true;
      }

      // Step 2b: Create new session if needed
      if (isNewSession) {
        const createSessionResponse = await fetch(
          "https://artmetech.co.in/api/snap/create-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: phone,
              forceNew: true, // Force new session
            }),
          }
        );

        const createSessionData = await createSessionResponse.json();

        if (!createSessionResponse.ok || !createSessionData.success) {
          throw new Error(
            createSessionData.message || "Failed to create new session"
          );
        }

        sessionId = createSessionData.data.sessionId;
        console.log(`✅ New session created: ${sessionId}`);

        // Step 3: Associate phone with the new session
        const associateResponse = await fetch(
          "https://artmetech.co.in/api/snap/associate-phone",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId: sessionId,
              phone: phone,
              userInfo: {
                userId: userInfo.userId,
                userName: userInfo.userName,
                phone: phone,
              },
            }),
          }
        );

        const associateData = await associateResponse.json();

        if (!associateResponse.ok || !associateData.success) {
          throw new Error(
            associateData.message || "Failed to associate phone with session"
          );
        }

        console.log(`✅ Phone associated with session:`, associateData.data);
      }

      // Step 4: Reset the phone-based AR state to ended: false
      const arEndResponse = await fetch("https://artmetech.co.in/api/ar-end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          ended: false, // Reset to ongoing
        }),
      });

      const arEndData = await arEndResponse.json();

      if (!arEndResponse.ok || !arEndData.success) {
        console.warn("⚠️ Failed to reset AR end state:", arEndData.message);
        // Don't throw error here, as the session is already set up
      } else {
        console.log(`✅ AR state reset to ongoing:`, arEndData.data);
      }

      // Step 5: Update local storage with session info
      localStorage.setItem("currentSessionId", sessionId);
      localStorage.setItem("snapARSessionId", sessionId); // 🚨 NEW: Also set this key
      localStorage.setItem("arSessionReady", "true");

      // 🚨 NEW: Ensure lens selection is preserved
      if (lensInfo.groupSize) {
        localStorage.setItem("selectedGroupSize", lensInfo.groupSize);
      }

      // Step 6: Check if we can reuse AR session from cache
      const cache = window.snapARPreloadCache;
      const hasValidARSession = cache?.sessionReady && cache?.session;

      console.log("📊 Final AR Session Status:", {
        sessionId: sessionId,
        hasCache: !!cache,
        sessionReady: cache?.sessionReady,
        hasSession: !!cache?.session,
        canReuseAR: hasValidARSession,
        lensInfo: lensInfo, // 🚨 NEW: Log lens info
      });

      // 🚨 NEW: Force cache to load both lenses if needed
      if (hasValidARSession && cache && !cache.lenses?.loaded) {
        console.log(
          "🔄 Cache exists but lenses not loaded, forcing fresh session"
        );

        // Clear cache to force fresh session creation with both lenses
        if (cache.session) {
          try {
            await cache.session.pause();
          } catch (e) {
            console.log("Session already stopped");
          }
        }

        if (cache.mediaStream) {
          cache.mediaStream.getTracks().forEach((track) => track.stop());
        }

        window.snapARPreloadCache = null;
        hasValidARSession = false;
      }

      // Step 7: Execute the appropriate retry action
      if (hasValidARSession && onRetryAR) {
        // AR session is available - go directly to AR experience
        console.log("🎮 Launching AR experience with session:", sessionId);

        onRetryAR({
          sessionId: sessionId,
          phone: userInfo.phone,
          userId: userInfo.userId,
          userName: userInfo.userName,
          groupSize: lensInfo.groupSize, // 🚨 NEW: Pass lens info
          isRetry: true,
        });
      } else {
        // No AR session in cache - do full restart but keep session info
        console.log("🔄 Doing full restart with session:", sessionId);

        // Keep session info but clear other data for fresh registration flow
        localStorage.removeItem("userPhone");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        // 🚨 NEW: Keep lens selection
        // localStorage.removeItem("selectedGroupSize"); // Don't remove this

        if (onRetry) {
          onRetry({
            sessionId: sessionId,
            preserveSession: true,
            lensInfo: lensInfo, // 🚨 NEW: Pass lens info
          });
        }
      }
    } catch (error) {
      console.error("❌ Retry error:", error);
      setError(error.message || "Failed to restart session. Please try again.");

      // Fallback: Clear everything and do fresh start
      localStorage.clear();
      if (onRetry) {
        onRetry({ freshStart: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Updated handleRetry to use smart retry
  const handleRetry = () => {
    console.log("🔄 Retry button clicked - using smart retry");
    handleSmartRetry();
  };

  // 🚀 UPDATED: Debug function with lens info
  const handleDebug = async () => {
    const phone = userInfo?.phone;
    const sessionId = localStorage.getItem("currentSessionId");

    console.log("🔍 Debug Session State:");
    console.log("Phone:", phone);
    console.log("Stored Session ID:", sessionId);
    console.log("Lens Info:", lensInfo); // 🚨 NEW
    console.log(
      "Selected Group Size:",
      localStorage.getItem("selectedGroupSize")
    ); // 🚨 NEW
    console.log("AR Cache:", window.snapARPreloadCache);

    if (phone) {
      try {
        const arStatus = await fetch(
          `https://artmetech.co.in/api/snap/ar-status/${phone}`
        );
        const arData = await arStatus.json();
        console.log("Phone AR Status:", arData);
      } catch (e) {
        console.log("Could not fetch phone AR status");
      }
    }

    if (sessionId) {
      try {
        const sessionStatus = await fetch(
          `https://artmetech.co.in/api/snap/session-status/${sessionId}`
        );
        const sessionData = await sessionStatus.json();
        console.log("Session Status:", sessionData);
      } catch (e) {
        console.log("Could not fetch session status");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[991px] mx-auto relative z-10 overflow-y-hidden">
      {/* Loading Message */}
      {/* {isLoading && (
        <div className="mb-4 bg-blue-500/20 border border-blue-500/50 rounded p-3 text-center z-20">
          <p className="text-blue-300 text-sm">
            {userPhoto ? "Processing retry..." : "Loading your photo..."}
          </p>
        </div>
      )} */}

      {/* Image */}
      <div className="mb-8 z-10">
        <img
          src={userPhoto || "/assets/enddummy.png"}
          alt="Result"
          className="object-contain rounded-lg"
          onError={(e) => {
            // Fallback to dummy image if user photo fails to load
            e.target.src = "/assets/enddummy.png";
          }}
        />
      </div>

      {/* Buttons Container */}
      <div className="flex flex-col space-y-4 items-center z-20 relative">
        {/* Print/Download Button */}
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="text-white text-xl font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed py-3 w-80"
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
              DOWNLOADING
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
          className="text-white text-xl font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed py-3 w-80"
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
              PROCESSING
            </div>
          ) : (
            "RETRY"
          )}
        </button>
      </div>
    </div>
  );
};

export default EndScreen;
