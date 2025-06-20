import React from 'react';

const EndScreen = ({ onRetry }) => {

    const handlePrint = () => {
        window.print();
    };

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
    };

    const buttonStyle = {
        width: '208px',
        height: '38px',
        background: 'radial-gradient(31% 31% at 50% 50%, #FFFFFF 0%, #0033FF 59%, #000DFF 100%)',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.52)',
        boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.39)',
        backdropFilter: 'blur(20px)',
        opacity: '100%',
        zIndex: 10,
        position: 'relative'
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white relative z-10">

            {/* Image */}
            <div className="mb-8 z-10">
                <img
                    src="/assets/enddummy.png"
                    alt="Result"
                    className="w-80 h-80 object-contain rounded-lg"
                />
            </div>

            {/* Buttons Container */}
            <div className="flex flex-col space-y-4 items-center z-20 relative">

                {/* Print Button */}
                <button
                    onClick={handlePrint}
                    className="text-white text-xl font-bold hover:scale-105 transition-transform cursor-pointer"
                    style={buttonStyle}
                >
                    PRINT
                </button>

                {/* Retry Button */}
                <button
                    onClick={handleRetry}
                    className="text-white text-xl font-bold hover:scale-105 transition-transform cursor-pointer"
                    style={buttonStyle}
                >
                    RETRY
                </button>

            </div>

        </div>
    );
};

export default EndScreen;