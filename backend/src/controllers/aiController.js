const aiService = require('../services/aiService');
const diagramService = require('../services/diagramService');
const { successResponse, errorResponse } = require('../utils/response');

class AIController {
  async getVerseExplanation(req, res, next) {
    try {
      const { verseKey } = req.params;
      const { lang = 'en', refresh = 'false' } = req.query;
      const forceRefresh = refresh === 'true' || refresh === '1';

      const explanation = await aiService.getVerseExplanation(verseKey, lang, forceRefresh);
      return successResponse(res, explanation, 'Verse explanation retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getDiagrams(req, res, next) {
    try {
      const { type, book } = req.query;
      const diagrams = await diagramService.getAllDiagrams(type, book);
      return successResponse(res, diagrams, 'Diagrams retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  async getDiagramById(req, res, next) {
    try {
      const { id } = req.params;
      const diagram = await diagramService.getDiagram(id);
      if (!diagram) {
        return errorResponse(res, `Diagram not found: ${id}`, 404);
      }
      return successResponse(res, diagram, 'Diagram retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AIController();
