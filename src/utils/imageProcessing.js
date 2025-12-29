import html2canvas from 'html2canvas';
import GIF from 'gif.js';
import { saveAs } from 'file-saver';

export const downloadStrip = async (element) => {
    if (!element) return;
    try {
        const canvas = await html2canvas(element, {
            useCORS: true,
            scale: 2,
            backgroundColor: null, // Preserve transparency if any
            ignoreElements: (element) => element.classList.contains('delete-btn')
        });
        canvas.toBlob((blob) => {
            saveAs(blob, `PhotoboothByNjmi-${Date.now()}.png`);
        });
    } catch (error) {
        console.error("Download failed:", error);
    }
};

export const shareStrip = async (element) => {
    if (!element) return;
    try {
        const canvas = await html2canvas(element, {
            useCORS: true,
            scale: 2,
            backgroundColor: null,
            ignoreElements: (element) => element.classList.contains('delete-btn')
        });

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const file = new File([blob], `photobooth-share-${Date.now()}.png`, { type: 'image/png' });

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Photobooth Strip',
                        text: 'Check out my photos from Photobooth By Njmi!',
                        files: [file]
                    });
                } catch (shareError) {
                    console.log('Error sharing:', shareError);
                }
            } else {
                alert('Sharing is not supported on this browser/device. Try downloading instead!');
            }
        });
    } catch (error) {
        console.error("Share generation failed:", error);
    }
};

const getFilterString = (filterType) => {
    switch (filterType) {
        case 'sepia': return 'sepia(0.8) contrast(1.2)';
        case 'grayscale': return 'grayscale(1) contrast(1.1)';
        case 'vintage': return 'sepia(0.4) contrast(1.2) brightness(0.9) saturate(1.2)';
        case 'invert': return 'invert(0.1) contrast(1.2)';
        case 'vivid': return 'saturate(1.6) contrast(1.2) brightness(1.05)';
        case 'noir': return 'grayscale(1) contrast(1.5) brightness(0.9)';
        case 'cool': return 'saturate(1.1) contrast(1.1) hue-rotate(30deg) brightness(1.1)';
        case 'warm': return 'sepia(0.3) saturate(1.3) contrast(1.1) brightness(1.1)';
        case 'cyber': return 'saturate(1.8) contrast(1.2) hue-rotate(190deg) brightness(1.1)';
        default: return 'none';
    }
};

export const generateGif = async (photos, filterType, width = 640, height = 480) => {
    return new Promise((resolve, reject) => {
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width,
            height,
            workerScript: import.meta.env.BASE_URL + 'gif.worker.js' // Correct path with base URL
        });

        let loadedCount = 0;
        const filterString = getFilterString(filterType);

        // Process images in order
        const images = photos.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });

        const processImages = () => {
            images.forEach(img => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                // Apply filter
                ctx.filter = filterString;

                // Draw image to fill canvas (cover)
                // Simple draw for now, assuming photos match aspect ratio or handled by video capture
                ctx.drawImage(img, 0, 0, width, height);

                gif.addFrame(canvas, { delay: 500 });
            });

            gif.on('finished', (blob) => {
                saveAs(blob, `PhotoboothByNjmi-gif-${Date.now()}.gif`);
                resolve();
            });

            gif.render();
        };

        // Preload all
        images.forEach(img => {
            img.onload = () => {
                loadedCount++;
                if (loadedCount === images.length) {
                    processImages();
                }
            };
            img.onerror = (e) => reject(e);
        });
    });
};
