import { useRef, useEffect, useState } from 'react';

const FILTER_STYLES = {
  none: 'none',
  sepia: 'sepia(0.8) contrast(1.2)',
  grayscale: 'grayscale(1) contrast(1.1)',
  vintage: 'sepia(0.4) contrast(1.2) brightness(0.9) saturate(1.2)',
  invert: 'invert(0.1) contrast(1.2)',
  vivid: 'saturate(1.6) contrast(1.2) brightness(1.05)',
  noir: 'grayscale(0.5) contrast(1.5) brightness(0.9)',
  cool: 'saturate(1.1) contrast(1.1) hue-rotate(30deg) brightness(1.1)',
  warm: 'sepia(0.3) saturate(1.3) contrast(1.1) brightness(1.1)',
  cyber: 'saturate(1.8) contrast(1.2) hue-rotate(190deg) brightness(1.1)'
};

const CameraView = ({ onCapture, filter = 'none' }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    setCountdown(3);
    let count = 3;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        capture();
        setCountdown(null);
      }
    }, 1000);
  };

  const capture = () => {
    if (!videoRef.current) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;

    // Calculate crop for 4:3 aspect ratio
    const videoAspect = video.videoWidth / video.videoHeight;
    const targetAspect = 4 / 3;

    let renderWidth = video.videoWidth;
    let renderHeight = video.videoHeight;
    let startX = 0;
    let startY = 0;

    if (videoAspect > targetAspect) {
      // Video is wider than 4:3 (e.g. 16:9) - Crop sides
      renderWidth = video.videoHeight * targetAspect;
      startX = (video.videoWidth - renderWidth) / 2;
    } else {
      // Video is taller than 4:3 - Crop top/bottom
      renderHeight = video.videoWidth / targetAspect;
      startY = (video.videoHeight - renderHeight) / 2;
    }

    const canvas = document.createElement('canvas');
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    const ctx = canvas.getContext('2d');

    // Flip horizontally if using user-facing camera (mirror effect)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Apply filter to context
    ctx.filter = FILTER_STYLES[filter] || 'none';

    // Draw cropped image
    ctx.drawImage(video, startX, startY, renderWidth, renderHeight, 0, 0, renderWidth, renderHeight);

    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="camera-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-feed"
          style={{ filter: FILTER_STYLES[filter] || 'none' }}
        />
        {countdown !== null && (
          <div className="countdown-overlay">
            {countdown > 0 ? countdown : "SMILE!"}
          </div>
        )}
        {flash && <div className="flash-overlay"></div>}
      </div>

      <div className="camera-controls">
        <button
          className="capture-btn"
          onClick={takePhoto}
          disabled={countdown !== null}
        >
          <div className="shutter-inner"></div>
        </button>
      </div>
    </div>
  );
};

export default CameraView;
