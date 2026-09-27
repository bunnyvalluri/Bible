const eventBus = require('./eventBus');

/**
 * Socket.IO Broadcaster
 * Listens to EventBus events and emits them across appropriate Socket.IO rooms.
 */
class Broadcaster {
  constructor() {
    this.io = null;
  }

  initialize(io) {
    this.io = io;

    // Bridge all EventBus events to Socket.IO
    eventBus.on('realtime_event', (event) => {
      this.broadcast(event);
    });
  }

  /**
   * Broadcast an event to specified rooms or global
   */
  broadcast(event) {
    if (!this.io) return;

    const rooms = Array.isArray(event.rooms) && event.rooms.length > 0
      ? event.rooms
      : ['global'];

    rooms.forEach((room) => {
      this.io.to(room).emit(event.eventType, {
        eventId: event.eventId,
        eventType: event.eventType,
        entityId: event.entityId,
        version: event.version || 1,
        timestamp: event.timestamp || new Date().toISOString(),
        payload: event.payload
      });
    });
  }

  /**
   * Direct emit to a specific socket
   */
  emitToSocket(socketId, eventType, data) {
    if (!this.io) return;
    this.io.to(socketId).emit(eventType, data);
  }

  /**
   * Get connected clients count
   */
  getConnectionCount() {
    if (!this.io) return 0;
    return this.io.engine.clientsCount;
  }
}

const broadcaster = new Broadcaster();
module.exports = broadcaster;
