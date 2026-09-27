# 🏛️ Vachanam Architecture & Design

```
+-------------------------------------------------------------------------------+
|                                VACHANAM CLIENT                                |
|                                (Next.js 14 PWA)                               |
|                                                                               |
|  [Reader Pages]     [Search Engine]     [Diagram Explorer]   [Artwork Studio] |
|  - Book Mode        - Telugu / En / Hi  - Timelines          - Multi-Aspect   |
|  - Parallel Mode    - Match Highlights  - Flowcharts         - Typography     |
|  - Focus Mode       - Suggestions       - Mindmaps           - PNG / WebP     |
|                                                                               |
|  [State & Offline Persistence]                                                |
|  - React Context (I18n, AudioPlayer)                                          |
|  - IndexedDB (Offline Chapters, Bookmarks, Notes, Highlights, Plan Progress)  |
|  - Service Worker (Asset Caching & Network Fallback)                          |
+---------------------------------------+---------------------------------------+
                                        | (REST API / JSON)
                                        v
+-------------------------------------------------------------------------------+
|                            VACHANAM API SERVER                                |
|                            (Express.js & Node.js)                             |
|                                                                               |
|  [Middlewares]                                                                |
|  - Helmet Security  • CORS  • Rate Limiting  • Compression  • In-Memory Cache |
|                                                                               |
|  [Controllers & Services]                                                     |
|  - Bible Service    • Multilingual Search Engine   • Audio & TTS Service      |
|  - AI Service       • Diagram Service              • Artwork Service          |
|                                                                               |
|  [AI & Media Adapters]                                                        |
|  - OpenAI GPT-4o-mini & Theological Generator Fallback                        |
|  - Cloudinary & CDN Storage Adapters                                          |
|  - AWS S3 & Audio Streaming Pipeline                                          |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                           PERSISTENCE LAYER (Prisma)                          |
|                                                                               |
|  - SQLite (Local Development)                                                 |
|  - PostgreSQL / Supabase (Cloud Production)                                   |
|  - Indexed Tables: Book, Chapter, Verse, Explanation, Diagram, Image, Audio   |
+-------------------------------------------------------------------------------+
```

---

## Key Design Principles

1. **Reverent Typography & Book Feel**: The reader mirrors antique printed Bible typography (warm cream page texture, Cormorant Garamond / Noto Sans Telugu & Devanagari fonts, gold accents, drop caps) with zero clutter.
2. **Public Accessibility**: No user login required; bookmarks, notes, and highlights are stored locally in the client's IndexedDB with import/export capabilities, making every feature accessible to all believers, students, and pastors.
3. **Resilient Offline First PWA**: All visited books, chapters, bookmarks, and search index caches persist offline through IndexedDB and Service Workers.
4. **Multilingual Tri-Core**: First-class synchronous support for Telugu (తెలుగు), English, and Hindi (हिंदी) across scripture text, AI explanations, visual diagrams, and audio tracks.
