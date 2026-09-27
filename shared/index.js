const books = require('./src/books');
const constants = require('./src/constants');
const readingPlans = require('./src/readingPlans');
const diagramTemplates = require('./src/diagramTemplates');

const shared = {
  ...books,
  ...constants,
  ...readingPlans,
  ...diagramTemplates
};

module.exports = shared;
