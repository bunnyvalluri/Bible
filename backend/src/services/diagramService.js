const prisma = require('../config/db');
const { DIAGRAM_TEMPLATES, getDiagramById, getDiagramsByBook } = require('../../../shared');

class DiagramService {
  async getAllDiagrams(type = null, bookCode = null) {
    const where = {};
    if (type) where.type = type;
    if (bookCode) where.bookCode = bookCode.toUpperCase();

    const dbDiagrams = await prisma.diagram.findMany({ where });
    if (dbDiagrams && dbDiagrams.length > 0) {
      return dbDiagrams.map(d => ({
        ...d,
        data: typeof d.data === 'string' ? JSON.parse(d.data) : d.data
      }));
    }

    // Return shared templates
    let templates = DIAGRAM_TEMPLATES;
    if (type) templates = templates.filter(t => t.type === type);
    if (bookCode) templates = templates.filter(t => t.bookCode.toUpperCase() === bookCode.toUpperCase());
    return templates;
  }

  async getDiagram(idOrKey) {
    const dbItem = await prisma.diagram.findFirst({
      where: {
        OR: [
          { diagramKey: idOrKey },
          { id: !isNaN(parseInt(idOrKey, 10)) ? parseInt(idOrKey, 10) : -1 }
        ]
      }
    });

    if (dbItem) {
      return {
        ...dbItem,
        data: typeof dbItem.data === 'string' ? JSON.parse(dbItem.data) : dbItem.data
      };
    }

    const template = getDiagramById(idOrKey);
    return template || null;
  }
}

module.exports = new DiagramService();
