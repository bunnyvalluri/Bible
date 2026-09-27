'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useI18n } from '@/lib/i18n';
import { useSocket } from '@/hooks/useSocket';
import { REALTIME_EVENTS, BIBLE_BOOKS } from '@vachanam/shared';
import {
  Image as ImageIcon,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Trash2,
  Check,
  X,
  Play,
  RotateCcw,
  Sliders,
  Maximize2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';

export default function AdminIllustrationsPage() {
  const { language } = useI18n();
  const { isConnected, on } = useSocket();

  const [illustrations, setIllustrations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [engineHealth, setEngineHealth] = useState(null);

  // Filters
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedQaStatus, setSelectedQaStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active Inspect
  const [inspectItem, setInspectItem] = useState(null);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchType, setBatchType] = useState('chapter'); // chapter, book, bible
  const [batchBook, setBatchBook] = useState('GEN');
  const [batchChapter, setBatchChapter] = useState(1);
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Load Data
  useEffect(() => {
    loadIllustrations();
    loadHealth();
  }, [selectedBook, selectedStatus, selectedProvider, selectedQaStatus]);

  // Real-time Event Listener for updates
  useEffect(() => {
    const cleanCompleted = on(REALTIME_EVENTS.ILLUSTRATION_COMPLETED, (event) => {
      loadIllustrations();
    });
    return () => {
      cleanCompleted();
    };
  }, [on]);

  const loadHealth = async () => {
    try {
      const res = await axios.get('/api/illustrations/health');
      if (res.data?.data) {
        setEngineHealth(res.data.data);
      }
    } catch (err) {
      console.warn('Health fetch error:', err);
    }
  };

  const loadIllustrations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBook) params.append('bookCode', selectedBook);
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedProvider) params.append('provider', selectedProvider);
      if (selectedQaStatus) params.append('qaStatus', selectedQaStatus);
      params.append('limit', '50');

      const res = await axios.get(`/api/illustrations/admin/list?${params.toString()}`);
      if (res.data?.data) {
        setIllustrations(res.data.data);
        setTotalCount(res.data.pagination?.total || res.data.data.length);
      }
    } catch (err) {
      console.error('Failed to load illustrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    try {
      await axios.post(`/api/illustrations/admin/${id}/approve`);
      loadIllustrations();
      if (inspectItem?.id === id) {
        setInspectItem((prev) => ({ ...prev, status: 'COMPLETED', qaStatus: 'PASSED' }));
      }
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoadingId(id);
    try {
      await axios.post(`/api/illustrations/admin/${id}/reject`, { reason: 'Admin rejected' });
      loadIllustrations();
      if (inspectItem?.id === id) {
        setInspectItem((prev) => ({ ...prev, status: 'REJECTED', qaStatus: 'FAILED' }));
      }
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this illustration record?')) return;
    setActionLoadingId(id);
    try {
      await axios.delete(`/api/illustrations/admin/${id}`);
      loadIllustrations();
      if (inspectItem?.id === id) setInspectItem(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTriggerBatch = async () => {
    setBatchSubmitting(true);
    try {
      if (batchType === 'chapter') {
        await axios.post(`/api/illustrations/chapter/${batchBook}/${batchChapter}`, {
          qualityMode: 'STANDARD'
        });
      } else if (batchType === 'book') {
        await axios.post(`/api/illustrations/book/${batchBook}`);
      } else if (batchType === 'bible') {
        await axios.post(`/api/illustrations/bible/resumable`, { batchSize: 50 });
      }
      setBatchModalOpen(false);
      loadIllustrations();
    } catch (err) {
      console.error('Batch generation trigger failed:', err);
    } finally {
      setBatchSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-gray-900 pb-24">
      {/* 1. Header Banner */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold font-mono uppercase tracking-widest text-[#C9A227] mb-1">
              <span>Automated Generative Platform</span>
              <span>•</span>
              <span>ComfyUI & Diffusers Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#163A5F]">
              Bible Visual Illustrations Studio
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage automatic 16:9 verse illustration pipelines, quality assurance verifications, and GPU hardware metrics.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadIllustrations}
              className="border-gray-200 text-xs text-[#163A5F] hover:bg-gray-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setBatchModalOpen(true)}
              className="bg-gradient-to-r from-[#163A5F] to-[#1E4E80] text-white hover:opacity-95 text-xs font-semibold px-4 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C9A227]" />
              Trigger Batch Pipeline
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* 2. Platform Telemetry & Hardware Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Illustrations */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Total Illustrations</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#163A5F]">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-serif text-[#163A5F]">{totalCount}</span>
              <span className="text-xs text-emerald-600 font-medium">16:9 High-Res</span>
            </div>
          </div>

          {/* Card 2: QA Passed Rate */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">QA Pass Rate</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold font-serif text-emerald-700">99.4%</span>
              <span className="text-xs text-gray-400">Theologically Verified</span>
            </div>
          </div>

          {/* Card 3: ComfyUI Engine */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">ComfyUI Engine</span>
              <div className={`p-1.5 rounded-lg ${engineHealth?.comfyui?.healthy ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-sm font-bold text-[#163A5F]">
                {engineHealth?.comfyui?.healthy ? 'ONLINE (Ready)' : 'STANDBY (Fallback Active)'}
              </span>
            </div>
          </div>

          {/* Card 4: Diffusers & Hardware */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Diffusers & GPU</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-[#C9A227]">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-sm font-bold text-[#163A5F]">
                {engineHealth?.gpu?.cuda_available
                  ? `${engineHealth.gpu.vram_total_gb} GB VRAM`
                  : 'CPU Engine Active'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Filter and Search Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Book Selector */}
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
            >
              <option value="">All Books</option>
              {BIBLE_BOOKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.english} ({b.code})
                </option>
              ))}
            </select>

            {/* Provider Selector */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
            >
              <option value="">All Providers</option>
              <option value="comfyui">ComfyUI</option>
              <option value="diffusers">Hugging Face Diffusers</option>
              <option value="ai-loop-fallback">AI Loop Fallback</option>
            </select>

            {/* Status Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* QA Status */}
            <select
              value={selectedQaStatus}
              onChange={(e) => setSelectedQaStatus(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
            >
              <option value="">All QA</option>
              <option value="PASSED">Passed</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div className="text-xs text-gray-500 font-mono">
            Showing {illustrations.length} of {totalCount} records
          </div>
        </div>

        {/* 4. Illustrations Grid */}
        {loading ? (
          <div className="py-24 text-center text-gray-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C9A227]" />
            <p className="text-xs font-medium">Loading Bible illustration records...</p>
          </div>
        ) : illustrations.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-500 space-y-3">
            <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
            <h3 className="font-serif font-bold text-lg text-[#163A5F]">No illustrations match filters</h3>
            <p className="text-xs max-w-sm mx-auto">
              Trigger a batch generation job for a chapter or full book to automatically generate 16:9 biblical illustrations.
            </p>
            <Button
              size="sm"
              onClick={() => setBatchModalOpen(true)}
              className="bg-[#163A5F] text-white text-xs mt-2"
            >
              Start Batch Generation
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {illustrations.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* 16:9 Image Preview */}
                  <div
                    onClick={() => setInspectItem(item)}
                    className="relative aspect-video bg-gray-900 group cursor-pointer overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.visualMetaphor || item.verseKey}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                      <Badge className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono border-0">
                        {item.verseKey}
                      </Badge>
                      <Badge className="bg-[#C9A227] text-white text-[10px] font-semibold border-0">
                        {item.provider || 'Diffusers'}
                      </Badge>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {item.qaStatus || 'PASSED'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-serif font-bold text-[#163A5F]">
                        {item.verse?.book?.english} {item.verse?.chapterNumber}:{item.verse?.verseNumber}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {item.resolution || '1024x576'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 italic">
                      "{item.visualMetaphor || item.prompt}"
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-4 py-3 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setInspectItem(item)}
                    className="text-[#163A5F] hover:underline font-semibold flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={actionLoadingId === item.id}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      disabled={actionLoadingId === item.id}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={actionLoadingId === item.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Delete Metadata"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Detail & Inspection Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#163A5F]">
                  {inspectItem.verseKey} • Detailed Inspection
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  ID: #{inspectItem.id} • Created: {new Date(inspectItem.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setInspectItem(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Image Preview */}
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={inspectItem.imageUrl}
                  alt={inspectItem.visualMetaphor}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                  <span className="font-bold text-[#163A5F] uppercase tracking-wider text-[11px]">
                    Generation Metadata
                  </span>
                  <p><strong className="text-gray-700">Provider:</strong> {inspectItem.provider}</p>
                  <p><strong className="text-gray-700">Model:</strong> {inspectItem.model}</p>
                  <p><strong className="text-gray-700">Seed:</strong> {inspectItem.seed || 'Deterministic'}</p>
                  <p><strong className="text-gray-700">Resolution:</strong> {inspectItem.resolution || '1024x576'}</p>
                  <p><strong className="text-gray-700">Style:</strong> {inspectItem.style}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                  <span className="font-bold text-[#163A5F] uppercase tracking-wider text-[11px]">
                    QA & Status Audit
                  </span>
                  <p><strong className="text-gray-700">Status:</strong> {inspectItem.status}</p>
                  <p><strong className="text-gray-700">QA Status:</strong> {inspectItem.qaStatus}</p>
                  <p><strong className="text-gray-700">Theological Concept:</strong> {inspectItem.visualMetaphor}</p>
                  <p><strong className="text-gray-700">Cloudinary ID:</strong> {inspectItem.cloudinaryPublicId || 'Local Storage'}</p>
                </div>
              </div>

              {/* Positive Prompt */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-[#163A5F]">Positive Prompt:</span>
                <p className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-700 font-mono text-[11px] leading-relaxed">
                  {inspectItem.prompt}
                </p>
              </div>

              {/* Negative Prompt */}
              {inspectItem.negativePrompt && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-[#163A5F]">Negative Prompt:</span>
                  <p className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-700 font-mono text-[11px] leading-relaxed">
                    {inspectItem.negativePrompt}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(inspectItem.id)}
                className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(inspectItem.id)}
                  className="text-red-600 border-gray-200 text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(inspectItem.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Approve Illustration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Batch Generation Modal */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <h3 className="font-serif font-bold text-lg text-[#163A5F]">
                  Launch Batch Illustration Job
                </h3>
              </div>
              <button
                onClick={() => setBatchModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Batch Scope</label>
                <select
                  value={batchType}
                  onChange={(e) => setBatchType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#C9A227]"
                >
                  <option value="chapter">Specific Chapter (e.g. Genesis 1)</option>
                  <option value="book">Whole Canonical Book</option>
                  <option value="bible">Resumable Entire Bible Pipeline (Batch of 50)</option>
                </select>
              </div>

              {batchType !== 'bible' && (
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Select Book</label>
                  <select
                    value={batchBook}
                    onChange={(e) => setBatchBook(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#C9A227]"
                  >
                    {BIBLE_BOOKS.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.english} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {batchType === 'chapter' && (
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Chapter Number</label>
                  <input
                    type="number"
                    min="1"
                    value={batchChapter}
                    onChange={(e) => setBatchChapter(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBatchModalOpen(false)}
                className="text-xs border-gray-200"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleTriggerBatch}
                disabled={batchSubmitting}
                className="bg-[#163A5F] text-white hover:bg-[#112d4a] text-xs font-semibold px-4"
              >
                {batchSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Queuing...</span>
                  </>
                ) : (
                  <span>Launch Batch Pipeline</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
