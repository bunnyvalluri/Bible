# 🕊️ Vachanam (వచనం • Vachanam • वचन)

> **Production-Ready, Enterprise-Grade Multilingual Digital Bible Platform with AI Verse Explanations, Interactive Theological Diagrams, Scripture Artwork Studio, Audio Bible & Offline PWA**

[![CI Status](https://github.com/vachanam/vachanam/actions/workflows/ci.yml/badge.svg)](https://github.com/vachanam/vachanam)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![Node: >=20.0.0](https://img.shields.io/badge/Node-%3E%3D20.0.0-blue.svg)](https://nodejs.org)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)](https://prisma.io)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-10b981.svg)](https://web.dev/progressive-web-apps/)

---

## 📑 Complete Documentation Directory

| Document | Description |
| :--- | :--- |
| 📖 [**README.md**](./README.md) | Master Project Overview, Core Capabilities & Architecture |
| 🛠️ [**INSTALL.md**](./INSTALL.md) | Step-by-Step Local Installation, Seeding & Environment Setup |
| 🚀 [**DEPLOYMENT.md**](./DEPLOYMENT.md) | Production Deployment Guide (Vercel, Supabase, Cloudinary, AWS S3, Docker) |
| 📡 [**API.md**](./API.md) | Complete REST API Specification with Request/Response schemas & cURL |
| 🏛️ [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Full System Architecture, Data Flow, PWA & State Management |
| 🗄️ [**DATABASE.md**](./DATABASE.md) | Prisma Schema, Relational Models, Indexes & PostgreSQL / Supabase Migrations |
| 💡 [**AI_SERVICES.md**](./AI_SERVICES.md) | Google Gemini & OpenAI AI Theological Breakdown Engine & Prompts |
| 👥 [**USER_GUIDE.md**](./USER_GUIDE.md) | End-to-End User Manual for Pastors, Students, Families & Youth |
| 🔧 [**TROUBLESHOOTING.md**](./TROUBLESHOOTING.md) | Debugging Guide, Offline Sync Solutions & Performance Optimization |
| 🤝 [**CONTRIBUTING.md**](./CONTRIBUTING.md) | Open Source Guidelines, Coding Standards & PR Workflows |

---

## 🌟 Key Application Pillars

### 1. 📖 Premium Multilingual Scripture Reader
- **Tri-Language Canonical Engine**: Full authentic support for **Telugu (తెలుగు)**, **English (King James Version)**, and **Hindi (हिंदी)** across all 66 books (OT 39, NT 27) and 1,189 chapters.
- **4 Dedicated Reading Modes**:
  - 📜 **Book Mode**: Antique printed Bible page texture, drop caps, and paragraph rhythm.
  - 📑 **Parallel Mode**: Side-by-side synchronized multi-column translation (Telugu + English + Hindi).
  - 🔍 **Compare Mode**: Verse-by-verse translation inspection modal.
  - 🧘 **Focus Mode**: Distraction-free full-screen ambient meditation mode.
- **Continuous Navigation**: Instant book/chapter dropdown, keyboard arrow support, reading progress indicators, and automated reading history tracking.

### 2. 💡 6-Dimensional AI Theological Explanations
For every verse in the Holy Bible, the integrated AI engine (powered by Google Gemini API & OpenAI with smart theological synthesis fallback) generates:
1. **Simple Explanation**: Clear, accessible overview of the scripture.
2. **3 Key Learning Points**: Essential spiritual takeaways for personal growth.
3. **Historical & Cultural Context**: Ancient biblical setting, archaeological background, and cultural customs.
4. **Spiritual Meaning & Doctrine**: Core theological doctrines, Christological revelations, and divine attributes.
5. **Practical Life Application**: Actionable guidance for modern daily challenges.
6. **Youth & Teen Perspective**: Engaging, relatable application tailored for teenagers and students.
- All 6 dimensions are generated in the active language (Telugu, English, or Hindi) and cached in the database.

### 3. 📊 Interactive Visual Diagrams & Biblical Explorer
- **Timelines**: Chronological progression models (e.g. The 7 Days of Creation, Life of Christ).
- **Flowcharts**: Theological step-by-step roadmaps (e.g. The Romans Road to Salvation).
- **Concept Maps**: Structural spiritual diagrams (e.g. The Full Armor of God in Ephesians 6).
- **Character Relationship Maps**: Relational dynamics (e.g. The Prodigal Son, Older Brother & Father).
- **Mind Maps**: Structured spiritual principles (e.g. The Beatitudes in Matthew 5).

### 4. 🎨 Verse Artwork Creator Studio
- Built-in graphics canvas studio allowing believers, pastors, and media teams to generate high-resolution biblical artwork.
- Fine-art backgrounds with soft divine lighting.
- Typography engine supporting Telugu, Devanagari, and English fonts.
- Multi-aspect ratio presets: `1:1` Square (Instagram/DP), `9:16` Story (WhatsApp Status/Reels), and `16:9` Banner (Worship Presentation screens).
- Instant high-res PNG / WebP export and one-click social sharing.

### 5. 🎧 Narrated Audio Bible & Persistent Global Player
- Audio narration for chapters and verses in Telugu, English, and Hindi.
- Global bottom floating player with Play/Pause, speed adjustment (`0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`), volume control, and chapter playlist drawer.

### 6. 📅 Spiritual Reading Plans
- **30-Day Gospel Journey**
- **90-Day Wisdom & Psalms**
- **One-Year Complete Bible**
- **Topical Plans**: *Peace in Times of Anxiety*, *Youth & Faith in Action*.
- Interactive day-by-day checklist with progress percentage stored locally in IndexedDB.

### 7. 💾 Offline PWA, Bookmarks & Rich Study Notes
- Complete Progressive Web App with Service Worker asset & scripture caching.
- Bookmarks, multi-color highlighters (Gold, Emerald, Sapphire, Ruby, Amethyst), and Markdown rich notes stored in IndexedDB.
- JSON data export and import for seamless multi-device backup without login.
- **100% Public Access**: Intentionally zero authentication required for user features.

---

## 📁 Clean Monorepo Architecture

```
c:/bible/
├── frontend/             # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/          # App Router: Reader, Search, Plans, Saved, Diagrams, Studio, Audio, Admin
│   │   ├── components/   # Reader, AI Drawer, Visual Diagrams, Audio Player, Canvas Studio
│   │   ├── hooks/        # Reactive state & storage hooks
│   │   └── lib/          # API client, i18n, IndexedDB offline persistence
│   └── public/           # PWA Manifest, Service Worker & Icons
│
├── backend/              # Express.js REST API Server
│   ├── src/
│   │   ├── controllers/  # Bible, Search, AI, Daily Verse, Audio, Images, Plans, Admin
│   │   ├── services/     # Bible, Full-Text Search, Gemini/OpenAI AI, Diagrams, TTS
│   │   ├── routes/       # Clean modular REST routes
│   │   └── middlewares/  # Helmet, CORS, Rate-limiting, Cache, Auth, Errors
│   └── tests/            # Automated API integration test suite (12 tests, 100% passing)
│
├── database/             # Database Layer
│   ├── schema.prisma     # Prisma ORM Schema (PostgreSQL / Supabase / SQLite)
│   └── dev.db            # SQLite database pre-seeded with 66 books, chapters & verses
│
├── shared/               # Shared constants & datasets
│   ├── src/books.js      # Canonical 66 Books metadata in Telugu, English, and Hindi
│   ├── src/plans.js      # 30-Day, 90-Day, 1-Year & Topical reading plans
│   ├── src/diagrams.js   # Timelines, flowcharts, concept maps & mindmaps
│   └── src/constants.js  # Language codes, reading modes, highlight palettes
│
├── scripts/              # Data Pipelines & Automation
│   ├── importBible.js    # Data import & database seeder
│   ├── generateAIExplanations.js
│   ├── generateVerseImages.js
│   ├── generateAudioFiles.js
│   └── rebuildSearchIndexes.js
│
├── docs/                 # Technical Documentation
├── docker/               # Container configs and docker-compose.yml
└── .env                  # Master environment configuration
```

---

## 🚀 Quick Launch

```bash
# 1. Install dependencies
npm install

# 2. Synchronize database & Seed (Pre-seeded dev.db already included)
npm run db:push
npm run db:seed

# 3. Start development servers concurrently (Frontend :3000, Backend :5000)
npm run dev
```

Visit:
- 🌐 **Web Reader**: [http://localhost:3000](http://localhost:3000)
- 📡 **REST API**: [http://localhost:5000](http://localhost:5000)
- 🩺 **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing

```bash
npm test
```
All 12 REST API integration tests and Next.js static builds pass with 100% success.
