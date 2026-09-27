# 🚀 Vachanam Production Deployment Guide

Vachanam is engineered to deploy seamlessly on standard cloud infrastructures:

---

## 1. Deploying to Vercel (Frontend Next.js)

1. Push your repository to GitHub or GitLab.
2. In the Vercel Dashboard, click **Add New Project** and select the repository.
3. Configure the Root Directory to `apps/web`.
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed Express backend (e.g. `https://api.vachanam.org/api`)
   - `NEXT_PUBLIC_APP_URL`: `https://vachanam.org`
5. Click **Deploy**.

---

## 2. Deploying Backend to Render / Railway / Supabase

1. Connect your repository to Render / Railway.
2. Select Root Directory as `apps/server` (or run from root with `npm run start --workspace=apps/server`).
3. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `DATABASE_URL`: Your Supabase or PostgreSQL Connection String (`postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?schema=public`)
   - `ADMIN_API_KEY`: Strong randomized secret key
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Set Build Command: `npm install && npx prisma db push && node scripts/importBible.js`
5. Set Start Command: `node apps/server/src/index.js`

---

## 3. Storage Adapters Setup

### Cloudinary (Verse Artwork)
- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Artwork generated via the Studio can be saved to Cloudinary buckets with auto WebP optimization.

### AWS S3 (Audio Bible Tracks)
- Set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `AWS_S3_BUCKET`.
- Chapter narration audio streams are cached and served via CloudFront or S3 bucket URLs.

---

## 4. Docker Deployment

To launch the complete stack with Docker Compose:

```bash
docker-compose up -d --build
```
Web app will be available at port 3000, and Express API at port 5000.
