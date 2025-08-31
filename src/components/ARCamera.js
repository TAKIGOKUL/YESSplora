import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, RotateCcw } from 'lucide-react';
import './ARCamera.css';

const ARCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
  const [capturedImage, setCapturedImage] = useState(null);

  // Initialize camera
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Get user media with specified facing mode
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsStreaming(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create object URL
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        
        // Here you would typically save or process the image
        console.log('Photo captured:', imageUrl);
      }
    }, 'image/jpeg', 0.8);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const savePhoto = () => {
    if (capturedImage) {
      // Here you would typically upload the image or save it
      console.log('Saving photo:', capturedImage);
      setCapturedImage(null);
    }
  };

  return (
    <div className="ar-camera">
      <div className="camera-container">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              muted
            />
            
            {error && (
              <div className="camera-error">
                <CameraOff size={48} />
                <p>{error}</p>
                <button className="retry-btn" onClick={startCamera}>
                  Retry
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="captured-image-container">
            <img
              src={capturedImage}
              alt="Captured"
              className="captured-image"
            />
            <div className="image-actions">
              <button className="action-btn retake" onClick={retakePhoto}>
                <RotateCcw size={20} />
                Retake
              </button>
              <button className="action-btn save" onClick={savePhoto}>
                <Camera size={20} />
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="camera-controls">
        {!capturedImage && (
          <>
            <button
              className="control-btn switch-camera"
              onClick={switchCamera}
              disabled={!isStreaming}
            >
              <RotateCcw size={24} />
            </button>
            
            <button
              className="capture-btn"
              onClick={capturePhoto}
              disabled={!isStreaming}
            >
              <div className="capture-inner"></div>
            </button>
            
            <div className="control-spacer"></div>
          </>
        )}
      </div>

      {/* AR Overlay Elements */}
      <div className="ar-overlay-elements">
        {/* Crosshair */}
        <div className="crosshair">
          <div className="crosshair-horizontal"></div>
          <div className="crosshair-vertical"></div>
        </div>
        
        {/* Corner markers */}
        <div className="corner-markers">
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
        </div>
        
        {/* Status indicators */}
        <div className="status-indicators">
          <div className={`status-indicator ${isStreaming ? 'active' : 'inactive'}`}>
            <div className="status-dot"></div>
            <span>{isStreaming ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ARCamera;

