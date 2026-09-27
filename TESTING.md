# 🧪 Vachanam Testing & Verification Guide

## Test Architecture

Vachanam incorporates automated testing covering backend REST endpoints, AI loop orchestration, domain verification pipelines, and frontend components.

---

## 🏃 Running Automated Tests

### Run Full Test Suite
```bash
npm test
```

### Run Backend API Integration Tests Only
```bash
npm run test --workspace=backend
```

### Run AI Loop Engine Tests Only
```bash
npm run test:ai
```

---

## 📋 Test Suites & Coverage

### 1. REST API Integration Tests ([backend/tests/api.test.js](file:///c:/bible/backend/tests/api.test.js))
- ✅ System information and metadata (`GET /`)
- ✅ Health check probe (`GET /api/health`)
- ✅ Canonical books list and testament filters (`GET /api/books?testament=NT`)
- ✅ Multilingual full-text search (`GET /api/search?q=God`)
- ✅ Search auto-suggestions (`GET /api/search/popular`)
- ✅ Scheduled daily verse retrieval (`GET /api/daily-verse/today`)
- ✅ Interactive theological diagrams (`GET /api/diagrams`)
- ✅ Structured reading plans (`GET /api/plans`)
- ✅ Admin authorization & cache flush (`POST /api/admin/cache/flush`)

### 2. AI Loop Engine Tests ([ai-engine/tests/loopEngine.test.js](file:///c:/bible/ai-engine/tests/loopEngine.test.js))
- ✅ `LoopRunner` execution, retry, and verification lifecycle
- ✅ `ExplanationVerifier` 6-dimensional validation and biblical sanctity filter
- ✅ `VerseExplanationLoop` trilingual breakdown generation
- ✅ `DailyVersePipelineWorkflow` end-to-end multi-modal pipeline execution
