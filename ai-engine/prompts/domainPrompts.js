const DIAGRAM_PROMPTS = {
  version: '1.2.0',
  generatePrompt: ({ passage, diagramType }) => {
    return `Generate an interactive ${diagramType} diagram structure for biblical passage: ${passage}.
Output strictly valid JSON:
{
  "type": "${diagramType}",
  "title": "Diagram Title",
  "data": {
    "nodes": [
      { "id": "1", "label": "Initial Stage / Principle", "description": "Details" },
      { "id": "2", "label": "Spiritual Growth / Turning Point", "description": "Details" }
    ],
    "links": [
      { "source": "1", "target": "2", "label": "Leads to" }
    ]
  }
}`;
  }
};

const IMAGE_PROMPTS = {
  version: '1.5.0',
  generatePrompt: ({ reference, theme, style = 'biblical-oil-painting' }) => {
    return `Masterpiece biblical artwork illustrating ${reference}, theme: "${theme}". Style: ${style}, soft divine radiant volumetric lighting, Rembrandt chiaroscuro, cinematic landscape composition with ample negative space for typography overlay, 8k resolution, serene reverent atmosphere, no modern artifacts.`;
  }
};

const DAILY_VERSE_PROMPTS = {
  version: '1.1.0',
  generateCurationPrompt: ({ season, date }) => {
    return `Select a spiritually uplifting, faith-building Bible verse for date: ${date}. Provide theme and focus points.`;
  }
};

module.exports = {
  DIAGRAM_PROMPTS,
  IMAGE_PROMPTS,
  DAILY_VERSE_PROMPTS
};
