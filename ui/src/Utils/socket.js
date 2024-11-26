import io from 'socket.io-client';
const API_BASE_URL_SOCKET= import.meta.env.VITE_API_BASE_URL_SOCKET
const socket = io(`${API_BASE_URL_SOCKET}`, {
    transports: ['websocket'],  // Force WebSocket transport
  });  // Ensure this matches your backend URL

socket.on('connect', () => {
//   console.log('Socket connected:', socket.id);
});

socket.on('orderUpdated', (data) => {
//   console.log('Order Update:', data);
});

export { socket };