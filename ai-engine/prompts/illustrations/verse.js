const VERSE_ILLUSTRATION_PROMPT = {
  version: '1.0.0',
  system: 'You are creating a reverent, clean, educational Bible illustration adhering to the Vachanam Bible Illustration Style.',
  generatePrompt: ({ reference, text, theme, visualMetaphor, language = 'en' }) => {
    return `Create a clean 16:9 hand-drawn editorial Bible illustration communicating the core spiritual concept of ${reference}.
Scripture Reference: ${reference}
Theme: "${theme || 'God\'s Truth and Grace'}"
Visual Metaphor / Concept: "${visualMetaphor || 'A glowing pathway of truth guiding weary travelers across rough terrain'}"

Style Guidelines (Vachanam Bible Illustration Style):
- 16:9 widescreen composition (1920x1080)
- Minimalist editorial line art with warm, reverent watercolor/pastel tones (deep blue, warm cream, gentle gold accents)
- Hand-drawn educational aesthetic; avoid cluttered or hyper-realistic AI chaos
- Clear focal point and visual hierarchy representing the cognitive idea behind the verse
- Wide negative space allowing for non-intrusive scripture typography overlay
- STRICT BIBLICAL SANCTITY: No caricatures, no mockery, no modern anachronisms, respectful and honorable depiction.`;
  }
};

module.exports = { VERSE_ILLUSTRATION_PROMPT };
