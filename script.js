// Get references to the video, canvas, and message elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const messageDiv = document.getElementById('message');

// Request access to the webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        // Display the video stream in the video element
        video.srcObject = stream;
        // Automatically take the picture and video after 3 seconds
        setTimeout(captureImageAndVideo, 3000);
    })
    .catch(err => {
        console.error("Error accessing the webcam: ", err);
    });

// Function to capture an image and a 20-second video
function captureImageAndVideo() {
    // Capture the image and display it on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Show the "You look ugly" message after capturing the picture
    messageDiv.textContent = "You look ugly 😅";

    // Start recording a 20-second video
    recordVideo();
}

// Function to record a 20-second video
function recordVideo() {
    const mediaRecorder = new MediaRecorder(video.srcObject);
    const recordedChunks = [];

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);

        // Create a video element to display the recorded video
        const recordedVideo = document.createElement('video');
        recordedVideo.controls = true;
        recordedVideo.src = videoURL;
        recordedVideo.width = 640;
        recordedVideo.height = 480;

        // Append the recorded video to the webpage
        document.body.appendChild(recordedVideo);
    };

    // Start recording and stop after 20 seconds
    mediaRecorder.start();
    setTimeout(() => {
        mediaRecorder.stop();
    }, 20000); // 20 seconds
}
