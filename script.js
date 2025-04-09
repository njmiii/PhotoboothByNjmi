const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const filterSelect = document.getElementById('filter');
const gallery = document.getElementById('gallery');
const countdown = document.getElementById('countdown');
const combinedCanvas = document.getElementById('combinedCanvas');
const combinedCtx = combinedCanvas.getContext('2d');
const combinedPreview = document.createElement('img');
const colorPalette = document.getElementById('colorPalette');
const timerSelect = document.getElementById('timer');

combinedPreview.id = 'combinedPreview';
document.body.appendChild(combinedPreview);

let photos = [];
let selectedFilter = 'none';
let selectedBorderColor = '#ffffff';
let timerDuration = 0;
let selectedSticker = null;

// pemilihan stiker
document.querySelectorAll('.sticker-option').forEach((sticker) => {
  sticker.addEventListener('click', function () {
    selectedSticker = this.src;
    document.querySelectorAll('.sticker-option').forEach((el) => (el.style.borderColor = 'transparent'));
    this.style.borderColor = '#0052aa';
  });
});
// pemilihan stiker end

// pemilihan warna border
const colors = ['#173F5F', '#20639B', '#3CAEA3', '#F6D55C', '#FFFFFF', '#000000', '#808080'];
colors.forEach((color) => {
  let colorDiv = document.createElement('div');
  colorDiv.style.backgroundColor = color;
  colorDiv.className = 'color-option';
  colorDiv.addEventListener('click', function () {
    selectedBorderColor = color;
  });
  colorPalette.appendChild(colorDiv);
});
// pemilihan warna border end

// akses kamera
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: 'user' } })
  .then((stream) => {
    video.srcObject = stream;
    video.playsInline = true;
    video.addEventListener('loadedmetadata', () => {
      video.play();
      adjustCanvasSize();
    });
  })
  .catch((error) => console.error('Error akses kamera:', error));

function adjustCanvasSize() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
}
// akses kamera end

// pemilihan filter
filterSelect.addEventListener('change', function () {
  selectedFilter = filterSelect.value;

  switch (selectedFilter) {
    case 'vivid':
      video.style.filter = 'contrast(1.4) saturate(1.5)';
      break;
    case 'vintage':
      video.style.filter = 'sepia(0.4) contrast(1.1) brightness(0.9)';
      break;
    case 'noir':
      video.style.filter = 'grayscale(1) contrast(1.2)';
      break;
    default:
      video.style.filter = selectedFilter; // fallback ke 'none' atau filter bawaan
  }
});

timerSelect.addEventListener('change', function () {
  timerDuration = parseInt(timerSelect.value);
});
// pemilihan filter end

// ambil foto
document.getElementById('snap').addEventListener('click', function () {
  let timeLeft = timerDuration;
  countdown.innerText = timeLeft;
  countdown.style.display = 'block';

  let timer = setInterval(function () {
    timeLeft--;
    countdown.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      countdown.style.display = 'none';

      adjustCanvasSize();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Terapkan filter ke context canvas
      let filterStyle;
      switch (selectedFilter) {
        case 'vivid':
          filterStyle = 'contrast(1.4) saturate(1.5)';
          break;
        case 'vintage':
          filterStyle = 'sepia(0.4) contrast(1.1) brightness(0.9)';
          break;
        case 'noir':
          filterStyle = 'grayscale(1) contrast(1.2)';
          break;
        default:
          filterStyle = selectedFilter;
      }

      ctx.save();
      ctx.filter = filterStyle;

      // Mirror efek (flip horizontal)
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      // Gambar video ke canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      let imgData = canvas.toDataURL('image/png');
      photos.push({ imgData });
      updateGallery();
    }
  }, 1000);
});

// ambil foto end

// hapus foto
function updateGallery() {
  gallery.innerHTML = '';
  photos.forEach((photo, index) => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'photo-container';

    const img = document.createElement('img');
    img.src = photo.imgData;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Hapus';
    deleteBtn.addEventListener('click', function () {
      photos.splice(index, 1);
      updateGallery();
    });

    imgContainer.appendChild(img);
    imgContainer.appendChild(deleteBtn);
    gallery.appendChild(imgContainer);
  });
}
// hapus foto end

// menggabungkan foto
document.getElementById('combine').addEventListener('click', async function () {
  if (photos.length === 0) return alert('Foto dulu der!');

  const outerBorderSize = 45;
  const innerSpacing = 20;
  let imgWidth = canvas.width;
  let imgHeight = canvas.height;

  let totalWidth = imgWidth + outerBorderSize * 2;
  let totalHeight = imgHeight * photos.length + innerSpacing * (photos.length - 1) + outerBorderSize * 2;

  combinedCanvas.width = totalWidth;
  combinedCanvas.height = totalHeight;

  combinedCtx.fillStyle = selectedBorderColor;
  combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

  let yOffset = outerBorderSize;

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];

    await new Promise((resolve) => {
      let img = new Image();
      img.src = photo.imgData;
      img.onload = function () {
        combinedCtx.drawImage(img, outerBorderSize, yOffset, imgWidth, imgHeight);

        if (selectedSticker) {
          let sticker = new Image();
          sticker.src = selectedSticker;
          sticker.onload = function () {
            combinedCtx.drawImage(sticker, outerBorderSize, yOffset, imgWidth, imgHeight);

            yOffset += imgHeight + innerSpacing;
            resolve();
          };

          sticker.onerror = function () {
            yOffset += imgHeight + innerSpacing;
            resolve();
          };
        } else {
          yOffset += imgHeight + innerSpacing;
          resolve();
        }
      };
    });
  }

  combinedPreview.src = combinedCanvas.toDataURL('image/png');
  combinedPreview.style.display = 'block';
  combinedPreview.style.maxWidth = '100%';
});
// menggabungkan foto end

//mendownload foto
document.getElementById('download').addEventListener('click', function () {
  if (photos.length === 0) return alert('Foto dulu der!');
  let link = document.createElement('a');
  link.download = 'PhotoboothByNjmi.jpg';
  link.href = combinedCanvas.toDataURL('image/jpg');
  link.click();
});
// mendownload foto end

// mendownload gif
document.getElementById('downloadGif').addEventListener('click', function () {
  if (photos.length === 0) return alert('Foto dulu der!');

  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: 'assets/script/gif.worker.js',
  });

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  photos.forEach((photo) => {
    const img = new Image();
    img.src = photo.imgData;
    gif.addFrame(img, { delay: 500 });
  });

  gif.on('finished', function (blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PhotoboothByNjmi.gif';
    link.click();
  });

  gif.render();
});
// mendownload gif end

video.style.transform = 'scaleX(-1)'; // flip video

document.getElementById('removeSticker').addEventListener('click', function () {
  selectedSticker = null;
  if (photos.length > 0) {
  }
});
// hapus stiker end

const targetRatio = 4 / 3;
let actualRatio = video.videoWidth / videoHeight;

if (actualRatio > targetRatio) {
  canvas.height = video.videoHeight;
  canvas.width = video.videoHeight * targetRatio;
} else {
  canvas.width = video.videoWidth;
  canvas.height = video.videoWidth / targetRatio;
}
