/**
 * Complete Canonical 66 Books of the Holy Bible
 * Fully mapped with English, Telugu (తెలుగు), and Hindi (हिंदी) metadata
 */

const BIBLE_BOOKS = [
  // OLD TESTAMENT (పాత నిబంధన / पुराना नियम) - 39 Books
  // Pentateuch / Law (ధర్మశాస్త్ర గ్రంథములు / व्यवस्था)
  { id: 1, code: 'GEN', english: 'Genesis', telugu: 'ఆదికాండము', hindi: 'उत्पत्ति', testament: 'OT', chapters: 50, category: 'Law', shortCode: 'Gen' },
  { id: 2, code: 'EXO', english: 'Exodus', telugu: 'నిర్గమకాండము', hindi: 'निर्गमन', testament: 'OT', chapters: 40, category: 'Law', shortCode: 'Exod' },
  { id: 3, code: 'LEV', english: 'Leviticus', telugu: 'లేవీయకాండము', hindi: 'लैव्यव्यवस्था', testament: 'OT', chapters: 27, category: 'Law', shortCode: 'Lev' },
  { id: 4, code: 'NUM', english: 'Numbers', telugu: 'సంఖ్యాకాండము', hindi: 'गिनती', testament: 'OT', chapters: 36, category: 'Law', shortCode: 'Num' },
  { id: 5, code: 'DEU', english: 'Deuteronomy', telugu: 'ద్వితీయోపదేశకాండము', hindi: 'व्यवस्थाविवरण', testament: 'OT', chapters: 34, category: 'Law', shortCode: 'Deut' },

  // Historical Books (చారిత్రక గ్రంథములు / ऐतिहासिक पुस्तकें)
  { id: 6, code: 'JOS', english: 'Joshua', telugu: 'యెహోషువ', hindi: 'यहोशू', testament: 'OT', chapters: 24, category: 'History', shortCode: 'Josh' },
  { id: 7, code: 'JDG', english: 'Judges', telugu: 'న్యాయాధిపతులు', hindi: 'न्यायियों', testament: 'OT', chapters: 21, category: 'History', shortCode: 'Judg' },
  { id: 8, code: 'RUT', english: 'Ruth', telugu: 'రూతు', hindi: 'रूत', testament: 'OT', chapters: 4, category: 'History', shortCode: 'Ruth' },
  { id: 9, code: '1SA', english: '1 Samuel', telugu: '1 సమూయేలు', hindi: '1 शमूएल', testament: 'OT', chapters: 31, category: 'History', shortCode: '1Sam' },
  { id: 10, code: '2SA', english: '2 Samuel', telugu: '2 సమూయేలు', hindi: '2 शमूएल', testament: 'OT', chapters: 24, category: 'History', shortCode: '2Sam' },
  { id: 11, code: '1KI', english: '1 Kings', telugu: '1 రాజులు', hindi: '1 राजा', testament: 'OT', chapters: 22, category: 'History', shortCode: '1Kgs' },
  { id: 12, code: '2KI', english: '2 Kings', telugu: '2 రాజులు', hindi: '2 राजा', testament: 'OT', chapters: 25, category: 'History', shortCode: '2Kgs' },
  { id: 13, code: '1CH', english: '1 Chronicles', telugu: '1 దినవృత్తాంతములు', hindi: '1 इतिहास', testament: 'OT', chapters: 29, category: 'History', shortCode: '1Chr' },
  { id: 14, code: '2CH', english: '2 Chronicles', telugu: '2 దినవృత్తాంతములు', hindi: '2 इतिहास', testament: 'OT', chapters: 36, category: 'History', shortCode: '2Chr' },
  { id: 15, code: 'EZR', english: 'Ezra', telugu: 'ఎజ్రా', hindi: 'एज्रा', testament: 'OT', chapters: 10, category: 'History', shortCode: 'Ezra' },
  { id: 16, code: 'NEH', english: 'Nehemiah', telugu: 'నెహెమ్యా', hindi: 'नहेमायाह', testament: 'OT', chapters: 13, category: 'History', shortCode: 'Neh' },
  { id: 17, code: 'EST', english: 'Esther', telugu: 'ఎస్తేరు', hindi: 'एस्तेर', testament: 'OT', chapters: 10, category: 'History', shortCode: 'Esth' },

  // Poetry & Wisdom (కావ్య / జ్ఞాన గ్రంథములు / काव्य और बुद्धि)
  { id: 18, code: 'JOB', english: 'Job', telugu: 'యోబు', hindi: 'अय्यूब', testament: 'OT', chapters: 42, category: 'Poetry', shortCode: 'Job' },
  { id: 19, code: 'PSA', english: 'Psalms', telugu: 'కీర్తనలు', hindi: 'भजन संहिता', testament: 'OT', chapters: 150, category: 'Poetry', shortCode: 'Ps' },
  { id: 20, code: 'PRO', english: 'Proverbs', telugu: 'సామెతలు', hindi: 'नीतिवचन', testament: 'OT', chapters: 31, category: 'Poetry', shortCode: 'Prov' },
  { id: 21, code: 'ECC', english: 'Ecclesiastes', telugu: 'ప్రసంగి', hindi: 'सभोपदेशक', testament: 'OT', chapters: 12, category: 'Poetry', shortCode: 'Eccl' },
  { id: 22, code: 'SNG', english: 'Song of Solomon', telugu: 'పరమగీతము', hindi: 'श्रेष्ठगीत', testament: 'OT', chapters: 8, category: 'Poetry', shortCode: 'Song' },

  // Major Prophets (పెద్ద ప్రవక్తలు / प्रमुख भविष्यद्वक्ता)
  { id: 23, code: 'ISA', english: 'Isaiah', telugu: 'యెషయా', hindi: 'यशायाह', testament: 'OT', chapters: 66, category: 'Major Prophets', shortCode: 'Isa' },
  { id: 24, code: 'JER', english: 'Jeremiah', telugu: 'యిర్మీయా', hindi: 'यिर्मयाह', testament: 'OT', chapters: 52, category: 'Major Prophets', shortCode: 'Jer' },
  { id: 25, code: 'LAM', english: 'Lamentations', telugu: 'విలాపవాక్యములు', hindi: 'विलापगीत', testament: 'OT', chapters: 5, category: 'Major Prophets', shortCode: 'Lam' },
  { id: 26, code: 'EZK', english: 'Ezekiel', telugu: 'యెహెజ్కేలు', hindi: 'यहेजकेल', testament: 'OT', chapters: 48, category: 'Major Prophets', shortCode: 'Ezek' },
  { id: 27, code: 'DAN', english: 'Daniel', telugu: 'దానియేలు', hindi: 'दानिय्येल', testament: 'OT', chapters: 12, category: 'Major Prophets', shortCode: 'Dan' },

  // Minor Prophets (చిన్న ప్రవక్తలు / लघु भविष्यद्वक्ता)
  { id: 28, code: 'HOS', english: 'Hosea', telugu: 'హోషేయ', hindi: 'होशे', testament: 'OT', chapters: 14, category: 'Minor Prophets', shortCode: 'Hos' },
  { id: 29, code: 'JOL', english: 'Joel', telugu: 'యోవేలు', hindi: 'योएल', testament: 'OT', chapters: 3, category: 'Minor Prophets', shortCode: 'Joel' },
  { id: 30, code: 'AMO', english: 'Amos', telugu: 'ఆమోసు', hindi: 'आमोस', testament: 'OT', chapters: 9, category: 'Minor Prophets', shortCode: 'Amos' },
  { id: 31, code: 'OBA', english: 'Obadiah', telugu: 'ఓబద్యా', hindi: 'ओबद्याह', testament: 'OT', chapters: 1, category: 'Minor Prophets', shortCode: 'Obad' },
  { id: 32, code: 'JON', english: 'Jonah', telugu: 'యోనా', hindi: 'योना', testament: 'OT', chapters: 4, category: 'Minor Prophets', shortCode: 'Jonah' },
  { id: 33, code: 'MIC', english: 'Micah', telugu: 'మీకా', hindi: 'मीका', testament: 'OT', chapters: 7, category: 'Minor Prophets', shortCode: 'Mic' },
  { id: 34, code: 'NAM', english: 'Nahum', telugu: 'నహూము', hindi: 'नहूम', testament: 'OT', chapters: 3, category: 'Minor Prophets', shortCode: 'Nah' },
  { id: 35, code: 'HAB', english: 'Habakkuk', telugu: 'హబక్కూకు', hindi: 'हबक्कूक', testament: 'OT', chapters: 3, category: 'Minor Prophets', shortCode: 'Hab' },
  { id: 36, code: 'ZEP', english: 'Zephaniah', telugu: 'జెఫన్యా', hindi: 'सपन्याह', testament: 'OT', chapters: 3, category: 'Minor Prophets', shortCode: 'Zeph' },
  { id: 37, code: 'HAG', english: 'Haggai', telugu: 'హగ్గయి', hindi: 'हाग्गै', testament: 'OT', chapters: 2, category: 'Minor Prophets', shortCode: 'Hag' },
  { id: 38, code: 'ZEC', english: 'Zechariah', telugu: 'జెకర్యా', hindi: 'जकर्याह', testament: 'OT', chapters: 14, category: 'Minor Prophets', shortCode: 'Zech' },
  { id: 39, code: 'MAL', english: 'Malachi', telugu: 'మలాకీ', hindi: 'मलाकी', testament: 'OT', chapters: 4, category: 'Minor Prophets', shortCode: 'Mal' },

  // NEW TESTAMENT (క్రొత్త నిబంధన / नया नियम) - 27 Books
  // Gospels (సువార్తలు / सुसमाचार)
  { id: 40, code: 'MAT', english: 'Matthew', telugu: 'మత్తయి సువార్త', hindi: 'मत्ती', testament: 'NT', chapters: 28, category: 'Gospels', shortCode: 'Matt' },
  { id: 41, code: 'MRK', english: 'Mark', telugu: 'మార్కు సువార్త', hindi: 'मरकुस', testament: 'NT', chapters: 16, category: 'Gospels', shortCode: 'Mark' },
  { id: 42, code: 'LUK', english: 'Luke', telugu: 'లూకా సువార్త', hindi: 'लूका', testament: 'NT', chapters: 24, category: 'Gospels', shortCode: 'Luke' },
  { id: 43, code: 'JHN', english: 'John', telugu: 'యోహాను సువార్త', hindi: 'यूहन्ना', testament: 'NT', chapters: 21, category: 'Gospels', shortCode: 'John' },

  // Church History (అపొస్తలుల కార్యములు / प्रेरितों के काम)
  { id: 44, code: 'ACT', english: 'Acts', telugu: 'అపొస్తలుల కార్యములు', hindi: 'प्रेरितों के काम', testament: 'NT', chapters: 28, category: 'Church History', shortCode: 'Acts' },

  // Pauline Epistles (పౌలు పత్రికలు / पौलुस की पत्रियाँ)
  { id: 45, code: 'ROM', english: 'Romans', telugu: 'రోమీయులకు', hindi: 'रोमियों', testament: 'NT', chapters: 16, category: 'Pauline Epistles', shortCode: 'Rom' },
  { id: 46, code: '1CO', english: '1 Corinthians', telugu: '1 కొరింథీయులకు', hindi: '1 कुरिन्थियों', testament: 'NT', chapters: 16, category: 'Pauline Epistles', shortCode: '1Cor' },
  { id: 47, code: '2CO', english: '2 Corinthians', telugu: '2 కొరింథీయులకు', hindi: '2 कुरिन्थियों', testament: 'NT', chapters: 13, category: 'Pauline Epistles', shortCode: '2Cor' },
  { id: 48, code: 'GAL', english: 'Galatians', telugu: 'గలతీయులకు', hindi: 'गलातियों', testament: 'NT', chapters: 6, category: 'Pauline Epistles', shortCode: 'Gal' },
  { id: 49, code: 'EPH', english: 'Ephesians', telugu: 'ఎఫెసీయులకు', hindi: 'इफिसियों', testament: 'NT', chapters: 6, category: 'Pauline Epistles', shortCode: 'Eph' },
  { id: 50, code: 'PHP', english: 'Philippians', telugu: 'ఫిలిప్పీయులకు', hindi: 'फिलिप्पियों', testament: 'NT', chapters: 4, category: 'Pauline Epistles', shortCode: 'Phil' },
  { id: 51, code: 'COL', english: 'Colossians', telugu: 'కొలొస్సయులకు', hindi: 'कुलुस्सियों', testament: 'NT', chapters: 4, category: 'Pauline Epistles', shortCode: 'Col' },
  { id: 52, code: '1TH', english: '1 Thessalonians', telugu: '1 థెస్సలొనీకయులకు', hindi: '1 थिस्सलुनीकियों', testament: 'NT', chapters: 5, category: 'Pauline Epistles', shortCode: '1Thess' },
  { id: 53, code: '2TH', english: '2 Thessalonians', telugu: '2 థెస్సలొనీకయులకు', hindi: '2 थिस्सलुनीकियों', testament: 'NT', chapters: 3, category: 'Pauline Epistles', shortCode: '2Thess' },
  { id: 54, code: '1TI', english: '1 Timothy', telugu: '1 తిమోతికి', hindi: '1 तीमुथियुस', testament: 'NT', chapters: 6, category: 'Pauline Epistles', shortCode: '1Tim' },
  { id: 55, code: '2TI', english: '2 Timothy', telugu: '2 తిమోతికి', hindi: '2 तीमुथियुस', testament: 'NT', chapters: 4, category: 'Pauline Epistles', shortCode: '2Tim' },
  { id: 56, code: 'TIT', english: 'Titus', telugu: 'తీతుకు', hindi: 'तीतुस', testament: 'NT', chapters: 3, category: 'Pauline Epistles', shortCode: 'Titus' },
  { id: 57, code: 'PHM', english: 'Philemon', telugu: 'ఫిలేమోనుకు', hindi: 'फिलेमोन', testament: 'NT', chapters: 1, category: 'Pauline Epistles', shortCode: 'Phlm' },

  // General Epistles (సాధారణ పత్రికలు / सामान्य पत्रियाँ)
  { id: 58, code: 'HEB', english: 'Hebrews', telugu: 'హెబ్రీయులకు', hindi: 'इब्रानियों', testament: 'NT', chapters: 13, category: 'General Epistles', shortCode: 'Heb' },
  { id: 59, code: 'JAS', english: 'James', telugu: 'యాకోబు', hindi: 'याकूब', testament: 'NT', chapters: 5, category: 'General Epistles', shortCode: 'Jas' },
  { id: 60, code: '1PE', english: '1 Peter', telugu: '1 పేతురు', hindi: '1 पतरस', testament: 'NT', chapters: 5, category: 'General Epistles', shortCode: '1Pet' },
  { id: 61, code: '2PE', english: '2 Peter', telugu: '2 పేతురు', hindi: '2 पतरस', testament: 'NT', chapters: 3, category: 'General Epistles', shortCode: '2Pet' },
  { id: 62, code: '1JN', english: '1 John', telugu: '1 యోహాను', hindi: '1 यूहन्ना', testament: 'NT', chapters: 5, category: 'General Epistles', shortCode: '1John' },
  { id: 63, code: '2JN', english: '2 John', telugu: '2 యోహాను', hindi: '2 यूहन्ना', testament: 'NT', chapters: 1, category: 'General Epistles', shortCode: '2John' },
  { id: 64, code: '3JN', english: '3 John', telugu: '3 యోహాను', hindi: '3 यूहन्ना', testament: 'NT', chapters: 1, category: 'General Epistles', shortCode: '3John' },
  { id: 65, code: 'JUD', english: 'Jude', telugu: 'యూదా', hindi: 'यहूदा', testament: 'NT', chapters: 1, category: 'General Epistles', shortCode: 'Jude' },

  // Prophecy (ప్రకటన గ్రంథము / भविष्यवाणी)
  { id: 66, code: 'REV', english: 'Revelation', telugu: 'ప్రకటన గ్రంథము', hindi: 'प्रकाशितवाक्य', testament: 'NT', chapters: 22, category: 'Prophecy', shortCode: 'Rev' }
];

function getBookById(id) {
  const num = parseInt(id, 10);
  return BIBLE_BOOKS.find(b => b.id === num);
}

function getBookByCode(code) {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  return BIBLE_BOOKS.find(b => b.code.toUpperCase() === upper || b.shortCode.toUpperCase() === upper);
}

function getBookByName(name, lang = 'en') {
  if (!name) return null;
  const q = name.trim().toLowerCase();
  return BIBLE_BOOKS.find(b => 
    b.english.toLowerCase() === q ||
    b.telugu.toLowerCase() === q ||
    b.hindi.toLowerCase() === q ||
    b.code.toLowerCase() === q
  );
}

function getBookName(book, lang = 'en') {
  if (!book) return '';
  if (lang === 'te') return book.telugu || book.english;
  if (lang === 'hi') return book.hindi || book.english;
  return book.english;
}

module.exports = {
  BIBLE_BOOKS,
  getBookById,
  getBookByCode,
  getBookByName,
  getBookName
};
