import { useState, useRef, useEffect } from 'react';
import CameraView from './components/CameraView';
import PhotoStrip from './components/PhotoStrip';
import Controls from './components/Controls';
import { downloadStrip, generateGif, shareStrip } from './utils/imageProcessing';
import SocialShare from './components/SocialShare';
import './App.css';

function App() {
  console.log('APP: Component Mounting/Rendering');
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('none');
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [layout, setLayout] = useState('1-col');
  const stripRef = useRef(null);

  const handleCapture = (photoData) => {
    setPhotos([...photos, photoData]);
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

  const handleShareStrip = () => {
    shareStrip(stripRef.current);
  };

  const handleDownloadGif = () => {
    generateGif(photos, 'none');
  };

  return (
    <div className="app-layout">
      <div className="main-content">
        <div className="app-branding">
          <h1 className="brand-main-title">PHOTOBOOTH</h1>
          <span className="brand-sub-title">By Njmi</span>
        </div>
        <p style={{ textAlign: 'center' }}>Capture your moments, style your strip.</p>

        <CameraView onCapture={handleCapture} filter={filter} />

        <Controls
          selectedFilter={filter}
          onSelectFilter={setFilter}
          borderColor={borderColor}
          onColorChange={setBorderColor}
          textColor={textColor}
          onTextColorChange={setTextColor}
          layout={layout}
          onSelectLayout={setLayout}
          onDownloadStrip={handleDownloadStrip}
          onShareStrip={handleShareStrip}
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
            textColor={textColor}
            layout={layout}
            onRemovePhoto={handleRemovePhoto}
          />
        </div>

        <SocialShare
          onShare={handleShareStrip}
          hasPhotos={photos.length > 0}
        />
      </div>
    </div>
  );
}

export default App;
