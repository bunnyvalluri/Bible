'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './useSocket';
import { REALTIME_EVENTS } from '@vachanam/shared';

/**
 * Hook to listen for Real-Time Server Events and automatically update React Query caches
 */
export function useRealtime({ rooms = [], onEvent } = {}) {
  const { isConnected, subscribe, unsubscribe, on } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isConnected) return;

    // Join requested rooms
    rooms.forEach((r) => subscribe(r));

    // Handle AI Explanation completion
    const cleanupExplanation = on(REALTIME_EVENTS.AI_EXPLANATION_COMPLETED, (event) => {
      const { verseKey, language } = event.payload || {};
      if (verseKey) {
        queryClient.invalidateQueries({ queryKey: ['explanation', verseKey, language] });
        queryClient.invalidateQueries({ queryKey: ['explanation', verseKey] });
      }
      if (onEvent) onEvent(REALTIME_EVENTS.AI_EXPLANATION_COMPLETED, event);
    });

    // Handle Illustration completion
    const cleanupIllustration = on(REALTIME_EVENTS.ILLUSTRATION_COMPLETED, (event) => {
      const { verseKey } = event.payload || {};
      if (verseKey) {
        queryClient.invalidateQueries({ queryKey: ['illustration', verseKey] });
        queryClient.invalidateQueries({ queryKey: ['illustrations'] });
      }
      if (onEvent) onEvent(REALTIME_EVENTS.ILLUSTRATION_COMPLETED, event);
    });

    // Handle Daily Verse update
    const cleanupDailyVerse = on(REALTIME_EVENTS.DAILY_VERSE_UPDATED, (event) => {
      queryClient.invalidateQueries({ queryKey: ['daily-verse'] });
      if (onEvent) onEvent(REALTIME_EVENTS.DAILY_VERSE_UPDATED, event);
    });

    // Handle Chapter content update
    const cleanupChapter = on(REALTIME_EVENTS.BIBLE_CHAPTER_UPDATED, (event) => {
      const { bookCode, chapterNumber } = event.payload || {};
      if (bookCode && chapterNumber) {
        queryClient.invalidateQueries({ queryKey: ['chapter', bookCode, chapterNumber] });
      }
      if (onEvent) onEvent(REALTIME_EVENTS.BIBLE_CHAPTER_UPDATED, event);
    });

    return () => {
      rooms.forEach((r) => unsubscribe(r));
      cleanupExplanation();
      cleanupIllustration();
      cleanupDailyVerse();
      cleanupChapter();
    };
  }, [isConnected, rooms, subscribe, unsubscribe, on, queryClient, onEvent]);

  return { isConnected };
}
