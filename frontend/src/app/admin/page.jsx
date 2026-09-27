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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-900/10 dark:bg-gold-400/10 text-xs font-semibold text-primary-900 dark:text-gold-300">
            <Shield className="w-3.5 h-3.5" />
            <span>Server Operations & Data Maintenance</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mt-2">
            {t('admin')}
          </h1>
          <p className="text-xs text-muted-foreground">
            Protected maintenance endpoints (Configured via ADMIN_API_KEY)
          </p>
        </div>

        {/* Admin Secret Key Input */}
        <div className="flex items-center space-x-2 bg-card p-2 rounded-2xl border border-border">
          <Key className="w-4 h-4 text-gold-500 ml-2" />
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Admin Secret Key"
            className="bg-transparent text-xs p-1 focus:outline-none w-48 text-foreground"
          />
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-card border border-border text-sm font-medium shadow-sm animate-in fade-in">
          {statusMessage}
        </div>
      )}

      {/* 1. Database & System Health Metrics */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          System Health & Dataset Counts
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Card className="p-4 text-center">
            <span className="text-xs text-muted-foreground">Books</span>
            <h4 className="text-2xl font-bold font-serif text-primary-900 dark:text-gold-300">
              {health?.counts?.books ?? 66}
            </h4>
          </Card>

          <Card className="p-4 text-center">
            <span className="text-xs text-muted-foreground">Chapters</span>
            <h4 className="text-2xl font-bold font-serif text-primary-900 dark:text-gold-300">
              {health?.counts?.chapters ?? 1189}
            </h4>
          </Card>

          <Card className="p-4 text-center">
            <span className="text-xs text-muted-foreground">Verses</span>
            <h4 className="text-2xl font-bold font-serif text-primary-900 dark:text-gold-300">
              {health?.counts?.verses ?? 31102}
            </h4>
          </Card>

          <Card className="p-4 text-center">
            <span className="text-xs text-muted-foreground">AI Explanations</span>
            <h4 className="text-2xl font-bold font-serif text-primary-900 dark:text-gold-300">
              {health?.counts?.explanations ?? 0}
            </h4>
          </Card>

          <Card className="p-4 text-center">
            <span className="text-xs text-muted-foreground">Visual Diagrams</span>
            <h4 className="text-2xl font-bold font-serif text-primary-900 dark:text-gold-300">
              {health?.counts?.diagrams ?? 5}
            </h4>
          </Card>

          <Card className="p-4 text-center">
            <span className="text-xs text-muted-foreground">Artwork Images</span>
            <h4 className="text-2xl font-bold font-serif text-primary-900 dark:text-gold-300">
              {health?.counts?.images ?? 0}
            </h4>
          </Card>
        </div>
      </div>

      {/* 2. Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batch AI Generator */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-950 text-gold-700 dark:text-gold-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-foreground">AI Verse Explanations</h4>
              <p className="text-xs text-muted-foreground">Generate multilingual theological breakdowns in batch</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Button variant="gold" size="sm" onClick={() => handleTriggerBatch('ai', 20)} disabled={loading}>
              Generate 20 Verses
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleTriggerBatch('ai', 50)} disabled={loading}>
              Generate 50 Verses
            </Button>
          </div>
        </Card>

        {/* Batch Image Generator */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-foreground">Biblical Artwork Batch</h4>
              <p className="text-xs text-muted-foreground">Synthesize fine-art background palettes for verses</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => handleTriggerBatch('images', 50)} disabled={loading}>
              Generate 50 Images
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleTriggerBatch('images', 100)} disabled={loading}>
              Generate 100 Verses
            </Button>
          </div>
        </Card>

        {/* Cache Management */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-foreground">Cache & Memory Invalidation</h4>
              <p className="text-xs text-muted-foreground">Flush in-memory caches for instant DB data refresh</p>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={handleFlushCache} disabled={loading} className="text-rose-600 border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950">
              Clear All Cache Keys
            </Button>
          </div>
        </Card>

        {/* Audio Synthesizer */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-foreground">Audio Bible Synthesizer</h4>
              <p className="text-xs text-muted-foreground">Generate audio voice recordings in Telugu, Hindi & English</p>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={() => handleTriggerBatch('audio', 10)} disabled={loading}>
              Synthesize 10 Chapters
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
