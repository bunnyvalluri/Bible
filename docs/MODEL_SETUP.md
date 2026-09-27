# Model Setup & Checkpoint Configuration

## Overview
Vachanam supports interchangeable model checkpoints for both ComfyUI and Hugging Face Diffusers.

---

## 1. Supported Model Families

| Model | Provider | Target Resolution | Recommended VRAM |
| :--- | :--- | :--- | :--- |
| **Stable Diffusion XL 1.0** | Diffusers / ComfyUI | 1024×576 (16:9) | 8GB - 12GB |
| **Stable Diffusion 1.5** | Diffusers / ComfyUI | 768×432 (16:9) | 4GB - 6GB |
| **Vachanam Sacred Editorial Fine-Tune** | ComfyUI Checkpoint | 1024×576 (16:9) | 8GB+ |

---

## 2. ComfyUI Checkpoint Directory
Place model safetensors in ComfyUI's model repository:
```
ComfyUI/models/checkpoints/
├── vachanam_sacred_v1.safetensors
└── sd_xl_base_1.0.safetensors
```

---

## 3. Quality & Cost Presets

| Preset | Resolution | Steps | CFG Scale | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **DRAFT** | 768×432 | 20 | 6.5 | Fast development and preview |
| **STANDARD** | 1024×576 | 30 | 7.0 | Default Vachanam production |
| **HIGH_QUALITY** | 1280×720 | 45 | 7.5 | High-resolution print/display |
