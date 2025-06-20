import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showButton, setShowButton] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [preloadedImages, setPreloadedImages] = useState({});

    // Preload all images
    useEffect(() => {
        const images = {};
        let loadedCount = 0;
        const totalImages = 41; // 0 to 40 = 41 images

        for (let i = 0; i <= 40; i++) {
            const img = new Image();
            const fileName = `Comp 1_${i.toString().padStart(5, '0')}.png`;
            const src = `/assets/smile/${fileName}`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setImagesLoaded(true);
                }
            };

            img.src = src;
            images[i] = src;
        }

        setPreloadedImages(images);
    }, []);

    // Start progress animation after images are loaded
    useEffect(() => {
        if (!imagesLoaded) return;

        let step = 0;
        const totalSteps = 20; // Reduced from 40 to 20 for faster percentage

        const interval = setInterval(() => {
            if (step >= totalSteps) {
                setLoadingProgress(100);
                setShowButton(true);
                clearInterval(interval);
                return;
            }

            const progress = (step / totalSteps) * 100;
            setLoadingProgress(progress);
            step++;
        }, 50);

        return () => clearInterval(interval);
    }, [imagesLoaded]);

    // Calculate which image to show based on progress
    const getCurrentImageIndex = () => {
        return Math.min(Math.floor((loadingProgress / 100) * 40), 40);
    };

    const handleTapToBegin = () => {
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white">

            {/* Image */}
            <img
                src="/assets/happydent-logo.png"
                alt="HAPPYDENT"
                className="w-64 h-32 object-contain mb-8"
            />

            {/* Image Sequence Loader */}
            {!showButton && imagesLoaded && (
                <div className="mb-8 flex flex-col items-center">
                    <div className="mb-4">
                        <img
                            src={preloadedImages[getCurrentImageIndex()]}
                            alt="Loading animation"
                            className="w-42 h-42 object-contain"
                        />
                    </div>
                    <p className="text-center text-xl font-bold">{Math.round(loadingProgress)}%</p>
                </div>
            )}

            {/* Loading message while preloading images */}
            {!imagesLoaded && (
                <div className="mb-8">
                    <p className="text-center text-lg">Loading...</p>
                </div>
            )}

            {/* Button */}
            {showButton && (
                <button
                    onClick={handleTapToBegin}
                    className="text-white text-xl font-bold"
                    style={{
                        width: '208px',
                        height: '38px',
                        background: 'radial-gradient(31% 31% at 50% 50%, #FFFFFF 0%, #0033FF 59%, #000DFF 100%)',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.52)',
                        boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.39)',
                        backdropFilter: 'blur(20px)',
                        opacity: '100%'
                    }}
                >
                    TAP TO BEGIN!
                </button>
            )}

        </div>
    );
};

export default SplashScreen;