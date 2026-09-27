from typing import Dict, Any, Optional

# Structured Character Consistency Profiles for Biblical Visual Identity
# Ensures recurring characters maintain reverent, historically accurate visual signatures.
CHARACTER_PROFILES: Dict[str, Dict[str, Any]] = {
    "JESUS": {
        "name": "Jesus of Nazareth",
        "era": "1st Century Judea / Galilee",
        "visual_signature": "First-century Galilean Jewish man in his early 30s, olive complexion, kind and deeply compassionate dark brown eyes, neatly kept brown beard, simple unbleached off-white linen tunic with natural woven texture, soft blue-gray outer mantle, leather sandals, serene and authoritative demeanor, natural soft golden lighting",
        "appearance_constraints": "Reverent, dignified, historically authentic Middle Eastern features, no exaggerated modern halos, no European renaissance distortions, gentle strength",
        "negative_prompts": "blonde hair, blue eyes, modern clothing, crown with jewelry, caricature, distorted hands, modern accessories"
    },
    "MOSES": {
        "name": "Moses",
        "era": "Late Bronze Age / Ancient Egypt & Sinai Wilderness",
        "visual_signature": "Venerable ancient Hebrew leader, weathered tanned skin, strong angular facial structure, dignified flowing gray and white beard, deep contemplative gaze, earth-toned desert nomadic wool robe in terracotta and desert sand shades, leather belt, holding polished acacia wood staff",
        "appearance_constraints": "Rugged desert resilience, profound spiritual wisdom, authentic ancient Semitic desert traveler attire",
        "negative_prompts": "modern spectacles, synthetic fabrics, horned headdress, cartoonish beard"
    },
    "DAVID": {
        "name": "King David",
        "era": "Iron Age Kingdom of Israel (c. 1000 BCE)",
        "visual_signature": "Athletic and noble Hebrew king/poet, dark wavy hair, expressive soulful eyes, short trimmed beard, finely woven deep indigo and gold-trimmed ancient Israelite tunic, leather wrist bracers, holding cedarwood ten-string lyre (kinnor)",
        "appearance_constraints": "Combination of warrior strength and poet humility, authentic Levantine textile patterns",
        "negative_prompts": "medieval European armor, western crowns, fantasy swords"
    },
    "PETER": {
        "name": "Simon Peter (Apostle)",
        "era": "1st Century Sea of Galilee & Rome",
        "visual_signature": "Sturdy Galilean fisherman in his 40s, sun-darkened muscular arms, earnest and resolute expression, thick curly salt-and-pepper hair and short beard, coarse sea-worn linen tunic in slate blue and earth grey",
        "appearance_constraints": "Working-class fisherman authenticity, weathered hands, earnest devotion",
        "negative_prompts": "papal vestments in 1st century, pristine velvet, modern fishing nets"
    },
    "PAUL": {
        "name": "Apostle Paul (Saul of Tarsus)",
        "era": "1st Century Mediterranean / Greco-Roman Era",
        "visual_signature": "Focused intellectual Jewish scholar and missionary, thoughtful furrowed brow, intense observant dark eyes, dark receded hair, dark beard with silver streaks, practical travel-worn Roman-era traveler cloak, parchment scroll in hand",
        "appearance_constraints": "Scholarly intensity, well-traveled endurance, humble missionary presence",
        "negative_prompts": "medieval monk robes, modern books, spectacles"
    },
    "ABRAHAM": {
        "name": "Patriarch Abraham",
        "era": "Middle Bronze Age Mesopotamia / Canaan",
        "visual_signature": "Venerable patriarch, deep sun-baked complexion, long distinguished silver beard, noble posture, heavy wool nomadic mantle in undyed camel and sheep wool, gazing reverently toward starry night sky",
        "appearance_constraints": "Ancient Mesopotamian/Canaanite nomad patriarch authenticity",
        "negative_prompts": "modern tents, printed textiles, fantasy armor"
    },
    "MARY": {
        "name": "Mary (Mother of Jesus)",
        "era": "1st Century Nazareth",
        "visual_signature": "Young Jewish woman from Galilee, modest olive complexion, warm dark brown eyes, graceful and humble expression, simple soft blue head-covering (mitpachat) with natural ivory linen tunic",
        "appearance_constraints": "Humble grace, pure devotion, authentic 1st century Levantine village attire",
        "negative_prompts": "elaborate crown, modern makeup, European baroque dress"
    },
    "ELIJAH": {
        "name": "Prophet Elijah the Tishbite",
        "era": "9th Century BCE Kingdom of Israel",
        "visual_signature": "Intense wilderness prophet, rugged weathered appearance, untamed dark hair with silver streaks, rough garment of coarse camel hair with a broad leather belt, commanding prophetic posture",
        "appearance_constraints": "Ascetic desert prophet, uncompromising spiritual fire",
        "negative_prompts": "fine linen, royal palace furniture, clean salon grooming"
    }
}

def get_character_profile(name: str) -> Optional[Dict[str, Any]]:
    key = name.strip().upper()
    return CHARACTER_PROFILES.get(key)
