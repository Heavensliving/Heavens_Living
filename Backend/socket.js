const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
  });

  // Handle socket events
  io.on('connection', (socket) => {
    // console.log('A user connected');

    socket.on('disconnect', () => {
    //   console.log('A user disconnected');
    });

    // Custom event handler
    socket.on('send-message', (data) => {
    //   console.log('Message received:', data);
      io.emit('receive-message', { message: 'Message received!' });
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized yet!');
  }
  return io;
};

module.exports = { initializeSocket, getIo };
