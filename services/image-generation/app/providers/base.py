from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class ImageGenerationProvider(ABC):
    """
    Abstract Base Class for Image Generation Providers (ComfyUI, Hugging Face Diffusers, etc.)
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    def is_healthy(self) -> Dict[str, Any]:
        """
        Check connectivity and model readiness.
        """
        pass

    @abstractmethod
    def generate(
        self,
        prompt: str,
        negative_prompt: str,
        width: int,
        height: int,
        steps: int,
        cfg_scale: float,
        seed: int,
        workflow_type: str = "biblical_scene",
        metadata: Optional[Dict[str, Any]] = None
    ) -> bytes:
        """
        Executes image generation and returns raw image bytes.
        """
        pass
