// import React, { useState, useEffect } from "react";

// const RegistrationScreen = ({ onComplete, onTerms }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     groupSize: "",
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

//   // API endpoint - change this to your backend URL
//   const API_BASE_URL = "https://artmetech.co.in";

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
//     return (
//       formData.name.trim() !== "" &&
//       validatePhone(formData.phone) &&
//       formData.groupSize !== "" &&
//       otpData.isOtpVerified
//     );
//   };

//   const handleNameChange = (e) => {
//     setError(""); // Clear error when user types
//     setFormData((prev) => ({ ...prev, name: e.target.value }));
//   };

//   const handlePhoneChange = (e) => {
//     setError(""); // Clear error when user types
//     const value = e.target.value.replace(/\D/g, ""); // Remove non-digits

//     // Reset OTP state if phone number changes
//     if (value !== formData.phone) {
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

//   // Send OTP API call
//   const sendOTP = async () => {
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
//           otpVerified: otpData.isOtpVerified,
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
//       if (!otpData.isOtpVerified) {
//         setError("Please verify your phone number first");
//       } else {
//         setError("Please fill all fields correctly");
//       }
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
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

//       {/* Form Container */}
//       <div className="w-full max-w-sm space-y-6">
//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-center">
//             <p className="text-red-300 text-sm">{error}</p>
//           </div>
//         )}

//         {/* Success Message for OTP Verification */}
//         {otpData.isOtpVerified && (
//           <div className="bg-green-500/20 border border-green-500/50 rounded p-3 text-center">
//             <p className="text-green-300 text-sm">
//               ✅ Phone number verified successfully!
//             </p>
//           </div>
//         )}

//         {/* Loading Message */}
//         {isLoading && (
//           <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 text-center">
//             <p className="text-blue-300 text-sm">Processing...</p>
//           </div>
//         )}

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
//                   (otpData.isOtpSent && !otpData.canResend)
//                 }
//                 className={`px-4 py-3 rounded font-medium text-sm transition-all ${validatePhone(formData.phone) &&
//                   !isLoading &&
//                   (!otpData.isOtpSent || otpData.canResend)
//                   ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"
//                   : "bg-gray-500/30 text-gray-400 border border-gray-500/30 cursor-not-allowed"
//                   }`}
//               >
//                 {otpData.isOtpSent && !otpData.canResend
//                   ? "Sent"
//                   : otpData.isOtpSent
//                     ? "Resend"
//                     : "Send OTP"}
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

//         {/* OTP Input (shown only when OTP is sent) */}
//         {otpData.isOtpSent && !otpData.isOtpVerified && (
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
//                   ? "bg-green-600 text-white border border-green-600 hover:bg-green-700"
//                   : "bg-gray-500/30 text-gray-400 border border-gray-500/30 cursor-not-allowed"
//                   }`}
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
//           <h3 className="text-white text-lg mb-4">
//             ——— Select you <span className="font-bold">GROUP SIZE</span> ———
//           </h3>

//           <div className="flex space-x-1">
//             <button
//               onClick={() => handleGroupSizeSelect("less")}
//               disabled={isLoading}
//               className={`flex-1 py-3 px-4 border border-white/50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.groupSize === "less"
//                 ? "bg-white text-blue-600 font-medium"
//                 : "bg-transparent text-white"
//                 }`}
//             >
//               Less than 3 people
//             </button>
//             <button
//               onClick={() => handleGroupSizeSelect("more")}
//               disabled={isLoading}
//               className={`flex-1 py-3 px-4 border border-white/50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.groupSize === "more"
//                 ? "bg-white text-blue-600 font-medium"
//                 : "bg-transparent text-white"
//                 }`}
//             >
//               More than 3 people
//             </button>
//           </div>
//         </div>

//         {/* Get Started Button */}
//         <div className="pt-4">
//           <button
//             onClick={handleGetStarted}
//             disabled={!isFormValid() || isLoading}
//             className={`w-full py-4 px-6 rounded font-bold text-lg transition-all relative ${isFormValid() && !isLoading
//               ? "bg-blue-600 text-white border border-white/50 hover:bg-blue-700"
//               : "bg-gray-500/30 text-gray-400 border border-gray-500/30 cursor-not-allowed"
//               }`}
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

const RegistrationScreen = ({ onComplete, onTerms }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    groupSize: "",
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

  // ⭐ TESTING MODE - Set to true to bypass OTP
  const BYPASS_OTP = true; // Change to false for production

  // API endpoint - change this to your backend URL
  const API_BASE_URL = "https://artmetech.co.in";

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
      // 🎭 START AR SESSION - Set AR state to ongoing (false)
      console.log(`🎭 Starting AR session for ${formData.phone}`);
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

      // Prepare data for API
      const userData = {
        name: formData.name.trim(),
        phone: formData.phone,
        groupSize: formData.groupSize,
      };

      console.log("Registering user:", userData);

      // Call registration API
      const response = await registerUser(userData);

      console.log("Registration successful:", response);

      // Store phone number in localStorage for photo download later
      localStorage.setItem("userPhone", formData.phone);
      localStorage.setItem("userId", response.data.id.toString());
      localStorage.setItem("userName", formData.name.trim());

      // Pass the user data to parent component
      onComplete({
        ...formData,
        userId: response.data.id,
        isExisting: response.data.isExisting,
        apiResponse: response,
        bypassMode: BYPASS_OTP,
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

      {/* Testing Mode Indicator */}
      {BYPASS_OTP && (
        <div className="w-full max-w-sm mb-4">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-2 text-center">
            <p className="text-yellow-300 text-xs">
              🧪 Testing Mode - OTP Bypassed
            </p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="w-full max-w-sm space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message for OTP Verification */}
        {otpData.isOtpVerified && (
          <div className="bg-green-500/20 border border-green-500/50 rounded p-3 text-center">
            <p className="text-green-300 text-sm">
              ✅{" "}
              {BYPASS_OTP
                ? "Phone number verified (bypass mode)"
                : "Phone number verified successfully!"}
            </p>
          </div>
        )}

        {/* Loading Message */}
        {isLoading && (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 text-center">
            <p className="text-blue-300 text-sm">Processing...</p>
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
                    ? "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"
                    : "bg-gray-500/30 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                }`}
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
                    ? "bg-green-600 text-white border border-green-600 hover:bg-green-700"
                    : "bg-gray-500/30 text-gray-400 border border-gray-500/30 cursor-not-allowed"
                }`}
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
          <h3 className="text-white text-lg mb-4">
            ——— Select you <span className="font-bold">GROUP SIZE</span> ———
          </h3>

          <div className="flex space-x-1">
            <button
              onClick={() => handleGroupSizeSelect("less")}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 border border-white/50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.groupSize === "less"
                  ? "bg-white text-blue-600 font-medium"
                  : "bg-transparent text-white"
              }`}
            >
              Less than 3 people
            </button>
            <button
              onClick={() => handleGroupSizeSelect("more")}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 border border-white/50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.groupSize === "more"
                  ? "bg-white text-blue-600 font-medium"
                  : "bg-transparent text-white"
              }`}
            >
              More than 3 people
            </button>
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
