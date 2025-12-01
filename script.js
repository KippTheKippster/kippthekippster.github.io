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
    gyro.orientation.alpha = data.alpha
    gyro.orientation.beta = data.beta
    gyro.orientation.gamma = data.gamma

    let orientation = gyro.getCorrectedOrientation()

    document.getElementById("x").innerHTML = orientation.alpha.toFixed(3)
    document.getElementById("y").innerHTML = orientation.beta.toFixed(3)
    document.getElementById("z").innerHTML = orientation.gamma.toFixed(3)
    let message = orientation.alpha + ";" + orientation.beta + ";" + orientation.gamma
    socket.send(message)
}

// --Gyroscope--
var gyro = {}

gyro.orientation = {
    alpha: 0.0,
    beta: 0.0,
    gamma: 0.0
}

gyro.offset = {
    alpha: 0.0,
    beta: 0.0,
    gamma: 0.0
}

gyro.resetOrientation = function() {
    log("Reseting")
    gyro.offset = {
        alpha: -gyro.orientation.alpha,
        beta: -gyro.orientation.beta,
        gamma: -gyro.orientation.gamma
    }
}

gyro.getCorrectedOrientation = function() {
    return {
        alpha: gyro.orientation.alpha + gyro.offset.alpha,
        beta: gyro.orientation.beta + gyro.offset.beta,
        gamma: gyro.orientation.gamma + gyro.offset.gamma
    }
}

//https://trekhleb.dev/blog/2021/gyro-web/
gyro.addOrientationListener = function(listener) {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // Handle iOS 13+ devices.
        DeviceMotionEvent.requestPermission()
            .then((state) => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', listener);
                } else {
                    console.error('Request to access the orientation was rejected');
                }
            })
            .catch(console.error);
    } else {
        // Handle regular non iOS 13+ devices.
        window.addEventListener('deviceorientation', listener);
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

    const resetGyro = document.getElementById("reset-gyro")
    resetGyro.addEventListener("click", function() {
        gyro.resetOrientation()
    })

    gyro.addOrientationListener(onOrientation)
    onOrientation({alpha: 20.032131231, beta:13.03125435634643, gamma:-20.0543654654})
})