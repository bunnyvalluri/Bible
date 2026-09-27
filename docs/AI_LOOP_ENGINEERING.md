# 🔄 Loop Engineering — AI Orchestration & Automation Architecture

> **Vachanam (వచనం • Vachanam • वचन)** incorporates **Loop Engineering** as its dedicated, stateful AI orchestration, verification, and automation layer.

---

## 🏛️ Architecture Overview

The Loop Engineering framework structures all generative and analytical operations into deterministic, verified, and self-healing cycles.

```text
ai-engine/
├── core/
│   ├── LoopRunner.js          # Execution container with state transitions & hooks
│   ├── ExecutionContext.js    # Per-invocation state, traces, telemetry & tokens
│   ├── StateStore.js          # Persistent workflow state machine (Pending, Running, Completed, Failed, Retrying, Cancelled)
│   └── QueueManager.js        # Priority background task queue & Dead-Letter Queue
│
├── verifiers/
│   ├── VerificationPipeline.js # Composable validation rules pipeline
│   ├── ExplanationVerifier.js  # 6-D structural, depth, and theological sanctity checks
│   └── DomainVerifiers.js      # Diagram graph validator, Image resolution & Bible canonical verifiers
│
├── prompts/
│   ├── explanationPrompts.js  # Versioned 6-dimensional multilingual breakdown prompts
│   ├── domainPrompts.js       # Diagram, Artwork, and Daily Verse curation prompts
│   └── index.js               # Central prompt registry
│
├── services/
│   ├── aiModelProvider.js     # Unified adapter (Gemini 1.5, GPT-4o, and Theological Engine fallback)
│   └── mediaProviders.js      # Image artwork, TTS audio, and Cloudinary/S3 storage adapters
│
├── cache/
│   └── AICacheManager.js      # Multi-level memory & database caching with TTL
│
├── loops/
│   ├── VerseExplanationLoop.js # 6-Dimensional trilingual scripture breakdown loop
│   ├── MediaLoops.js           # Diagram generation, Verse artwork & Audio narration loops
│   ├── DailyVerseLoop.js       # End-to-end multi-modal daily verse curation loop
│   └── OperationalLoops.js     # Bible Import, Full-text indexing, Cache sweep, QA & System Monitor
│
├── workflows/
│   └── Workflows.js            # DailyVersePipelineWorkflow & FullBibleEnrichmentWorkflow
│
└── utilities/
    ├── logger.js               # Structured JSON & colored console telemetry
    ├── backoff.js              # Exponential backoff with jitter
    ├── rateLimiter.js          # Token-bucket rate limiter for AI endpoints
    └── auxiliary.js            # CronScheduler, AIEngineAnalytics & QAReportGenerator
```

---

## 🔄 The 5-Phase Loop Execution Model

Every AI loop managed by `LoopRunner` executes through a 5-phase lifecycle:

1. **Pre-flight Validation**: Validates inputs, canonical references, and parameter types before calling external APIs.
2. **Execution & Rate-Limited Dispatch**: Dispatches requests through exponential backoff with jitter and token bucket rate limits.
3. **Verification Pipeline**: Runs strict structural and content checks (e.g. 6 dimensions present, no empty fields, graph connectivity).
4. **Persistence & Cache Tier**: Caches verified outputs in memory and synchronizes with PostgreSQL via Prisma.
5. **Telemetry & State Transition**: Records metrics, durations, token usage estimates, and emits lifecycle events.

---

## 🧪 Testing the AI Loop Engine

Run the dedicated test suite:

```bash
npm run test:ai
```

Or run the entire full-stack monorepo test suite:

```bash
npm test
```
