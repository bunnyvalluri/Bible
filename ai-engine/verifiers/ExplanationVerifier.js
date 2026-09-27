const { VerificationPipeline } = require('./VerificationPipeline');

function createExplanationVerifier() {
  const pipeline = new VerificationPipeline('ExplanationVerifier');

  // Rule 1: Structural Completeness
  pipeline.addRule('CheckRequiredDimensions', (data) => {
    if (!data || typeof data !== 'object') return false;
    const requiredKeys = [
      'simpleExplanation',
      'keyPoints',
      'historicalContext',
      'spiritualMeaning',
      'lifeApplication',
      'youthExplanation'
    ];
    for (const key of requiredKeys) {
      if (!data[key] || typeof data[key] !== (key === 'keyPoints' ? 'object' : 'string')) {
        return false;
      }
    }
    return true;
  });

  // Rule 2: Minimum Content Length
  pipeline.addRule('CheckContentDepth', (data) => {
    if (data.simpleExplanation.trim().length < 15) return false;
    if (data.spiritualMeaning.trim().length < 15) return false;
    if (data.lifeApplication.trim().length < 15) return false;
    return true;
  });

  // Rule 3: Key Points Array Integrity
  pipeline.addRule('CheckKeyPointsCount', (data) => {
    const points = Array.isArray(data.keyPoints)
      ? data.keyPoints
      : (typeof data.keyPoints === 'string' ? JSON.parse(data.keyPoints) : []);
    return Array.isArray(points) && points.length >= 2;
  });

  // Rule 4: Profanity & Offense Check
  pipeline.addRule('BiblicalSanctityFilter', (data) => {
    const prohibitedWords = ['mockery', 'profane', 'vulgar', 'hate_speech'];
    const textCorpus = JSON.stringify(data).toLowerCase();
    for (const bad of prohibitedWords) {
      if (textCorpus.includes(bad)) return false;
    }
    return true;
  });

  return pipeline;
}

module.exports = {
  createExplanationVerifier,
  defaultExplanationVerifier: createExplanationVerifier()
};
