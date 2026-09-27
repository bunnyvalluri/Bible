/**
 * Centralized Real-Time Event Types and Definitions for Vachanam
 */

const REALTIME_EVENTS = {
  // Bible Content Events
  BIBLE_CHAPTER_UPDATED: 'bible.chapter.updated',
  BIBLE_VERSE_UPDATED: 'bible.verse.updated',

  // AI Explanation Events
  AI_EXPLANATION_STARTED: 'ai.explanation.started',
  AI_EXPLANATION_PROGRESS: 'ai.explanation.progress',
  AI_EXPLANATION_COMPLETED: 'ai.explanation.completed',
  AI_EXPLANATION_FAILED: 'ai.explanation.failed',

  // AI Diagram Events
  AI_DIAGRAM_STARTED: 'ai.diagram.started',
  AI_DIAGRAM_PROGRESS: 'ai.diagram.progress',
  AI_DIAGRAM_COMPLETED: 'ai.diagram.completed',
  AI_DIAGRAM_FAILED: 'ai.diagram.failed',

  // Bible Visual Illustration Events
  ILLUSTRATION_STARTED: 'illustration.started',
  ILLUSTRATION_PROGRESS: 'illustration.progress',
  ILLUSTRATION_COMPLETED: 'illustration.completed',
  ILLUSTRATION_FAILED: 'illustration.failed',

  // Audio Generation Events
  AUDIO_STARTED: 'audio.started',
  AUDIO_PROGRESS: 'audio.progress',
  AUDIO_COMPLETED: 'audio.completed',
  AUDIO_FAILED: 'audio.failed',

  // Search & Indexing Events
  SEARCH_INDEX_UPDATED: 'search.index.updated',

  // Reading Plans & Daily Verse
  READING_PLAN_UPDATED: 'reading-plan.updated',
  DAILY_VERSE_UPDATED: 'daily-verse.updated',

  // Offline Sync Events
  SYNC_STARTED: 'sync.started',
  SYNC_PROGRESS: 'sync.progress',
  SYNC_COMPLETED: 'sync.completed',
  SYNC_FAILED: 'sync.failed',

  // System & Health
  SYSTEM_HEALTH_UPDATED: 'system.health.updated',
  SYSTEM_MAINTENANCE: 'system.maintenance',
  NOTIFICATION_BROADCAST: 'notification.broadcast'
};

const JOB_STATES = {
  PENDING: 'PENDING',
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  PROCESSING: 'PROCESSING',
  VALIDATING: 'VALIDATING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  RETRYING: 'RETRYING',
  CANCELLED: 'CANCELLED'
};

const ROOM_PREFIXES = {
  GLOBAL: 'global',
  LANGUAGE: 'language:',
  BOOK: 'book:',
  CHAPTER: 'chapter:',
  VERSE: 'verse:',
  JOB: 'job:',
  ADMIN: 'admin',
  SYSTEM: 'system'
};

module.exports = {
  REALTIME_EVENTS,
  JOB_STATES,
  ROOM_PREFIXES
};
