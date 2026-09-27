'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { REALTIME_EVENTS } from '@vachanam/shared';
import { Sparkles, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export function LiveJobToast() {
  const { on } = useSocket();
  const [activeNotification, setActiveNotification] = useState(null);

  useEffect(() => {
    // 1. AI Explanation Started
    const cleanAiStart = on(REALTIME_EVENTS.AI_EXPLANATION_STARTED, (event) => {
      setActiveNotification({
        id: event.eventId,
        type: 'ai-explanation',
        status: 'PROCESSING',
        title: 'AI Explanation Started',
        message: 'Synthesizing theological insights in real-time...',
        progress: 25
      });
    });

    // 2. AI Explanation Progress
    const cleanAiProg = on(REALTIME_EVENTS.AI_EXPLANATION_PROGRESS, (event) => {
      setActiveNotification((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          progress: event.payload.progress || 50,
          message: event.payload.stage || prev.message
        };
      });
    });

    // 3. AI Explanation Completed
    const cleanAiDone = on(REALTIME_EVENTS.AI_EXPLANATION_COMPLETED, (event) => {
      setActiveNotification({
        id: event.eventId,
        type: 'ai-explanation',
        status: 'COMPLETED',
        title: 'AI Explanation Ready',
        message: '6-dimensional breakdown generated & verified.',
        progress: 100
      });
      setTimeout(() => setActiveNotification(null), 5000);
    });

    // 4. Illustration Completed
    const cleanIllDone = on(REALTIME_EVENTS.ILLUSTRATION_COMPLETED, (event) => {
      setActiveNotification({
        id: event.eventId,
        type: 'illustration',
        status: 'COMPLETED',
        title: 'Visual Metaphor Generated',
        message: 'Editorial 16:9 illustration is ready.',
        progress: 100
      });
      setTimeout(() => setActiveNotification(null), 5000);
    });

    return () => {
      cleanAiStart();
      cleanAiProg();
      cleanAiDone();
      cleanIllDone();
    };
  }, [on]);

  if (!activeNotification) return null;

  const isCompleted = activeNotification.status === 'COMPLETED';

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xl space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-gold-50 text-gold-600'}`}>
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Loader2 className="w-4 h-4 animate-spin text-[#163A5F]" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#163A5F]">
                {activeNotification.title}
              </h4>
              <p className="text-[11px] text-[#525252]">
                {activeNotification.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveNotification(null)}
            className="text-[#737373] hover:text-[#171717] p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-[#163A5F]'}`}
            style={{ width: `${activeNotification.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
