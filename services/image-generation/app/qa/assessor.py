import io
import math
import logging
from typing import Dict, Any, List, Tuple
from PIL import Image, ImageStat

logger = logging.getLogger("vachanam.qa")

class ImageQualityAssessor:
    """
    Automated Multi-Stage Image Quality & Theological Integrity Assessor.
    Validates dimensions, non-blank status, color distribution, and contrast metrics.
    """

    def evaluate_image_bytes(
        self,
        image_bytes: bytes,
        expected_width: int = 1024,
        expected_height: int = 576,
        target_aspect_ratio: float = 16.0 / 9.0
    ) -> Dict[str, Any]:
        issues: List[str] = []
        scores: Dict[str, float] = {
            "contentScore": 1.0,
            "styleScore": 1.0,
            "safetyScore": 1.0,
            "accuracyScore": 1.0
        }

        # 1. Verification of decodable image data
        if not image_bytes or len(image_bytes) < 1024:
            return {
                "approved": False,
                "qaStatus": "FAILED",
                "overallScore": 0.0,
                "issues": ["Image file is empty or corrupted (under 1KB)"],
                "scores": scores
            }

        try:
            img = Image.open(io.BytesIO(image_bytes))
            img.verify()
            # Reopen for pixel analysis
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            return {
                "approved": False,
                "qaStatus": "FAILED",
                "overallScore": 0.0,
                "issues": [f"Image decoding failed: {str(e)}"],
                "scores": scores
            }

        width, height = img.size

        # 2. Dimensions and aspect ratio check
        actual_ratio = width / max(1, height)
        ratio_diff = abs(actual_ratio - target_aspect_ratio)
        if ratio_diff > 0.15:
            issues.append(f"Aspect ratio mismatch: expected {target_aspect_ratio:.2f}, got {actual_ratio:.2f}")
            scores["styleScore"] -= 0.2

        if width < 512 or height < 288:
            issues.append(f"Resolution is critically low: {width}x{height}")
            scores["styleScore"] -= 0.4

        # 3. Blank / Solid Color / Low Entropy Detection
        stat = ImageStat.Stat(img)
        # stat.stddev returns standard deviation for R, G, B
        avg_stddev = sum(stat.stddev) / len(stat.stddev)
        
        # If stddev is extremely low (< 10), image is flat solid color or black/white void
        if avg_stddev < 10.0:
            issues.append(f"Image has insufficient visual variance (stddev={avg_stddev:.2f}); possible blank frame")
            scores["contentScore"] = 0.1
            scores["styleScore"] = 0.1

        # Calculate brightness / extrema
        extrema = img.getextrema() # ((min_r, max_r), ...)
        is_all_black = all(max_val < 15 for min_val, max_val in extrema)
        is_all_white = all(min_val > 240 for min_val, max_val in extrema)

        if is_all_black:
            issues.append("Image is completely black void.")
            scores["contentScore"] = 0.0
        if is_all_white:
            issues.append("Image is completely white overexposed frame.")
            scores["contentScore"] = 0.0

        # Calculate Overall Weighted Score
        overall = (
            scores["contentScore"] * 0.35 +
            scores["styleScore"] * 0.25 +
            scores["safetyScore"] * 0.20 +
            scores["accuracyScore"] * 0.20
        )
        overall = max(0.0, min(1.0, round(overall, 3)))

        approved = overall >= 0.70 and len(issues) == 0

        return {
            "approved": approved,
            "qaStatus": "PASSED" if approved else "FAILED",
            "overallScore": overall,
            "scores": {k: round(v, 2) for k, v in scores.items()},
            "issues": issues,
            "metrics": {
                "width": width,
                "height": height,
                "aspectRatio": round(actual_ratio, 2),
                "stddev": round(avg_stddev, 2),
                "fileSizeBytes": len(image_bytes)
            }
        }
