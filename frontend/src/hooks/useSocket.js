'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '@/lib/socket';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setSocketId(null);
    };

    if (socket.connected) {
      setIsConnected(true);
      setSocketId(socket.id);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const subscribe = useCallback((room) => {
    const socket = getSocket();
    if (socket && room) {
      socket.emit('subscribe', room);
    }
  }, []);

  const unsubscribe = useCallback((room) => {
    const socket = getSocket();
    if (socket && room) {
      socket.emit('unsubscribe', room);
    }
  }, []);

  const on = useCallback((eventName, callback) => {
    const socket = getSocket();
    if (socket && eventName && callback) {
      socket.on(eventName, callback);
      return () => socket.off(eventName, callback);
    }
    return () => {};
  }, []);

  return {
    socket: getSocket(),
    isConnected,
    socketId,
    subscribe,
    unsubscribe,
    on
  };
}
