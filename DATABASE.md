# 🗄️ Vachanam Database Schema & Models

Vachanam uses Prisma ORM with support for SQLite (local default) and PostgreSQL / Supabase (production).

---

## Prisma Schema Overview

### 1. `Book`
- `id`: Canonical ID (1 to 66)
- `code`: 3-letter uppercase code (e.g. `GEN`, `PSA`, `MAT`, `JHN`, `ROM`, `REV`)
- `shortCode`: Short display code (`Gen`, `Ps`, `Matt`, `John`)
- `english`: English Name
- `telugu`: Telugu Name (e.g. `ఆదికాండము`, `కీర్తనలు`, `మత్తయి సువార్త`)
- `hindi`: Hindi Name (e.g. `उत्पत्ति`, `भजन संहिता`, `मत्ती`)
- `testament`: `OT` | `NT`
- `chaptersCount`: Total chapters (e.g. 50, 150, 28)
- `category`: `Law`, `History`, `Poetry`, `Major Prophets`, `Minor Prophets`, `Gospels`, `Pauline Epistles`, `General Epistles`, `Prophecy`

### 2. `Chapter`
- `id`: Autoincrement primary key
- `bookId`: Foreign key to `Book.id`
- `chapterNumber`: Chapter index (e.g. 1, 2, 3...)
- `totalVerses`: Total verses in this chapter

### 3. `Verse`
- `id`: Autoincrement primary key
- `verseKey`: Unique key format `${bookCode}.${chapter}.${verse}` (e.g. `JHN.3.16`, `GEN.1.1`)
- `bookId`: Foreign key to `Book.id`
- `chapterNumber`: Chapter number
- `verseNumber`: Verse index
- `textTelugu`: Authentic Telugu scripture translation
- `textEnglish`: King James Version scripture text
- `textHindi`: Hindi scripture translation

### 4. `Explanation`
- `id`: Autoincrement primary key
- `verseKey`: Reference string
- `language`: `en` | `te` | `hi`
- `simpleExplanation`: Plain English/Telugu/Hindi summary
- `keyPoints`: JSON Array of 3 learning points
- `historicalContext`: Historical & cultural background
- `spiritualMeaning`: Theological significance
- `lifeApplication`: Modern daily living guidance
- `youthExplanation`: Youth & teen perspective
- `aiModel`: Model name (e.g. `gpt-4o-mini`)

### 5. `Diagram`
- `id`: Autoincrement primary key
- `diagramKey`: Unique slug (e.g. `creation-timeline`, `armor-of-god`, `salvation-journey`)
- `type`: `timeline` | `flowchart` | `relationship` | `concept` | `mindmap`
- `data`: JSON structured nodes & links

### 6. `VerseImage`
- `id`: Autoincrement primary key
- `verseKey`: Target verse key
- `imageUrl`: CDN / Cloudinary URL
- `prompt`: Prompt used for generation
- `style`: Art style preset

### 7. `Audio`
- `id`: Autoincrement primary key
- `chapterId` / `verseKey`: Target reference
- `language`: `en` | `te` | `hi`
- `audioUrl`: Streamable MP3 audio link
- `durationSeconds`: Track length

### 8. `DailyVerse`
- `dateKey`: `YYYY-MM-DD`
- `reference`: Formatted citation
- `theme`: Spiritual topic
- `verseTextEn`, `verseTextTe`, `verseTextHi`: Multilingual texts
- `imageUrl`, `audioUrl`: Associated media links
