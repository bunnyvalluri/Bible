const searchService = require('../services/searchService');
const { successResponse } = require('../utils/response');

class SearchController {
  async search(req, res, next) {
    try {
      const { q, query, lang, language, book, testament, page, limit } = req.query;
      const searchQuery = q || query || '';
      const selectedLang = lang || language || 'all';

      const results = await searchService.search({
        query: searchQuery,
        language: selectedLang,
        bookCode: book,
        testament,
        page: parseInt(page || '1', 10),
        limit: parseInt(limit || '20', 10)
      });

      return successResponse(res, results, 'Search executed successfully');
    } catch (err) {
      next(err);
    }
  }

  async getSuggestions(req, res, next) {
    try {
      const { q, lang } = req.query;
      const suggestions = await searchService.getSuggestions(q, lang);
      return successResponse(res, suggestions, 'Suggestions retrieved');
    } catch (err) {
      next(err);
    }
  }

  async getPopular(req, res, next) {
    try {
      const popular = searchService.getPopularSearches();
      return successResponse(res, popular, 'Popular searches retrieved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SearchController();
