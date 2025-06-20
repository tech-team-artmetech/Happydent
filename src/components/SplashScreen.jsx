import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
    const navigate = useNavigate();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 100) {
                    setShowButton(true);
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const handleTapToBegin = () => {
        navigate('/register');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white">

            {/* Image */}
            <img
                src="/assets/happydent-logo.png"
                alt="HAPPYDENT"
                className="w-64 h-32 object-contain mb-8"
            />

            {/* Generic Loader */}
            {!showButton && (
                <div className="mb-8">
                    <div className="w-48 h-2 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className="text-center mt-4">{loadingProgress}%</p>
                </div>
            )}

            {/* Button */}
            {showButton && (
                <button
                    onClick={handleTapToBegin}
                    className="text-white text-xl"
                    style={{
                        width: '208px',
                        height: '38px',
                        background: 'radial-gradient(31% 31% at 50% 50%, #FFFFFF 0%, #0033FF 59%, #000DFF 100%)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.52)',
                        boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.39)',
                        backdropFilter: 'blur(20px)',
                        opacity: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        cursor: 'pointer',
                    }}
                >
                    TAP TO BEGIN!
                </button>
            )}

        </div>
    );
};

export default SplashScreen;