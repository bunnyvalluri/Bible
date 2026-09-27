# Vachanam Bible Visual Illustration Generation Architecture

## Overview
The Vachanam Bible Visual Illustration Engine automatically creates high-resolution, reverent 16:9 editorial visual artwork for every verse in the Holy Bible. It coordinates Python generative AI engines (ComfyUI and Hugging Face Diffusers), BullMQ asynchronous job queues, automated multi-stage Quality Assurance (QA), Cloudinary cloud storage, and Neon PostgreSQL database persistence with instant real-time Socket.IO synchronization.

---

## 1. End-to-End Pipeline

```
Bible Verse
  ↓
Theological Context Analyzer
  ↓
Structured Visual Concept Generator
  ↓
Prompt Engine (Positive & Negative Prompts)
  ↓
BullMQ Job Queue (Redis)
  ↓
Image Generation Service (ComfyUI / Diffusers)
  ↓
Multi-Stage Image QA Assessor
  ↓
Post-Processing & Cloudinary Upload
  ↓
Neon PostgreSQL (Prisma)
  ↓
Transactional Outbox & Socket.IO Broadcaster
  ↓
Vachanam Verse UI (Live Update without Page Refresh)
```

---

## 2. Key Architecture Components

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Generative Service** | FastAPI (Python 3.10+) | Programmatic orchestration of ComfyUI and Hugging Face Diffusers |
| **ComfyUI Engine** | ComfyUI REST/WebSocket | Node-based visual execution graph with custom Vachanam workflows |
| **Diffusers Engine** | Hugging Face Diffusers + PyTorch | Programmatic SDXL and SD 1.5 pipelines with CUDA acceleration |
| **QA Assessor** | Pillow + ImageStat | Validates 16:9 ratio, non-blank status, entropy, safety, and contrast |
| **Queue Manager** | BullMQ + Redis | Priority queuing, concurrency limits, exponential backoff, dead-letter |
| **Storage Engine** | Cloudinary / WebP | 16:9 high-res artwork, 480x270 thumbnails, structured public IDs |
| **Realtime Engine** | Socket.IO | Broadcasts `illustration.completed` and `illustration.progress` events |
| **Frontend UI** | Next.js 14 (React) | `<VerseBlock />` with integrated `<VerseIllustrationCard />` |

---

## 3. Configuration & Environment Variables

```env
# Generation Engine
IMAGE_PROVIDER=diffusers            # comfyui | diffusers | auto
FALLBACK_IMAGE_PROVIDER=comfyui    # fallback provider
DIFFUSERS_MODEL_ID=stabilityai/stable-diffusion-xl-base-1.0
COMFYUI_URL=http://localhost:8188
COMFYUI_WS_URL=ws://localhost:8188/ws

# Image Dimensions & Quality Presets
DEFAULT_QUALITY_MODE=STANDARD       # DRAFT | STANDARD | HIGH_QUALITY
DEFAULT_WIDTH=1024
DEFAULT_HEIGHT=576
DEFAULT_STEPS=30
DEFAULT_CFG_SCALE=7.0

# Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=vachanam/bible
```
