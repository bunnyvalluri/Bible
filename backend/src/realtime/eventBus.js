const { EventEmitter } = require('events');

/**
 * Central EventBus for Vachanam Application
 * Decouples services, queue workers, and background jobs from Socket.IO transport.
 */
class RealtimeEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  /**
   * Publish an application event to the bus
   */
  publish(eventType, eventData) {
    const formattedEvent = {
      eventId: eventData.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      eventType,
      entityId: eventData.entityId || eventData.aggregateId || null,
      version: eventData.version || 1,
      timestamp: eventData.timestamp || new Date().toISOString(),
      rooms: eventData.rooms || ['global'],
      payload: eventData.payload || eventData
    };

    this.emit('realtime_event', formattedEvent);
    this.emit(eventType, formattedEvent);
    return formattedEvent;
  }
}

const eventBus = new RealtimeEventBus();
module.exports = eventBus;
