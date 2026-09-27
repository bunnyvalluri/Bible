import os
import time
import logging
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .config import settings, QUALITY_PRESETS
from .gpu import detect_hardware
from .prompts.engine import PromptEngine
from .qa.assessor import ImageQualityAssessor
from .storage.uploader import StorageUploader
from .providers.comfyui import ComfyUIProvider
from .providers.diffusers_provider import DiffusersProvider

# Configure Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s"
)
logger = logging.getLogger("vachanam.image_service")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Automated Bible Verse Illustration Generation Engine powered by ComfyUI & Hugging Face Diffusers."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate Core Engines
prompt_engine = PromptEngine()
qa_assessor = ImageQualityAssessor()
storage_uploader = StorageUploader()
comfyui_provider = ComfyUIProvider()
diffusers_provider = DiffusersProvider()

# --- Request / Response Schemas ---
class GenerateImageRequest(BaseModel):
    verseKey: str = Field(..., example="GEN.1.1")
    bookCode: str = Field(..., example="GEN")
    bookName: str = Field(..., example="Genesis")
    chapter: int = Field(..., example=1)
    verseNumber: int = Field(..., example=1)
    verseText: str = Field(..., example="In the beginning God created the heaven and the earth.")
    style: Optional[str] = "vachanam-editorial-handdrawn"
    qualityMode: Optional[str] = "STANDARD" # DRAFT, STANDARD, HIGH_QUALITY
    provider: Optional[str] = None # comfyui, diffusers, auto
    width: Optional[int] = None
    height: Optional[int] = None
    steps: Optional[int] = None
    cfgScale: Optional[float] = None
    seed: Optional[int] = None
    context: Optional[str] = None

class PreviewPromptRequest(BaseModel):
    verseKey: str = Field(..., example="GEN.1.1")
    bookName: str = Field(..., example="Genesis")
    chapter: int = Field(..., example=1)
    verseNumber: int = Field(..., example=1)
    verseText: str = Field(..., example="In the beginning God created the heaven and the earth.")

# --- Endpoints ---

@app.get("/health")
def get_health() -> Dict[str, Any]:
    gpu_info = detect_hardware()
    comfy_health = comfyui_provider.is_healthy()
    diffusers_health = diffusers_provider.is_healthy()

    return {
        "status": "HEALTHY",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "defaultProvider": settings.IMAGE_PROVIDER,
        "fallbackProvider": settings.FALLBACK_IMAGE_PROVIDER,
        "gpu": gpu_info,
        "comfyui": comfy_health,
        "diffusers": diffusers_health
    }

@app.get("/gpu-info")
def get_gpu_info() -> Dict[str, Any]:
    return detect_hardware()

@app.get("/workflows")
def list_workflows() -> List[str]:
    workflow_dir = os.path.join(os.path.dirname(__file__), "workflows")
    if os.path.exists(workflow_dir):
        return [f for f in os.listdir(workflow_dir) if f.endswith(".json")]
    return []

@app.post("/prompts/preview")
def preview_prompt(req: PreviewPromptRequest) -> Dict[str, Any]:
    concept = prompt_engine.analyze_verse_context(
        verse_key=req.verseKey,
        book_name=req.bookName,
        chapter=req.chapter,
        verse_number=req.verseNumber,
        verse_text=req.verseText
    )
    positive, negative, meta = prompt_engine.generate_prompts(concept, req.verseText)
    return {
        "concept": concept,
        "positivePrompt": positive,
        "negativePrompt": negative,
        "metadata": meta
    }

@app.post("/generate")
def generate_illustration(req: GenerateImageRequest) -> Dict[str, Any]:
    start_time = time.time()
    logger.info(f"Received illustration generation request for {req.verseKey} ({req.bookName} {req.chapter}:{req.verseNumber})")

    # 1. Resolve Quality Presets
    preset = QUALITY_PRESETS.get(req.qualityMode, QUALITY_PRESETS["STANDARD"])
    width = req.width or preset["width"]
    height = req.height or preset["height"]
    steps = req.steps or preset["steps"]
    cfg_scale = req.cfgScale or preset["cfg_scale"]

    # 2. Context Analysis & Prompt Engineering
    concept = prompt_engine.analyze_verse_context(
        verse_key=req.verseKey,
        book_name=req.bookName,
        chapter=req.chapter,
        verse_number=req.verseNumber,
        verse_text=req.verseText,
        surrounding_context=req.context
    )

    positive_prompt, negative_prompt, prompt_meta = prompt_engine.generate_prompts(
        concept=concept,
        verse_text=req.verseText,
        custom_style=req.style
    )

    seed = req.seed if req.seed is not None else prompt_meta["seed"]
    workflow_type = concept.get("illustrationType", "biblical_scene")

    # 3. Provider Selection & Execution
    target_provider = (req.provider or settings.IMAGE_PROVIDER).lower()
    if target_provider == "auto":
        # Check ComfyUI health first, if healthy use ComfyUI, else Diffusers
        comfy_status = comfyui_provider.is_healthy()
        target_provider = "comfyui" if comfy_status.get("healthy") else "diffusers"

    image_bytes = None
    executed_provider = target_provider
    provider_error = None

    try:
        if target_provider == "comfyui":
            image_bytes = comfyui_provider.generate(
                prompt=positive_prompt,
                negative_prompt=negative_prompt,
                width=width,
                height=height,
                steps=steps,
                cfg_scale=cfg_scale,
                seed=seed,
                workflow_type=workflow_type,
                metadata=prompt_meta
            )
        else:
            image_bytes = diffusers_provider.generate(
                prompt=positive_prompt,
                negative_prompt=negative_prompt,
                width=width,
                height=height,
                steps=steps,
                cfg_scale=cfg_scale,
                seed=seed,
                workflow_type=workflow_type,
                metadata=prompt_meta
            )
    except Exception as e:
        logger.warning(f"Primary provider {target_provider} failed: {e}. Attempting fallback...")
        provider_error = str(e)
        # Attempt fallback to secondary provider
        fallback = "diffusers" if target_provider == "comfyui" else "comfyui"
        try:
            if fallback == "comfyui":
                image_bytes = comfyui_provider.generate(
                    prompt=positive_prompt,
                    negative_prompt=negative_prompt,
                    width=width,
                    height=height,
                    steps=steps,
                    cfg_scale=cfg_scale,
                    seed=seed,
                    workflow_type=workflow_type,
                    metadata=prompt_meta
                )
            else:
                image_bytes = diffusers_provider.generate(
                    prompt=positive_prompt,
                    negative_prompt=negative_prompt,
                    width=width,
                    height=height,
                    steps=steps,
                    cfg_scale=cfg_scale,
                    seed=seed,
                    workflow_type=workflow_type,
                    metadata=prompt_meta
                )
            executed_provider = fallback
        except Exception as fb_err:
            logger.error(f"Fallback provider {fallback} also failed: {fb_err}")
            raise HTTPException(
                status_code=500,
                detail=f"Image generation failed across providers: primary ({provider_error}), fallback ({fb_err})"
            )

    # 4. Automated Multi-Stage QA
    qa_result = qa_assessor.evaluate_image_bytes(
        image_bytes=image_bytes,
        expected_width=width,
        expected_height=height
    )

    if not qa_result["approved"]:
        logger.warning(f"QA rejected generated image for {req.verseKey}: {qa_result['issues']}")

    # 5. Storage & Post-Processing (16:9 Thumbnail, WebP, Cloudinary)
    storage_res = storage_uploader.process_and_upload(
        image_bytes=image_bytes,
        verse_key=req.verseKey,
        book_code=req.bookCode,
        chapter=req.chapter,
        verse_number=req.verseNumber
    )

    duration_ms = int((time.time() - start_time) * 1000)
    logger.info(f"Completed illustration for {req.verseKey} in {duration_ms}ms via {executed_provider}")

    return {
        "success": True,
        "verseKey": req.verseKey,
        "bookCode": req.bookCode,
        "chapter": req.chapter,
        "verseNumber": req.verseNumber,
        "imageUrl": storage_res["imageUrl"],
        "thumbnailUrl": storage_res["thumbnailUrl"],
        "storageProvider": storage_res["storageProvider"],
        "cloudinaryPublicId": storage_res.get("publicId"),
        "illustrationType": workflow_type,
        "visualMetaphor": concept["scene"],
        "theme": concept["mood"],
        "prompt": positive_prompt,
        "negativePrompt": negative_prompt,
        "provider": executed_provider,
        "model": settings.DIFFUSERS_MODEL_ID if executed_provider == "diffusers" else "comfyui-vachanam-v1",
        "seed": seed,
        "parameters": {
            "width": width,
            "height": height,
            "steps": steps,
            "cfgScale": cfg_scale,
            "qualityMode": req.qualityMode
        },
        "concept": concept,
        "qa": qa_result,
        "durationMs": duration_ms
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
