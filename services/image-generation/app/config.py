import os
from typing import Optional, Literal
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Service Information
    APP_NAME: str = "Vachanam Bible Visual Illustration Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Primary & Fallback Generation Providers
    # Options: "comfyui", "diffusers", "auto", "mock"
    IMAGE_PROVIDER: str = os.getenv("IMAGE_PROVIDER", "diffusers")
    FALLBACK_IMAGE_PROVIDER: Optional[str] = os.getenv("FALLBACK_IMAGE_PROVIDER", "comfyui")

    # ComfyUI Engine Settings
    COMFYUI_URL: str = os.getenv("COMFYUI_URL", "http://localhost:8188")
    COMFYUI_WS_URL: str = os.getenv("COMFYUI_WS_URL", "ws://localhost:8188/ws")
    COMFYUI_CLIENT_ID: str = os.getenv("COMFYUI_CLIENT_ID", "vachanam-client-1")
    COMFYUI_TIMEOUT_SECONDS: int = int(os.getenv("COMFYUI_TIMEOUT_SECONDS", "120"))

    # Hugging Face Diffusers Settings
    DIFFUSERS_MODEL_ID: str = os.getenv(
        "DIFFUSERS_MODEL_ID",
        "stabilityai/stable-diffusion-xl-base-1.0"
    )
    DIFFUSERS_REFINER_MODEL_ID: Optional[str] = os.getenv("DIFFUSERS_REFINER_MODEL_ID", None)
    DIFFUSERS_DEVICE: str = os.getenv("DIFFUSERS_DEVICE", "cuda")
    TORCH_DTYPE: str = os.getenv("TORCH_DTYPE", "float16")
    ENABLE_CPU_OFFLOAD: bool = os.getenv("ENABLE_CPU_OFFLOAD", "true").lower() == "true"
    ENABLE_XFORMERS: bool = os.getenv("ENABLE_XFORMERS", "true").lower() == "true"

    # Generation Quality Presets
    # DRAFT: 768x432 (16:9), 20 steps
    # STANDARD: 1024x576 (16:9), 30 steps
    # HIGH_QUALITY: 1280x720 (16:9), 45 steps
    DEFAULT_QUALITY_MODE: Literal["DRAFT", "STANDARD", "HIGH_QUALITY"] = "STANDARD"
    DEFAULT_WIDTH: int = 1024
    DEFAULT_HEIGHT: int = 576
    DEFAULT_STEPS: int = 30
    DEFAULT_CFG_SCALE: float = 7.0
    DEFAULT_SEED_POLICY: str = "deterministic_hash" # deterministic_hash | random

    # Cloudinary Storage
    CLOUDINARY_CLOUD_NAME: Optional[str] = os.getenv("CLOUDINARY_CLOUD_NAME", None)
    CLOUDINARY_API_KEY: Optional[str] = os.getenv("CLOUDINARY_API_KEY", None)
    CLOUDINARY_API_SECRET: Optional[str] = os.getenv("CLOUDINARY_API_SECRET", None)
    CLOUDINARY_FOLDER: str = os.getenv("CLOUDINARY_FOLDER", "vachanam/bible")

    # Local Storage Fallback
    LOCAL_STORAGE_DIR: str = os.getenv("LOCAL_STORAGE_DIR", "./generated_images")

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

QUALITY_PRESETS = {
    "DRAFT": {
        "width": 768,
        "height": 432,
        "steps": 20,
        "cfg_scale": 6.5
    },
    "STANDARD": {
        "width": 1024,
        "height": 576,
        "steps": 30,
        "cfg_scale": 7.0
    },
    "HIGH_QUALITY": {
        "width": 1280,
        "height": 720,
        "steps": 45,
        "cfg_scale": 7.5
    }
}
