import { useRef, useEffect, useState } from 'react';

const FILTER_STYLES = {
  sepia: 'sepia(0.8) contrast(1.2)',
  grayscale: 'grayscale(1) contrast(1.1)',
  vintage: 'sepia(0.4) contrast(1.2) brightness(0.9) saturate(1.2)',
  invert: 'invert(0.1) contrast(1.2)',
  none: 'none'
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

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');

    // Flip horizontally if using user-facing camera (mirror effect)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Apply filter to context
    ctx.filter = FILTER_STYLES[filter] || 'none';

    ctx.drawImage(videoRef.current, 0, 0);

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
