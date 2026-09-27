/**
 * Preset and dynamic diagram models for rich visual biblical learning
 */

const DIAGRAM_TEMPLATES = [
  {
    id: 'creation-timeline',
    title: 'The Seven Days of Creation',
    titleTelugu: 'సృష్టి యొక్క ఏడు దినములు',
    titleHindi: 'सृष्टि के सात दिन',
    type: 'timeline',
    bookCode: 'GEN',
    chapter: 1,
    verses: 'GEN 1:1-31',
    description: 'Chronological progression of God speaking the cosmos into existence.',
    nodes: [
      { id: '1', title: 'Day 1: Light & Darkness', desc: 'Let there be light. Separation of light from darkness.', icon: 'Sun' },
      { id: '2', title: 'Day 2: Sky & Waters', desc: 'Creation of the firmament separating the waters above and below.', icon: 'Cloud' },
      { id: '3', title: 'Day 3: Land, Seas & Plants', desc: 'Dry land gathered, seas formed, vegetation and fruit trees.', icon: 'Trees' },
      { id: '4', title: 'Day 4: Sun, Moon & Stars', desc: 'Lights in the expanse for seasons, days, and years.', icon: 'Moon' },
      { id: '5', title: 'Day 5: Sea Creatures & Birds', desc: 'Teeming life in oceans and skies to multiply and fill the earth.', icon: 'Fish' },
      { id: '6', title: 'Day 6: Land Animals & Mankind', desc: 'Living creatures and mankind created in God’s own image.', icon: 'Users' },
      { id: '7', title: 'Day 7: Divine Sabbath Rest', desc: 'God rested from all His work, blessed the seventh day and sanctified it.', icon: 'Sparkles' }
    ]
  },
  {
    id: 'armor-of-god',
    title: 'The Full Armor of God',
    titleTelugu: 'సర్వాంగ కవచము',
    titleHindi: 'परमेश्वर के सारे हथियार',
    type: 'concept',
    bookCode: 'EPH',
    chapter: 6,
    verses: 'EPH 6:10-18',
    description: 'Spiritual defensive and offensive armaments for Christian discipleship.',
    nodes: [
      { id: 'belt', title: 'Belt of Truth', desc: 'Gird your loins with absolute integrity and divine truth.', category: 'Defense' },
      { id: 'breastplate', title: 'Breastplate of Righteousness', desc: 'Guarding the heart through Christ’s imputed righteousness.', category: 'Defense' },
      { id: 'shoes', title: 'Shoes of the Gospel of Peace', desc: 'Readiness to proclaim good news and stand firm.', category: 'Mobility' },
      { id: 'shield', title: 'Shield of Faith', desc: 'Extinguishing all the flaming darts of the evil one.', category: 'Defense' },
      { id: 'helmet', title: 'Helmet of Salvation', desc: 'Protecting the mind and thoughts with the assurance of redemption.', category: 'Defense' },
      { id: 'sword', title: 'Sword of the Spirit', desc: 'The spoken Word of God—the offensive power of truth.', category: 'Offense' },
      { id: 'prayer', title: 'Constant Prayer in the Spirit', desc: 'Alertness and persevering supplication for all saints.', category: 'Empowerment' }
    ]
  },
  {
    id: 'prodigal-son-map',
    title: 'Parable of the Prodigal Son: Character Dynamics',
    titleTelugu: 'తప్పిపోయిన కుమారుని ఉపమానము: సంబంధ చిత్రపటము',
    titleHindi: 'उड़ाऊ पुत्र का दृष्टान्त: संबंध रूपरेखा',
    type: 'relationship',
    bookCode: 'LUK',
    chapter: 15,
    verses: 'LUK 15:11-32',
    description: 'Relationships, motives, and redemption in Christ’s most famous parable.',
    nodes: [
      { id: 'father', title: 'The Compassionate Father', desc: 'Represents God’s boundless love, running to embrace the repentant.' },
      { id: 'younger_son', title: 'The Younger (Prodigal) Son', desc: 'Represents the rebel who squandered grace, humbled himself, and repented.' },
      { id: 'older_son', title: 'The Elder Brother', desc: 'Represents religious legalism, resentment, and lack of fraternal compassion.' },
      { id: 'distant_land', title: 'The Distant Country', desc: 'The illusion of autonomy leading to famine and desperation.' }
    ],
    links: [
      { source: 'father', target: 'younger_son', label: 'Unconditional Grace & Restoration' },
      { source: 'younger_son', target: 'distant_land', label: 'Departure & Squandering' },
      { source: 'younger_son', target: 'father', label: 'Repentant Return' },
      { source: 'older_son', target: 'father', label: 'Bitterness & Self-Righteousness' }
    ]
  },
  {
    id: 'beatitudes-mindmap',
    title: 'The Beatitudes: Architecture of the Blessed Life',
    titleTelugu: 'ధన్యతలు: ఆశీర్వదించబడిన జీవిత స్వభావము',
    titleHindi: 'धन्य वचन: आशीषमय जीवन की रूपरेखा',
    type: 'mindmap',
    bookCode: 'MAT',
    chapter: 5,
    verses: 'MAT 5:1-12',
    description: 'Core heart postures and corresponding kingdom rewards proclaimed on the Mount.',
    nodes: [
      { id: 'root', title: 'The Beatitudes (మత్తయి 5)', desc: 'Kingdom Constitution' },
      { id: 'b1', title: 'Poor in Spirit', desc: 'For theirs is the kingdom of heaven.', parent: 'root' },
      { id: 'b2', title: 'Those who Mourn', desc: 'For they shall be comforted.', parent: 'root' },
      { id: 'b3', title: 'The Meek', desc: 'For they shall inherit the earth.', parent: 'root' },
      { id: 'b4', title: 'Hunger for Righteousness', desc: 'For they shall be filled.', parent: 'root' },
      { id: 'b5', title: 'The Merciful', desc: 'For they shall obtain mercy.', parent: 'root' },
      { id: 'b6', title: 'Pure in Heart', desc: 'For they shall see God.', parent: 'root' },
      { id: 'b7', title: 'The Peacemakers', desc: 'For they shall be called sons of God.', parent: 'root' },
      { id: 'b8', title: 'Persecuted for Righteousness', desc: 'For theirs is the kingdom of heaven.', parent: 'root' }
    ]
  },
  {
    id: 'salvation-journey',
    title: 'The Romans Road: Step-by-Step Flowchart of Redemption',
    titleTelugu: 'రక్షణ మార్గము (రోమా పత్రిక ఆధారంగా)',
    titleHindi: 'उद्धार का मार्ग (रोमियों की पत्री)',
    type: 'flowchart',
    bookCode: 'ROM',
    chapter: 3,
    verses: 'ROM 3:23, 6:23, 5:8, 10:9, 8:1',
    description: 'Logical steps from human condition to eternal life in Jesus Christ.',
    nodes: [
      { id: 's1', step: '1', title: 'Universal Need (Romans 3:23)', desc: 'For all have sinned and fall short of the glory of God.' },
      { id: 's2', step: '2', title: 'The Consequence (Romans 6:23a)', desc: 'For the wages of sin is death, but the gift of God is eternal life.' },
      { id: 's3', step: '3', title: 'Divine Demonstration (Romans 5:8)', desc: 'While we were yet sinners, Christ died for us.' },
      { id: 's4', step: '4', title: 'Personal Confession (Romans 10:9-10)', desc: 'Confess with your mouth Jesus as Lord and believe in your heart.' },
      { id: 's5', step: '5', title: 'No Condemnation (Romans 8:1)', desc: 'There is now no condemnation for those who are in Christ Jesus.' }
    ]
  }
];

function getDiagramsByBook(bookCode) {
  if (!bookCode) return DIAGRAM_TEMPLATES;
  return DIAGRAM_TEMPLATES.filter(d => d.bookCode.toUpperCase() === bookCode.toUpperCase());
}

function getDiagramById(id) {
  return DIAGRAM_TEMPLATES.find(d => d.id === id);
}

module.exports = {
  DIAGRAM_TEMPLATES,
  getDiagramsByBook,
  getDiagramById
};
