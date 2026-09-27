const { VerificationPipeline } = require('./VerificationPipeline');

function createDiagramVerifier() {
  const pipeline = new VerificationPipeline('DiagramVerifier');

  pipeline.addRule('ValidDiagramType', (data) => {
    const validTypes = ['flowchart', 'timeline', 'relationship', 'infographic', 'mindmap', 'concept', 'journey'];
    return data && validTypes.includes(data.type);
  });

  pipeline.addRule('ValidGraphStructure', (data) => {
    if (!data.data) return false;
    let parsed = data.data;
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        return false;
      }
    }
    // Must contain nodes or steps
    return (Array.isArray(parsed.nodes) && parsed.nodes.length > 0) ||
           (Array.isArray(parsed.steps) && parsed.steps.length > 0) ||
           (Array.isArray(parsed.items) && parsed.items.length > 0);
  });

  return pipeline;
}

function createImageVerifier() {
  const pipeline = new VerificationPipeline('ImageVerifier');

  pipeline.addRule('ValidImageProperties', (data) => {
    if (!data || !data.imageUrl) return false;
    const isHttp = data.imageUrl.startsWith('http://') || data.imageUrl.startsWith('https://') || data.imageUrl.startsWith('data:image/');
    return isHttp && data.prompt && data.prompt.length > 5;
  });

  return pipeline;
}

function createBibleTextVerifier() {
  const pipeline = new VerificationPipeline('BibleTextVerifier');

  pipeline.addRule('ValidCanonicalStructure', (data) => {
    if (!data.bookCode || !data.chapterNumber || !data.verseNumber) return false;
    if (data.chapterNumber < 1 || data.verseNumber < 1) return false;
    return true;
  });

  pipeline.addRule('TextAvailability', (data) => {
    return (data.textTelugu && data.textTelugu.trim().length > 0) ||
           (data.textEnglish && data.textEnglish.trim().length > 0) ||
           (data.textHindi && data.textHindi.trim().length > 0);
  });

  return pipeline;
}

module.exports = {
  createDiagramVerifier,
  createImageVerifier,
  createBibleTextVerifier,
  defaultDiagramVerifier: createDiagramVerifier(),
  defaultImageVerifier: createImageVerifier(),
  defaultBibleTextVerifier: createBibleTextVerifier()
};
