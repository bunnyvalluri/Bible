import os
import io
import logging
from typing import Dict, Any, Optional
from PIL import Image
from ..config import settings

logger = logging.getLogger("vachanam.storage")

class StorageUploader:
    """
    Manages image post-processing, 16:9 thumbnail generation, WebP optimization,
    and Cloudinary upload with structured public ID paths.
    """

    def __init__(self):
        self.has_cloudinary = False
        if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
            try:
                import cloudinary
                import cloudinary.uploader
                cloudinary.config(
                    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                    api_key=settings.CLOUDINARY_API_KEY,
                    api_secret=settings.CLOUDINARY_API_SECRET,
                    secure=True
                )
                self.has_cloudinary = True
                logger.info("Cloudinary storage initialized successfully")
            except Exception as e:
                logger.warning(f"Could not initialize Cloudinary: {e}")

        # Ensure local dir exists
        os.makedirs(settings.LOCAL_STORAGE_DIR, exist_ok=True)

    def process_and_upload(
        self,
        image_bytes: bytes,
        verse_key: str,
        book_code: str,
        chapter: int,
        verse_number: int
    ) -> Dict[str, Any]:
        """
        Creates optimized image, 16:9 thumbnail, and uploads to Cloudinary or saves locally.
        """
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # 1. Generate 16:9 Thumbnail (480x270)
        thumb = img.copy()
        thumb.thumbnail((480, 270), Image.Resampling.LANCZOS)
        thumb_buffer = io.BytesIO()
        thumb.save(thumb_buffer, format="WEBP", quality=85)
        thumb_bytes = thumb_buffer.getvalue()

        # 2. Optimize Main Image to WebP
        main_buffer = io.BytesIO()
        img.save(main_buffer, format="WEBP", quality=90)
        optimized_bytes = main_buffer.getvalue()

        public_id = f"{settings.CLOUDINARY_FOLDER}/{book_code.lower()}/{chapter}/{verse_number}"

        # 3. Upload to Cloudinary if available
        if self.has_cloudinary:
            try:
                import cloudinary.uploader
                upload_res = cloudinary.uploader.upload(
                    optimized_bytes,
                    public_id=public_id,
                    overwrite=True,
                    resource_type="image",
                    format="webp"
                )
                image_url = upload_res.get("secure_url") or upload_res.get("url")

                # Upload thumbnail
                thumb_res = cloudinary.uploader.upload(
                    thumb_bytes,
                    public_id=f"{public_id}_thumb",
                    overwrite=True,
                    resource_type="image",
                    format="webp"
                )
                thumb_url = thumb_res.get("secure_url") or thumb_res.get("url")

                return {
                    "storageProvider": "cloudinary",
                    "imageUrl": image_url,
                    "thumbnailUrl": thumb_url,
                    "publicId": public_id
                }
            except Exception as e:
                logger.error(f"Cloudinary upload failed: {e}. Falling back to local storage.")

        # 4. Fallback Local Storage
        clean_key = verse_key.replace(".", "_")
        main_filename = f"{clean_key}.webp"
        thumb_filename = f"{clean_key}_thumb.webp"

        main_path = os.path.join(settings.LOCAL_STORAGE_DIR, main_filename)
        thumb_path = os.path.join(settings.LOCAL_STORAGE_DIR, thumb_filename)

        with open(main_path, "wb") as f:
            f.write(optimized_bytes)
        with open(thumb_path, "wb") as f:
            f.write(thumb_bytes)

        return {
            "storageProvider": "local",
            "imageUrl": f"/generated_images/{main_filename}",
            "thumbnailUrl": f"/generated_images/{thumb_filename}",
            "publicId": public_id
        }
