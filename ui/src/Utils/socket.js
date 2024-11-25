import io from 'socket.io-client';

const socket = io(`https://heavens-05p5.onrender.com`, {
    transports: ['websocket'],  // Force WebSocket transport
  });  // Ensure this matches your backend URL

socket.on('connect', () => {
//   console.log('Socket connected:', socket.id);
});

socket.on('orderUpdated', (data) => {
//   console.log('Order Update:', data);
});

export { socket };