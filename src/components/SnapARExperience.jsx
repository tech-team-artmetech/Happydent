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
    const cameraManagerRef = useRef(null);

    useEffect(() => {
        initializeCameraKit();
        return () => {
            cleanup();
        };
    }, []);

    const initializeCameraKit = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Use your exact API token and lens group ID
            const actualApiToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzUwMjUxNDQ5LCJzdWIiOiJmZDFmZDkyMi01NWI1LTQ3ZTQtOTlmOS1kMjQ1YzIyNzZjZWZ-U1RBR0lOR340MDg2OWI4MC05ZmFhLTRiNDItYmFhZi1kYzUzNTIwMjE1MjAifQ.KdKKmZgB55cHRYL7L8O7O8-XyX2WnRfxbfF2iMZQ1v0';
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

        } catch (err) {
            console.error('Camera Kit initialization error:', err);
            setError(`Failed to initialize AR: ${err.message}`);
            setIsLoading(false);
        }
    };

    const cleanup = () => {
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
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-white max-w-[768px] mx-auto">
            {/* Header */}


            {/* AR Canvas Container */}
            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="text-white">Loading AR experience...</p>
                        </div>
                    </div>
                )}

                {/* Canvas - Exactly like your HTML */}
                <canvas
                    ref={canvasRef}
                    id="canvas"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>

            {/* Controls */}

        </div>
    );
};

export default SnapARExperience;