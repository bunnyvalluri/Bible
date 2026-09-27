/**
 * Biblical Reading Plans
 */

const READING_PLANS = [
  {
    id: '30-day-gospels',
    title: '30-Day Gospel Journey',
    titleTelugu: '30 రోజుల సువార్త యాత్ర',
    titleHindi: '30 दिनों की सुसमाचार यात्रा',
    durationDays: 30,
    category: 'Gospels',
    description: 'Walk through the life, teachings, miracles, crucifixion, and resurrection of Jesus Christ across Matthew, Mark, Luke, and John.',
    readings: [
      { day: 1, title: 'The Word Became Flesh', references: ['JHN.1', 'LUK.1'] },
      { day: 2, title: 'Birth and Youth of Jesus', references: ['MAT.1', 'MAT.2', 'LUK.2'] },
      { day: 3, title: 'Baptism and Temptation', references: ['MAT.3', 'MAT.4', 'MRK.1'] },
      { day: 4, title: 'The Sermon on the Mount (Part 1)', references: ['MAT.5'] },
      { day: 5, title: 'The Sermon on the Mount (Part 2)', references: ['MAT.6', 'MAT.7'] },
      { day: 6, title: 'Authority over Sickness and Nature', references: ['MAT.8', 'MRK.4'] },
      { day: 7, title: 'Parables of the Kingdom', references: ['MAT.13'] },
      { day: 8, title: 'Feeding the Multitude & Walking on Water', references: ['MAT.14', 'JHN.6'] },
      { day: 9, title: 'The Good Samaritan & Martha/Mary', references: ['LUK.10'] },
      { day: 10, title: 'The Good Shepherd', references: ['JHN.10'] },
      { day: 11, title: 'The Prodigal Son & Lost Sheep', references: ['LUK.15'] },
      { day: 12, title: 'Raising of Lazarus', references: ['JHN.11'] },
      { day: 13, title: 'Zacchaeus & The Triumphal Entry', references: ['LUK.19'] },
      { day: 14, title: 'The Greatest Commandments', references: ['MAT.22', 'MRK.12'] },
      { day: 15, title: 'Signs of the End of the Age', references: ['MAT.24'] },
      { day: 16, title: 'The Last Supper', references: ['MAT.26', 'JHN.13'] },
      { day: 17, title: 'I Am the True Vine', references: ['JHN.15'] },
      { day: 18, title: 'The High Priestly Prayer', references: ['JHN.17'] },
      { day: 19, title: 'Gethsemane and Arrest', references: ['MAT.26', 'JHN.18'] },
      { day: 20, title: 'The Crucifixion and Death', references: ['MAT.27', 'JHN.19'] },
      { day: 21, title: 'The Glorious Resurrection', references: ['MAT.28', 'JHN.20'] },
      { day: 22, title: 'The Road to Emmaus', references: ['LUK.24'] },
      { day: 23, title: 'The Great Commission & Ascension', references: ['MAT.28', 'ACT.1'] },
      { day: 24, title: 'Peter’s Restoration', references: ['JHN.21'] },
      { day: 25, title: 'The Promise of the Holy Spirit', references: ['JHN.14', 'JHN.16'] },
      { day: 26, title: 'Light of the World', references: ['JHN.8'] },
      { day: 27, title: 'Living Water and the Samaritan Woman', references: ['JHN.4'] },
      { day: 28, title: 'Healings on the Sabbath', references: ['JHN.5', 'JHN.9'] },
      { day: 29, title: 'Kingdom Humility and Service', references: ['MAT.18', 'MRK.10'] },
      { day: 30, title: 'Abiding in Christ Forever', references: ['JHN.15', 'ROM.8'] }
    ]
  },
  {
    id: '90-day-wisdom-psalms',
    title: '90-Day Wisdom & Psalms',
    titleTelugu: '90 రోజుల జ్ఞానము & కీర్తనలు',
    titleHindi: '90 दिनों की बुद्धि और भजन',
    durationDays: 90,
    category: 'Wisdom',
    description: 'Immerse your mind in divine wisdom, praise, poetic solace, and daily practical guidance through Psalms, Proverbs, and Ecclesiastes.',
    readings: Array.from({ length: 90 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: Psalms & Proverbs`,
      references: [`PSA.${(i % 150) + 1}`, `PRO.${(i % 31) + 1}`]
    }))
  },
  {
    id: '365-day-bible',
    title: 'One-Year Bible Journey',
    titleTelugu: 'సంవత్సర బైబిల్ పఠన ప్రణాళిక',
    titleHindi: 'एक वर्ष की सम्पूर्ण बाइबिल यात्रा',
    durationDays: 365,
    category: 'Complete Bible',
    description: 'Read the complete Old and New Testaments across 365 manageable daily portions with balanced OT, NT, Psalm, and Proverb passages.',
    readings: Array.from({ length: 365 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}`,
      references: [`GEN.${(i % 50) + 1}`, `MAT.${(i % 28) + 1}`, `PSA.${(i % 150) + 1}`]
    }))
  },
  {
    id: 'topical-peace-anxiety',
    title: 'Peace in Times of Anxiety',
    titleTelugu: 'ఆందోళన సమయాల్లో దేవుని సమాధానం',
    titleHindi: 'चिंता के समय में परमेश्वर की शांति',
    durationDays: 7,
    category: 'Topical',
    description: 'Find inner calm, unshakable trust, and the peace that surpasses all understanding.',
    readings: [
      { day: 1, title: 'Cast Your Cares on the Lord', references: ['PSA.55', '1PE.5'] },
      { day: 2, title: 'Do Not Be Anxious About Anything', references: ['PHP.4'] },
      { day: 3, title: 'Peace I Leave With You', references: ['JHN.14'] },
      { day: 4, title: 'The Lord is My Shepherd', references: ['PSA.23'] },
      { day: 5, title: 'Under His Wings', references: ['PSA.91'] },
      { day: 6, title: 'Come to Me, All Who Are Weary', references: ['MAT.11'] },
      { day: 7, title: 'Perfect Love Casts Out Fear', references: ['1JN.4', 'ROM.8'] }
    ]
  },
  {
    id: 'topical-faith-youth',
    title: 'Ignite: Youth & Faith in Action',
    titleTelugu: 'యువత & విశ్వాస చైతన్యం',
    titleHindi: 'युवा और कर्मशील विश्वास',
    durationDays: 14,
    category: 'Topical',
    description: 'Inspiring biblical stories and life instructions for youth stepping boldly into purpose and spiritual strength.',
    readings: [
      { day: 1, title: 'Let No One Despise Your Youth', references: ['1TI.4'] },
      { day: 2, title: 'David and Goliath: Overcoming Giants', references: ['1SA.17'] },
      { day: 3, title: 'Daniel’s Courage in Babylon', references: ['DAN.1', 'DAN.6'] },
      { day: 4, title: 'Esther: For Such a Time as This', references: ['EST.4'] },
      { day: 5, title: 'The Armor of God', references: ['EPH.6'] },
      { day: 6, title: 'Running the Race with Endurance', references: ['HEB.12'] },
      { day: 7, title: 'Trust in the Lord with All Your Heart', references: ['PRO.3'] },
      { day: 8, title: 'Joseph: Integrity in Adversity', references: ['GEN.39', 'GEN.41'] },
      { day: 9, title: 'The Fruit of the Spirit', references: ['GAL.5'] },
      { day: 10, title: 'More than Conquerors', references: ['ROM.8'] },
      { day: 11, title: 'Be Strong and Courageous', references: ['JOS.1'] },
      { day: 12, title: 'Salt and Light', references: ['MAT.5'] },
      { day: 13, title: 'Renewing Your Mind', references: ['ROM.12'] },
      { day: 14, title: 'The Greatest Gift: Love', references: ['1CO.13'] }
    ]
  }
];

module.exports = {
  READING_PLANS
};
