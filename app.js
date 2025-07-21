const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapshot = document.getElementById('snapshot');
const captureButton = document.getElementById('capture');
const editableImage = document.getElementById('editableImage');
const scanButton = document.getElementById('scanImage');

let cropper;

// Activamos la cámara
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error al acceder a la cámara:", err);
  });

// Captura y activa Cropper
captureButton.addEventListener('click', () => {
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const imgData = canvas.toDataURL('image/png');
  editableImage.src = imgData;

  if (cropper) cropper.destroy();

  cropper = new Cropper(editableImage, {
    aspectRatio: NaN,
    viewMode: 1,
    autoCropArea: 1,
    background: false
  });
});

// Recorte y escaneo
scanButton.addEventListener('click', () => {
  const croppedCanvas = cropper.getCroppedCanvas();
  canvas.width = croppedCanvas.width;
  canvas.height = croppedCanvas.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(croppedCanvas, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Blanco y negro con contraste
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const contrast = avg > 128 ? 255 : 0;
    data[i]     = contrast;
    data[i + 1] = contrast;
    data[i + 2] = contrast;
  }

  ctx.putImageData(imageData, 0, 0);
  snapshot.src = canvas.toDataURL('image/png');
});
const guardarRecorteButton = document.getElementById('guardarRecorte');

guardarRecorteButton.addEventListener('click', () => {
  const croppedCanvas = cropper.getCroppedCanvas();

  // Reemplazamos el canvas global con el recorte
  canvas.width = croppedCanvas.width;
  canvas.height = croppedCanvas.height;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(croppedCanvas, 0, 0);

  // Opcional: actualizamos vista previa también
  snapshot.src = canvas.toDataURL('image/png');
});
navigator.mediaDevices.getUserMedia({
  video: { facingMode: { ideal: "environment" } }, // Solicita cámara trasera
  audio: false
})
.then(stream => {
  video.srcObject = stream;
})
.catch(err => {
  console.error("Error al acceder a la cámara:", err);
});
