import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        groupSize: ''
    });

    // Validate Indian phone number (exactly 10 digits)
    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    // Check if all fields are filled and valid
    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            validatePhone(formData.phone) &&
            formData.groupSize !== ''
        );
    };

    const handleNameChange = (e) => {
        setFormData(prev => ({ ...prev, name: e.target.value }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 10) {
            setFormData(prev => ({ ...prev, phone: value }));
        }
    };

    const handleGroupSizeSelect = (size) => {
        setFormData(prev => ({ ...prev, groupSize: size }));
    };

    const handleGetStarted = () => {
        if (isFormValid()) {
            navigate('/end');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white">

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
                <p className="text-lg italic">
                    filling in your details!
                </p>
            </div>

            {/* Form Container */}
            <div className="w-full max-w-sm space-y-6">

                {/* Name Input */}
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleNameChange}
                        className="w-full px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white"
                    />
                </div>

                {/* Phone Input */}
                <div>
                    <input
                        type="tel"
                        placeholder="Phone No."
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className="w-full px-4 py-3 bg-transparent border border-white/50 rounded text-white placeholder-white/70 focus:outline-none focus:border-white"
                        maxLength="10"
                    />
                    {formData.phone && !validatePhone(formData.phone) && (
                        <p className="text-red-300 text-xs mt-1">Enter valid 10-digit Indian mobile number</p>
                    )}
                </div>

                {/* Group Size Selection */}
                <div className="text-center">
                    <h3 className="text-white text-lg mb-4">
                        ——— Select you <span className="font-bold">GROUP SIZE</span> ———
                    </h3>

                    <div className="flex space-x-1">
                        <button
                            onClick={() => handleGroupSizeSelect('less')}
                            className={`flex-1 py-3 px-4 border border-white/50 rounded transition-all ${formData.groupSize === 'less'
                                ? 'bg-white text-blue-600 font-medium'
                                : 'bg-transparent text-white'
                                }`}
                        >
                            Less than 3 people
                        </button>
                        <button
                            onClick={() => handleGroupSizeSelect('more')}
                            className={`flex-1 py-3 px-4 border border-white/50 rounded transition-all ${formData.groupSize === 'more'
                                ? 'bg-white text-blue-600 font-medium'
                                : 'bg-transparent text-white'
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
                        disabled={!isFormValid()}
                        className={`w-full py-4 px-6 rounded font-bold text-lg transition-all ${isFormValid()
                            ? 'bg-blue-600 text-white border border-white/50 hover:bg-blue-700'
                            : 'bg-gray-500/30 text-gray-400 border border-gray-500/30 cursor-not-allowed'
                            }`}
                    >
                        <span className="italic">GET STARTED</span>
                    </button>
                </div>

                {/* Footer Text */}
                <div className="text-center pt-6">
                    <p className="text-white/80 text-sm italic mb-2">
                        Powered by advanced AR Technology
                    </p>
                    <a
                        href="/terms"
                        className="text-white/60 text-xs underline hover:text-white/80 transition-colors"
                    >
                        Terms & Conditions
                    </a>
                </div>

            </div>
        </div>
    );
};

export default RegistrationScreen;