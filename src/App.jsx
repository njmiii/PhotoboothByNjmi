import { useState, useRef } from 'react';
import CameraView from './components/CameraView';
import PhotoStrip from './components/PhotoStrip';
import Controls from './components/Controls';
import { downloadStrip, generateGif } from './utils/imageProcessing';
import './App.css'; // Ensure cleaned CSS is used

function App() {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('none');
  const [borderColor, setBorderColor] = useState('#ffffff');
  const stripRef = useRef(null);

  const handleCapture = (photoData) => {
    if (photos.length < 4) {
      setPhotos([...photos, photoData]);
    } else {
      // Start over? Or just stop?
      // "Take a sequence" usually implies clearing or full set.
      // Let's replace the set if full? Or provide a reset.
      // I'll make it append until full, user must Reset to take more.
      // Or auto-reset? Let's manual reset for now.
      alert("Strip is full! Please download or reset.");
    }
  };

  const handleReset = () => {
    setPhotos([]);
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleDownloadStrip = () => {
    downloadStrip(stripRef.current);
  };

  const handleDownloadGif = () => {
    generateGif(photos, 'none');
  };

  return (
    <div className="app-layout">
      <div className="main-content">
        <h1>ONLINE PHOTOBOOTH</h1>
        <p>Capture your moments, style your strip.</p>

        <CameraView onCapture={handleCapture} filter={filter} />

        <Controls
          selectedFilter={filter}
          onSelectFilter={setFilter}
          borderColor={borderColor}
          onColorChange={setBorderColor}
          onDownloadStrip={handleDownloadStrip}
          onDownloadGif={handleDownloadGif}
          onReset={handleReset}
          hasPhotos={photos.length > 0}
        />
      </div>

      <div className="preview-sidebar">
        <div className="strip-preview-container">
          <PhotoStrip
            ref={stripRef}
            photos={photos}
            filter="none"
            borderColor={borderColor}
            onRemovePhoto={handleRemovePhoto}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
