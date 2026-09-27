'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { api } from '@/lib/api';
import {
  Shield,
  Database,
  Sparkles,
  Palette,
  Headphones,
  Trash2,
  Upload,
  Activity,
  CheckCircle2,
  RefreshCw,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui/card';

export default function AdminPage() {
  const { t } = useI18n();
  const [adminKey, setAdminKey] = useState('vachanam_admin_secret_key_2026');
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [jsonInput, setJsonInput] = useState('');

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    try {
      const data = await api.getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.warn('Health check failed:', err);
    }
  };

  const handleTriggerBatch = async (type, limit) => {
    setLoading(true);
    setStatusMessage('');
    try {
      const res = await api.triggerBatch(type, limit, adminKey);
      setStatusMessage(`✅ ${res.message || 'Batch successfully initiated!'}`);
      setTimeout(loadHealth, 2000);
    } catch (err) {
      setStatusMessage(`❌ Action failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFlushCache = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const res = await api.flushCache(adminKey);
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
            <span>Server Operations & Data Maintenance</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#163A5F] mt-2">
            {t('admin')}
          </h1>
          <p className="text-xs text-[#737373]">
            Protected maintenance endpoints (Configured via ADMIN_API_KEY)
          </p>
        </div>

        {/* Admin Secret Key Input */}
        <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <Key className="w-4 h-4 text-gold-600 ml-2" />
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Admin Secret Key"
            className="bg-transparent text-xs p-1 focus:outline-none w-48 text-[#171717]"
          />
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-sm text-[#171717] font-medium shadow-sm animate-in fade-in">
          {statusMessage}
        </div>
      )}

      {/* 1. Database & System Health Metrics */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
          System Health & Dataset Counts
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Card className="p-4 text-center bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Books</span>
            <h4 className="text-2xl font-bold font-serif text-[#163A5F]">
              {health?.counts?.books ?? 66}
            </h4>
          </Card>

          <Card className="p-4 text-center bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Chapters</span>
            <h4 className="text-2xl font-bold font-serif text-[#163A5F]">
              {health?.counts?.chapters ?? 1189}
            </h4>
          </Card>

          <Card className="p-4 text-center bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Verses</span>
            <h4 className="text-2xl font-bold font-serif text-[#163A5F]">
              {health?.counts?.verses ?? 31102}
            </h4>
          </Card>

          <Card className="p-4 text-center bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">AI Explanations</span>
            <h4 className="text-2xl font-bold font-serif text-[#163A5F]">
              {health?.counts?.explanations ?? 0}
            </h4>
          </Card>

          <Card className="p-4 text-center bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Visual Diagrams</span>
            <h4 className="text-2xl font-bold font-serif text-[#163A5F]">
              {health?.counts?.diagrams ?? 5}
            </h4>
          </Card>

          <Card className="p-4 text-center bg-white border-[#E5E7EB] shadow-sm">
            <span className="text-xs text-[#737373]">Artwork Images</span>
            <h4 className="text-2xl font-bold font-serif text-[#163A5F]">
              {health?.counts?.images ?? 0}
            </h4>
          </Card>
        </div>
      </div>

      {/* 2. Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batch AI Generator */}
        <Card className="p-6 space-y-4 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#171717]">AI Verse Explanations</h4>
              <p className="text-xs text-[#737373]">Generate multilingual theological breakdowns in batch</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Button variant="default" size="sm" className="bg-[#163A5F] hover:bg-[#0f2842] text-white" onClick={() => handleTriggerBatch('ai', 20)} disabled={loading}>
              Generate 20 Verses
            </Button>
            <Button variant="outline" size="sm" className="border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50" onClick={() => handleTriggerBatch('ai', 50)} disabled={loading}>
              Generate 50 Verses
            </Button>
          </div>
        </Card>

        {/* Batch Image Generator */}
        <Card className="p-6 space-y-4 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#171717]">Biblical Artwork Batch</h4>
              <p className="text-xs text-[#737373]">Synthesize fine-art background palettes for verses</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Button variant="outline" size="sm" className="border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50" onClick={() => handleTriggerBatch('images', 50)} disabled={loading}>
              Generate 50 Images
            </Button>
            <Button variant="outline" size="sm" className="border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50" onClick={() => handleTriggerBatch('images', 100)} disabled={loading}>
              Generate 100 Verses
            </Button>
          </div>
        </Card>

        {/* Cache Management */}
        <Card className="p-6 space-y-4 bg-white border-[#E5E7EB] shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#171717]">Cache & Memory Invalidation</h4>
              <p className="text-xs text-[#737373]">Flush in-memory caches for instant DB data refresh</p>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={handleFlushCache} disabled={loading} className="text-rose-600 border-rose-200 hover:bg-rose-50">
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
              <h4 className="font-bold text-base text-[#171717]">Audio Bible Synthesizer</h4>
              <p className="text-xs text-[#737373]">Generate audio voice recordings in Telugu, Hindi & English</p>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="border-[#E5E7EB] bg-white text-[#171717] hover:bg-slate-50" onClick={() => handleTriggerBatch('audio', 10)} disabled={loading}>
              Synthesize 10 Chapters
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
