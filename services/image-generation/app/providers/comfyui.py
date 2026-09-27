import os
import json
import uuid
import time
import logging
import requests
from typing import Dict, Any, Optional
from .base import ImageGenerationProvider
from ..config import settings

logger = logging.getLogger("vachanam.provider.comfyui")

class ComfyUIProvider(ImageGenerationProvider):
    """
    ComfyUI Provider Adapter.
    Executes programmatic inference through ComfyUI's REST and WebSocket API.
    """

    def __init__(self, base_url: Optional[str] = None):
        self.base_url = (base_url or settings.COMFYUI_URL).rstrip("/")
        self.client_id = f"vachanam_{uuid.uuid4().hex[:8]}"
        self.workflow_dir = os.path.join(os.path.dirname(__file__), "..", "workflows")

    @property
    def provider_name(self) -> str:
        return "comfyui"

    def is_healthy(self) -> Dict[str, Any]:
        try:
            res = requests.get(f"{self.base_url}/system_stats", timeout=4)
            if res.status_code == 200:
                stats = res.json()
                return {
                    "healthy": True,
                    "provider": "comfyui",
                    "url": self.base_url,
                    "system": stats.get("system", {}),
                    "devices": stats.get("devices", [])
                }
            return {
                "healthy": False,
                "provider": "comfyui",
                "error": f"HTTP status {res.status_code}"
            }
        except Exception as e:
            return {
                "healthy": False,
                "provider": "comfyui",
                "error": str(e)
            }

    def _load_workflow(self, workflow_type: str) -> Dict[str, Any]:
        mapping = {
            "creation_scene": "vachanam_creation_scene.json",
            "biblical_scene": "vachanam_biblical_scene.json",
            "character_portrait": "vachanam_character_scene.json",
            "symbolic_illustration": "vachanam_symbolic_illustration.json",
            "landscape_scene": "vachanam_landscape_scene.json"
        }
        filename = mapping.get(workflow_type, "vachanam_bible_illustration.json")
        file_path = os.path.join(self.workflow_dir, filename)

        if not os.path.exists(file_path):
            file_path = os.path.join(self.workflow_dir, "vachanam_bible_illustration.json")

        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _customize_workflow(
        self,
        workflow: Dict[str, Any],
        prompt: str,
        negative_prompt: str,
        width: int,
        height: int,
        steps: int,
        cfg_scale: float,
        seed: int
    ) -> Dict[str, Any]:
        for node_id, node in workflow.items():
            class_type = node.get("class_type")
            inputs = node.get("inputs", {})

            if class_type == "CLIPTextEncode":
                # Typically node 6 is positive, node 7 is negative in standard templates
                current_text = inputs.get("text", "")
                if "bad anatomy" in current_text or "watermark" in current_text or node_id == "7":
                    inputs["text"] = negative_prompt
                else:
                    inputs["text"] = prompt

            elif class_type == "KSampler":
                inputs["steps"] = steps
                inputs["cfg"] = cfg_scale
                inputs["seed"] = seed

            elif class_type == "EmptyLatentImage":
                inputs["width"] = width
                inputs["height"] = height

        return workflow

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
        raw_workflow = self._load_workflow(workflow_type)
        custom_workflow = self._customize_workflow(
            raw_workflow, prompt, negative_prompt, width, height, steps, cfg_scale, seed
        )

        payload = {
            "prompt": custom_workflow,
            "client_id": self.client_id
        }

        # Submit Prompt Job
        post_res = requests.post(f"{self.base_url}/prompt", json=payload, timeout=10)
        if post_res.status_code != 200:
            raise RuntimeError(f"ComfyUI rejected prompt job: {post_res.text}")

        prompt_data = post_res.json()
        prompt_id = prompt_data.get("prompt_id")
        if not prompt_id:
            raise RuntimeError(f"No prompt_id returned from ComfyUI: {prompt_data}")

        # Poll History until image is ready (with timeout)
        start_time = time.time()
        timeout = settings.COMFYUI_TIMEOUT_SECONDS

        while time.time() - start_time < timeout:
            time.sleep(1.0)
            hist_res = requests.get(f"{self.base_url}/history/{prompt_id}", timeout=5)
            if hist_res.status_code == 200:
                history = hist_res.json()
                if prompt_id in history:
                    outputs = history[prompt_id].get("outputs", {})
                    for node_id, node_output in outputs.items():
                        if "images" in node_output and len(node_output["images"]) > 0:
                            img_info = node_output["images"][0]
                            filename = img_info["filename"]
                            subfolder = img_info.get("subfolder", "")
                            folder_type = img_info.get("type", "output")

                            view_url = f"{self.base_url}/view?filename={filename}&subfolder={subfolder}&type={folder_type}"
                            view_res = requests.get(view_url, timeout=15)
                            if view_res.status_code == 200:
                                return view_res.content

        raise TimeoutError(f"ComfyUI generation timed out after {timeout} seconds for prompt {prompt_id}")
