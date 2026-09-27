# Batch Generation & Resumable Bible Pipelines

## Overview
Vachanam provides industrial batch workflows to generate illustrations for chapters, canonical books, or the entire Bible.

---

## 1. Batch API Endpoints

### 1.1 Chapter Batch
```http
POST /api/illustrations/chapter/:bookCode/:chapterNumber
Content-Type: application/json

{
  "language": "en",
  "style": "vachanam-editorial-handdrawn",
  "qualityMode": "STANDARD"
}
```

### 1.2 Book Batch
```http
POST /api/illustrations/book/:bookCode
Content-Type: application/json

{
  "language": "en",
  "startChapter": 1,
  "endChapter": 50
}
```

### 1.3 Entire Bible Resumable Pipeline
```http
POST /api/illustrations/bible/resumable
Content-Type: application/json

{
  "language": "en",
  "batchSize": 50
}
```

---

## 2. Idempotency & Resumability
- Before queuing each verse, the system checks whether a completed, approved illustration exists for `(verseKey, language)`.
- If interrupted by server restart, the pipeline resumes without repeating already completed verses.
