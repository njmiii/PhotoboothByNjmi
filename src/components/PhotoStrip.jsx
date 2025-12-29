import { forwardRef } from 'react';
import './PhotoStrip.css';

const PhotoStrip = forwardRef(({ photos, filter, borderColor, onRemovePhoto, layout = '1-col', textColor = '#000000' }, ref) => {
    if (photos.length === 0) {
        return (
            <div className={`empty-strip layout-${layout}`}>
                <div className="empty-slot"></div>
                <div className="empty-slot"></div>
                <div className="empty-slot"></div>
                <p style={{ color: textColor }}>Ready to snap!</p>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={`photo-strip layout-${layout}`}
            style={{ backgroundColor: borderColor, color: textColor }}
        >
            <div className={`photos-container layout-${layout}`}>
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
                 <div className="strip-branding">
                <div className="brand-main">PHOTOBOOTH</div>
                <div className="brand-sub">by Njmi</div>
            </div>
        </div>
    );
});

PhotoStrip.displayName = 'PhotoStrip';

export default PhotoStrip;
