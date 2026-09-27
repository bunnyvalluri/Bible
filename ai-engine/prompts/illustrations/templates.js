const STORY_ILLUSTRATION_PROMPT = {
  version: '1.0.0',
  generatePrompt: ({ storyTitle, keyMoment, reference }) => {
    return `Create an educational 16:9 hand-drawn story illustration for the biblical narrative of "${storyTitle}" (${reference}).
Key Dramatic / Spiritual Turning Point: "${keyMoment}"
Style: Vachanam Bible Illustration Style - warm, editorial, thoughtful narrative composition, reverent and historically mindful.`;
  }
};

const CONCEPT_ILLUSTRATION_PROMPT = {
  version: '1.0.0',
  generatePrompt: ({ conceptName, theologicalIdea, visualMetaphor }) => {
    return `Create a 16:9 editorial concept illustration explaining the theological principle of "${conceptName}".
Core Idea: "${theologicalIdea}"
Visual Metaphor: "${visualMetaphor}"
Style: Clean minimalist linework with warm gouache texture. Explains the spiritual dynamic clearly without visual noise.`;
  }
};

const CHARACTER_ILLUSTRATION_PROMPT = {
  version: '1.0.0',
  generatePrompt: ({ characterName, biblicalRole, keyEvent }) => {
    return `Create a dignified, reverent 16:9 editorial character illustration for "${characterName}" (${biblicalRole}).
Context / Life Focus: "${keyEvent}"
Style: Vachanam Bible Illustration Style - respectful, authentic ancient Near Eastern / Mediterranean attire, noble and humble posture.`;
  }
};

const HISTORICAL_ILLUSTRATION_PROMPT = {
  version: '1.0.0',
  generatePrompt: ({ era, location, historicalContext }) => {
    return `Create an educational 16:9 historical background illustration depicting "${location}" during "${era}".
Context: "${historicalContext}"
Style: Architectural and cultural accuracy based on biblical archaeology, warm parchment tones, educational and grounded.`;
  }
};

const YOUTH_ILLUSTRATION_PROMPT = {
  version: '1.0.0',
  generatePrompt: ({ topic, modernRelatability, biblicalPrinciple }) => {
    return `Create an engaging, relatable 16:9 youth-focused illustration for "${topic}".
Biblical Foundation: "${biblicalPrinciple}"
Relatable Analogy: "${modernRelatability}"
Style: Warm, approachable hand-drawn illustration that connects timeless biblical wisdom with real-world student and youth life.`;
  }
};

const QA_PROMPT = {
  version: '1.0.0',
  generatePrompt: ({ illustrationData }) => {
    return `Evaluate the generated Bible illustration for theological accuracy, reverent tone, 16:9 composition, and biblical safety.`;
  }
};

module.exports = {
  STORY_ILLUSTRATION_PROMPT,
  CONCEPT_ILLUSTRATION_PROMPT,
  CHARACTER_ILLUSTRATION_PROMPT,
  HISTORICAL_ILLUSTRATION_PROMPT,
  YOUTH_ILLUSTRATION_PROMPT,
  QA_PROMPT
};
