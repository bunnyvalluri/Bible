/**
 * Vachanam Multilingual Bible Importer & Seed Engine
 */

const { PrismaClient } = require('@prisma/client');
const { BIBLE_BOOKS } = require('../shared/src/books');
const { READING_PLANS } = require('../shared/src/readingPlans');
const { DIAGRAM_TEMPLATES } = require('../shared/src/diagramTemplates');

const prisma = new PrismaClient();

// Curated authentic Multilingual Verse Datasets
const AUTHENTIC_VERSES = {
  'GEN.1.1': {
    te: 'ఆదియందు దేవుడు భూమ్యాకాశములను సృజించెను.',
    en: 'In the beginning God created the heaven and the earth.',
    hi: 'आदि में परमेश्वर ने आकाश और पृथ्वी की सृष्टि की।'
  },
  'GEN.1.2': {
    te: 'భూమి నిరాకారముగాను శూన్యముగాను ఉండెను; చీకటి అగాధజలములమీద కమ్మియుండెను; దేవుని ఆత్మ జలములమీద అల్లాడుచుండెను.',
    en: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
    hi: 'पृथ्वी बेडौल और सुनसान पड़ी थी, और गहरे जल के ऊपर अन्धियारा था: तथा परमेश्वर की आत्मा जल के ऊपर मण्डलाती थी।'
  },
  'GEN.1.3': {
    te: 'దేవుడు వెలుగు కలుగునుగాక అని పలుకగా వెలుగు కలిగెను.',
    en: 'And God said, Let there be light: and there was light.',
    hi: 'तब परमेश्वर ने कहा, उजियाला हो: तो उजियाला हो गया।'
  },
  'PSA.23.1': {
    te: 'యెహోవా నా కాపరి, నాకు లేమి కలుగదు.',
    en: 'The LORD is my shepherd; I shall not want.',
    hi: 'यहोवा मेरा चरवाहा है, मुझे कुछ घटी न होगी।'
  },
  'PSA.23.2': {
    te: 'పచ్చికగల చోట్లను ఆయన నన్ను పరుండజేయుచున్నాడు, శాంతికరమైన జలములయొద్దకు నన్ను నడిపించుచున్నాడు.',
    en: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
    hi: 'वह मुझे हरी हरी चराइयों में बैठाता है; वह मुझे सुखदाई जल के झरने के पास ले चलता है।'
  },
  'PSA.23.3': {
    te: 'నా ప్రాణమునకు ఆయన సేదదీర్చుచున్నాడు. తన నామమునుబట్టి నీతిమార్గములలో నన్ను నడిపించుచున్నాడు.',
    en: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
    hi: 'वह मेरे जी में जी ले आता है। धर्म के मार्गों में वह अपने नाम के निमित्त मेरी अगुवाई करता है।'
  },
  'PSA.23.4': {
    te: 'గాఢాంధకారపు లోయలో నేను సంచరించినను ఏ అపాయమునకు భయపడను, నీవు నాకు తోడైయుందువు; నీ దుడ్డుకఱ్ఱయు నీ దండమును నన్ను ఆదరించును.',
    en: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
    hi: 'चाहे मैं घोर अन्धकार से भरी हुई तराई में होकर चलूं, तौभी हानि से न डरूंगा, क्योंकि तू मेरे साथ रहता है; तेरे सोंटे और तेरी लाठी से मुझे शान्ति मिलती है।'
  },
  'PSA.23.5': {
    te: 'నా శత్రువుల యెదుట నీవు నాకు భోజనము సిద్ధపరచుదువు; నూనెతో నా తల అంటియున్నావు, నా గిన్నె నిండి పొర్లుచున్నది.',
    en: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
    hi: 'तू मेरे शत्रुओं के साम्हने मेरे लिये मेज बिछाता है; तू ने मेरे सिर पर तेल मला है, मेरा कटोरा उमड़ रहा है।'
  },
  'PSA.23.6': {
    te: 'నేను బ్రదుకు దినములన్నియు కృపాక్షేమములే నా వెంట వచ్చును; చిరకాలము యెహోవా మందిరములో నేను నివాసము చేసెదను.',
    en: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
    hi: 'निश्चय भलाई और करूणा जीवन भर मेरे साथ साथ बनी रहेंगी; और मैं यहोवा के धाम में सर्वदा वास करूंगा।'
  },
  'PSA.91.1': {
    te: 'మహోన్నతుని చాటున నివసించువాడే సర్వశక్తుని నీడను విశ్రమించువాడు.',
    en: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.',
    hi: 'जो परमप्रधान के छाए हुए स्थान में बैठा रहे, वह सर्वशक्तिमान की छाया में ठिकाना पाएगा।'
  },
  'PSA.91.2': {
    te: 'ఆయనే నా ఆశ్రయము, నా కోట, నేను నమ్ముకొను నా దేవుడు అని నేను యెహోవానుగూర్చి చెప్పుచున్నాను.',
    en: 'I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.',
    hi: 'मैं यहोवा के विषय कहूंगा, कि वह मेरा शरणस्थान और मेरा गढ़ है; वह मेरा परमेश्वर है, मैं उस पर भरोसा रखूंगा।'
  },
  'PRO.3.5': {
    te: 'నీ స్వబుద్ధిని ఆధారము చేసికొనక నీ పూర్ణహృదయముతో యెహోవాయందు నమ్మకముంచుము.',
    en: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
    hi: 'तू अपनी समझ का सहारा न लेना, वरन सम्पूर्ण मन से यहोवा पर भरोसा रखना।'
  },
  'PRO.3.6': {
    te: 'నీ ప్రవర్తన అంతటియందు ఆయన అధికారమునకు ఒప్పుకొనుము, అప్పుడు ఆయన నీ మార్గములను సరాళము చేయును.',
    en: 'In all thy ways acknowledge him, and he shall direct thy paths.',
    hi: 'उसी को अपने सब मार्गों में पहिचाने रहना, तब वह तेरे लिये सीधा मार्ग निकालेगा।'
  },
  'MAT.5.3': {
    te: 'ఆత్మవిషయమై దీనులైనవారు ధన్యులు; పరలోకరాజ్యము వారిది.',
    en: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.',
    hi: 'धन्य हैं वे, जो मन के दीन हैं, क्योंकि स्वर्ग का राज्य उन्हीं का है।'
  },
  'MAT.5.4': {
    te: 'దుఃఖపడువారు ధన్యులు; వారు ఓదార్చబడుదురు.',
    en: 'Blessed are they that mourn: for they shall be comforted.',
    hi: 'धन्य हैं वे, जो शोक करते हैं, क्योंकि वे शान्ति पाएंगे।'
  },
  'MAT.5.5': {
    te: 'సాత్వికులు ధన్యులు; వారు భూలోకమును స్వతంత్రించుకొందురు.',
    en: 'Blessed are the meek: for they shall inherit the earth.',
    hi: 'धन्य हैं वे, जो नम्र हैं, क्योंकि वे पृथ्वी के अधिकारी होंगे।'
  },
  'MAT.5.6': {
    te: 'నీతికొరకు ఆకలిదప్పులు గలవారు ధన్యులు; వారు తృప్తిపరచబడుదురు.',
    en: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.',
    hi: 'धन्य हैं वे जो धार्मिकता के भूखे और प्यासे हैं, क्योंकि वे तृप्त किये जाएंगे।'
  },
  'MAT.5.7': {
    te: 'దయగలవారు ధన్యులు; వారు దయపొందుదురు.',
    en: 'Blessed are the merciful: for they shall obtain mercy.',
    hi: 'धन्य हैं वे, जो दयावन्त हैं, क्योंकि उन पर दया की जाएगी।'
  },
  'MAT.5.8': {
    te: 'హృదయశుద్ధి గలవారు ధన్యులు; వారు దేవుని చూచెదరు.',
    en: 'Blessed are the pure in heart: for they shall see God.',
    hi: 'धन्य हैं वे, जिनके मन शुद्ध हैं, क्योंकि वे परमेश्वर को देखेंगे।'
  },
  'MAT.5.9': {
    te: 'సమాధానపరచువారు ధన్యులు; వారు దేవుని కుమారులనబడుదురు.',
    en: 'Blessed are the peacemakers: for they shall be called the children of God.',
    hi: 'धन्य हैं वे, जो मेल करवाने वाले हैं, क्योंकि वे परमेश्वर के पुत्र कहलाएंगे।'
  },
  'JHN.1.1': {
    te: 'ఆదియందు వాక్యముండెను, వాక్యము దేవునియొద్ద ఉండెను, వాక్యము దేవుడై యుండెను.',
    en: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    hi: 'आदि में वचन था, और वचन परमेश्वर के साथ था, और वचन परमेश्वर था।'
  },
  'JHN.1.14': {
    te: 'ఆ వాక్యము శరీరధారియై, కృపాసత్యసంపూర్ణుడుగా మనమధ్య నివసించెను; తండ్రివలన కలిగిన అద్వితీయకుమారుని మహిమవలె మనము ఆయన మహిమను కనుగొంటిమి.',
    en: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
    hi: 'और वचन देहधारी हुआ; और अनुग्रह और सच्चाई से परिपूर्ण होकर हमारे बीच में डेरा किया, और हम ने उसकी ऐसी महिमा देखी, जैसी पिता के एकलौते की महिमा।'
  },
  'JHN.3.16': {
    te: 'దేవుడు లోకమును ఎంతో ప్రేమించెను. కాగా ఆయన తన అద్వితీయకుమారునిగా పుట్టిన వానియందు విశ్వాసముంచు ప్రతివాడును నశింపక నిత్యజీవము పొందునట్లు ఆయనను అనుగ్రహించెను.',
    en: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    hi: 'क्योंकि परमेश्वर ने जगत से ऐसा प्रेम रखा कि उसने अपना एकलौता पुत्र दे दिया, ताकि जो कोई उस पर विश्वास करे, वह नाश न हो, परन्तु अनन्त जीवन पाए।'
  },
  'JHN.14.6': {
    te: 'యేసు నేనే మార్గమును, సత్యమును, జీవమును; నా ద్వారానే తప్ప యెవడును తండ్రియొద్దకు రాడు అని అతనితో చెప్పెను.',
    en: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
    hi: 'यीशु ने उससे कहा, मार्ग और सच्चाई और जीवन मैं ही हूं; बिना मेरे द्वारा कोई पिता के पास नहीं पहुंच सकता।'
  },
  'ROM.8.28': {
    te: 'దేవుని ప్రేమించువారికి, అనగా ఆయన సంకల్పముచొప్పున పిలువబడినవారికి, మేలుకలుగుటకై సమస్తమును సమకూడి జరుగుచున్నవని యెరుగుదుము.',
    en: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
    hi: 'और हम जानते हैं, कि जो लोग परमेश्वर से प्रेम रखते हैं, उनके लिये सब बातें मिलकर भलाई ही को उत्पन्न करती हैं; अर्थात उन्हीं के लिये जो उसकी इच्छा के अनुसार बुलाए हुए हैं।'
  },
  'PHP.4.13': {
    te: 'నన్ను బలపరచువానియందే నేను సమస్తమును చేయగలను.',
    en: 'I can do all things through Christ which strengtheneth me.',
    hi: 'जो मुझे सामर्थ्य देता है उसमें मैं सब कुछ कर सकता हूँ।'
  },
  'PHP.4.6': {
    te: 'దేనినిగూర్చియు చింతపడకుడి గాని ప్రతి విషయములోను ప్రార్థన విజ్ఞాపనములచేత కృతజ్ఞతాపూర్వకముగా మీ విన్నపములు దేవునికి తెలియజేయుడి.',
    en: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
    hi: 'किसी भी बात की चिन्ता मत करो: परन्तु हर एक बात में तुम्हारे निवेदन, प्रार्थना और बिनती के द्वारा धन्यवाद के साथ परमेश्वर के सम्मुख उपस्थित किए जाएं।'
  },
  'PHP.4.7': {
    te: 'అప్పుడు సమస్త జ్ఞానమునకు మించిన దేవుని సమాధానము యేసుక్రీస్తువలన మీ హృదయములకును మీ తలంపులకును కావలియుండును.',
    en: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
    hi: 'तब परमेश्वर की शान्ति, जो सारी समझ से परे है, तुम्हारे हृदय और तुम्हारे विचारों को मसीह यीशु में सुरक्षित रखेगी।'
  },
  'EPH.6.11': {
    te: 'మీరు అపవాది తంత్రములను ఎదిరించి నిలువబడుటకు శక్తిమంతులగునట్లు దేవుడిచ్చు సర్వాంగకవచమును ధరించుకొనుడి.',
    en: 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.',
    hi: 'परमेश्वर के सारे हथियार बान्ध लो; कि तुम शैतान की युक्तियों के साम्हने खड़े रह सको।'
  },
  'REV.21.4': {
    te: 'ఆయన వారి కన్నుల ప్రతి బాష్పబిందువును తుడిచివేయును, ఇకను మరణము ఉండదు, దుఃఖమైనను ఏడ్పైనను వేదనయైనను ఇకను ఉండదు; మొదటివి గతించెను.',
    en: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',
    hi: 'और वह उन की आंखों से सब आंसू पोंछ डालेगा; और इसके बाद मृत्यु न रहेगी, और न शोक, न विलाप, न पीड़ा रहेगी; पहली बातें जाती रहीं।'
  }
};

const SAMPLE_EXPLANATIONS = {
  'JHN.3.16': {
    en: {
      simple: 'John 3:16 is often called the Gospel in a nutshell. It reveals the boundless extent of God’s unconditional love for humanity: He gave His greatest treasure—His only Son Jesus—so that whoever puts their trust in Him will not perish eternally, but experience everlasting, abundant life with God.',
      keyPoints: JSON.stringify([
        'God’s love is universal, initiating, and sacrificial.',
        'Believing in Jesus is the singular pathway to eternal salvation.',
        'Eternal life is a present reality and future guarantee, rescuing us from spiritual perishability.'
      ]),
      historical: 'Spoken by Jesus during His nighttime conversation with Nicodemus, a prominent Pharisee and member of the Jewish Sanhedrin in 1st century Jerusalem, bridging Old Covenant expectations to the New Covenant of Grace.',
      spiritual: 'It reveals the divine heartbeat of the Triune God. Grace is unearned favor flowing directly from God’s sovereign love rather than human religious merit.',
      lifeApplication: 'Accept God’s love today without hesitation, cast aside guilt, and mirror that radical sacrificial love by forgiving and serving others in your daily life.',
      youth: 'Imagine someone paying off an impossible debt you could never afford just because they love you that much. Jesus gave His life so you could live an extraordinary, forever-connected life with God.'
    },
    te: {
      simple: 'యోహాను 3:16 సమస్త పరిశుద్ధ గ్రంథమునకు కేంద్రబిందువు వంటిది. దేవుడు మానవాళిపై చూపిన అపరిమితమైన ప్రేమను ఇది తెలియజేస్తుంది. తన అద్వితీయ కుమారుడైన యేసుక్రీస్తును నమ్మిన ప్రతి ఒక్కరూ నశించిపోకుండా శాశ్వతమైన నిత్యజీవము పొందుతారు.',
      keyPoints: JSON.stringify([
        'దేవుని ప్రేమ స్వచ్ఛమైనది, త్యాగపూరితమైనది మరియు సార్వత్రికమైనది.',
        'యేసుక్రీస్తునందు విశ్వాసముంచుట ద్వారానే సంపూర్ణ రక్షణ లభిస్తుంది.',
        'నిత్యజీవము అనేది భవిష్యత్ ఆశ మాత్రమే కాదు, నేటి జీవితంలోనే అనుభవించగల దైవిక సమాధానము.'
      ]),
      historical: 'మొదటి శతాబ్దపు యెరూషలేములో నికోదేము అను యూదుల పెద్దతో రాత్రివేళ ప్రభువైన యేసు సంభాషిస్తున్నప్పుడు ఈ మాటలు పలికెను.',
      spiritual: 'కృప అనేది మానవ క్రియల ద్వారా కాక, దేవుని నిరుపమాన ప్రేమ ద్వారా మాత్రమే లభించు గొప్ప వరం అని స్పష్టమౌతుంది.',
      lifeApplication: 'దేవుని అపారమైన ప్రేమను హృదయపూర్వకంగా అంగీకరించండి. ఆయన ప్రేమను మీ కుటుంబంలో, సమాజంలో తోటివారి పట్ల దయ మరియు క్షమాగుణము ద్వారా చూపించండి.',
      youth: 'మీరు ఎంత విలువైనవారో తెలుసా? దేవుడు మీకోసం తన ప్రాణాన్నే అర్పించాడు. మీ భవిష్యత్తు, మీ జీవితం ఆయన చేతుల్లో భద్రంగా ఉన్నాయి.'
    },
    hi: {
      simple: 'यूहन्ना 3:16 पूरी बाइबल का सबसे अनमोल और प्रसिद्ध वचन है। यह परमेश्वर के असीम और निःस्वार्थ प्रेम को प्रकट करता है, जिसने अपने एकलौते पुत्र यीशु को दिया ताकि जो कोई उस पर विश्वास करे, वह नष्ट न हो बल्कि अनन्त जीवन पाए।',
      keyPoints: JSON.stringify([
        'परमेश्वर का प्रेम त्यागपूर्ण, सार्वभौमिक और सनातन है।',
        'यीशु पर विश्वास करना ही उद्धार और अनन्त जीवन का एकमात्र मार्ग है।',
        'अनन्त जीवन केवल भविष्य की आशा नहीं, बल्कि आज का आत्मिक आनंद है।'
      ]),
      historical: 'यह वचन यीशु ने निकुदेमुस नामक फरीसी और यहूदी अगुवे से रात के समय वार्तालाप करते हुए कहा था।',
      spiritual: 'यह पद अनुग्रह के उस सिद्धांत को स्थापित करता है कि उद्धार हमारे कर्मों से नहीं, बल्कि परमेश्वर के असीम प्रेम और बलिदान से मिलता है।',
      lifeApplication: 'परमेश्वर के प्रेम को पूरे दिल से स्वीकार करें और दूसरों के प्रति भी क्षमा, प्रेम और भलाई का जीवन जिएं।',
      youth: 'परमेश्वर के लिए आप इतने अनमोल हैं कि उसने आपके उद्धार के लिए अपना सबसे प्रिय पुत्र दे दिया। अपनी पहचान मसीह के प्रेम में खोजें।'
    }
  },
  'PSA.23.1': {
    en: {
      simple: 'Psalm 23:1 is a comforting declaration of David that with the Almighty God as our personal Shepherd, every spiritual, emotional, and physical need is met with divine provision.',
      keyPoints: JSON.stringify([
        'God takes personal, tender responsibility for those who follow Him.',
        'Lack and anxiety are dispelled by trusting in divine sufficiency.',
        'A sheep’s contentment depends entirely on the character of its Shepherd.'
      ]),
      historical: 'Penned by King David, who himself was an experienced shepherd boy in Bethlehem before ascending the throne of Israel.',
      spiritual: 'Anticipates Jesus Christ, who proclaimed in John 10: "I am the Good Shepherd; the good shepherd gives His life for the sheep."',
      lifeApplication: 'Surrender control of your worries, financial fears, and decisions today, knowing God watches over every detail of your journey.',
      youth: 'You do not have to stress about the future or compare yourself with others. The ultimate Guide and Protector is leading your steps.'
    },
    te: {
      simple: 'కీర్తన 23:1 దావీదు భక్తుని యొక్క ప్రగాఢ విశ్వాస ప్రకటన. సర్వశక్తిమంతుడైన యెహోవా మన కాపరిగా ఉన్నప్పుడు, మన ఆత్మీయ, మానసిక మరియు భౌతిక అవసరతలన్నిటినీ ఆయన తీర్చును; మనకు ఎన్నడూ కొరత ఉండదు.',
      keyPoints: JSON.stringify([
        'దేవుడు మనపై వ్యక్తిగత శ్రద్ధను, వాత్సల్యమును కలిగియున్నాడు.',
        'ఆయనపై నమ్మకముంచినప్పుడు ఆందోళన, భయము తొలగిపోతాయి.',
        'మంచి కాపరి తన గొర్రెలను ఎన్నడూ విడువడు.'
      ]),
      historical: 'ఇశ్రాయేలు రాజైన దావీదు తన యౌవనకాలంలో గొఱ్ఱెల కాపరిగా ఉన్న అనుభవమును జ్ఞప్తికి తెచ్చుకుంటూ ఈ అమూల్యమైన కీర్తనను రచించెను.',
      spiritual: 'యోహాను 10లో ప్రభువైన యేసు "నేనే మంచి కాపరిని" అని పలికిన దైవిక వాగ్దానానికి ఇది ఛాయారూపము.',
      lifeApplication: 'ఈ రోజు మీ చింతలను, భయాలను దేవుని సన్నిధిలో విడిచిపెట్టండి. ఆయన మీ జీవితాన్ని క్షేమకరముగా నడిపించును.',
      youth: 'భవిష్యత్తు గురించి ఆందోళన చెందవద్దు. సర్వశక్తిమంతుడైన దేవుడే నీ జీవితానికి మార్గదర్శకుడిగా ఉన్నాడు.'
    },
    hi: {
      simple: 'भजन संहिता 23:1 राजा दाऊद का परमेश्वर पर अटूट भरोसे का प्रकटीकरण है। जब सर्वशक्तिमान प्रभु हमारा चरवाहा है, तो हमें किसी भली वस्तु की घटी नहीं होगी।',
      keyPoints: JSON.stringify([
        'परमेश्वर हमारे जीवन की हर आवश्यकता को व्यक्तिगत रूप से पूरा करता है।',
        'प्रभु पर भरोसा रखने से सारी चिंताएं और भय दूर हो जाते हैं।',
        'एक अच्छा चरवाहा अपनी भेड़ों को कभी अकेला नहीं छोड़ता।'
      ]),
      historical: 'इस भजन की रचना दाऊद ने की थी, जो इस्राएल का राजा बनने से पहले एक चरवाहा था।',
      spiritual: 'यह वचन प्रभु यीशु की ओर संकेत करता है, जिन्होंने कहा: "अच्छा चरवाहा मैं हूं; अच्छा चरवाहा भेड़ों के लिये अपना प्राण देता है।"',
      lifeApplication: 'अपनी सभी चिंताओं को प्रभु को सौंप दें और विश्वास रखें कि वह आपकी हर ज़रूरत को समय पर पूरा करेगा।',
      youth: 'अपने भविष्य या करियर की चिंता में मत डूबो; जब परमेश्वर तुम्हारा मार्गदर्शक है, तो विजय निश्चित है।'
    }
  }
};

const DAILY_VERSES_DATA = [
  {
    dateKey: new Date().toISOString().slice(0, 10),
    verseKey: 'JHN.3.16',
    reference: 'John 3:16 • యోహాను 3:16 • यूहन्ना 3:16',
    theme: 'Eternal Love & Grace',
    verseTextEn: AUTHENTIC_VERSES['JHN.3.16'].en,
    verseTextTe: AUTHENTIC_VERSES['JHN.3.16'].te,
    verseTextHi: AUTHENTIC_VERSES['JHN.3.16'].hi,
    explanationEn: SAMPLE_EXPLANATIONS['JHN.3.16'].en.simple,
    explanationTe: SAMPLE_EXPLANATIONS['JHN.3.16'].te.simple,
    explanationHi: SAMPLE_EXPLANATIONS['JHN.3.16'].hi.simple,
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80'
  }
];

async function seedDatabase() {
  console.log('🚀 Initializing Vachanam Database Seed Engine...');

  for (const book of BIBLE_BOOKS) {
    await prisma.book.upsert({
      where: { id: book.id },
      update: {
        code: book.code,
        shortCode: book.shortCode,
        english: book.english,
        telugu: book.telugu,
        hindi: book.hindi,
        testament: book.testament,
        chaptersCount: book.chapters,
        category: book.category,
        orderIndex: book.id
      },
      create: {
        id: book.id,
        code: book.code,
        shortCode: book.shortCode,
        english: book.english,
        telugu: book.telugu,
        hindi: book.hindi,
        testament: book.testament,
        chaptersCount: book.chapters,
        category: book.category,
        orderIndex: book.id
      }
    });
  }

  for (const book of BIBLE_BOOKS) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      const chapter = await prisma.chapter.upsert({
        where: {
          bookId_chapterNumber: {
            bookId: book.id,
            chapterNumber: ch
          }
        },
        update: { totalVerses: 25 },
        create: {
          bookId: book.id,
          chapterNumber: ch,
          totalVerses: 25
        }
      });

      const versesToGenerate = (book.id <= 5 || book.id >= 40 || [19, 20].includes(book.id)) ? 10 : 5;
      for (let v = 1; v <= versesToGenerate; v++) {
        const verseKey = `${book.code}.${ch}.${v}`;
        const authentic = AUTHENTIC_VERSES[verseKey];

        const textEn = authentic ? authentic.en : `${book.english} ${ch}:${v} - The Word of the Lord endures forever, bringing grace, light, and wisdom to all generations.`;
        const textTe = authentic ? authentic.te : `${book.telugu} ${ch}:${v} - దేవుని వాక్యము నిరంతరము నిలుచును; అది సమస్త తరములకు వెలుగును, కృపను, జ్ఞానమును అనుగ్రహించును.`;
        const textHi = authentic ? authentic.hi : `${book.hindi} ${ch}:${v} - परमेश्वर का वचन सदा स्थिर रहता है; वह सब पीढ़ियों के लिए ज्योति, अनुग्रह और बुद्धि प्रदान करता है।`;

        const savedVerse = await prisma.verse.upsert({
          where: { verseKey },
          update: {
            textTelugu: textTe,
            textEnglish: textEn,
            textHindi: textHi
          },
          create: {
            verseKey,
            bookId: book.id,
            chapterId: chapter.id,
            chapterNumber: ch,
            verseNumber: v,
            textTelugu: textTe,
            textEnglish: textEn,
            textHindi: textHi
          }
        });

        if (SAMPLE_EXPLANATIONS[verseKey]) {
          const expData = SAMPLE_EXPLANATIONS[verseKey];
          for (const lang of ['en', 'te', 'hi']) {
            if (expData[lang]) {
              await prisma.explanation.upsert({
                where: {
                  verseKey_language: {
                    verseKey,
                    language: lang
                  }
                },
                update: {
                  simpleExplanation: expData[lang].simple,
                  keyPoints: expData[lang].keyPoints,
                  historicalContext: expData[lang].historical,
                  spiritualMeaning: expData[lang].spiritual,
                  lifeApplication: expData[lang].lifeApplication,
                  youthExplanation: expData[lang].youth
                },
                create: {
                  verseId: savedVerse.id,
                  verseKey,
                  language: lang,
                  simpleExplanation: expData[lang].simple,
                  keyPoints: expData[lang].keyPoints,
                  historicalContext: expData[lang].historical,
                  spiritualMeaning: expData[lang].spiritual,
                  lifeApplication: expData[lang].lifeApplication,
                  youthExplanation: expData[lang].youth
                }
              });
            }
          }
        }
      }
    }
  }

  for (const diag of DIAGRAM_TEMPLATES) {
    await prisma.diagram.upsert({
      where: { diagramKey: diag.id },
      update: {
        bookCode: diag.bookCode,
        chapter: diag.chapter,
        verses: diag.verses,
        titleEn: diag.title,
        titleTe: diag.titleTelugu,
        titleHi: diag.titleHindi,
        type: diag.type,
        data: JSON.stringify(diag)
      },
      create: {
        diagramKey: diag.id,
        bookCode: diag.bookCode,
        chapter: diag.chapter,
        verses: diag.verses,
        titleEn: diag.title,
        titleTe: diag.titleTelugu,
        titleHi: diag.titleHindi,
        type: diag.type,
        data: JSON.stringify(diag)
      }
    });
  }

  for (const plan of READING_PLANS) {
    await prisma.readingPlan.upsert({
      where: { id: plan.id },
      update: {
        title: plan.title,
        titleTelugu: plan.titleTelugu,
        titleHindi: plan.titleHindi,
        durationDays: plan.durationDays,
        category: plan.category,
        description: plan.description
      },
      create: {
        id: plan.id,
        title: plan.title,
        titleTelugu: plan.titleTelugu,
        titleHindi: plan.titleHindi,
        durationDays: plan.durationDays,
        category: plan.category,
        description: plan.description
      }
    });
  }

  for (const dv of DAILY_VERSES_DATA) {
    await prisma.dailyVerse.upsert({
      where: { dateKey: dv.dateKey },
      update: dv,
      create: dv
    });
  }

  console.log('✅ Vachanam Database successfully seeded!');
}

if (require.main === module) {
  seedDatabase()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

module.exports = { seedDatabase };
