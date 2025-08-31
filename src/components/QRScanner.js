import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import jsQR from 'jsqr';
import './QRScanner.css';

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        // Start scanning loop
        scanLoop();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanLoop = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleQRDetected(code.data);
        return;
      }
    }

    // Continue scanning
    requestAnimationFrame(scanLoop);
  };

  const handleQRDetected = (data) => {
    setScanResult(data);
    setIsScanning(false);
    stopCamera();
    
    // Process the QR code data
    setTimeout(() => {
      onScan(data);
    }, 1000);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const retryScan = () => {
    setScanResult(null);
    setError(null);
    startCamera();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="qr-scanner-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="qr-scanner-modal"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="scanner-header">
            <h2>QR Code Scanner</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Scanner Content */}
          <div className="scanner-content">
            {!scanResult && !error && (
              <>
                <div className="camera-container">
                  <video
                    ref={videoRef}
                    className="scanner-video"
                    autoPlay
                    playsInline
                    muted
                  />
                  
                  {/* Scanning Overlay */}
                  <div className="scanning-overlay">
                    <div className="scan-frame">
                      <div className="corner top-left"></div>
                      <div className="corner top-right"></div>
                      <div className="corner bottom-left"></div>
                      <div className="corner bottom-right"></div>
                    </div>
                    <div className="scan-line"></div>
                  </div>
                </div>
                
                <div className="scanner-instructions">
                  <p>Position the QR code within the frame</p>
                  <p className="instruction-subtitle">Make sure the code is clearly visible</p>
                </div>
              </>
            )}

            {error && (
              <div className="scanner-error">
                <AlertCircle size={48} />
                <h3>Camera Error</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={retryScan}>
                  <RotateCcw size={20} />
                  Try Again
                </button>
              </div>
            )}

            {scanResult && (
              <div className="scan-result">
                <CheckCircle size={48} />
                <h3>QR Code Detected!</h3>
                <div className="result-data">
                  <p className="result-label">Data:</p>
                  <p className="result-value">{scanResult}</p>
                </div>
                <p className="processing-text">Processing...</p>
              </div>
            )}
          </div>

          {/* Controls */}
          {!scanResult && !error && (
            <div className="scanner-controls">
              <button className="control-btn" onClick={switchCamera}>
                <RotateCcw size={20} />
                Switch Camera
              </button>
              <button className="control-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          )}

          {/* Hidden canvas for QR detection */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRScanner;

