# ComfyUI Integration Guide

## Overview
Vachanam integrates [ComfyUI](https://github.com/Comfy-Org/ComfyUI) as backend infrastructure for complex node-based visual generation workflows. ComfyUI runs in headless server mode and is controlled programmatically through its REST API and WebSocket events.

---

## 1. Vachanam Workflows
Pre-configured workflows are located in `services/image-generation/app/workflows/`:
1. `vachanam_bible_illustration.json`: Default sacred editorial illustration.
2. `vachanam_biblical_scene.json`: Narrative historical scenes with Levantine architecture.
3. `vachanam_symbolic_illustration.json`: Abstract theological metaphors (faith, grace, covenant).
4. `vachanam_character_scene.json`: Dignified portraits with character consistency constraints.
5. `vachanam_creation_scene.json`: Cosmic creation narratives with primordial illumination.
6. `vachanam_landscape_scene.json`: Panoramic Judean hills, Galilee shores, and ancient geography.

---

## 2. Server Mode Execution
Run ComfyUI as a standalone backend service:
```bash
python main.py --listen 0.0.0.0 --port 8188 --headless
```

---

## 3. Programmatic Execution Flow
1. **Load Workflow Template**: Read workflow JSON template according to `illustrationType`.
2. **Inject Parameters**: Inject positive prompt, universal negative prompt, seed, steps, and resolution.
3. **Submit Job**: `POST /prompt` with customized workflow graph.
4. **Monitor Execution**: Poll `GET /history/{prompt_id}` or listen via WebSocket `/ws`.
5. **Retrieve Output**: Fetch rendered image bytes from `GET /view`.
