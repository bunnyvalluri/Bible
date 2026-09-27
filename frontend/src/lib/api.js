import axios from 'axios';
import { getCachedChapter, cacheChapterOffline } from './storage';
import { BIBLE_BOOKS } from '@vachanam/shared';

const API_BASE_URL = typeof window !== 'undefined'
  ? '/api'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Books
  async getBooks(testament) {
    try {
      const res = await apiClient.get('/books', { params: { testament } });
      return res.data.data;
    } catch (err) {
      console.warn('API getBooks fallback to shared books:', err.message);
      let books = BIBLE_BOOKS;
      if (testament) {
        books = books.filter(b => b.testament.toUpperCase() === testament.toUpperCase());
      }
      return books;
    }
  },

  // Chapter with offline fallback & caching
  async getChapter(bookCode, chapterNumber) {
    const cached = await getCachedChapter(bookCode, chapterNumber);
    try {
      const res = await apiClient.get(`/chapters/${bookCode}/${chapterNumber}`);
      const data = res.data.data;
      if (data) {
        await cacheChapterOffline(bookCode, chapterNumber, data);
      }
      return data;
    } catch (err) {
      if (cached) {
        console.info('Serving chapter from offline IndexedDB cache');
        return cached;
      }
      throw err;
    }
  },

  // Verse
  async getVerse(verseKey) {
    const res = await apiClient.get(`/verses/${verseKey}`);
    return res.data.data;
  },

  // Multilingual Search
  async search({ query, language = 'all', bookCode, testament, page = 1, limit = 20 }) {
    const res = await apiClient.get('/search', {
      params: { q: query, lang: language, book: bookCode, testament, page, limit }
    });
    return res.data.data;
  },

  // Suggestions
  async getSearchSuggestions(q, lang) {
    try {
      const res = await apiClient.get('/search/suggestions', { params: { q, lang } });
      return res.data.data;
    } catch (err) {
      return [];
    }
  },

  // Popular searches
  async getPopularSearches() {
    try {
      const res = await apiClient.get('/search/popular');
      return res.data.data;
    } catch (err) {
      return [];
    }
  },

  // Daily Verse
  async getDailyVerse() {
    try {
      const res = await apiClient.get('/daily-verse/today');
      return res.data.data;
    } catch (err) {
      return null;
    }
  },

  // AI Verse Explanation
  async getVerseExplanation(verseKey, language = 'en', refresh = false) {
    const res = await apiClient.get(`/explanations/${verseKey}`, {
      params: { lang: language, refresh: refresh ? '1' : '0' }
    });
    return res.data.data;
  },

  // Diagrams
  async getDiagrams(type, book) {
    const res = await apiClient.get('/diagrams', { params: { type, book } });
    return res.data.data;
  },

  async getDiagramById(id) {
    const res = await apiClient.get(`/diagrams/${id}`);
    return res.data.data;
  },

  // Audio
  async getChapterAudio(chapterId, lang = 'en') {
    const res = await apiClient.get(`/audio/chapter/${chapterId}`, { params: { lang } });
    return res.data.data;
  },

  async getVerseAudio(verseKey, lang = 'en') {
    const res = await apiClient.get(`/audio/verse/${verseKey}`, { params: { lang } });
    return res.data.data;
  },

  // Images
  async getVerseArtwork(verseKey) {
    const res = await apiClient.get(`/images/verse/${verseKey}`);
    return res.data.data;
  },

  // Plans
  async getReadingPlans() {
    const res = await apiClient.get('/plans');
    return res.data.data;
  },

  async getPlanById(id) {
    const res = await apiClient.get(`/plans/${id}`);
    return res.data.data;
  },

  // Visual Illustrations
  async getIllustration(verseKey, lang = 'en', type = 'verse') {
    const res = await apiClient.get(`/illustrations/${verseKey}`, {
      params: { lang, type }
    });
    return res.data.data;
  },

  async generateIllustration(payload) {
    const res = await apiClient.post('/illustrations/generate', payload);
    return res.data.data;
  },

  async regenerateIllustration(id) {
    const res = await apiClient.post(`/illustrations/${id}/regenerate`);
    return res.data.data;
  },

  async batchIllustrations(payload) {
    const res = await apiClient.post('/illustrations/batch', payload);
    return res.data;
  },

  // Admin
  async getSystemHealth() {
    const res = await apiClient.get('/admin/health');
    return res.data.data;
  },

  async triggerBatch(type, limit = 20, adminKey = 'vachanam_admin_secret_key_2026') {
    const endpoint = `/admin/batch/${type}`;
    const res = await apiClient.post(endpoint, { limit }, {
      headers: { 'x-admin-key': adminKey }
    });
    return res.data;
  },

  async flushCache(adminKey = 'vachanam_admin_secret_key_2026') {
    const res = await apiClient.post('/admin/cache/flush', {}, {
      headers: { 'x-admin-key': adminKey }
    });
    return res.data;
  }
};
