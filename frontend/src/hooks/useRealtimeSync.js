'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getHighlights, getBookmarks, getNotes } from '@/lib/storage';

/**
 * Multi-Tab & Offline-First Realtime Sync Hook
 */
export function useRealtimeSync() {
  const [syncStatus, setSyncStatus] = useState('SYNCED'); // 'SYNCING' | 'SYNCED' | 'OFFLINE'
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let bc = null;
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel('vachanam_multitab_sync');
      setChannel(bc);

      bc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        // Trigger storage update across tabs
        window.dispatchEvent(new CustomEvent('vachanam_tab_sync', { detail: { type, payload } }));
      };
    }

    const handleOnline = () => {
      setSyncStatus('SYNCING');
      triggerCloudSync().finally(() => setSyncStatus('SYNCED'));
    };

    const handleOffline = () => {
      setSyncStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const broadcastLocalChange = useCallback((type, payload) => {
    if (channel) {
      channel.postMessage({ type, payload });
    }
  }, [channel]);

  const triggerCloudSync = async () => {
    try {
      const [highlights, bookmarks, notes] = await Promise.all([
        getHighlights(),
        getBookmarks(),
        getNotes()
      ]);

      const operations = [
        ...highlights.map(h => ({
          operationId: `hl_${h.verseKey}_${Date.now()}`,
          entityType: 'highlight',
          entityId: h.verseKey,
          operation: 'CREATE',
          payload: h
        })),
        ...bookmarks.map(b => ({
          operationId: `bm_${b.id}_${Date.now()}`,
          entityType: 'bookmark',
          entityId: b.id,
          operation: 'CREATE',
          payload: b
        })),
        ...notes.map(n => ({
          operationId: `nt_${n.id}_${Date.now()}`,
          entityType: 'note',
          entityId: n.id,
          operation: 'CREATE',
          payload: n
        }))
      ];

      if (operations.length > 0) {
        await axios.post('/api/jobs/sync', { operations, clientId: 'browser-client' });
      }
    } catch (err) {
      console.warn('Sync attempt failed:', err.message);
    }
  };

  return {
    syncStatus,
    broadcastLocalChange,
    triggerCloudSync
  };
}
