from typing import Dict, Any

PROMPT_VERSION = "2.1.0"

# Standard Base Positive Style Suffix for Vachanam Bible Identity
VACHANAM_STYLE_SUFFIX = (
    "masterpiece, authentic sacred editorial biblical illustration, hand-drawn fine line work, "
    "rich warm organic earth tones, gold and lapis lazuli subtle accents, natural volumetric lighting, "
    "cinematic 16:9 wide composition, reverent atmosphere, historically accurate Levantine and Near Eastern setting, "
    "award-winning editorial artwork, fine parchment texture, elegant dignity"
)

# Standard Universal Negative Prompt
UNIVERSAL_NEGATIVE_PROMPT = (
    "text, typography, watermark, logo, subtitles, captions, bad anatomy, extra limbs, mutated hands, "
    "fused fingers, distorted facial features, blurry, low resolution, cartoonish, 3d render, plastic skin, "
    "oversaturated colors, neon glow, modern clothing, modern buildings, automobiles, sunglasses, wristwatches, "
    "medieval knight armor, European baroque distortions, western renaissance cliches, meme, anime, comic book, "
    "creepy, grotesque, irreverent"
)

ILLUSTRATION_TYPE_TEMPLATES: Dict[str, Dict[str, str]] = {
    "creation_scene": {
        "prompt_template": (
            "Cosmic biblical creation scene depicting {subject}. {scene_description}. "
            "Primordial light breaking through ancient darkness, celestial waters, dramatic atmosphere, "
            "divine majesty, grand scale perspective, {style_suffix}"
        ),
        "negative_template": "modern astronomy photo, telescope grid, sci-fi spaceship, " + UNIVERSAL_NEGATIVE_PROMPT
    },
    "biblical_scene": {
        "prompt_template": (
            "Authentic biblical scene of {subject} in ancient {location}. {action}. "
            "{characters_description}. Historically accurate Near Eastern architecture and garments, "
            "warm natural Mediterranean sunlight, deep compositional depth, {style_suffix}"
        ),
        "negative_template": UNIVERSAL_NEGATIVE_PROMPT
    },
    "character_portrait": {
        "prompt_template": (
            "Dignified biblical portrait of {character_name}. {character_signature}. "
            "Gazing with deep spiritual conviction, authentic ancient Levantine setting, "
            "subtle golden rim light, rich editorial portraiture, {style_suffix}"
        ),
        "negative_template": UNIVERSAL_NEGATIVE_PROMPT
    },
    "symbolic_illustration": {
        "prompt_template": (
            "Sacred visual metaphor representing {theological_concept}. {symbolic_elements}. "
            "Poetic symbolic composition, harmonious sacred geometry, mystical yet grounded spiritual depth, "
            "golden illumination, deep lapis lazuli and warm ochre tones, {style_suffix}"
        ),
        "negative_template": UNIVERSAL_NEGATIVE_PROMPT
    },
    "landscape_scene": {
        "prompt_template": (
            "Panoramic ancient Levantine landscape of {location}. {environmental_details}. "
            "Rolling Judean hills, olive groves, terracotta soil, golden hour lighting, "
            "authentic Biblical geography, serene and timeless stillness, {style_suffix}"
        ),
        "negative_template": "modern roads, telephone poles, modern tourists, concrete buildings, " + UNIVERSAL_NEGATIVE_PROMPT
    }
}
