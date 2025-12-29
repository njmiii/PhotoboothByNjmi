import { forwardRef } from 'react';
import './PhotoStrip.css';

const PhotoStrip = forwardRef(({ photos, filter, borderColor, onRemovePhoto }, ref) => {
    if (photos.length === 0) {
        return (
            <div className="empty-strip">
                <div className="empty-slot"></div>
                <div className="empty-slot"></div>
                <div className="empty-slot"></div>
                <p>Ready to snap!</p>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className="photo-strip"
            style={{ backgroundColor: borderColor }}
        >
            <div className="strip-branding">
                <span className="brand-text">PHOTOBOOTH</span>
            </div>

            <div className="photos-container">
                {photos.map((photo, index) => (
                    <div key={index} className="photo-frame">
                        <img
                            src={photo}
                            alt={`Capture ${index + 1}`}
                            className={`photo-item ${filter}`}
                        />
                        {onRemovePhoto && (
                            <button
                                className="delete-btn"
                                onClick={() => onRemovePhoto(index)}
                                aria-label="Remove photo"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="strip-footer">
                <span className="date-text">{new Date().toLocaleDateString()}</span>
                <span className="time-text">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
});

PhotoStrip.displayName = 'PhotoStrip';

export default PhotoStrip;
