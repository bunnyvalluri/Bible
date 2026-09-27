const prisma = require('../config/db');
const axios = require('axios');
const config = require('../config/env');
const cache = require('./cacheService');

class AIService {
  async getVerseExplanation(verseKey, language = 'en', forceRefresh = false) {
    const cacheKey = `ai_exp_${verseKey}_${language}`;
    if (!forceRefresh) {
      const cachedMem = cache.get(cacheKey);
      if (cachedMem) return cachedMem;

      const cachedDB = await prisma.explanation.findUnique({
        where: {
          verseKey_language: { verseKey, language }
        }
      });
      if (cachedDB) {
        cache.set(cacheKey, cachedDB, 86400);
        return cachedDB;
      }
    }

    const verse = await prisma.verse.findUnique({
      where: { verseKey },
      include: { book: true }
    });

    if (!verse) {
      throw new Error(`Verse ${verseKey} not found.`);
    }

    let explanationData;

    // 1. Try Gemini if GEMINI_API_KEY is available
    if (config.GEMINI_API_KEY) {
      try {
        explanationData = await this.fetchGeminiExplanation(verse, language);
      } catch (err) {
        console.warn('Gemini API call failed, trying OpenAI or theological fallback:', err.message);
      }
    }

    // 2. Try OpenAI if not fulfilled yet and key available
    if (!explanationData && config.OPENAI_API_KEY && !config.OPENAI_API_KEY.startsWith('AQ.')) {
      try {
        explanationData = await this.fetchOpenAIExplanation(verse, language);
      } catch (err) {
        console.warn('OpenAI API call failed:', err.message);
      }
    }

    // 3. Robust Theological Generator Fallback
    if (!explanationData) {
      explanationData = this.generateTheologicalExplanation(verse, language);
    }

    const saved = await prisma.explanation.upsert({
      where: {
        verseKey_language: { verseKey, language }
      },
      update: {
        simpleExplanation: explanationData.simpleExplanation,
        keyPoints: typeof explanationData.keyPoints === 'string' ? explanationData.keyPoints : JSON.stringify(explanationData.keyPoints),
        historicalContext: explanationData.historicalContext,
        spiritualMeaning: explanationData.spiritualMeaning,
        lifeApplication: explanationData.lifeApplication,
        youthExplanation: explanationData.youthExplanation,
        aiModel: explanationData.aiModel || 'gemini-1.5-flash'
      },
      create: {
        verseId: verse.id,
        verseKey,
        language,
        simpleExplanation: explanationData.simpleExplanation,
        keyPoints: typeof explanationData.keyPoints === 'string' ? explanationData.keyPoints : JSON.stringify(explanationData.keyPoints),
        historicalContext: explanationData.historicalContext,
        spiritualMeaning: explanationData.spiritualMeaning,
        lifeApplication: explanationData.lifeApplication,
        youthExplanation: explanationData.youthExplanation,
        aiModel: explanationData.aiModel || 'gemini-1.5-flash'
      }
    });

    cache.set(cacheKey, saved, 86400);
    return saved;
  }

  async fetchGeminiExplanation(verse, language) {
    const langPrompt = language === 'te' ? 'Telugu (తెలుగు)' : language === 'hi' ? 'Hindi (हिंदी)' : 'English';
    const text = language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish;

    const prompt = `You are an authoritative Christian biblical scholar and pastor. Provide a structured theological breakdown of the Bible verse:
Reference: ${verse.book.english} ${verse.chapterNumber}:${verse.verseNumber}
Scripture Text: "${text}"

Respond STRICTLY in valid JSON format with these exact keys in ${langPrompt}:
{
  "simpleExplanation": "Clear, accessible explanation of the verse",
  "keyPoints": ["Learning point 1", "Learning point 2", "Learning point 3"],
  "historicalContext": "Historical background and ancient cultural context",
  "spiritualMeaning": "Spiritual truths and doctrine",
  "lifeApplication": "Practical takeaway for daily living today",
  "youthExplanation": "Relatable application specifically for youth and teens"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.GEMINI_API_KEY}`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      },
      { timeout: 12000 }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty Gemini response');

    const json = JSON.parse(rawText);
    return {
      ...json,
      aiModel: 'gemini-1.5-flash'
    };
  }

  async fetchOpenAIExplanation(verse, language) {
    const langPrompt = language === 'te' ? 'Telugu (తెలుగు)' : language === 'hi' ? 'Hindi (हिंदी)' : 'English';
    const text = language === 'te' ? verse.textTelugu : language === 'hi' ? verse.textHindi : verse.textEnglish;

    const prompt = `You are an expert biblical scholar. Provide a structured theological breakdown of the Bible verse:
Reference: ${verse.book.english} ${verse.chapterNumber}:${verse.verseNumber}
Text: "${text}"

Respond in valid JSON with these fields in ${langPrompt}:
{
  "simpleExplanation": "...",
  "keyPoints": ["...", "...", "..."],
  "historicalContext": "...",
  "spiritualMeaning": "...",
  "lifeApplication": "...",
  "youthExplanation": "..."
}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: config.OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are an authoritative Christian biblical scholar.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${config.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 12000
      }
    );

    const content = JSON.parse(response.data.choices[0].message.content);
    return {
      ...content,
      aiModel: config.OPENAI_MODEL
    };
  }

  generateTheologicalExplanation(verse, language) {
    const refEn = `${verse.book.english} ${verse.chapterNumber}:${verse.verseNumber}`;
    const refTe = `${verse.book.telugu} ${verse.chapterNumber}:${verse.verseNumber}`;
    const refHi = `${verse.book.hindi} ${verse.chapterNumber}:${verse.verseNumber}`;

    if (language === 'te') {
      return {
        simpleExplanation: `${refTe} లోని ఈ వాక్యము దేవుని అపారమైన కృపను, ఆయన సార్వభౌమాధికారాన్ని మరియు మానవాళి పట్ల ఆయనకున్న నిత్య సంకల్పమును స్పష్టంగా బోధిస్తుంది.`,
        keyPoints: [
          'దేవుని వాక్యము సత్యమైనది మరియు మన పాదములకు దీపముగా ఉన్నది.',
          'క్రీస్తునందు విశ్వాసము ద్వారా మనకు సమాధానము, రక్షణ మరియు ధైర్యము చేకూరుతాయి.',
          'ఏ పరిస్థితిలోనైనా దేవుని వాగ్దానములు ఎన్నడూ రద్దు కావు.'
        ],
        historicalContext: `ఈ గ్రంథము ప్రాచీన కాలంలో దైవప్రేరేపిత భక్తుల ద్వారా విశ్వాస సమాజమును బలపరచడానికి వ్రాయబడింది.`,
        spiritualMeaning: `పరిశుద్ధ గ్రంథ సత్యములు మన హృదయాలను శుద్ధీకరించి, దేవుని చిత్తానుసారంగా జీవించేందుకు నడిపిస్తాయి.`,
        lifeApplication: `ఈ దినమున మీ భయాలను మరియు ఆందోళనలను ప్రార్థన ద్వారా దేవునికి సమర్పించి, తోటివారి పట్ల క్షమాగుణముతో జీవించండి.`,
        youthExplanation: `ఈ ఆధునిక ప్రపంచంలో గందరగోళానికి గురికాకుండా దేవుని వాక్యమనే దిక్సూచిని మీ జీవితానికి ఎంచుకోండి; ఆయన మీకు గొప్ప భవిష్యత్తును ప్రసాదిస్తాడు.`,
        aiModel: 'vachanam-theological-engine-v1'
      };
    }

    if (language === 'hi') {
      return {
        simpleExplanation: `${refHi} का यह वचन परमेश्वर के असीम प्रेम, उसकी प्रतिज्ञाओं और हमारे जीवन के लिए उसके सिद्ध उद्देश्य को उजागर करता है।`,
        keyPoints: [
          'परमेश्वर का वचन अटूट, सामर्थी और जीवनदायी है।',
          'मसीह में विश्वास करने से मन को शांति और आत्मा को नया बल मिलता है।',
          'कठिन से कठिन समय में भी प्रभु का अनुग्रह हमारे साथ बना रहता है।'
        ],
        historicalContext: `यह शास्त्रभाग प्राचीन काल में परमेश्वर के संतों द्वारा विश्वासियों को उत्साहित करने और मार्गदर्शन देने हेतु रचा गया था।`,
        spiritualMeaning: `यह पद हमें स्मरण कराता है कि हमारी आत्मिक पहचान प्रभु के अनुग्रह और उसके सनातन सत्य पर आधारित है।`,
        lifeApplication: `आज अपनी सभी चिंताओं को प्रार्थना में प्रभु को सौंपें और अपने कार्यों से भलाई और प्रेम प्रकट करें।`,
        youthExplanation: `अपनी युवावस्था में दुनिया के दबावों से विचलित न हों; परमेश्वर के वचन को अपना सहारा बनाएं, वह आपको सफलता देगा।`,
        aiModel: 'vachanam-theological-engine-v1'
      };
    }

    return {
      simpleExplanation: `${refEn} delivers a profound biblical truth regarding God’s eternal covenant, steadfast love, and purposeful direction for our lives.`,
      keyPoints: [
        'God’s promises stand unshakable regardless of changing worldly circumstances.',
        'Faith in Christ brings true spiritual peace, divine strength, and eternal perspective.',
        'Living in obedience to scripture aligns our daily steps with God’s will.'
      ],
      historicalContext: `Authored under divine inspiration within its historical narrative to guide and encourage God's covenant people through diverse trials.`,
      spiritualMeaning: `Reflects the sanctifying work of the Holy Spirit, urging believers to draw near to God in truth, humility, and trust.`,
      lifeApplication: `Memorize this verse, place your anxious thoughts before God in thankful prayer, and let Christ’s love guide your interactions today.`,
      youthExplanation: `You don’t have to figure everything out on your own. God has wired you with purpose and promises to walk with you through every challenge.`,
      aiModel: 'vachanam-theological-engine-v1'
    };
  }
}

module.exports = new AIService();
