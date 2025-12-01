const socket = new WebSocket('https://thomasina-childly-garnett.ngrok-free.dev/'); 

console.log("Loading...")

// Event listener for connection open
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server!');
    socket.send('Hello from Web client!');
});

// Event listener for receiving messages
socket.addEventListener('message', (event) => {
    console.log('Message from server: ', event.data);
});

// Event listener for WebSocket close
socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);
});

// Event listener for error
socket.addEventListener('error', (error) => {
    console.log('WebSocket error:', error);
});
