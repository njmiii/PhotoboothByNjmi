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
            saveAs(blob, `photobooth-strip-${Date.now()}.png`);
        });
    } catch (error) {
        console.error("Download failed:", error);
    }
};

const getFilterString = (filterType) => {
    switch (filterType) {
        case 'sepia': return 'sepia(0.8) contrast(1.2)';
        case 'grayscale': return 'grayscale(1) contrast(1.1)';
        case 'vintage': return 'sepia(0.4) contrast(1.2) brightness(0.9) saturate(1.2)';
        case 'invert': return 'invert(0.1) contrast(1.2)';
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
            workerScript: '/gif.worker.js' // Important: path to worker in public/
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
                saveAs(blob, `photobooth-anim-${Date.now()}.gif`);
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
