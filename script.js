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

filterSelect.addEventListener('change', function () {
  selectedFilter = filterSelect.value;
});

timerSelect.addEventListener('change', function () {
  timerDuration = parseInt(timerSelect.value);
});

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
      ctx.save();
      ctx.filter = selectedFilter;
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      
      let imgData = canvas.toDataURL('image/png');
      photos.push({ imgData, filter: selectedFilter });
      updateGallery();
    }
  }, 1000);
});

function updateGallery() {
  gallery.innerHTML = '';
  photos.forEach((photo, index) => {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'photo-container';

    const img = document.createElement('img');
    img.src = photo.imgData;
    img.style.filter = photo.filter;

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

document.getElementById('combine').addEventListener('click', function () {
  if (photos.length === 0) return alert('Tidak ada foto untuk digabungkan!');

  const borderSize = 10;
  let imgWidth = canvas.width;
  let imgHeight = canvas.height;
  let totalHeight = (imgHeight + borderSize) * photos.length - borderSize;

  combinedCanvas.width = imgWidth + borderSize * 2;
  combinedCanvas.height = totalHeight;

  combinedCtx.fillStyle = selectedBorderColor;
  combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

  let yOffset = borderSize;
  photos.forEach((photo, index) => {
    let img = new Image();
    img.src = photo.imgData;
    img.onload = function () {
      combinedCtx.save();
      combinedCtx.filter = photo.filter;
      combinedCtx.drawImage(img, borderSize, yOffset, imgWidth, imgHeight);
      combinedCtx.restore();
      yOffset += imgHeight + borderSize;

      if (index === photos.length - 1) {
        combinedPreview.src = combinedCanvas.toDataURL('image/png');
        combinedPreview.style.display = 'block';
        combinedPreview.style.maxWidth = '100%';
      }
    };
  });
});

document.getElementById('download').addEventListener('click', function () {
  let link = document.createElement('a');
  link.download = 'PhotoboothByNjmi.jpg';
  link.href = combinedCanvas.toDataURL('image/jpg');
  link.click();
});

video.style.transform = 'scaleX(-1)';
