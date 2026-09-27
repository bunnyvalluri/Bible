const { Server } = require('socket.io');
const roomManager = require('./roomManager');
const broadcaster = require('./broadcaster');
const eventBus = require('./eventBus');
const { REALTIME_EVENTS } = require('@vachanam/shared');

/**
 * Initializes and configures the Socket.IO Realtime Gateway
 */
function initializeSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    pingInterval: 25000,
    pingTimeout: 20000,
    transports: ['websocket', 'polling'],
    maxHttpBufferSize: 1e6 // 1MB
  });

  broadcaster.initialize(io);

  io.on('connection', (socket) => {
    // Automatically join global room and language room if specified
    socket.join('global');

    const clientIp = socket.handshake.address;
    const userLang = socket.handshake.query?.lang || 'te';
    if (['en', 'te', 'hi'].includes(userLang)) {
      socket.join(`language:${userLang}`);
    }

    // Handle room subscription
    socket.on('subscribe', (room) => {
      if (Array.isArray(room)) {
        room.forEach(r => roomManager.joinRoom(socket, r));
      } else {
        roomManager.joinRoom(socket, room);
      }
    });

    // Handle room unsubscription
    socket.on('unsubscribe', (room) => {
      if (Array.isArray(room)) {
        room.forEach(r => roomManager.leaveRoom(socket, r));
      } else {
        roomManager.leaveRoom(socket, room);
      }
    });

    // Heartbeat / ping event
    socket.on('ping_health', (callback) => {
      if (typeof callback === 'function') {
        callback({
          status: 'HEALTHY',
          timestamp: new Date().toISOString(),
          socketId: socket.id
        });
      }
    });

    socket.on('disconnect', (reason) => {
      // Clean up rooms automatically handled by socket.io
    });
  });

  return io;
}

module.exports = {
  initializeSocketServer
};
