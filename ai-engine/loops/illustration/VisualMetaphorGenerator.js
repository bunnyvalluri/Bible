/**
 * VisualMetaphorGenerator — Formulates clear, educational visual metaphors for biblical concepts
 */
class VisualMetaphorGenerator {
  generate({ analysis, illustrationType = 'verse' }) {
    const theme = (analysis.theme || '').toLowerCase();

    // Available Metaphor Structures
    let metaphorStructure = 'Path';
    let visualDescription = 'A gentle radiant path winding through ancient rolling hills towards dawn.';
    let focalElements = ['Radiant pathway', 'Quiet hills', 'Warm dawn horizon', 'Soft golden light'];
    let colorPalette = ['Deep Navy (#0c1a38)', 'Warm Cream (#faf7f2)', 'Golden Ocre (#d4af37)', 'Soft Sage (#8ea89d)'];

    if (theme.includes('love') || theme.includes('salvation')) {
      metaphorStructure = 'Bridge';
      visualDescription = 'A glowing wooden bridge of grace spanning a deep chasm, connecting broken terrain to lush green pastures flooded with sunrise.';
      focalElements = ['Bridge of grace', 'Deep chasm', 'Sunlit horizon', 'Olive branches'];
      colorPalette = ['Warm Amber', 'Deep Royal Blue', 'Cream', 'Gentle Rose Gold'];
    } else if (theme.includes('guidance') || theme.includes('light')) {
      metaphorStructure = 'Light & Lamp';
      visualDescription = 'An ancient oil lamp casting warm, stepping-stone circles of light along a rocky pathway under a peaceful starry sky.';
      focalElements = ['Ancient clay lamp', 'Stone steps', 'Volumetric warm beam', 'Constellations'];
      colorPalette = ['Night Sky Blue', 'Warm Lantern Gold', 'Parchment Cream'];
    } else if (theme.includes('peace') || theme.includes('care') || theme.includes('shepherd')) {
      metaphorStructure = 'River & Tree';
      visualDescription = 'A deep-rooted cedar tree flourishing beside calm, mirror-like living waters with gentle pastoral green slopes.';
      focalElements = ['Flourishing tree by water', 'Still stream', 'Soft morning mist', 'Pastoral meadows'];
      colorPalette = ['Emerald Green', 'Soft Sky Blue', 'Earth Ochre', 'Warm White'];
    } else if (theme.includes('faith') || theme.includes('endurance')) {
      metaphorStructure = 'Mountain & Anchor';
      visualDescription = 'A steadfast mountain fortress standing unshaken amidst swirling mist, grounded upon an ancient stone foundation.';
      focalElements = ['Unshakable rock fortress', 'Morning clouds', 'Firm foundation', 'Golden crest'];
      colorPalette = ['Granite Slate', 'Sunrise Gold', 'Deep Indigo', 'Soft Alabaster'];
    } else if (illustrationType === 'concept') {
      metaphorStructure = 'Seed & Growth';
      visualDescription = 'A tiny golden seed bursting with life, sending vibrant green shoots and blossoms upward through fertile soil.';
      focalElements = ['Sprouting seed', 'Sunbeams', 'Fertile earth', 'Living leaf canopy'];
      colorPalette = ['Forest Green', 'Sunlit Gold', 'Warm Terracotta'];
    }

    return {
      metaphorStructure,
      visualDescription,
      focalElements,
      colorPalette,
      compositionLayout: '16:9 Landscape with off-center focal weight and clean negative space for typography overlay.'
    };
  }
}

module.exports = {
  VisualMetaphorGenerator,
  defaultVisualMetaphorGenerator: new VisualMetaphorGenerator()
};
