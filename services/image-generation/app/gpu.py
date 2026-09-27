import os
import sys
import logging
from typing import Dict, Any, List

logger = logging.getLogger("vachanam.gpu")

def detect_hardware() -> Dict[str, Any]:
    """
    Detects system GPU accelerators, CUDA status, VRAM availability, and device counts.
    Provides fallback diagnostic info for CPU execution when CUDA is unavailable.
    """
    info: Dict[str, Any] = {
        "cuda_available": False,
        "device_count": 0,
        "devices": [],
        "recommended_provider": "diffusers",
        "cpu_threads": os.cpu_count() or 4,
        "vram_total_gb": 0.0,
        "vram_free_gb": 0.0,
        "supports_sdxl": False,
        "supports_sd15": True,
        "status": "HEALTHY"
    }

    try:
        import torch
        info["torch_version"] = torch.__version__
        cuda_avail = torch.cuda.is_available()
        info["cuda_available"] = cuda_avail

        if cuda_avail:
            count = torch.cuda.device_count()
            info["device_count"] = count
            total_vram = 0.0
            free_vram = 0.0

            for i in range(count):
                props = torch.cuda.get_device_properties(i)
                total_mem = props.total_memory / (1024 ** 3)
                total_vram += total_mem

                # Attempt memory stats
                try:
                    mem_alloc = torch.cuda.memory_allocated(i) / (1024 ** 3)
                    mem_free = total_mem - mem_alloc
                    free_vram += mem_free
                except Exception:
                    mem_free = total_mem

                dev_info = {
                    "index": i,
                    "name": props.name,
                    "total_vram_gb": round(total_mem, 2),
                    "free_vram_gb": round(mem_free, 2),
                    "major_capability": props.major,
                    "minor_capability": props.minor,
                    "multi_processor_count": props.multi_processor_count
                }
                info["devices"].append(dev_info)

            info["vram_total_gb"] = round(total_vram, 2)
            info["vram_free_gb"] = round(free_vram, 2)
            # SDXL requires >= 6GB VRAM for efficient inference
            info["supports_sdxl"] = total_vram >= 6.0
            info["supports_sd15"] = True
            info["recommended_device"] = "cuda:0"
        else:
            info["recommended_device"] = "cpu"
            info["status"] = "CPU_FALLBACK_ACTIVE"
            info["warning"] = "CUDA is not available. System running on CPU fallback mode."
    except ImportError:
        info["torch_version"] = "not_installed"
        info["status"] = "TORCH_NOT_FOUND"
        info["recommended_device"] = "cpu"
        info["warning"] = "PyTorch is not installed in the environment."
    except Exception as e:
        logger.error(f"Error inspecting hardware: {e}")
        info["status"] = "DETECTION_ERROR"
        info["error"] = str(e)

    return info

def get_best_torch_device() -> str:
    hw = detect_hardware()
    if hw.get("cuda_available") and hw.get("device_count", 0) > 0:
        return "cuda"
    return "cpu"
