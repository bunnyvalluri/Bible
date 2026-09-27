# Third-Party Open-Source Attribution & Licensing

This document details third-party open-source generative AI repositories and libraries integrated into the Vachanam Bible Application.

---

## 1. ComfyUI
- **Repository**: [https://github.com/Comfy-Org/ComfyUI.git](https://github.com/Comfy-Org/ComfyUI.git)
- **License**: GNU General Public License v3.0 (GPL-3.0)
- **Role in Vachanam**: Integrated as headless generative visual graph execution infrastructure. Vachanam communicates with ComfyUI over internal HTTP/WebSocket APIs without embedding or distributing ComfyUI's core code into the proprietary frontend.
- **Attribution**: Copyright (c) Comfy-Org and ComfyUI contributors.

---

## 2. Hugging Face Diffusers
- **Repository**: [https://github.com/huggingface/diffusers.git](https://github.com/huggingface/diffusers.git)
- **License**: Apache License 2.0
- **Role in Vachanam**: Utilized for programmatic PyTorch text-to-image diffusion pipelines, schedulers, and model offloading.
- **Attribution**: Copyright (c) Hugging Face Inc. and Diffusers contributors.

---

## 3. PyTorch & Torchvision
- **Repository**: [https://github.com/pytorch/pytorch](https://github.com/pytorch/pytorch)
- **License**: BSD-3-Clause License
- **Role in Vachanam**: Deep learning and tensor computation runtime with CUDA acceleration.
- **Attribution**: Copyright (c) 2016-present Meta Platforms, Inc. and PyTorch contributors.

---

## 4. Pillow (PIL Fork)
- **Repository**: [https://github.com/python-pillow/Pillow](https://github.com/python-pillow/Pillow)
- **License**: HPND License
- **Role in Vachanam**: Image processing, 16:9 thumbnail generation, WebP optimization, and QA entropy validation.
- **Attribution**: Copyright (c) 1997-2024 by Secret Labs AB, Fredrik Lundh and contributors.
