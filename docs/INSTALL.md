# 🛠️ Vachanam Installation & Local Setup Guide

---

## 1. Directory Architecture

```
c:/bible/
├── frontend/             # Next.js 14 Web Application
├── backend/              # Express.js REST API Server
├── database/             # Prisma schema & SQLite database (dev.db)
├── shared/               # Shared constants, 66 books, reading plans & diagrams
├── scripts/              # Seeding, AI generation, and audio batch scripts
├── docs/                 # Documentation
└── docker/               # Container configs
```

---

## 2. Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Synchronize database & Seed (Pre-seeded dev.db already included)
npm run db:push
npm run db:seed

# 3. Start development servers concurrently
npm run dev
```

Visit:
- 🌐 **Web Reader**: [http://localhost:3000](http://localhost:3000)
- 📡 **REST API**: [http://localhost:5000](http://localhost:5000)

---

## 3. Run Automated Tests

```bash
npm test
```
