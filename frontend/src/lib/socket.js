import { io } from 'socket.io-client';

let socketInstance = null;

/**
 * Get or initialize the Socket.IO client singleton
 */
export function getSocket() {
  if (typeof window === 'undefined') return null;

  if (!socketInstance) {
    // In Next.js client, connect to backend port 5000 directly or through current origin
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true
    });

    socketInstance.on('connect', () => {
      // Re-join global room on connect/reconnect
      socketInstance.emit('subscribe', 'global');
    });
  }

  return socketInstance;
}
