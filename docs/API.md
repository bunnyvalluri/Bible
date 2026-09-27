# 📡 Vachanam REST API Specification

Base URL: `http://localhost:5000/api` (or your production API host)

---

## 1. Books API

### `GET /books`
Retrieves canonical books of the Bible.
- **Query Params**:
  - `testament`: Optional (`OT` or `NT`)
- **Response**: Array of Book objects with English, Telugu, and Hindi names, chapter count, and category.

### `GET /books/:identifier`
Retrieves a single book by ID, Code (e.g. `GEN`), or short code (`Gen`).

---

## 2. Chapters & Verses API

### `GET /chapters/:bookCode/:chapterNumber`
Retrieves the chapter with all verses in Telugu, English, and Hindi, along with navigation metadata (`prev`, `next`).
- **Example**: `GET /api/chapters/JHN/3`

### `GET /verses/:verseKey`
Retrieves single verse details with attached explanations, images, and audio.
- **Example**: `GET /api/verses/JHN.3.16`

---

## 3. Search Engine API

### `GET /search`
Executes instant multilingual full-text search across Telugu, English, and Hindi.
- **Query Params**:
  - `q`: Search keyword or reference (e.g., `love`, `John 3:16`, `ప్రేమ`, `శాంతి`)
  - `lang`: `all` | `te` | `en` | `hi`
  - `book`: Optional book code filter (e.g. `PSA`)
  - `testament`: Optional `OT` | `NT`
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 20)

### `GET /search/suggestions`
Returns suggested book titles or scripture references matching a partial prefix.

### `GET /search/popular`
Returns curated high-frequency search topics and references.

---

## 4. AI Theological Breakdown API

### `GET /explanations/:verseKey`
Returns a 6-dimensional theological breakdown for the verse.
- **Query Params**:
  - `lang`: `en` | `te` | `hi`
  - `refresh`: `1` to force AI re-synthesis
- **Response**:
```json
{
  "simpleExplanation": "Clear accessible overview...",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "historicalContext": "1st century Jerusalem context...",
  "spiritualMeaning": "Grace and salvation doctrines...",
  "lifeApplication": "Practical daily living guidance...",
  "youthExplanation": "Relatable perspective for teenagers..."
}
```

---

## 5. Visual Diagrams API

### `GET /diagrams`
Returns visual learning models.
- **Query Params**:
  - `type`: `timeline` | `flowchart` | `relationship` | `concept` | `mindmap`
  - `book`: Optional book filter (e.g. `GEN`)

### `GET /diagrams/:id`
Returns a single diagram by ID or key.

---

## 6. Daily Verse API

### `GET /daily-verse/today`
Returns the curated daily verse for today's date with multilingual texts, audio link, artwork, and explanation.

---

## 7. Media & Audio API

### `GET /audio/chapter/:chapterId?lang=te`
Returns audio stream link for full chapter.

### `GET /images/verse/:verseKey`
Returns biblical artwork URLs associated with the verse.

---

## 8. Admin & Batch Operations (Protected)

Header required: `x-admin-key: <ADMIN_API_KEY>`

- `POST /admin/batch/ai`: Triggers batch AI explanation generation. Body: `{ "limit": 50 }`
- `POST /admin/batch/images`: Triggers batch verse artwork creation. Body: `{ "limit": 100 }`
- `POST /admin/batch/audio`: Triggers audio synthesis for chapters. Body: `{ "limit": 10 }`
- `POST /admin/cache/flush`: Flushes all in-memory caching keys.
- `GET /admin/health`: Returns detailed server health, memory metrics, and table row counts.
