/**
 * ContentAnalyzer — Breaks down Bible passages into cognitive and theological primitives
 */
class ContentAnalyzer {
  analyze({ reference, text, bookCode, chapterNumber, verseNumber }) {
    const lower = (text || '').toLowerCase();

    // Thematic & Cognitive Extraction
    let theme = 'God’s Faithfulness & Covenant';
    let subject = 'God';
    let action = 'reveals & redeems';
    let target = 'humanity';
    let result = 'spiritual transformation';
    let tone = 'reverent';

    if (lower.includes('love') || lower.includes('ప్రేమ') || lower.includes('प्रेम')) {
      theme = 'God’s Sacrificial Love';
      subject = 'God the Father / Jesus Christ';
      action = 'gives & forgives unconditionally';
      target = 'the world and all believers';
      result = 'eternal life and reconciliation';
      tone = 'compassionate & hopeful';
    } else if (lower.includes('light') || lower.includes('వెలుగు') || lower.includes('ज्योति') || lower.includes('lamp') || lower.includes('దీపము')) {
      theme = 'Divine Guidance & Illumination';
      subject = 'The Word of God';
      action = 'illuminates darkness';
      target = 'the believer’s pathway';
      result = 'moral clarity and wisdom';
      tone = 'inspiring & reassuring';
    } else if (lower.includes('peace') || lower.includes('సమాధానము') || lower.includes('शांति') || lower.includes('rest')) {
      theme = 'Transcendent Peace';
      subject = 'The Holy Spirit';
      action = 'quiets anxiety and protects the heart';
      target = 'the troubled soul';
      result = 'inner stillness and quiet confidence';
      tone = 'calm & meditative';
    } else if (lower.includes('faith') || lower.includes('విశ్వాసము') || lower.includes('विश्वास')) {
      theme = 'Steadfast Faith & Endurance';
      subject = 'The Believer';
      action = 'trusts in the unseen promises of God';
      target = 'unshakable spiritual foundation';
      result = 'victory over trials';
      tone = 'courageous & resolute';
    } else if (lower.includes('shepherd') || lower.includes('కాపరి') || lower.includes('चरवाहा')) {
      theme = 'Divine Care & Protection';
      subject = 'The Good Shepherd';
      action = 'guides, feeds, and restores';
      target = 'His flock';
      result = 'abundant safety and provision';
      tone = 'tender & pastoral';
    }

    return {
      reference: reference || `${bookCode} ${chapterNumber}:${verseNumber}`,
      theme,
      subject,
      action,
      target,
      result,
      tone,
      theologicalConcept: `${theme}: ${subject} ${action} towards ${target} resulting in ${result}.`
    };
  }
}

module.exports = {
  ContentAnalyzer,
  defaultContentAnalyzer: new ContentAnalyzer()
};
