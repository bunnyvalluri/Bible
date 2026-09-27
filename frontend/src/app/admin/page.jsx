'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { useRealtime } from '@/hooks/useRealtime';
import {
  Shield,
  Database,
  Sparkles,
  Palette,
  Headphones,
  Trash2,
  Activity,
  CheckCircle2,
  RefreshCw,
  Key,
  Radio,
  Clock,
  Layers,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, Badge } from '@/components/ui/card';

export default function AdminPage() {
  const { t } = useI18n();
  const { isConnected, on } = useSocket();
  const [adminKey, setAdminKey] = useState('vachanam_admin_secret_key_2026');
  const [health, setHealth] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useRealtime({ rooms: ['admin', 'global'] });

  useEffect(() => {
    loadHealth();
    loadRealtimeData();

    // Listen for live job progress updates
    const cleanJobProgress = on('ai-explanation.progress', () => loadRealtimeData());
    const cleanJobComplete = on('ai-explanation.completed', () => loadRealtimeData());

    return () => {
      cleanJobProgress();
      cleanJobComplete();
    };
  }, [on]);

  const loadHealth = async () => {
    try {
      const data = await api.getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.warn('Health check failed:', err);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const res = await axios.get('/api/jobs/health');
      setRealtimeData(res.data);
    } catch (err) {
      console.warn('Realtime metrics fetch failed:', err);
    }
  };

  const handleTriggerRealtimeJob = async (type, verseKey = 'JHN.3.16') => {
    setLoading(true);
    setStatusMessage('');
    try {
      const res = await axios.post(`/api/jobs/${type}`, {
        verseKey,
        language: 'en'
      });
      setStatusMessage(`⚡ Real-Time Job Dispatched! (ID: ${res.data.jobId})`);
      setTimeout(loadRealtimeData, 500);
    } catch (err) {
      setStatusMessage(`❌ Job dispatch failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFlushCache = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      await api.flushCache(adminKey);
      setStatusMessage('✅ In-memory cache cleared successfully.');
      setTimeout(loadHealth, 1000);
    } catch (err) {
      setStatusMessage(`❌ Flush failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen pb-32 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-[#163A5F]">
            <Shield className="w-3.5 h-3.5" />
            <span>Mission Control & Real-Time Orchestration</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#163A5F] mt-2">
            {t('admin')}
          </h1>
          <p className="text-xs text-[#737373]">
            Real-Time Socket.IO, BullMQ Workers, Outbox Event Bus & Dataset Metrics
          </p>
        </div>

        {/* Real-time Status Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs font-semibold">
            <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-emerald-500 animate-pulse' : 'text-amber-500'}`} />
            <span>{isConnected ? 'Gateway Connected' : 'Connecting...'}</span>
            <span className="text-[10px] text-[#737373] ml-1">
              ({realtimeData?.realtime?.activeConnections ?? 1} active)
            </span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-sm text-[#171717] font-medium shadow-sm animate-in fade-in">
          {statusMessage}
        </div>
      )}

      {/* 1. Real-Time Jobs & Queue Overview */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#737373] flex items-center justify-between">
          <span>Live Background Jobs & Worker Status</span>
          <button
            onClick={loadRealtimeData}
            className="text-xs font-sans text-gold-700 hover:text-gold-900 flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Refresh
          </button>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Queued Jobs</span>
            <h4 className="text-2xl font-bold font-serif text-[#163A5F]">
              {realtimeData?.jobs?.queued ?? 0}
            </h4>
          </Card>

          <Card className="p-4 bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Running Jobs</span>
            <h4 className="text-2xl font-bold font-serif text-blue-600">
              {realtimeData?.jobs?.running ?? 0}
            </h4>
          </Card>

          <Card className="p-4 bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Completed Jobs</span>
            <h4 className="text-2xl font-bold font-serif text-emerald-600">
              {realtimeData?.jobs?.completed ?? 0}
            </h4>
          </Card>

          <Card className="p-4 bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Failed Jobs</span>
            <h4 className="text-2xl font-bold font-serif text-rose-600">
              {realtimeData?.jobs?.failed ?? 0}
            </h4>
          </Card>
        </div>

        {/* Live Recent Jobs Table */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between">
            <span className="text-xs font-bold text-[#163A5F] uppercase tracking-wider">Recent Dispatched Jobs</span>
            <span className="text-[11px] text-[#737373]">Live auto-updating</span>
          </div>

          <div className="divide-y divide-[#E5E7EB] text-xs">
            {realtimeData?.jobs?.recent?.length > 0 ? (
              realtimeData.jobs.recent.map((job) => (
                <div key={job.jobId} className="p-3.5 sm:px-5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {job.type}
                      </Badge>
                      <span className="font-mono text-[11px] text-[#525252] truncate">{job.jobId}</span>
                    </div>
                    <p className="text-[11px] text-[#737373] truncate">{job.stage || 'Processing in worker'}</p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden hidden sm:block">
                      <div
                        className={`h-full ${job.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-[#163A5F]'}`}
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <Badge
                      className={`text-[10px] font-bold ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : job.status === 'RUNNING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-[#525252]'
                      }`}
                    >
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[#737373]">No background jobs recorded yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Real-Time Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Real-time AI Explanation Dispatcher */}
        <Card className="p-6 space-y-4 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#171717]">Async AI Explanation Loop</h4>
              <p className="text-xs text-[#737373]">Dispatch async job with multi-stage WebSocket progress</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="default"
              size="sm"
              className="bg-[#163A5F] hover:bg-[#0f2842] text-white"
              onClick={() => handleTriggerRealtimeJob('explanation', 'JHN.3.16')}
              disabled={loading}
            >
              Explain John 3:16
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50"
              onClick={() => handleTriggerRealtimeJob('explanation', 'PSA.23.1')}
              disabled={loading}
            >
              Explain Psalm 23:1
            </Button>
          </div>
        </Card>

        {/* Real-time Illustration Dispatcher */}
        <Card className="p-6 space-y-4 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#171717]">Visual Metaphor Pipeline</h4>
              <p className="text-xs text-[#737373]">Generate 16:9 hand-drawn editorial illustration via background queue</p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50 font-semibold"
              onClick={() => handleTriggerRealtimeJob('illustration', 'PRO.3.5')}
              disabled={loading}
            >
              Synthesize Proverbs 3:5 Metaphor
            </Button>
          </div>
        </Card>

        {/* Cache Invalidation */}
        <Card className="p-6 space-y-4 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#171717]">Cache & Event Bus Invalidation</h4>
              <p className="text-xs text-[#737373]">Flush in-memory and React Query caches</p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFlushCache}
              disabled={loading}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Clear All Cache Keys
            </Button>
          </div>
        </Card>

        {/* Audio Synthesizer */}
        <Card className="p-6 space-y-4 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#171717]">Real-Time Audio Worker</h4>
              <p className="text-xs text-[#737373]">Queue neural chapter narration job</p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50 font-semibold"
              onClick={() => handleTriggerRealtimeJob('audio', 'GEN.1.1')}
              disabled={loading}
            >
              Synthesize Genesis 1 Audio
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
