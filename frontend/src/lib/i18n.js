'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const TRANSLATIONS = {
  en: {
    app_name: 'Vachanam',
    tagline: 'Multilingual Digital Bible & Theological AI Explorer',
    read: 'Read Bible',
    search: 'Search Scripture',
    plans: 'Reading Plans',
    saved: 'Bookmarks & Notes',
    diagrams: 'Visual Explorer',
    artwork: 'Verse Studio',
    audio: 'Audio Bible',
    admin: 'Admin Console',
    today_verse: 'Daily Verse',
    ot: 'Old Testament',
    nt: 'New Testament',
    all_books: 'All Books',
    chapter: 'Chapter',
    verse: 'Verse',
    reading_mode: 'Reading Mode',
    mode_book: 'Book Mode',
    mode_parallel: 'Parallel Translation',
    mode_compare: 'Compare Mode',
    mode_single: 'Single Language',
    mode_focus: 'Focus Mode',
    ai_explanation: 'AI Theological Breakdown',
    visualize: 'Visual Diagram',
    create_artwork: 'Create Verse Art',
    listen: 'Listen Audio',
    bookmark: 'Bookmark',
    bookmarked: 'Bookmarked',
    note: 'Add Note',
    highlight: 'Highlight',
    share: 'Share Verse',
    copy: 'Copy Text',
    copied: 'Copied to Clipboard!',
    simple_explanation: 'Simple Explanation',
    key_points: '3 Key Learning Points',
    historical_context: 'Historical & Cultural Context',
    spiritual_meaning: 'Spiritual Meaning',
    life_application: 'Practical Life Application',
    youth_explanation: 'Youth & Teens Perspective',
    select_book: 'Select Book',
    select_chapter: 'Select Chapter',
    previous_chapter: 'Previous Chapter',
    next_chapter: 'Next Chapter',
    search_placeholder: 'Search keywords, verses (e.g. John 3:16, ప్రేమ, peace)...',
    popular_searches: 'Popular Searches',
    recent_searches: 'Recent Searches',
    font_size: 'Font Size',
    theme: 'Theme',
    light: 'Light Cream',
    dark: 'Night Navy',
    offline_ready: 'Available Offline',
    sync_online: 'Synchronized with Cloud'
  },
  te: {
    app_name: 'వచనం',
    tagline: 'పరిశుద్ధ గ్రంథము • దైవిక జ్ఞానము • దృశ్య చిత్రపటములు',
    read: 'బైబిల్ చదవండి',
    search: 'వాక్య శోధన',
    plans: 'పఠన ప్రణాళికలు',
    saved: 'బుక్‌మార్క్‌లు & నోట్స్',
    diagrams: 'దృశ్య చిత్రపటములు',
    artwork: 'వాక్య చిత్ర స్టూడియో',
    audio: 'ఆడియో బైబిల్',
    admin: 'నిర్వాహణ వ్యవస్థ',
    today_verse: 'ఈ దినపు వాక్యము',
    ot: 'పాత నిబంధన',
    nt: 'క్రొత్త నిబంధన',
    all_books: 'సమస్త గ్రంథములు',
    chapter: 'అధ్యాయము',
    verse: 'వచనము',
    reading_mode: 'పఠన విధానము',
    mode_book: 'పుస్తక శైలి',
    mode_parallel: 'సమాంతర అనువాదం',
    mode_compare: 'పోలిక విధానం',
    mode_single: 'ఏక భాషా శైలి',
    mode_focus: 'ఏకాగ్రతా పఠనం',
    ai_explanation: 'AI దైవశాస్త్ర వివరణ',
    visualize: 'దృశ్య చిత్రపటము',
    create_artwork: 'చిత్రంగా మార్చండి',
    listen: 'వినండి (ఆడియో)',
    bookmark: 'బుక్‌మార్క్ చేయండి',
    bookmarked: 'బుక్‌మార్క్ చేయబడింది',
    note: 'నోట్ రాయండి',
    highlight: 'హైలైట్ చేయండి',
    share: 'పంచుకోండి',
    copy: 'కాపీ చేయండి',
    copied: 'కాపీ చేయబడింది!',
    simple_explanation: 'సులభ వివరణ',
    key_points: '3 ముఖ్య ఆత్మీయ అంశాలు',
    historical_context: 'చారిత్రక & సాంస్కృతిక నేపథ్యం',
    spiritual_meaning: 'ఆత్మీయ భావార్ధము',
    life_application: 'నిత్య జీవిత అన్వయం',
    youth_explanation: 'యువత కొరకు ప్రత్యేక వివరణ',
    select_book: 'గ్రంథము ఎంచుకోండి',
    select_chapter: 'అధ్యాయము ఎంచుకోండి',
    previous_chapter: 'మునుపటి అధ్యాయము',
    next_chapter: 'తరువాతి అధ్యాయము',
    search_placeholder: 'వాక్యాలు, పదాలు శోధించండి (ఉదా: యోహాను 3:16, ప్రేమ, సమాధానం)...',
    popular_searches: 'ప్రముఖ శోధనలు',
    recent_searches: 'ఇటీవలి శోధనలు',
    font_size: 'అక్షరాల పరిమాణం',
    theme: 'థీమ్',
    light: 'ప్రాచీన కాగితం (లైట్)',
    dark: 'రాత్రి సమయం (డార్క్)',
    offline_ready: 'ఆఫ్‌లైన్‌లో అందుబాటులో ఉంది',
    sync_online: 'క్లౌడ్‌తో అనుసంధానించబడింది'
  },
  hi: {
    app_name: 'वचन',
    tagline: 'पवित्र बाइबिल • आत्मिक ज्ञान • दृश्य रूपरेखा',
    read: 'बाइबिल पढ़ें',
    search: 'वचन खोजें',
    plans: 'पठन योजनाएँ',
    saved: 'बुकमार्क और नोट्स',
    diagrams: 'दृश्य रूपरेखा',
    artwork: 'वचन चित्रशाला',
    audio: 'ऑडियो बाइबिल',
    admin: 'प्रशासन कक्ष',
    today_verse: 'आज का वचन',
    ot: 'पुराना नियम',
    nt: 'नया नियम',
    all_books: 'सभी पुस्तकें',
    chapter: 'अध्याय',
    verse: 'पद',
    reading_mode: 'पठन शैली',
    mode_book: 'पुस्तक शैली',
    mode_parallel: 'समानांतर अनुवाद',
    mode_compare: 'तुलना शैली',
    mode_single: 'एकल भाषा शैली',
    mode_focus: 'एकाग्रता पठन',
    ai_explanation: 'AI आत्मिक व्याख्या',
    visualize: 'दृश्य रूपरेखा',
    create_artwork: 'चित्र बनाएं',
    listen: 'ऑडियो सुनें',
    bookmark: 'बुकमार्क करें',
    bookmarked: 'बुकमार्क किया गया',
    note: 'नोट लिखें',
    highlight: 'हाइलाइट करें',
    share: 'साझा करें',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    simple_explanation: 'सरल व्याख्या',
    key_points: '3 मुख्य आत्मिक बातें',
    historical_context: 'ऐतिहासिक और सांस्कृतिक संदर्भ',
    spiritual_meaning: 'आत्मिक अर्थ',
    life_application: 'जीवन में लागू करना',
    youth_explanation: 'युवाओं के लिए दृष्टिकोण',
    select_book: 'पुस्तक चुनें',
    select_chapter: 'अध्याय चुनें',
    previous_chapter: 'पिछला अध्याय',
    next_chapter: 'अगला अध्याय',
    search_placeholder: 'वचन या शब्द खोजें (उदा: यूहन्ना 3:16, प्रेम, शांति)...',
    popular_searches: 'लोकप्रिय खोजें',
    recent_searches: 'हाल की खोजें',
    font_size: 'फ़ॉन्ट आकार',
    theme: 'थीम',
    light: 'प्राचीन पृष्ठ (लाइट)',
    dark: 'रात्रि शैली (डार्क)',
    offline_ready: 'ऑफ़लाइन उपलब्ध',
    sync_online: 'क्लाउड से जुड़ा हुआ'
  }
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState('te'); // Default to Telugu as per specification primary

  useEffect(() => {
    const saved = localStorage.getItem('vachanam_lang');
    if (saved && ['en', 'te', 'hi'].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vachanam_lang', lang);
    }
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
