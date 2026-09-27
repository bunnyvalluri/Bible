# 💡 Vachanam AI Theological Engine & Services Documentation

Vachanam integrates an enterprise-grade Theological AI Engine designed to provide faithful, orthodox, and deeply engaging biblical insights for all 31,102 Bible verses across **Telugu (తెలుగు)**, **English**, and **Hindi (हिंदी)**.

---

## 🏛️ AI Architecture Overview

```
                          +-------------------------------+
                          |   User requests explanation  |
                          |      (e.g., John 3:16)        |
                          +---------------+---------------+
                                          |
                                          v
                          +---------------+---------------+
                          |    In-Memory Cache (TTL)      |
                          +---------------+---------------+
                                     /         \
                              Hit   /           \  Miss
                                   v             v
                    +--------------------+   +-----------------------+
                    | Return from Memory |   |   PostgreSQL / SQLite |
                    +--------------------+   +-----------+-----------+
                                                        / \
                                                 Hit   /   \  Miss
                                                      v     v
                                      +------------------+  +-------------------------------+
                                      | Return from DB   |  |   Primary: Google Gemini API  |
                                      +------------------+  |   (gemini-1.5-flash)          |
                                                            +---------------+---------------+
                                                                            |
                                                                   Failover |
                                                                            v
                                                            +---------------+---------------+
                                                            |   Secondary: OpenAI GPT-4o    |
                                                            +---------------+---------------+
                                                                            |
                                                                   Failover |
                                                                            v
                                                            +---------------+---------------+
                                                            |   Theological Generator Engine|
                                                            +-------------------------------+
```

---

## 🌟 The 6-Dimensional Theological Breakdown

Every verse explanation generates six distinct perspectives:

| Dimension | Key Name | Description |
| :--- | :--- | :--- |
| **1. Simple Explanation** | `simpleExplanation` | Plain language summary accessible to all reading levels and children. |
| **2. Key Learning Points** | `keyPoints` | Array of 3 concise theological takeaways and action principles. |
| **3. Historical & Cultural Context** | `historicalContext` | Ancient Near Eastern / 1st century Greco-Roman background and archaeological context. |
| **4. Spiritual Meaning & Doctrine** | `spiritualMeaning` | Revelation of God's character, grace, covenant, and Christology. |
| **5. Practical Life Application** | `lifeApplication` | Direct actionable guidance for contemporary daily decisions, family, and workplace. |
| **6. Youth & Teen Perspective** | `youthExplanation` | Modern, relatable spiritual counsel crafted specifically for students and teenagers. |

---

## 🤖 AI Provider Configurations

### 1. Google Gemini AI (Primary)
- **Model**: `gemini-1.5-flash` / `gemini-1.5-pro`
- **Authentication**: `GEMINI_API_KEY` in `.env`
- **Output Mode**: `application/json` with structured schema enforcement.
- **Latency**: Under 800ms.

### 2. OpenAI GPT-4o-mini (Secondary)
- **Model**: `gpt-4o-mini`
- **Authentication**: `OPENAI_API_KEY` in `.env`
- **Output Mode**: JSON mode with strict system instructions.

### 3. Theological Generator Engine (Zero-Downtime Fallback)
If network connectivity is unavailable or API quotas are exhausted, Vachanam activates its internal curated theological synthesis engine. This guarantees that **no user request ever fails**, maintaining 100% service uptime even in completely air-gapped or offline scenarios.

---

## 📝 Prompt Engineering Templates

### Multilingual Synthesis Prompt

```
System Prompt:
You are an authoritative Christian biblical scholar and pastor who explains scripture faithfully, reverently, and clearly.

User Prompt:
Reference: {Book} {Chapter}:{Verse}
Scripture Text: "{Text}"

Respond STRICTLY in valid JSON format with these exact keys in {Language}:
{
  "simpleExplanation": "Clear, accessible explanation of the verse",
  "keyPoints": ["Learning point 1", "Learning point 2", "Learning point 3"],
  "historicalContext": "Historical background and ancient cultural context",
  "spiritualMeaning": "Spiritual truths and doctrine",
  "lifeApplication": "Practical takeaway for daily living today",
  "youthExplanation": "Relatable application specifically for youth and teens"
}
```

---

## ⚡ Caching & Database Persistence

1. **In-Memory Cache**: Cached with TTL of 86,400 seconds (24 hours).
2. **Prisma Persistence**: Stored in the `Explanation` database table (`verseKey`, `language`, `simpleExplanation`, `keyPoints`, `historicalContext`, `spiritualMeaning`, `lifeApplication`, `youthExplanation`, `aiModel`).
3. **Database Index**: Indexed on `[verseKey, language]` ensuring sub-millisecond retrieval on repeat requests.

---

## 🛠️ Batch Generation Scripts

To pre-generate AI explanations for verses in batch:

```bash
# Generate explanations for 50 verses in Telugu, English, and Hindi
node scripts/generateAIExplanations.js
```

Or trigger asynchronously via the Admin REST endpoint:
```bash
curl -X POST http://localhost:5000/api/admin/batch/ai \
  -H "Content-Type: application/json" \
  -H "x-admin-key: vachanam_admin_secret_key_2026" \
  -d '{"limit": 100}'
```
