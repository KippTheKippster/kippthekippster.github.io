const socket = new WebSocket('https://thomasina-childly-garnett.ngrok-free.dev/'); 

let textArea = null

console.log("Loading...")

// Event listener for connection open
socket.addEventListener('open', (event) => {
    log('Connected to WebSocket server!');
});

// Event listener for WebSocket close
socket.addEventListener('close', (event) => {
    log('WebSocket connection closed:', event);
});

// Event listener for error
socket.addEventListener('error', (error) => {
    log('WebSocket error:', error);
});

// Gyro

function onOrientation(data) {
    log(data)
}

// --Gyroscope--
var gyro = {}

//https://trekhleb.dev/blog/2021/gyro-web/
gyro.addOrientationListener = function(listener) {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // Handle iOS 13+ devices.
        DeviceMotionEvent.requestPermission()
            .then((state) => {
                if (state === 'granted') {
                    window.addEventListener('devicemotion', listener);
                } else {
                    console.error('Request to access the orientation was rejected');
                }
            })
            .catch(console.error);
    } else {
        // Handle regular non iOS 13+ devices.
        window.addEventListener('devicemotion', listener);
    }
}


function log(...data) {
    if (textArea != null) {
        data.forEach(element => {
            textArea.value += element + "\n"
        }); 

        textArea.scrollTop = textArea.scrollHeight;
    }

    console.log(data)
}

document.addEventListener("DOMContentLoaded", () => {
    textArea = document.getElementById("debug-text-area")
    textArea.value = ""

    gyro.addOrientationListener(onOrientation)
})