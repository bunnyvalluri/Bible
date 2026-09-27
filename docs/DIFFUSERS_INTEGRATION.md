# Hugging Face Diffusers Integration Guide

## Overview
Vachanam leverages [Hugging Face Diffusers](https://github.com/huggingface/diffusers) for programmatic, scriptable text-to-image generation with direct PyTorch hardware acceleration.

---

## 1. Diffusers Pipeline Architecture
- **Pipeline Class**: `AutoPipelineForText2Image` (supports SDXL and Stable Diffusion 1.5/2.1).
- **Scheduler**: `DPMSolverMultistepScheduler` with Karras sigmas for fast 20-30 step convergence.
- **Precision**: FP16 execution on CUDA accelerators; FP32 on CPU fallback.
- **Memory Optimization**:
  - `pipe.enable_model_cpu_offload()` for GPUs with 6GB–12GB VRAM.
  - `pipe.enable_attention_slicing()` or `xformers` for optimized memory attention.

---

## 2. Programmatic Usage

```python
from app.providers.diffusers_provider import DiffusersProvider

provider = DiffusersProvider(model_id="stabilityai/stable-diffusion-xl-base-1.0")
image_bytes = provider.generate(
    prompt="Vachanam Sacred Illustration for John 3:16...",
    negative_prompt="modern objects, text, watermark, bad anatomy",
    width=1024,
    height=576,
    steps=30,
    cfg_scale=7.0,
    seed=42
)
```
