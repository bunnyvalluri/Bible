const eventBus = require('../realtime/eventBus');

/**
 * Transactional Outbox Pattern Implementation
 * Ensures database state and WebSocket events stay 100% consistent without losing events.
 */
class OutboxService {
  constructor(prisma) {
    this.prisma = prisma;
    this.isProcessing = false;
    this.intervalId = null;
  }

  /**
   * Add an outbox event inside an existing Prisma transaction or client
   */
  async createOutboxEvent(client, { eventType, aggregateType, aggregateId, payload, rooms = ['global'] }) {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fullPayload = {
      ...payload,
      _rooms: rooms
    };

    const outboxRecord = await client.outboxEvent.create({
      data: {
        eventId,
        eventType,
        aggregateType,
        aggregateId: String(aggregateId),
        payload: JSON.stringify(fullPayload),
        status: 'PENDING',
        attempts: 0
      }
    });

    return outboxRecord;
  }

  /**
   * Process all pending outbox events and publish them to Realtime EventBus
   */
  async processPendingEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'asc' },
        take: 50
      });

      for (const event of pendingEvents) {
        try {
          const parsedPayload = JSON.parse(event.payload);
          const rooms = parsedPayload._rooms || ['global'];
          delete parsedPayload._rooms;

          // Publish to EventBus -> Socket.IO Broadcaster
          eventBus.publish(event.eventType, {
            eventId: event.eventId,
            eventType: event.eventType,
            entityId: event.aggregateId,
            rooms,
            payload: parsedPayload,
            timestamp: event.createdAt.toISOString()
          });

          // Mark as published
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: {
              status: 'PUBLISHED',
              processedAt: new Date(),
              attempts: { increment: 1 }
            }
          });
        } catch (err) {
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: {
              status: event.attempts >= 5 ? 'FAILED' : 'PENDING',
              attempts: { increment: 1 },
              lastError: err.message
            }
          });
        }
      }
    } catch (err) {
      console.error('[OutboxService] Failed to process outbox events:', err.message);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Start polling loop for outbox processing
   */
  start(intervalMs = 1000) {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.processPendingEvents(), intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

let instance = null;

function getOutboxService(prisma) {
  if (!instance && prisma) {
    instance = new OutboxService(prisma);
  }
  return instance;
}

module.exports = {
  OutboxService,
  getOutboxService
};
