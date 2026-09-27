# GPU Setup & Hardware Acceleration

## Overview
The Vachanam Image Generation Service includes automated hardware telemetry and dynamic GPU detection.

---

## 1. Hardware Detection Matrix

- **NVIDIA CUDA**: Full GPU acceleration with PyTorch CUDA 12.1+ runtime.
- **VRAM Telemetry**: Inspects total and free VRAM per card.
- **CPU Fallback**: When CUDA is not available or during lightweight container execution, the service falls back gracefully without failing jobs or crashing.

---

## 2. Telemetry Endpoints
- `GET /health`: Overall system and engine health status.
- `GET /gpu-info`: Real-time CUDA device properties, memory allocation, and CPU thread metrics.
