const { ROOM_PREFIXES } = require('@vachanam/shared');

/**
 * Validates and manages Socket.IO room subscriptions
 */
class RoomManager {
  constructor() {
    this.validRoomPatterns = [
      /^global$/,
      /^language:(en|te|hi)$/,
      /^book:[A-Z0-9]{2,5}$/,
      /^chapter:[A-Z0-9]{2,5}\.\d+$/,
      /^verse:[A-Z0-9]{2,5}\.\d+\.\d+$/,
      /^job:[a-zA-Z0-9_-]+$/,
      /^reading-plan:[a-zA-Z0-9_-]+$/,
      /^admin$/,
      /^system$/
    ];
  }

  /**
   * Check if a room string is allowed
   */
  isValidRoom(room) {
    if (!room || typeof room !== 'string' || room.length > 64) {
      return false;
    }
    return this.validRoomPatterns.some(pattern => pattern.test(room));
  }

  /**
   * Subscribe socket to a room with validation
   */
  joinRoom(socket, room) {
    if (!this.isValidRoom(room)) {
      socket.emit('error', { message: `Invalid room subscription request: ${room}` });
      return false;
    }
    socket.join(room);
    return true;
  }

  /**
   * Unsubscribe socket from a room
   */
  leaveRoom(socket, room) {
    socket.leave(room);
    return true;
  }

  /**
   * Generate canonical room identifiers
   */
  static getChapterRoom(bookCode, chapterNumber) {
    return `chapter:${bookCode.toUpperCase()}.${chapterNumber}`;
  }

  static getVerseRoom(verseKey) {
    return `verse:${verseKey.toUpperCase()}`;
  }

  static getJobRoom(jobId) {
    return `job:${jobId}`;
  }
}

const roomManager = new RoomManager();
module.exports = roomManager;
