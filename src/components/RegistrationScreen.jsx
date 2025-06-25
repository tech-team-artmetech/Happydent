import React, { useState } from "react";

const RegistrationScreen = ({ onComplete, onTerms }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    groupSize: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  // API endpoint - change this to your backend URL
  const API_BASE_URL = 'http://localhost:3001';

  // Validate Indian phone number (exactly 10 digits)
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Check if all fields are filled and valid
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      validatePhone(formData.phone) &&
      formData.groupSize !== ""
    );
  };

  const handleNameChange = (e) => {
    setError(""); // Clear error when user types
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    setError(""); // Clear error when user types
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    // Only allow first digit to be 6-9
    if (value.length === 0 || /^[6-9]/.test(value)) {
      if (value.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: value }));
      }
    }
  };

  const handleGroupSizeSelect = (size) => {
    setError(""); // Clear error when user selects
    setFormData((prev) => ({ ...prev, groupSize: size }));
  };

  // API call to register user
  const registerUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration API error:', error);
      throw error;
    }
  };

  const handleGetStarted = async () => {
    if (!isFormValid()) {
      setError("Please fill all fields correctly");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Prepare data for API
      const userData = {
        name: formData.name.trim(),
        phone: formData.phone,
        groupSize: formData.groupSize
      };

      console.log('Registering user:', userData);

      // Call registration API
      const response = await registerUser(userData);

      console.log('Registration successful:', response);

      // Pass the user data to parent component
      onComplete({
        ...formData,
        userId: response.data.id,
        isExisting: response.data.isExisting,
        apiResponse: response
      });

    } catch (error) {
      console.error('Registration error:', error);

      // Handle specific error messages
      if (error.message.includes('already registered')) {
        setError("This phone number is already registered");
      } else if (error.message.includes('Invalid phone')) {
        setError("Please enter a valid phone number");
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
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

      {/* Form Container */}
      <div className="w-full max-w-sm space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message for Existing Users */}
        {isLoading && (
          <div className="bg-blue-500/20 border border-blue-500/50 rounded p-3 text-center">
            <p className="text-blue-300 text-sm">Connecting to server...</p>
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

        {/* Phone Input */}
        <div>
          <input
            type="tel"
            placeholder="Phone No."
            value={formData.phone}
            onChange={handlePhoneChange}
            onBlur={() => setPhoneTouched(true)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
            maxLength="10"
            pattern="^[6-9]\d{9}$"
          />
          <p
            className={`text-red-300 text-xs mt-1 transition-all duration-200 ${phoneTouched && !validatePhone(formData.phone)
              ? "visible"
              : "invisible"
              }`}
          >
            Enter valid 10 digit mobile number
          </p>
        </div>

        {/* Group Size Selection */}
        <div className="text-center">
          <h3 className="text-white text-lg mb-4">
            ——— Select you <span className="font-bold">GROUP SIZE</span> ———
          </h3>

          <div className="flex space-x-1">
            <button
              onClick={() => handleGroupSizeSelect("less")}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 border border-white/50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.groupSize === "less"
                ? "bg-white text-blue-600 font-medium"
                : "bg-transparent text-white"
                }`}
            >
              Less than 3 people
            </button>
            <button
              onClick={() => handleGroupSizeSelect("more")}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 border border-white/50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed ${formData.groupSize === "more"
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
            className={`w-full py-4 px-6 rounded font-bold text-lg transition-all relative ${isFormValid() && !isLoading
              ? "bg-blue-600 text-white border border-white/50 hover:bg-blue-700"
              : "bg-gray-500/30 text-gray-400 border border-gray-500/30 cursor-not-allowed"
              }`}
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