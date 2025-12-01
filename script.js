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
    const acc = data.acceleration

    gyro.orientation.x += acc.x
    gyro.orientation.y += acc.y
    gyro.orientation.z += acc.z

    document.getElementById("x").innerHTML = gyro.orientation.x.toFixed(3)
    document.getElementById("y").innerHTML = gyro.orientation.y.toFixed(3)
    document.getElementById("z").innerHTML = gyro.orientation.z.toFixed(3)
    let message = gyro.orientation.x + ";" + gyro.orientation.y + ";" + gyro.orientation.z
    socket.send(message)
}

// --Gyroscope--
var gyro = {}

gyro.orientation = {
    x: 0.0,
    y: 0.0,
    z: 0.0
}

gyro.resetOrientation = function() {
    log("Reseting")
    gyro.orientation = {
        x: 0.0,
        y: 0.0,
        z: 0.0
    }
}

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

    const resetGyro = document.getElementById("reset-gyro")
    resetGyro.addEventListener("click", function() {
        gyro.resetOrientation()
    })

    gyro.addOrientationListener(onOrientation)
    //onOrientation({acceleration: {x: 20.032131231, y:13.03125435634643, z:-20.0543654654}})
})