'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { WifiOff, RefreshCw } from 'lucide-react';

export function ConnectionIndicator() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useSocket();
  const { syncStatus } = useRealtimeSync();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-50 border border-[#E5E7EB] text-[#737373] opacity-60"
        suppressHydrationWarning
      >
        <span className="w-2 h-2 rounded-full bg-slate-300" />
        <span className="hidden md:inline text-[11px] font-medium">Connecting...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div
        className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shadow-sm"
        title="Reconnecting to Real-Time Server..."
        suppressHydrationWarning
      >
        <WifiOff className="w-3.5 h-3.5 animate-pulse" />
        <span className="hidden md:inline text-[11px] font-semibold">Offline (Local)</span>
      </div>
    );
  }

  if (syncStatus === 'SYNCING') {
    return (
      <div
        className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 shadow-sm"
        title="Syncing local changes to cloud..."
        suppressHydrationWarning
      >
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
        <span className="hidden md:inline text-[11px] font-semibold">Syncing</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm"
      title="Connected to Vachanam Real-Time Engine"
      suppressHydrationWarning
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="hidden md:inline text-[11px] font-semibold">Live Real-Time</span>
    </div>
  );
}
