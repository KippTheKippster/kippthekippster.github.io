const startUrl = 'wss://karlkostoulas.se:6969'

let socket

let textArea = null
let urlInput = null
let fullscreenButton = null

let shootIndex = 0; // Shoot index will increment when clicked (up to 9 and reset) this is to not have to send a message every time the button is pressed

function startSocket(url) {
    let newSocket = new WebSocket(url); 
    console.log("Loading...")

    // Event listener for connection open
    newSocket.addEventListener('open', (event) => {
        log('Connected to WebSocket server!');
        newSocket.send("add")
        textArea.style.visibility = "hidden"
    });

    // Event listener for WebSocket close
    newSocket.addEventListener('close', (event) => {
        log('WebSocket connection closed:', event);
    });

    // Event listener for error
    newSocket.addEventListener('error', (error) => {
        log('WebSocket error:', error);
    });

    return newSocket
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
    let sendDelay = 50

    let sendDelayInput = document.getElementById("send-delay")

    sendDelay = sendDelayInput.value

    fullscreenButton = document.getElementById("fullscreen")
    fullscreenButton.addEventListener("click", function()  {
        if (document.fullscreenElement) {
            document.exitFullscreen()
            window.screen.orientation.unlock()
        }
        else {
            document.documentElement.requestFullscreen();
            window.screen.orientation.lock("portrait")
        }
    })

    urlInput = document.getElementById("url-input")
    if (urlInput.value == "") {
        urlInput.value = startUrl
    }

    textArea = document.getElementById("debug-text-area")
    textArea.value = ""

    const resetGyroButton = document.getElementById("reset-gyro")
    resetGyroButton.addEventListener("click", function() {
        gyro.resetOrientation()
    })

    const shootButton = document.getElementById("shoot")
    shootButton.addEventListener("mousedown", function() {
        shooting = shootIndex
        shootIndex += 1
        shootIndex %= 10
    })

    socket = startSocket(urlInput.value);
    gyro.addOrientationListener(onOrientation)

    let sendInterval = setInterval(sendTimeout, sendDelay)

    sendDelayInput.addEventListener("change", function() {
        clearInterval(sendInterval)
        sendDelay = sendDelayInput.value
        sendInterval = setInterval(sendTimeout, sendDelay)
    })

    function onOrientation(data) {
        gyro.orientation.alpha = data.alpha
        gyro.orientation.beta = data.beta
        gyro.orientation.gamma = data.gamma

        let orientation = gyro.getCorrectedOrientation()

        document.getElementById("x").innerHTML = orientation.alpha.toFixed(3)
        document.getElementById("y").innerHTML = orientation.beta.toFixed(3)
        document.getElementById("z").innerHTML = orientation.gamma.toFixed(3)
    }
    
    function sendTimeout() {
        let orientation = gyro.getCorrectedOrientation()
        //socket.send([orientation.alpha, orientation.beta, orientation.gamma])
        let message = orientation.alpha.toFixed(3) + ";" + orientation.beta.toFixed(3) + ";" + orientation.gamma.toFixed(3) + ";" + shootIndex;
        socket.send(message)
    }
})