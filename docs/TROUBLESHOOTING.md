# 🔧 Vachanam Troubleshooting Guide

---

## 1. Port 5000 or 3000 Already in Use

**Symptom**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
- Either terminate the existing process or update the `PORT` variable in `.env`:
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```
Or edit `.env`: `PORT=5001`.

---

## 2. Prisma Database Not Found

**Symptom**: `PrismaClientInitializationError: Unable to open the database file`

**Solution**:
Run the database generator and migration scripts:
```bash
npm run db:push
npm run db:seed
```

---

## 3. OpenAI API Timeout or Rate Limit

**Symptom**: `OpenAI API call failed`

**Solution**:
Vachanam includes an automatic fallback theological synthesis engine. Even without an OpenAI API key or during network disruptions, the application continues to generate rich, structured 6-point explanations in Telugu, Hindi, and English.

---

## 4. Offline Mode Not Updating

**Symptom**: Service Worker serves older cache during development.

**Solution**:
In Chrome DevTools -> Application -> Service Workers -> click **Unregister** or check **Update on reload**.
