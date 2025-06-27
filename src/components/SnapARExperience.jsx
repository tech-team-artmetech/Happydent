import React, { useRef, useEffect, useState } from 'react';
import { bootstrapCameraKit, createMediaStreamSource, Transform2D } from '@snap/camera-kit';

class CameraManager {
    constructor() {
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.isBackFacing = false;
        this.mediaStream = null;
    }

    async initializeCamera() {
        if (!this.isMobile) {
            document.body.classList.add("desktop");
        }

        this.mediaStream = await navigator.mediaDevices.getUserMedia(this.getConstraints());
        return this.mediaStream;
    }

    getConstraints() {
        const settings = {
            camera: {
                constraints: {
                    front: {
                        video: {
                            facingMode: "user", // Remove "exact" to be more flexible
                        },
                        audio: true,
                    },
                    back: {
                        video: {
                            facingMode: "environment", // Remove "exact" to be more flexible
                        },
                        audio: true,
                    },
                    desktop: {
                        video: {
                            facingMode: "user",
                        },
                        audio: true,
                    },
                },
            },
        };

        return this.isMobile
            ? (this.isBackFacing ? settings.camera.constraints.back : settings.camera.constraints.front)
            : settings.camera.constraints.desktop;
    }
}

const SnapARExperience = ({ onComplete, userData, lensGroupId, apiToken }) => {
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCapturing, setIsCapturing] = useState(false);
    const [autoCapturing, setAutoCapturing] = useState(false);
    const cameraManagerRef = useRef(null);
    const sessionRef = useRef(null);
    const captureTimeoutRef = useRef(null);

    useEffect(() => {
        initializeCameraKit();
        return () => {
            cleanup();
        };
    }, []);

    // Add this after your existing useEffect
    useEffect(() => {
        // Check AR end state every 3 seconds
        const checkARState = async () => {
            if (!userData?.phone) return;

            try {
                const response = await fetch(`https://artmetech.co.in/api/ar-end/${userData.phone}`);
                const data = await response.json();

                if (data.success && data.data.arEnded) {
                    console.log('🎭 AR session ended by server - triggering capture');
                    captureAndUpload();
                }
            } catch (error) {
                console.error('❌ Failed to check AR state:', error);
            }
        };

        // Start checking every 3 seconds after AR loads
        let stateCheckInterval;
        if (!isLoading && userData?.phone) {
            stateCheckInterval = setInterval(checkARState, 3000);
            console.log('🎭 Started AR state monitoring every 3 seconds');
        }

        return () => {
            if (stateCheckInterval) {
                clearInterval(stateCheckInterval);
                console.log('🎭 Stopped AR state monitoring');
            }
        };
    }, [isLoading, userData?.phone]); // Dependencies: only restart if loading state or phone changes

    const initializeCameraKit = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Use your exact API token and lens group ID
            const actualApiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUwMjUxNDQ5LCJzdWIiOiJmZDFmZDkyMi01NWI1LTQ3ZTQtOTlmOS1kMjQ1YzIyNzZjZWZ-UFJPRFVDVElPTn4wYTBiZDg4OC0zYzJkLTQ2NTQtOWJhZS04NWNkZjIwZGZkM2MifQ.DXp0F3LA8ZqxuB0UH4TCaQT2iMbCsc9xrT8xbuoYOJg';
            const actualLensGroupId = 'b2aafdd8-cb11-4817-9df9-835b36d9d5a7';

            // Initialize managers (exactly like your code)
            cameraManagerRef.current = new CameraManager();

            // Initialize Camera Kit (exactly like your code)
            const cameraKit = await bootstrapCameraKit({
                apiToken: actualApiToken,
            });

            // Get canvas element for live render target (exactly like your code)
            const liveRenderTarget = canvasRef.current;

            // Create camera kit session (exactly like your code)
            const session = await cameraKit.createSession({ liveRenderTarget });
            sessionRef.current = session;

            // Initialize camera and set up source (exactly like your code)
            const mediaStream = await cameraManagerRef.current.initializeCamera();
            const source = createMediaStreamSource(mediaStream, {
                cameraType: "user",
                disableSourceAudio: false,
            });
            await session.setSource(source);
            source.setTransform(Transform2D.MirrorX);
            await source.setRenderSize(window.innerWidth, window.innerHeight);
            await session.setFPSLimit(60);
            await session.play();

            // Load and apply lens (exactly like your code)
            const { lenses } = await cameraKit.lensRepository.loadLensGroups([actualLensGroupId]);
            if (lenses && lenses.length > 0) {
                await session.applyLens(lenses[0]);
            }

            setIsLoading(false);

            // Start automatic capture after 8 seconds of AR being ready
            console.log('⏰ Starting 8-second countdown for automatic capture...');
            captureTimeoutRef.current = setTimeout(() => {
                console.log('🎯 Auto-capture triggered after 8 seconds');
                captureAndUpload();
            }, 8000);

        } catch (err) {
            console.error('Camera Kit initialization error:', err);
            setError(`Failed to initialize AR: ${err.message}`);
            setIsLoading(false);
        }
    };

    const cleanup = () => {
        // Clear the auto-capture timeout
        if (captureTimeoutRef.current) {
            clearTimeout(captureTimeoutRef.current);
            captureTimeoutRef.current = null;
        }

        if (cameraManagerRef.current && cameraManagerRef.current.mediaStream) {
            cameraManagerRef.current.mediaStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    };

    const skipToEnd = () => {
        cleanup();
        onComplete({
            ...userData,
            photo: 'test-photo-url',
            timestamp: new Date().toISOString(),
            lensGroupId: lensGroupId,
            testMode: true
        });
    };

    const captureAndUpload = async () => {
        if (!canvasRef.current || !userData?.phone || isCapturing) {
            console.log('❌ Cannot capture: missing canvas, phone, or already capturing');
            console.log('❌ Debug info:', {
                hasCanvas: !!canvasRef.current,
                hasPhone: !!userData?.phone,
                phone: userData?.phone,
                isCapturing
            });
            return;
        }

        try {
            setIsCapturing(true);
            setAutoCapturing(true);
            console.log('📸 Starting automatic polaroid capture process...');
            console.log('📱 Phone number for upload:', userData.phone);

            const canvas = canvasRef.current;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            console.log(`📐 Canvas dimensions: ${canvasWidth} x ${canvasHeight}`);

            // Define polaroid area to capture the entire frame including top and bottom text
            // Adjusted to capture the full polaroid from top "WHATTA CHAMKING SMILE!" to bottom "HAPPYDENT"
            const polaroidArea = {
                x: 3, // 12% from left (slightly more centered)
                y: 0, // 15% from top (to include the top text)
                width: 94, // 76% of canvas width (wider to get full frame)
                height: 85 // 70% of canvas height (taller to include bottom text)
            };

            console.log('🎯 Polaroid area (%):', polaroidArea);

            // Convert percentages to actual pixels
            const captureArea = {
                x: Math.floor((canvasWidth * polaroidArea.x) / 100),
                y: Math.floor((canvasHeight * polaroidArea.y) / 100),
                width: Math.floor((canvasWidth * polaroidArea.width) / 100),
                height: Math.floor((canvasHeight * polaroidArea.height) / 100)
            };

            console.log('📏 Capture area (pixels):', captureArea);

            // Create a temporary canvas for the cropped image with 30% larger dimensions
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            // Increase canvas size by 30%
            const enlargedWidth = Math.floor(captureArea.width * 1.3);
            const enlargedHeight = Math.floor(captureArea.height * 1.3);

            tempCanvas.width = enlargedWidth;
            tempCanvas.height = enlargedHeight;

            console.log('📏 Temp canvas dimensions:', {
                original: `${captureArea.width} x ${captureArea.height}`,
                enlarged: `${enlargedWidth} x ${enlargedHeight}`,
                increase: '30%'
            });

            // Draw the cropped area from the main canvas, scaled up to fill the larger temp canvas
            tempCtx.drawImage(
                canvas,
                captureArea.x, captureArea.y, captureArea.width, captureArea.height,
                0, 0, enlargedWidth, enlargedHeight
            );

            console.log('✂️ Cropped polaroid area to temp canvas');

            // Convert to blob - explicit Promise handling
            console.log('🔄 Converting canvas to blob...');
            const blob = await new Promise((resolve, reject) => {
                tempCanvas.toBlob((result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                }, 'image/jpeg', 0.9);
            });

            console.log(`📦 Created blob: ${blob.size} bytes`);

            // Create FormData for upload
            const formData = new FormData();
            formData.append('photo', blob, `polaroid_${userData.phone}.jpg`);
            formData.append('phone', userData.phone);
            formData.append('source', 'snapchat_polaroid');

            console.log('⬆️ Uploading to S3...');

            // Upload to your backend - using the correct URL from the documentation
            const response = await fetch('https://artmetech.co.in/api/upload-photo', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                console.log('✅ Upload successful:', result.data.imageUrl);
                console.log('📁 File details:', {
                    fileName: result.data.fileName,
                    source: result.data.source,
                    uploadedAt: result.data.uploadedAt
                });

                // Reduced delay by 20% (was 5 seconds, now 4 seconds)
                console.log('⏳ Waiting 4 seconds before transitioning to end screen...');
                setTimeout(() => {
                    console.log('➡️ Transitioning to end screen with successful upload');
                    onComplete({
                        ...userData,
                        photo: result.data.imageUrl,
                        timestamp: new Date().toISOString(),
                        lensGroupId: lensGroupId,
                        captureMode: 'polaroid',
                        uploadSuccess: true
                    });
                }, 4000);

            } else {
                console.error('❌ Upload failed:', result.message);
                console.error('❌ Error code:', result.code);
                // Reduced delay by 20% (was 3 seconds, now 2.4 seconds)  
                console.log('⏳ Upload failed, waiting 2.4 seconds before transitioning...');
                setTimeout(() => {
                    console.log('➡️ Transitioning to end screen with failed upload');
                    onComplete({
                        ...userData,
                        photo: 'upload-failed',
                        timestamp: new Date().toISOString(),
                        lensGroupId: lensGroupId,
                        captureMode: 'polaroid',
                        uploadSuccess: false,
                        errorMessage: result.message
                    });
                }, 2400);
            }

        } catch (error) {
            console.error('❌ Capture and upload error:', error);
            console.error('❌ Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });

            // Reduced delay by 20% (was 3 seconds, now 2.4 seconds)
            console.log('⏳ Error occurred, waiting 2.4 seconds before transitioning...');
            setTimeout(() => {
                console.log('➡️ Transitioning to end screen with error');
                onComplete({
                    ...userData,
                    photo: 'capture-failed',
                    timestamp: new Date().toISOString(),
                    lensGroupId: lensGroupId,
                    captureMode: 'polaroid',
                    uploadSuccess: false,
                    errorMessage: error.message
                });
            }, 2400);
        } finally {
            setIsCapturing(false);
            setAutoCapturing(false);
        }
    };

    // Check for errors and render error state if needed
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white max-w-[768px] mx-auto bg-black">
                <div className="text-center p-6">
                    <p className="text-red-300 text-sm mb-4">{error}</p>
                    <button
                        onClick={skipToEnd}
                        className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                    >
                        Skip to End (Test Mode)
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* CSS for tablet-specific canvas styling */}
            <style jsx>{`
                #canvas {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                /* Tablet styles - targets devices with screen width between 768px and 1024px */
                @media screen and (min-width: 768px) and (max-width: 1024px) {
                    #canvas {
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: contain !important;
                        aspect-ratio: 9 / 16 !important;
                        background: linear-gradient(180deg, #0c1f59, #0b3396) !important;
                    }
                    
                    .canvas-container {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                }
                
                /* Also target iPad specifically */
                @media screen and (device-width: 768px) and (device-height: 1024px),
                       screen and (device-width: 1024px) and (device-height: 768px),
                       screen and (device-width: 820px) and (device-height: 1180px),
                       screen and (device-width: 1180px) and (device-height: 820px) {
                    #canvas {
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: contain !important;
                        aspect-ratio: 9 / 16 !important;
                        background: linear-gradient(180deg, #0c1f59, #0b3396) !important;
                    }
                    
                    .canvas-container {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    }
                }
            `}</style>

            <div className="min-h-screen flex flex-col bg-black text-white max-w-[768px] mx-auto">
                {/* Header */}

                {/* AR Canvas Container */}
                <div className="flex-1 relative canvas-container">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                <p className="text-white">Loading AR experience...</p>
                            </div>
                        </div>
                    )}

                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        id="canvas"
                    />

                    {/* Auto-Capture Status Overlay */}
                    {autoCapturing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                            <div className="text-center">
                                <div className="animate-pulse text-white text-lg font-medium">
                                    📸 Capturing your moment...
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}

            </div>
        </>
    );
};

export default SnapARExperience;