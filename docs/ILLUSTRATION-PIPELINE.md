# 🔄 Vachanam Illustration Pipeline Specification

## Pipeline Lifecycle

1. **Step 1: Ingestion & Reference Normalization**: Validates book code, chapter, and verse index.
2. **Step 2: Content Analysis**: Identifies theological themes (Love, Guidance, Peace, Faith, Covenant) and emotional tone.
3. **Step 3: Visual Metaphor Generator**: Selects appropriate visual structures (Flow, Journey, Bridge, Path, Tree, Light, Seed, Door, Mountain, River).
4. **Step 4: Composition Planner**: Enforces 16:9 aspect ratio, off-center focal weight, and negative space for typography.
5. **Step 5: Prompt Generator**: Injects system constraints and style rules into versioned prompt templates.
6. **Step 6: Image Generation**: Dispatches rate-limited request with retry backoff.
7. **Step 7: Visual & Safety QA**: Automated scoring across content, style, safety, and accuracy.
8. **Step 8: Programmatic Text Overlay**: Client-side / server-side canvas overlay in active UI language (Telugu, English, Hindi).
9. **Step 9: Storage & Metadata**: Stores image assets and records metadata in Prisma `Illustration` and `IllustrationGeneration` tables.
10. **Step 10: Client Delivery**: Immediate display in Reader and Home page visual showcases with offline caching in IndexedDB.
