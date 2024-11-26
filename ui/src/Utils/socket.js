import io from 'socket.io-client';
import { API_BASE_URL_SOCKET } from '../config';

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