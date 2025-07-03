// import React, { useState, useEffect } from "react";

// const RegistrationScreen = ({ onComplete, onTerms }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     groupSize: "less",
//   });

//   const [otpData, setOtpData] = useState({
//     otp: "",
//     isOtpSent: false,
//     isOtpVerified: false,
//     timeLeft: 0,
//     canResend: false,
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [phoneTouched, setPhoneTouched] = useState(false);
//   const [otpTouched, setOtpTouched] = useState(false);

//   // ⭐ TESTING MODE - Set to true to bypass OTP
//   const BYPASS_OTP = true; // Change to false for production

//   // API endpoint - change this to your backend URL
//   const API_BASE_URL = "";

//   // Timer for OTP expiry
//   useEffect(() => {
//     let timer;
//     if (otpData.timeLeft > 0) {
//       timer = setTimeout(() => {
//         setOtpData((prev) => ({
//           ...prev,
//           timeLeft: prev.timeLeft - 1,
//           canResend: prev.timeLeft - 1 <= 0,
//         }));
//       }, 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [otpData.timeLeft]);

//   // Format time as MM:SS
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   // Validate Indian phone number (exactly 10 digits)
//   const validatePhone = (phone) => {
//     const phoneRegex = /^[6-9]\d{9}$/;
//     return phoneRegex.test(phone);
//   };

//   // Validate OTP (6 digits)
//   const validateOTP = (otp) => {
//     const otpRegex = /^\d{6}$/;
//     return otpRegex.test(otp);
//   };

//   // Check if all fields are filled and valid
//   const isFormValid = () => {
//     const basicFields =
//       formData.name.trim() !== "" &&
//       validatePhone(formData.phone) &&
//       formData.groupSize !== "";

//     // If bypassing OTP, only check basic fields
//     if (BYPASS_OTP) {
//       return basicFields;
//     }

//     // Normal mode - require OTP verification
//     return basicFields && otpData.isOtpVerified;
//   };

//   const handleNameChange = (e) => {
//     setError(""); // Clear error when user types
//     setFormData((prev) => ({ ...prev, name: e.target.value }));
//   };

//   const handlePhoneChange = (e) => {
//     setError(""); // Clear error when user types
//     const value = e.target.value.replace(/\D/g, ""); // Remove non-digits

//     // Reset OTP state if phone number changes
//     if (value !== formData.phone && !BYPASS_OTP) {
//       setOtpData({
//         otp: "",
//         isOtpSent: false,
//         isOtpVerified: false,
//         timeLeft: 0,
//         canResend: false,
//       });
//     }

//     // Only allow first digit to be 6-9
//     if (value.length === 0 || /^[6-9]/.test(value)) {
//       if (value.length <= 10) {
//         setFormData((prev) => ({ ...prev, phone: value }));
//       }
//     }
//   };

//   const handleOtpChange = (e) => {
//     setError("");
//     const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
//     if (value.length <= 6) {
//       setOtpData((prev) => ({ ...prev, otp: value }));
//     }
//   };

//   const handleGroupSizeSelect = (size) => {
//     setError(""); // Clear error when user selects
//     setFormData((prev) => ({ ...prev, groupSize: size }));
//   };

//   // Mock OTP verification for bypass mode
//   const bypassOTPVerification = () => {
//     setOtpData((prev) => ({
//       ...prev,
//       isOtpSent: true,
//       isOtpVerified: true,
//       timeLeft: 0,
//     }));
//   };

//   // Send OTP API call
//   const sendOTP = async () => {
//     // If bypassing, just mock the verification
//     if (BYPASS_OTP) {
//       setIsLoading(true);
//       setTimeout(() => {
//         bypassOTPVerification();
//         setIsLoading(false);
//       }, 500); // Small delay for UX
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError("");

//       const response = await fetch(`/api/send-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ phone: formData.phone }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to send OTP");
//       }

//       setOtpData((prev) => ({
//         ...prev,
//         isOtpSent: true,
//         timeLeft: data.data.expiresIn * 60, // Convert minutes to seconds
//         canResend: false,
//       }));

//       console.log("OTP sent successfully:", data);
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       setError(error.message || "Failed to send OTP. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Verify OTP API call
//   const verifyOTP = async () => {
//     // If bypassing, verification is already done
//     if (BYPASS_OTP) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError("");

//       const response = await fetch(`/api/verify-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           phone: formData.phone,
//           otp: otpData.otp,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "OTP verification failed");
//       }

//       setOtpData((prev) => ({
//         ...prev,
//         isOtpVerified: true,
//         timeLeft: 0,
//       }));

//       console.log("OTP verified successfully:", data);
//     } catch (error) {
//       console.error("Verify OTP error:", error);

//       if (error.message.includes("expired")) {
//         setOtpData((prev) => ({
//           ...prev,
//           isOtpSent: false,
//           otp: "",
//           timeLeft: 0,
//           canResend: true,
//         }));
//       }

//       setError(error.message || "OTP verification failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle Send/Resend OTP button click
//   const handleSendOTP = async () => {
//     if (!validatePhone(formData.phone)) {
//       setError("Please enter a valid 10-digit phone number");
//       setPhoneTouched(true);
//       return;
//     }

//     await sendOTP();
//   };

//   // Handle Verify OTP button click
//   const handleVerifyOTP = async () => {
//     if (!validateOTP(otpData.otp)) {
//       setError("Please enter a valid 6-digit OTP");
//       setOtpTouched(true);
//       return;
//     }

//     await verifyOTP();
//   };

//   // API call to register user
//   const registerUser = async (userData) => {
//     try {
//       const response = await fetch(`/api/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...userData,
//           otpVerified: BYPASS_OTP ? true : otpData.isOtpVerified,
//           bypassMode: BYPASS_OTP, // Let backend know this is bypass mode
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       return data;
//     } catch (error) {
//       console.error("Registration API error:", error);
//       throw error;
//     }
//   };

//   const handleGetStarted = async () => {
//     if (!isFormValid()) {
//       if (!BYPASS_OTP && !otpData.isOtpVerified) {
//         setError("Please verify your phone number first");
//       } else {
//         setError("Please fill all fields correctly");
//       }
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       // 🎭 START AR SESSION - Set AR state to ongoing (false)
//       console.log(`🎭 Starting AR session for ${formData.phone}`);
//       try {
//         await fetch(`/api/ar-end`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             phone: formData.phone,
//             ended: false, // false = AR ongoing
//           }),
//         });
//         console.log(`✅ AR session started for ${formData.phone}`);
//       } catch (arError) {
//         console.error("❌ Failed to start AR session:", arError);
//         // Continue with registration even if AR state fails
//       }

//       // Prepare data for API
//       const userData = {
//         name: formData.name.trim(),
//         phone: formData.phone,
//         groupSize: formData.groupSize,
//       };

//       console.log("Registering user:", userData);

//       // Call registration API
//       const response = await registerUser(userData);

//       console.log("Registration successful:", response);

//       // Store phone number in localStorage for photo download later
//       localStorage.setItem("userPhone", formData.phone);
//       localStorage.setItem("userId", response.data.id.toString());
//       localStorage.setItem("userName", formData.name.trim());

//       // Pass the user data to parent component
//       onComplete({
//         ...formData,
//         userId: response.data.id,
//         isExisting: response.data.isExisting,
//         apiResponse: response,
//         bypassMode: BYPASS_OTP,
//       });
//     } catch (error) {
//       console.error("Registration error:", error);

//       // Handle specific error messages
//       if (error.message.includes("already registered")) {
//         setError("This phone number is already registered");
//       } else if (error.message.includes("Invalid phone")) {
//         setError("Please enter a valid phone number");
//       } else if (error.message.includes("verification required")) {
//         setError("Please verify your phone number first");
//       } else if (
//         error.message.includes("network") ||
//         error.message.includes("fetch")
//       ) {
//         setError("Network error. Please check your connection and try again");
//       } else {
//         setError(error.message || "Registration failed. Please try again");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTermsClick = () => {
//     if (onTerms) {
//       onTerms(); // Go to terms screen
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

//       {/* Subtitle */}
//       <div className="text-center mb-8">
//         <p className="text-lg italic">
//           Get your <span className="font-bold">chamking</span> smile by
//         </p>
//         <p className="text-lg italic">filling in your details!</p>
//       </div>

//       {/* Testing Mode Indicator */}
//       {BYPASS_OTP && (
//         <div className="w-full max-w-sm mb-4">
//           <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-2 text-center">
//             <p className="text-yellow-300 text-xs">
//               🧪 Testing Mode - OTP Bypassed
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Form Container */}
//       <div className="w-full max-w-sm space-y-6">
//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-center">
//             <p className="text-red-300 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Success Message for OTP Verification */}
//         {/* {otpData.isOtpVerified && (
//           <div className="bg-green-500/20 border border-green-500/50 rounded p-3 text-center">
//             <p className="text-green-300 text-sm">
//               ✅{" "}
//               {BYPASS_OTP
//                 ? "Phone number verified (bypass mode)"
//                 : "Phone number verified successfully!"}
//             </p>
//           </div>
//         )} */}

//         {/* Name Input */}
//         <div>
//           <input
//             type="text"
//             placeholder="Name"
//             value={formData.name}
//             onChange={handleNameChange}
//             disabled={isLoading}
//             className="w-full px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
//           />
//         </div>

//         {/* Phone Input with OTP Button */}
//         <div>
//           <div className="flex space-x-2">
//             <input
//               type="tel"
//               placeholder="Phone No."
//               value={formData.phone}
//               onChange={handlePhoneChange}
//               onBlur={() => setPhoneTouched(true)}
//               disabled={isLoading || otpData.isOtpVerified}
//               className="flex-1 px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
//               maxLength="10"
//               pattern="^[6-9]\d{9}$"
//             />

//             {!otpData.isOtpVerified && (
//               <button
//                 onClick={handleSendOTP}
//                 disabled={
//                   !validatePhone(formData.phone) ||
//                   isLoading ||
//                   (otpData.isOtpSent && !otpData.canResend && !BYPASS_OTP)
//                 }
//                 className={`px-4 py-3 rounded font-medium text-sm transition-all ${validatePhone(formData.phone) &&
//                   !isLoading &&
//                   (!otpData.isOtpSent || otpData.canResend || BYPASS_OTP)
//                   ? "text-white hover:opacity-80 border-white"
//                   : "bg-gray-500/30 text-gray-400 border-white/40 cursor-not-allowed"
//                   }`}
//                 style={{
//                   backgroundColor: validatePhone(formData.phone) &&
//                     !isLoading &&
//                     (!otpData.isOtpSent || otpData.canResend || BYPASS_OTP)
//                     ? "#041763"
//                     : undefined
//                 }}
//               >
//                 {BYPASS_OTP
//                   ? "Verify"
//                   : otpData.isOtpSent && !otpData.canResend
//                     ? "Sent"
//                     : otpData.isOtpSent
//                       ? "Resend"
//                       : "Send OTP"}
//               </button>
//             )}
//           </div>

//           <p
//             className={`text-red-300 text-xs mt-1 transition-all duration-200 ${phoneTouched && !validatePhone(formData.phone)
//               ? "visible"
//               : "invisible"
//               }`}
//           >
//             Enter valid 10 digit mobile number
//           </p>
//         </div>

//         {/* OTP Input (shown only when OTP is sent and not bypassing) */}
//         {otpData.isOtpSent && !otpData.isOtpVerified && !BYPASS_OTP && (
//           <div>
//             <div className="flex space-x-2">
//               <input
//                 type="tel"
//                 placeholder="Enter 6-digit OTP"
//                 value={otpData.otp}
//                 onChange={handleOtpChange}
//                 onBlur={() => setOtpTouched(true)}
//                 disabled={isLoading}
//                 className="flex-1 px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
//                 maxLength="6"
//                 pattern="^\d{6}$"
//               />

//               <button
//                 onClick={handleVerifyOTP}
//                 disabled={!validateOTP(otpData.otp) || isLoading}
//                 className={`px-4 py-3 rounded font-medium text-sm transition-all ${validateOTP(otpData.otp) && !isLoading
//                   ? "text-white hover:opacity-80 border-white"
//                   : "bg-gray-500/30 text-gray-400 border-white/40 cursor-not-allowed"
//                   }`}
//                 style={{
//                   backgroundColor: validateOTP(otpData.otp) && !isLoading
//                     ? "#041763"
//                     : undefined
//                 }}
//               >
//                 Verify
//               </button>
//             </div>

//             {/* OTP Timer */}
//             {otpData.timeLeft > 0 && (
//               <p className="text-blue-300 text-xs mt-1">
//                 OTP expires in: {formatTime(otpData.timeLeft)}
//               </p>
//             )}

//             {/* OTP Validation Error */}
//             <p
//               className={`text-red-300 text-xs mt-1 transition-all duration-200 ${otpTouched && !validateOTP(otpData.otp)
//                 ? "visible"
//                 : "invisible"
//                 }`}
//             >
//               Enter valid 6-digit OTP
//             </p>
//           </div>
//         )}

//         {/* Group Size Selection */}
//         <div className="text-center">
//           <h3 className="text-white text-lg mb-4 text-[20px] flex items-center gap-4">
//             <div className="flex-1 h-px bg-white"></div>
//             Select your<span className="font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] text-white">GROUP SIZE</span>
//             <div className="flex-1 h-px bg-white"></div>
//           </h3>

//           <div className="relative">
//             {/* Background container */}
//             <div className="relative flex border-2 border-white rounded-[4px] overflow-hidden bg-transparent">
//               {/* Sliding white background */}
//               <div
//                 className={`absolute top-0 h-full w-1/2 bg-white transition-transform duration-300 ease-in-out ${formData.groupSize === "more" ? "translate-x-full" : "translate-x-0"
//                   }`}
//                 style={{
//                   margin: "0px",
//                   width: "50%",
//                   height: "100%",
//                   borderRadius: "4px",
//                 }}
//               />

//               {/* Button container */}
//               <div className="relative flex w-full">
//                 <button
//                   onClick={() => handleGroupSizeSelect("less")}
//                   disabled={isLoading}
//                   className={`flex-1 py-[14px] px-6 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative z-10 font-semibold text-[14px] rounded-[4px] select-none focus:outline-none focus:ring-0 ${formData.groupSize === "less"
//                     ? "bg-transparent text-blue-700"    // Selected: transparent bg (white shows from behind), blue text
//                     : "bg-transparent text-white"       // Not selected: transparent bg, white text
//                     }`}
//                   style={{
//                     WebkitTapHighlightColor: 'transparent',
//                     WebkitUserSelect: 'none',
//                     MozUserSelect: 'none',
//                     msUserSelect: 'none',
//                     userSelect: 'none'
//                   }}
//                 >
//                   Less than 3 people
//                 </button>
//                 <button
//                   onClick={() => handleGroupSizeSelect("more")}
//                   disabled={isLoading}
//                   className={`flex-1 py-[14px] px-6 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative z-10 font-semibold text-[14px] rounded-[4px] select-none focus:outline-none focus:ring-0 ${formData.groupSize === "more"
//                     ? "bg-transparent text-blue-700"    // Selected: transparent bg (white shows from behind), blue text
//                     : "bg-transparent text-white"       // Not selected: transparent bg, white text
//                     }`}
//                   style={{
//                     WebkitTapHighlightColor: 'transparent',
//                     WebkitUserSelect: 'none',
//                     MozUserSelect: 'none',
//                     msUserSelect: 'none',
//                     userSelect: 'none'
//                   }}
//                 >
//                   More than 3 people
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Get Started Button */}
//         <div className="pt-4">
//           <button
//             onClick={handleGetStarted}
//             disabled={!isFormValid() || isLoading}
//             className={`w-full py-4 px-6 rounded font-bold text-lg transition-all relative ${isFormValid() && !isLoading ? "" : "cursor-not-allowed"
//               }`}
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
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                 <span className="italic">REGISTERING...</span>
//               </div>
//             ) : (
//               <span className="italic">GET STARTED</span>
//             )}
//           </button>
//         </div>

//         {/* Footer Text */}
//         <div className="text-center pt-6">
//           <p className="text-white/80 text-sm italic mb-2">
//             Powered by advanced AR Technology
//           </p>
//           <button
//             onClick={handleTermsClick}
//             disabled={isLoading}
//             className="text-white/60 text-xs underline hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Terms & Conditions
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegistrationScreen;

import React, { useState, useEffect } from "react";

const RegistrationScreen = ({ onComplete, onTerms, sessionData }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    groupSize: "less",
  });

  const [otpData, setOtpData] = useState({
    otp: "",
    isOtpSent: false,
    isOtpVerified: false,
    timeLeft: 0,
    canResend: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [otpTouched, setOtpTouched] = useState(false);

  // NEW: Session management state
  const [snapAR, setSnapAR] = useState({
    sessionId: null,
    phoneAssociated: false,
    arEnded: false,
    isMonitoring: false,
  });

  // ⭐ TESTING MODE - Set to true to bypass OTP
  const BYPASS_OTP = false; // Change to false for production

  // API endpoint - change this to your backend URL
  const API_BASE_URL = "";

  // NEW: Initialize session data from splash screen
  useEffect(() => {
    // Get session ID from props (passed from splash screen) or localStorage
    const sessionId =
      sessionData?.sessionId || localStorage.getItem("snapARSessionId");

    if (sessionId) {
      setSnapAR((prev) => ({ ...prev, sessionId }));
      console.log(`🆔 Using session ID: ${sessionId}`);
    } else {
      console.warn(
        "⚠️ No session ID found - this may cause issues with Snap AR integration"
      );
    }
  }, [sessionData]);

  // Timer for OTP expiry
  useEffect(() => {
    let timer;
    if (otpData.timeLeft > 0) {
      timer = setTimeout(() => {
        setOtpData((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          canResend: prev.timeLeft - 1 <= 0,
        }));
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [otpData.timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Validate Indian phone number (exactly 10 digits)
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Validate OTP (6 digits)
  const validateOTP = (otp) => {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  };

  // Check if all fields are filled and valid
  const isFormValid = () => {
    const basicFields =
      formData.name.trim() !== "" &&
      validatePhone(formData.phone) &&
      formData.groupSize !== "";

    // If bypassing OTP, only check basic fields
    if (BYPASS_OTP) {
      return basicFields;
    }

    // Normal mode - require OTP verification
    return basicFields && otpData.isOtpVerified;
  };

  const handleNameChange = (e) => {
    setError(""); // Clear error when user types
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    setError(""); // Clear error when user types
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    // Reset OTP state if phone number changes
    if (value !== formData.phone && !BYPASS_OTP) {
      setOtpData({
        otp: "",
        isOtpSent: false,
        isOtpVerified: false,
        timeLeft: 0,
        canResend: false,
      });
    }

    // Only allow first digit to be 6-9
    if (value.length === 0 || /^[6-9]/.test(value)) {
      if (value.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: value }));
      }
    }
  };

  const handleOtpChange = (e) => {
    setError("");
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 6) {
      setOtpData((prev) => ({ ...prev, otp: value }));
    }
  };

  const handleGroupSizeSelect = (size) => {
    setError(""); // Clear error when user selects
    setFormData((prev) => ({ ...prev, groupSize: size }));
  };

  // Mock OTP verification for bypass mode
  const bypassOTPVerification = () => {
    setOtpData((prev) => ({
      ...prev,
      isOtpSent: true,
      isOtpVerified: true,
      timeLeft: 0,
    }));
  };

  // Send OTP API call
  const sendOTP = async () => {
    // If bypassing, just mock the verification
    if (BYPASS_OTP) {
      setIsLoading(true);
      setTimeout(() => {
        bypassOTPVerification();
        setIsLoading(false);
      }, 500); // Small delay for UX
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpData((prev) => ({
        ...prev,
        isOtpSent: true,
        timeLeft: data.data.expiresIn * 60, // Convert minutes to seconds
        canResend: false,
      }));

      console.log("OTP sent successfully:", data);
    } catch (error) {
      console.error("Send OTP error:", error);
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP API call
  const verifyOTP = async () => {
    // If bypassing, verification is already done
    if (BYPASS_OTP) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          otp: otpData.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setOtpData((prev) => ({
        ...prev,
        isOtpVerified: true,
        timeLeft: 0,
      }));

      console.log("OTP verified successfully:", data);
    } catch (error) {
      console.error("Verify OTP error:", error);

      if (error.message.includes("expired")) {
        setOtpData((prev) => ({
          ...prev,
          isOtpSent: false,
          otp: "",
          timeLeft: 0,
          canResend: true,
        }));
      }

      setError(error.message || "OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Send/Resend OTP button click
  const handleSendOTP = async () => {
    if (!validatePhone(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      setPhoneTouched(true);
      return;
    }

    await sendOTP();
  };

  // Handle Verify OTP button click
  const handleVerifyOTP = async () => {
    if (!validateOTP(otpData.otp)) {
      setError("Please enter a valid 6-digit OTP");
      setOtpTouched(true);
      return;
    }

    await verifyOTP();
  };

  // NEW: Associate phone number with session ID
  const associatePhoneWithSession = async (phone, userInfo = null) => {
    if (!snapAR.sessionId) {
      console.error("❌ No session ID available for phone association");
      return null;
    }

    try {
      console.log(
        `📱 Associating phone ${phone} with session ${snapAR.sessionId}`
      );

      const response = await fetch(`/api/snap/associate-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: snapAR.sessionId,
          phone: phone,
          userInfo: userInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to associate phone with session"
        );
      }

      setSnapAR((prev) => ({ ...prev, phoneAssociated: true }));
      console.log("✅ Phone associated with session successfully:", data);

      return data;
    } catch (error) {
      console.error("❌ Phone association error:", error);
      // Don't throw error - this shouldn't block registration
      return null;
    }
  };

  // API call to register user
  const registerUser = async (userData) => {
    try {
      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          otpVerified: BYPASS_OTP ? true : otpData.isOtpVerified,
          bypassMode: BYPASS_OTP, // Let backend know this is bypass mode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      console.error("Registration API error:", error);
      throw error;
    }
  };

  const handleGetStarted = async () => {
    if (!isFormValid()) {
      if (!BYPASS_OTP && !otpData.isOtpVerified) {
        setError("Please verify your phone number first");
      } else {
        setError("Please fill all fields correctly");
      }
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // NEW: 1. ASSOCIATE PHONE WITH SESSION
      const userInfo = {
        name: formData.name.trim(),
        groupSize: formData.groupSize,
        timestamp: new Date().toISOString(),
      };

      console.log(
        `📱 Step 1: Associating phone ${formData.phone} with session ${snapAR.sessionId}`
      );
      await associatePhoneWithSession(formData.phone, userInfo);

      // 2. START AR SESSION - Set AR state to ongoing (false)
      console.log(`🎭 Step 2: Starting AR session for ${formData.phone}`);
      try {
        await fetch(`/api/ar-end`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.phone,
            ended: false, // false = AR ongoing
          }),
        });
        console.log(`✅ AR session started for ${formData.phone}`);
      } catch (arError) {
        console.error("❌ Failed to start AR session:", arError);
        // Continue with registration even if AR state fails
      }

      // 3. REGISTER USER
      const userData = {
        name: formData.name.trim(),
        phone: formData.phone,
        groupSize: formData.groupSize,
      };

      console.log("Registering user:", userData);

      // Call registration API
      const response = await registerUser(userData);

      console.log("Registration successful:", response);

      // 4. STORE USER DATA (including session ID)
      localStorage.setItem("userPhone", formData.phone);
      localStorage.setItem("userId", response.data.id.toString());
      localStorage.setItem("userName", formData.name.trim());
      // Session ID should already be stored from splash screen

      // 5. COMPLETE REGISTRATION
      onComplete({
        ...formData,
        userId: response.data.id,
        isExisting: response.data.isExisting,
        apiResponse: response,
        bypassMode: BYPASS_OTP,
        // NEW: Session data
        snapAR: {
          sessionId: snapAR.sessionId,
          phoneAssociated: snapAR.phoneAssociated,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific error messages
      if (error.message.includes("already registered")) {
        setError("This phone number is already registered");
      } else if (error.message.includes("Invalid phone")) {
        setError("Please enter a valid phone number");
      } else if (error.message.includes("verification required")) {
        setError("Please verify your phone number first");
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        setError("Network error. Please check your connection and try again");
      } else {
        setError(error.message || "Registration failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsClick = () => {
    if (onTerms) {
      onTerms(); // Go to terms screen
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

      {/* Subtitle */}
      <div className="text-center mb-8">
        <p className="text-lg italic">
          Get your <span className="font-bold">chamking</span> smile by
        </p>
        <p className="text-lg italic">filling in your details!</p>
      </div>

      {/* Testing Mode + Session Status Indicators */}
      <div className="w-full max-w-sm mb-4 space-y-2">
        {BYPASS_OTP && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-2 text-center">
            <p className="text-yellow-300 text-xs">
              🧪 Testing Mode - OTP Bypassed
            </p>
          </div>
        )}

        {/* NEW: Session Status Indicator */}
        {snapAR.sessionId && (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded p-2 text-center">
            <p className="text-blue-300 text-xs">
              🆔 Session: {snapAR.sessionId.substring(0, 15)}...
              {snapAR.phoneAssociated && " | 📱 Phone Associated"}
            </p>
          </div>
        )}
      </div>

      {/* Form Container */}
      <div className="w-full max-w-sm space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Name Input */}
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleNameChange}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Phone Input with OTP Button */}
        <div>
          <div className="flex space-x-2">
            <input
              type="tel"
              placeholder="Phone No."
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={() => setPhoneTouched(true)}
              disabled={isLoading || otpData.isOtpVerified}
              className="flex-1 px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength="10"
              pattern="^[6-9]\d{9}$"
            />

            {!otpData.isOtpVerified && (
              <button
                onClick={handleSendOTP}
                disabled={
                  !validatePhone(formData.phone) ||
                  isLoading ||
                  (otpData.isOtpSent && !otpData.canResend && !BYPASS_OTP)
                }
                className={`px-4 py-3 rounded font-medium text-sm transition-all ${
                  validatePhone(formData.phone) &&
                  !isLoading &&
                  (!otpData.isOtpSent || otpData.canResend || BYPASS_OTP)
                    ? "text-white hover:opacity-80 border-white"
                    : "bg-gray-500/30 text-gray-400 border-white/40 cursor-not-allowed"
                }`}
                style={{
                  backgroundColor:
                    validatePhone(formData.phone) &&
                    !isLoading &&
                    (!otpData.isOtpSent || otpData.canResend || BYPASS_OTP)
                      ? "#041763"
                      : undefined,
                }}
              >
                {BYPASS_OTP
                  ? "Verify"
                  : otpData.isOtpSent && !otpData.canResend
                  ? "Sent"
                  : otpData.isOtpSent
                  ? "Resend"
                  : "Send OTP"}
              </button>
            )}
          </div>

          <p
            className={`text-red-300 text-xs mt-1 transition-all duration-200 ${
              phoneTouched && !validatePhone(formData.phone)
                ? "visible"
                : "invisible"
            }`}
          >
            Enter valid 10 digit mobile number
          </p>
        </div>

        {/* OTP Input (shown only when OTP is sent and not bypassing) */}
        {otpData.isOtpSent && !otpData.isOtpVerified && !BYPASS_OTP && (
          <div>
            <div className="flex space-x-2">
              <input
                type="tel"
                placeholder="Enter 6-digit OTP"
                value={otpData.otp}
                onChange={handleOtpChange}
                onBlur={() => setOtpTouched(true)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                maxLength="6"
                pattern="^\d{6}$"
              />

              <button
                onClick={handleVerifyOTP}
                disabled={!validateOTP(otpData.otp) || isLoading}
                className={`px-4 py-3 rounded font-medium text-sm transition-all ${
                  validateOTP(otpData.otp) && !isLoading
                    ? "text-white hover:opacity-80 border-white"
                    : "bg-gray-500/30 text-gray-400 border-white/40 cursor-not-allowed"
                }`}
                style={{
                  backgroundColor:
                    validateOTP(otpData.otp) && !isLoading
                      ? "#041763"
                      : undefined,
                }}
              >
                Verify
              </button>
            </div>

            {/* OTP Timer */}
            {otpData.timeLeft > 0 && (
              <p className="text-blue-300 text-xs mt-1">
                OTP expires in: {formatTime(otpData.timeLeft)}
              </p>
            )}

            {/* OTP Validation Error */}
            <p
              className={`text-red-300 text-xs mt-1 transition-all duration-200 ${
                otpTouched && !validateOTP(otpData.otp)
                  ? "visible"
                  : "invisible"
              }`}
            >
              Enter valid 6-digit OTP
            </p>
          </div>
        )}

        {/* Group Size Selection */}
        <div className="text-center">
          <h3 className="text-white text-lg mb-4 text-[20px] flex items-center gap-4">
            <div className="flex-1 h-px bg-white"></div>
            Select your
            <span className="font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] text-white">
              GROUP SIZE
            </span>
            <div className="flex-1 h-px bg-white"></div>
          </h3>

          <div className="relative">
            {/* Background container */}
            <div className="relative flex border-2 border-white rounded-[4px] overflow-hidden bg-transparent">
              {/* Sliding white background */}
              <div
                className={`absolute top-0 h-full w-1/2 bg-white transition-transform duration-300 ease-in-out ${
                  formData.groupSize === "more"
                    ? "translate-x-full"
                    : "translate-x-0"
                }`}
                style={{
                  margin: "0px",
                  width: "50%",
                  height: "100%",
                  borderRadius: "4px",
                }}
              />

              {/* Button container */}
              <div className="relative flex w-full">
                <button
                  onClick={() => handleGroupSizeSelect("less")}
                  disabled={isLoading}
                  className={`flex-1 py-[14px] px-6 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative z-10 font-semibold text-[14px] rounded-[4px] select-none focus:outline-none focus:ring-0 ${
                    formData.groupSize === "less"
                      ? "bg-transparent text-blue-700" // Selected: transparent bg (white shows from behind), blue text
                      : "bg-transparent text-white" // Not selected: transparent bg, white text
                  }`}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  Less than 3 people
                </button>
                <button
                  onClick={() => handleGroupSizeSelect("more")}
                  disabled={isLoading}
                  className={`flex-1 py-[14px] px-6 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative z-10 font-semibold text-[14px] rounded-[4px] select-none focus:outline-none focus:ring-0 ${
                    formData.groupSize === "more"
                      ? "bg-transparent text-blue-700" // Selected: transparent bg (white shows from behind), blue text
                      : "bg-transparent text-white" // Not selected: transparent bg, white text
                  }`}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  More than 3 people
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="pt-4">
          <button
            onClick={handleGetStarted}
            disabled={!isFormValid() || isLoading}
            className={`w-full py-4 px-6 rounded font-bold text-lg transition-all relative ${
              isFormValid() && !isLoading ? "" : "cursor-not-allowed"
            }`}
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
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span className="italic">REGISTERING...</span>
              </div>
            ) : (
              <span className="italic">GET STARTED</span>
            )}
          </button>
        </div>

        {/* Footer Text */}
        <div className="text-center pt-6">
          <p className="text-white/80 text-sm italic mb-2">
            Powered by advanced AR Technology
          </p>
          <button
            onClick={handleTermsClick}
            disabled={isLoading}
            className="text-white/60 text-xs underline hover:text-white/80 transition-colors bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;
