'use client';

import { openDB } from 'idb';

const DB_NAME = 'vachanam_offline_db';
const DB_VERSION = 1;

async function getDB() {
  if (typeof window === 'undefined') return null;

  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Books store
      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id' });
      }
      // Chapters store (cached offline chapters)
      if (!db.objectStoreNames.contains('chapters')) {
        db.createObjectStore('chapters', { keyPath: 'key' }); // e.g. "GEN_1"
      }
      // Bookmarks store
      if (!db.objectStoreNames.contains('bookmarks')) {
        const bmStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
        bmStore.createIndex('verseKey', 'verseKey', { unique: false });
        bmStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      // Notes store
      if (!db.objectStoreNames.contains('notes')) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'verseKey' });
        noteStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      // Highlights store
      if (!db.objectStoreNames.contains('highlights')) {
        db.createObjectStore('highlights', { keyPath: 'verseKey' });
      }
      // Reading History
      if (!db.objectStoreNames.contains('readingHistory')) {
        const rhStore = db.createObjectStore('readingHistory', { keyPath: 'id', autoIncrement: true });
        rhStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      // Plan Progress
      if (!db.objectStoreNames.contains('planProgress')) {
        db.createObjectStore('planProgress', { keyPath: 'key' }); // `${planId}_day_${day}`
      }
    }
  });
}

// ----------------------------------------------------
// Bookmarks
// ----------------------------------------------------
export async function getBookmarks() {
  const db = await getDB();
  if (!db) return [];
  const bookmarks = await db.getAll('bookmarks');
  return bookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function addBookmark(bookmark) {
  const db = await getDB();
  if (!db) return;
  const item = {
    id: bookmark.id || `bm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    verseKey: bookmark.verseKey,
    bookName: bookmark.bookName,
    chapterNumber: bookmark.chapterNumber,
    verseNumber: bookmark.verseNumber,
    textPreview: bookmark.textPreview,
    language: bookmark.language || 'te',
    createdAt: new Date().toISOString()
  };
  await db.put('bookmarks', item);
  return item;
}

export async function removeBookmark(id) {
  const db = await getDB();
  if (!db) return;
  await db.delete('bookmarks', id);
}

export async function isBookmarked(verseKey) {
  const db = await getDB();
  if (!db) return false;
  const index = db.transaction('bookmarks').store.index('verseKey');
  const match = await index.get(verseKey);
  return !!match;
}

// ----------------------------------------------------
// Notes
// ----------------------------------------------------
export async function getNotes() {
  const db = await getDB();
  if (!db) return [];
  const notes = await db.getAll('notes');
  return notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

export async function getNoteByVerse(verseKey) {
  const db = await getDB();
  if (!db) return null;
  return db.get('notes', verseKey);
}

export async function saveNote({ verseKey, bookName, chapterNumber, verseNumber, contentMarkdown }) {
  const db = await getDB();
  if (!db) return;
  const note = {
    verseKey,
    bookName,
    chapterNumber,
    verseNumber,
    contentMarkdown,
    updatedAt: new Date().toISOString()
  };
  await db.put('notes', note);
  return note;
}

export async function deleteNote(verseKey) {
  const db = await getDB();
  if (!db) return;
  await db.delete('notes', verseKey);
}

// ----------------------------------------------------
// Highlights
// ----------------------------------------------------
export async function getHighlights() {
  const db = await getDB();
  if (!db) return [];
  return db.getAll('highlights');
}

export async function setHighlight(verseKey, color) {
  const db = await getDB();
  if (!db) return;
  if (!color) {
    await db.delete('highlights', verseKey);
    return null;
  }
  const item = { verseKey, color, updatedAt: new Date().toISOString() };
  await db.put('highlights', item);
  return item;
}

// ----------------------------------------------------
// Reading History
// ----------------------------------------------------
export async function addReadingHistory({ bookCode, bookName, chapterNumber }) {
  const db = await getDB();
  if (!db) return;
  await db.add('readingHistory', {
    bookCode,
    bookName,
    chapterNumber,
    timestamp: new Date().toISOString()
  });
}

export async function getReadingHistory(limit = 10) {
  const db = await getDB();
  if (!db) return [];
  const all = await db.getAll('readingHistory');
  return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
}

// ----------------------------------------------------
// Reading Plan Progress
// ----------------------------------------------------
export async function togglePlanDay(planId, day) {
  const db = await getDB();
  if (!db) return false;
  const key = `${planId}_day_${day}`;
  const existing = await db.get('planProgress', key);
  if (existing) {
    await db.delete('planProgress', key);
    return false;
  } else {
    await db.put('planProgress', { key, planId, day, completedAt: new Date().toISOString() });
    return true;
  }
}

export async function getPlanCompletedDays(planId) {
  const db = await getDB();
  if (!db) return [];
  const all = await db.getAll('planProgress');
  return all.filter(p => p.planId === planId).map(p => p.day);
}

// ----------------------------------------------------
// Offline Bible Cache
// ----------------------------------------------------
export async function cacheChapterOffline(bookCode, chapterNumber, data) {
  const db = await getDB();
  if (!db) return;
  const key = `${bookCode.toUpperCase()}_${chapterNumber}`;
  await db.put('chapters', { key, data, timestamp: Date.now() });
}

export async function getCachedChapter(bookCode, chapterNumber) {
  const db = await getDB();
  if (!db) return null;
  const key = `${bookCode.toUpperCase()}_${chapterNumber}`;
  const item = await db.get('chapters', key);
  return item ? item.data : null;
}
