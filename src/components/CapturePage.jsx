import React, { useState, useRef, useEffect } from 'react';

const CapturePage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [facingMode, setFacingMode] = useState('user'); // Front camera by default
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [facingMode]);

    const startCamera = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Stop existing stream if any
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: facingMode
                },
                audio: false
            };

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }

            setIsLoading(false);
        } catch (err) {
            console.error('Camera access error:', err);
            setError('Camera access denied or not available. Please allow camera access and try again.');
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsCapturing(true);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // If front camera, mirror the canvas to match the preview
        if (facingMode === 'user') {
            context.scale(-1, 1);
            context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        } else {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        // Convert to base64
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedPhoto(photoDataUrl);

        // Stop camera
        stopCamera();

        console.log('Photo captured:', {
            resolution: `${canvas.width}x${canvas.height}`,
            facingMode: facingMode,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });

        setTimeout(() => {
            setIsCapturing(false);
        }, 1000);
    };

    const retryCamera = () => {
        setCapturedPhoto(null);
        setIsCapturing(false);
        startCamera();
    };

    const downloadPhoto = () => {
        if (!capturedPhoto) return;

        const link = document.createElement('a');
        link.download = `capture_${Date.now()}.jpg`;
        link.href = capturedPhoto;
        link.click();
    };

    if (capturedPhoto) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto bg-black">
                <div className="w-full max-w-md">
                    <h2 className="text-xl font-bold text-center mb-4">Photo Captured!</h2>

                    <div className="relative mb-6">
                        <img
                            src={capturedPhoto}
                            alt="Captured photo"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={downloadPhoto}
                            className="w-full py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors"
                        >
                            Download Photo
                        </button>

                        <button
                            onClick={retryCamera}
                            className="w-full py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                        >
                            Take Another Photo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-white max-w-[768px] mx-auto">
            {/* Header */}
            <div className="p-4 text-center">
                <h1 className="text-2xl font-bold mb-2">Camera Test</h1>
                <p className="text-sm text-white/80">
                    Test camera quality on different devices
                </p>
            </div>

            {/* Camera Container */}
            <div className="flex-1 relative bg-black">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="text-white">Starting camera...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                        <div className="text-center p-6">
                            <div className="mb-4">
                                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-red-300 text-sm mb-4">{error}</p>
                            <button
                                onClick={retryCamera}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Video Element - MIRRORED FOR FRONT CAMERA */}
                <video
                    ref={videoRef}
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    playsInline
                    muted
                />

                {/* Hidden Canvas for capturing */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Switch Camera Button - Top Right */}
                {!isLoading && !error && (
                    <button
                        onClick={switchCamera}
                        className="absolute top-4 right-4 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                        title="Switch Camera"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Controls Below Camera */}
            {!isLoading && !error && (
                <div className="p-6 bg-black">
                    <div className="text-center">
                        {/* Capture Button */}
                        <button
                            onClick={capturePhoto}
                            disabled={isCapturing}
                            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all mx-auto mb-4 ${isCapturing
                                ? 'bg-green-500 border-green-300'
                                : 'bg-white/20 hover:bg-white/30'
                                }`}
                        >
                            {isCapturing ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            ) : (
                                <div className="w-16 h-16 bg-white rounded-full"></div>
                            )}
                        </button>

                        {/* Instructions */}
                        <p className="text-white/90 text-sm mb-2">
                            Tap to capture photo
                        </p>

                        {/* Camera Info */}
                        <p className="text-white/60 text-xs">
                            Using {facingMode === 'user' ? 'Front' : 'Back'} Camera
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CapturePage;