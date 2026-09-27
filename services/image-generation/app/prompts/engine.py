import re
import hashlib
from typing import Dict, Any, Tuple, Optional
from .characters import CHARACTER_PROFILES, get_character_profile
from .templates import (
    PROMPT_VERSION,
    VACHANAM_STYLE_SUFFIX,
    UNIVERSAL_NEGATIVE_PROMPT,
    ILLUSTRATION_TYPE_TEMPLATES
)

class PromptEngine:
    """
    Intelligent Theological Prompt Engine for Vachanam Bible Illustrations.
    Translates Scripture context into reverent visual compositions and negative prompts.
    """

    def analyze_verse_context(
        self,
        verse_key: str,
        book_name: str,
        chapter: int,
        verse_number: int,
        verse_text: str,
        surrounding_context: Optional[str] = None
    ) -> Dict[str, Any]:
        text_lower = verse_text.lower()
        book_upper = book_name.upper()

        # 1. Determine Illustration Type
        illustration_type = "biblical_scene"
        if "GEN" in verse_key.upper() and chapter in [1, 2]:
            illustration_type = "creation_scene"
        elif any(k in text_lower for k in ["wisdom", "faith", "love", "grace", "spirit", "truth", "righteousness", "kingdom"]):
            illustration_type = "symbolic_illustration"
        elif any(k in text_lower for k in ["mountain", "sea", "desert", "wilderness", "river", "valley", "land"]):
            illustration_type = "landscape_scene"

        # 2. Check for Character Signatures
        detected_character = None
        for char_name, profile in CHARACTER_PROFILES.items():
            if char_name.lower() in text_lower or char_name.lower() in verse_text.lower():
                detected_character = profile
                if illustration_type != "creation_scene":
                    illustration_type = "character_portrait"
                break

        # 3. Formulate Structured Visual Concept
        subject = f"{book_name} {chapter}:{verse_number} Narrative"
        if illustration_type == "creation_scene":
            subject = f"Creation event in Genesis {chapter}:{verse_number}"
        elif detected_character:
            subject = f"{detected_character['name']} in {book_name} {chapter}:{verse_number}"

        concept = {
            "verseKey": verse_key,
            "book": book_name,
            "chapter": chapter,
            "verse": verse_number,
            "illustrationType": illustration_type,
            "subject": subject,
            "scene": verse_text[:120] + "...",
            "characters": [detected_character["name"]] if detected_character else [],
            "environment": "Ancient Near East / Levantine Sacred Landscape",
            "action": "Reverent biblical action and contemplative stillness",
            "mood": "Reverent, sacred, contemplative, inspiring",
            "symbolism": ["Divine light", "Holy covenant", "Living water", "Sacred truth"],
            "composition": "16:9 cinematic widescreen rule of thirds with prominent focal point",
            "lighting": "Natural golden dawn/dusk volumetric illumination",
            "style": "vachanam-editorial-handdrawn"
        }

        return concept

    def generate_prompts(
        self,
        concept: Dict[str, Any],
        verse_text: str,
        custom_style: Optional[str] = None
    ) -> Tuple[str, str, Dict[str, Any]]:
        """
        Builds positive and negative prompt along with generation metadata.
        """
        ill_type = concept.get("illustrationType", "biblical_scene")
        template_info = ILLUSTRATION_TYPE_TEMPLATES.get(
            ill_type,
            ILLUSTRATION_TYPE_TEMPLATES["biblical_scene"]
        )

        char_desc = ""
        char_negatives = ""
        if concept.get("characters"):
            for c_name in concept["characters"]:
                prof = get_character_profile(c_name)
                if prof:
                    char_desc += f" featuring {prof['visual_signature']}."
                    char_negatives += f", {prof['negative_prompts']}"

        # Clean sanitized verse core
        sanitized_text = re.sub(r'[\r\n]+', ' ', verse_text).strip()
        positive_prompt = (
            f"Vachanam Sacred Illustration for {concept['book']} {concept['chapter']}:{concept['verse']}. "
            f"Scene depicting: '{sanitized_text}'. {concept['subject']}. {concept['environment']}. "
            f"{concept['lighting']}. {char_desc} {VACHANAM_STYLE_SUFFIX}"
        )

        negative_prompt = template_info["negative_template"] + char_negatives

        # Compute deterministic seed from verseKey if needed
        seed_hash = int(hashlib.sha256(f"{concept['verseKey']}_{PROMPT_VERSION}".encode()).hexdigest()[:8], 16)

        metadata = {
            "promptVersion": PROMPT_VERSION,
            "illustrationType": ill_type,
            "concept": concept,
            "seed": seed_hash % (2**31 - 1),
            "style": custom_style or "vachanam-editorial-handdrawn"
        }

        return positive_prompt, negative_prompt, metadata
