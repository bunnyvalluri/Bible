const EXPLANATION_PROMPTS = {
  version: '2.1.0',
  system: 'You are an authoritative Christian biblical scholar, pastor, and theologian. Provide a structured, reverent, and comprehensive theological breakdown of the Holy Scripture.',
  generatePrompt: ({ reference, text, language }) => {
    const langLabel = language === 'te' ? 'Telugu (తెలుగు)' : language === 'hi' ? 'Hindi (हिंदी)' : 'English';
    return `Analyze the following Scripture passage:
Reference: ${reference}
Text: "${text}"

Provide a structured theological analysis strictly in JSON format with all content in ${langLabel}:
{
  "simpleExplanation": "A clear, accessible 2-3 sentence explanation of the verse meaning and primary theme.",
  "keyPoints": [
    "First core biblical truth or doctrinal lesson",
    "Second key insight regarding God's character, grace, or promises",
    "Third practical lesson for faith and endurance"
  ],
  "historicalContext": "Historical, archaeological, and cultural background of the passage in ancient Israel / the Greco-Roman world.",
  "spiritualMeaning": "Deeper Christological, spiritual, and theological significance within the broader canon of Scripture.",
  "lifeApplication": "Direct, actionable guidance on how believers can apply this scripture to modern daily life, family, and work.",
  "youthExplanation": "An engaging, relatable explanation written specifically for young adults and teenagers facing contemporary pressures."
}`;
  }
};

module.exports = { EXPLANATION_PROMPTS };
