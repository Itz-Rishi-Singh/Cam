// Access the webcam
const video = document.getElementById('video');
const photo = document.getElementById('photo');
const recordedVideo = document.getElementById('recorded-video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture-photo');
const recordButton = document.getElementById('record-video');

let mediaRecorder;
let recordedChunks = [];

// Get access to the webcam stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;

        // Set up MediaRecorder for video
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function(e) {
            recordedChunks.push(e.data);
        };
        
        mediaRecorder.onstop = function() {
            const blob = new Blob(recordedChunks, { type: 'video/mp4' });
            recordedVideo.src = URL.createObjectURL(blob);
            recordedChunks = [];  // Clear the recorded chunks
        };
    })
    .catch(err => {
        console.error('Error accessing media devices.', err);
    });

// Capture photo when button is clicked
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Display the captured image
    const dataURL = canvas.toDataURL('image/png');
    photo.src = dataURL;
});

// Record 20s video when button is clicked
recordButton.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
        mediaRecorder.start();
        recordButton.disabled = true;  // Disable button to avoid multiple clicks

        // Stop recording after 20 seconds
        setTimeout(() => {
            mediaRecorder.stop();
            recordButton.disabled = false;
        }, 20000);
    }
});
