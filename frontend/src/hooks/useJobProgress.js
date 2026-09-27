'use client';

import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

/**
 * Hook to track live background job progress via WebSockets
 */
export function useJobProgress(jobId) {
  const { isConnected, subscribe, unsubscribe, on } = useSocket();
  const [jobState, setJobState] = useState({
    jobId,
    status: 'IDLE',
    progress: 0,
    stage: '',
    message: '',
    result: null,
    error: null
  });

  useEffect(() => {
    if (!jobId) return;

    const room = `job:${jobId}`;
    subscribe(room);

    // Listen for progress events
    const cleanProgress = on(`${jobState.type || 'ai-explanation'}.progress`, (event) => {
      if (event.payload?.jobId === jobId) {
        setJobState((prev) => ({
          ...prev,
          status: event.payload.status,
          progress: event.payload.progress,
          stage: event.payload.stage,
          message: event.payload.message
        }));
      }
    });

    const cleanCompleted = on(`${jobState.type || 'ai-explanation'}.completed`, (event) => {
      if (event.payload?.jobId === jobId) {
        setJobState((prev) => ({
          ...prev,
          status: 'COMPLETED',
          progress: 100,
          stage: 'Completed',
          result: event.payload.result
        }));
      }
    });

    const cleanFailed = on(`${jobState.type || 'ai-explanation'}.failed`, (event) => {
      if (event.payload?.jobId === jobId) {
        setJobState((prev) => ({
          ...prev,
          status: 'FAILED',
          error: event.payload.error
        }));
      }
    });

    return () => {
      unsubscribe(room);
      cleanProgress();
      cleanCompleted();
      cleanFailed();
    };
  }, [jobId, isConnected, subscribe, unsubscribe, on, jobState.type]);

  return jobState;
}
