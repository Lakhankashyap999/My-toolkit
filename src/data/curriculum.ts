import { LessonUnit } from '@/types';

export const CURRICULUM_DATA: LessonUnit[] = [
  {
    id: 'a0-u1',
    level: 'A0',
    unitNumber: 1,
    title: 'The German Sounds & Alphabets',
    titleHindi: 'जर्मन वर्णमाला और विशेष ध्वनियाँ',
    description: 'Master the German alphabet, umlauts (Ä, Ö, Ü), and special sounds like CH, SCH, and EI vs IE.',
    descriptionHindi: 'जर्मन के खास अक्षर (ä, ö, ü, ß) और उच्चारण के नियम सीखें, बिना किसी कन्फ्यूजन के।',
    estimatedMinutes: 12,
    xpReward: 50,
    topics: ['Alphabet', 'Umlauts (ä, ö, ü)', 'Eszett (ß)', 'CH vs SCH', 'EI vs IE rule'],
    sections: [
      {
        title: 'German Umlauts: The Three Magic Dots',
        titleHindi: 'उमलाउट (Ä, Ö, Ü) का आसान उच्चारण',
        explanation: 'German has 3 vowels with dots called Umlauts. They change how your mouth shapes the sound.',
        explanationHindi: 'उमलाउट (Dots) देखकर घबराना नहीं है! ये बहुत आसान हैं:\n• Ä: जैसे Hindi में "ऐ" (Apple / बैग वाला sound). Eg: Mädchen (लड़की)\n• Ö: मुँह को "O" बनाओ, लेकिन आवाज़ "ए" निकालो! Eg: schön (सुंदर)\n• Ü: होंठों को सीटी बजाने जैसी गोल करो और "ई" बोलो! Eg: über (ऊपर)',
        germanExamples: [
          { german: 'das Mädchen', hindi: 'लड़की', breakdown: 'Mä-d-chen (May-d-khen)' },
          { german: 'schön', hindi: 'सुंदर / अच्छा', breakdown: 'sh-ö-n' },
          { german: 'über', hindi: 'ऊपर / बारे में', breakdown: 'ü-ber' },
          { german: 'die Straße', hindi: 'सड़क', breakdown: 'ß sounds like sharp Hindi "स"' }
        ],
        proTip: 'ß (Eszett) को B मत समझना! यह डबल "S" (स) की आवाज़ देता है। जैसे Straße = Strasse.',
        commonMistakeForIndians: 'Indian learners "W" ko English jaisa "wah" bolte hain. German mein W ka sound "V" (व) hota hai! Jaise: Wasser = Vasser.'
      },
      {
        title: 'The Golden Rule: EI vs IE',
        titleHindi: 'EI और IE का गोल्डन सीक्रेट',
        explanation: 'This is the most common confusion in German spelling and pronunciation.',
        explanationHindi: 'एक जादुई ट्रिक याद रखो:\nजो अक्षर बाद में आता है, उसी की आवाज़ निकालो!\n1. E - I: बाद में "I" आया, तो आवाज़ होगी "आई" (Eye)! जैसे: mein (माइन = मेरा), nein (नाइन = नहीं).\n2. I - E: बाद में "E" आया, तो आवाज़ होगी लंबी "ई" (Eee)! जैसे: Sie (ज़ी = आप), wie (वी = कैसे).',
        germanExamples: [
          { german: 'mein', hindi: 'मेरा (Pronounced: Mine)', breakdown: 'E-I = आई' },
          { german: 'nein', hindi: 'नहीं (Pronounced: Nine)', breakdown: 'E-I = आई' },
          { german: 'Sie', hindi: 'आप (Pronounced: Zee)', breakdown: 'I-E = ई' },
          { german: 'wie', hindi: 'कैसे (Pronounced: Vee)', breakdown: 'I-E = ई' }
        ],
        proTip: 'German mein "J" hamesha "Y" (य) ki awaz deta hai! Jaise Ja = "या", Jacke = "याके".'
      }
    ],
    quiz: [
      {
        id: 'a0-u1-q1',
        type: 'multiple_choice',
        question: 'German word "mein" (my) ka sahi pronunciation kya hai?',
        questionHindi: '"mein" शब्द का सही उच्चारण क्या है?',
        options: ['मीन (Meen)', 'माइन (Mine)', 'मेन (Main)', 'मियन (Miyan)'],
        correctAnswer: 'माइन (Mine)',
        explanationHindi: 'EI rule: Jab E ke baad I aata hai, to awaz "आई" (Eye) banti hai. Isliye m-ei-n = माइन.',
        explanationEnglish: 'EI sounds like "eye". Hence mein is pronounced like mine.',
        grammarTopic: 'EI vs IE Rule'
      },
      {
        id: 'a0-u1-q2',
        type: 'multiple_choice',
        question: 'German letter "ß" (Eszett) kis sound ko represent karta hai?',
        questionHindi: '"ß" अक्षर किस आवाज़ को दर्शाता है?',
        options: ['B (ब)', 'P (प)', 'SS (तीखा स)', 'K (क)'],
        correctAnswer: 'SS (तीखा स)',
        explanationHindi: 'ß koi B nahi hai! Ye sharp "स" sound hota hai, jaise "Straße" (सड़क).',
        explanationEnglish: 'ß is Eszett or sharp S sound.',
        grammarTopic: 'Special Characters'
      },
      {
        id: 'a0-u1-q3',
        type: 'multiple_choice',
        question: 'German word "Wasser" (Water) mein "W" ka sound kya hoga?',
        questionHindi: '"Wasser" में W का उच्चारण क्या है?',
        options: ['व (V)', 'w (अंग्रेजी वाला वाह)', 'ब (B)', 'ह (H)'],
        correctAnswer: 'व (V)',
        explanationHindi: 'German mein W hamesha Hindi ke "व" (V) ki tarah bola jata hai. Wasser = वासर.',
        explanationEnglish: 'German W is pronounced like English V.',
        grammarTopic: 'Consonant Pronunciation'
      }
    ]
  },
  {
    id: 'a0-u2',
    level: 'A0',
    unitNumber: 2,
    title: 'First Greetings & Introductions',
    titleHindi: 'नमस्ते और अपना परिचय देना',
    description: 'Learn how to greet respectfully, introduce yourself, and ask someone how they are doing.',
    descriptionHindi: 'जर्मनी में किसी से मिलना, हाल-चाल पूछना और अपना नाम व देश बताना सीखें।',
    estimatedMinutes: 15,
    xpReward: 60,
    topics: ['Guten Tag / Hallo', 'Ich heiße...', 'Woher kommst du / kommen Sie?', 'Du vs Sie Formality'],
    sections: [
      {
        title: 'Greetings for Different Times of Day',
        titleHindi: 'दिन के समय के अनुसार अभिवादन',
        explanation: 'Germans are punctual and have specific greetings depending on the clock.',
        explanationHindi: 'जर्मनी में समय के हिसाब से नमस्ते बोला जाता है:\n• Guten Morgen: सुबह 11 बजे तक (Good Morning)\n• Guten Tag: सुबह 11 से शाम 6 बजे तक (Good Day)\n• Guten Abend: शाम 6 बजे के बाद (Good Evening)\n• Gute Nacht: सिर्फ सोते समय (Good Night - ध्यान दें: इसमें "Gute" है, "Guten" नहीं!)',
        germanExamples: [
          { german: 'Guten Morgen!', hindi: 'शुभ प्रभात (Morning)' },
          { german: 'Guten Tag!', hindi: 'नमस्ते / शुभ दिन (Day)' },
          { german: 'Guten Abend!', hindi: 'शुभ संध्या (Evening)' },
          { german: 'Tschüss!', hindi: 'बाय-बाय (Casual Goodbye)' },
          { german: 'Auf Wiedersehen!', hindi: 'फिर मिलेंगे (Formal Goodbye)' }
        ],
        proTip: 'Berlin aur North Germany mein log casual greeting ke liye "Moin" ya "Hallo" bolte hain, jabki Bavaria/South mein "Grüß Gott" bolte hain!'
      },
      {
        title: 'Introducing Yourself: Name & Country',
        titleHindi: 'अपना नाम और देश बताना',
        explanation: 'Three core ways to state your identity in German.',
        explanationHindi: 'अपना परिचय देने के 3 तरीके:\n1. Ich heiße Lakhan. (मेरा नाम लाखन है)\n2. Ich bin Lakhan. (मैं लाखन हूँ)\n3. Mein Name ist Lakhan. (मेरा नाम लाखन है)\n\nकहाँ से आए हो:\n• Ich komme aus Indien. (मैं भारत से आता हूँ / आया हूँ)\n• Ich wohne in Berlin. (मैं बर्लिन में रहता हूँ)',
        germanExamples: [
          { german: 'Ich heiße Rahul.', hindi: 'मेरा नाम राहुल है।' },
          { german: 'Ich komme aus Indien.', hindi: 'मैं भारत से हूँ।' },
          { german: 'Ich lerne Deutsch.', hindi: 'मैं जर्मन सीख रहा हूँ।' }
        ],
        commonMistakeForIndians: 'Hindi mein hum bolte hain "Main India se hoon". German mein hamesha verb "kommen" (आना) use hota hai: "Ich komme aus Indien" (न कि Ich bin aus Indien).'
      }
    ],
    quiz: [
      {
        id: 'a0-u2-q1',
        type: 'multiple_choice',
        question: 'Office ya formal situation mein bye bolte waqt kya bolna chahiye?',
        questionHindi: 'औपचारिक स्थिति में विदाई के समय क्या बोलना चाहिए?',
        options: ['Auf Wiedersehen', 'Tschüss', 'Bis gleich', 'Moin'],
        correctAnswer: 'Auf Wiedersehen',
        explanationHindi: 'Tschüss casual (dosto ke sath) hota hai. Formal / Office mein hamesha "Auf Wiedersehen" bola jata hai.',
        explanationEnglish: '"Auf Wiedersehen" is the respectful formal farewell.',
        grammarTopic: 'Politeness & Formality'
      },
      {
        id: 'a0-u2-q2',
        type: 'multiple_choice',
        question: '"Main Bharat se hoon" ko German mein kaise kahenge?',
        questionHindi: '"मैं भारत से हूँ" को जर्मन में कैसे कहेंगे?',
        options: ['Ich komme aus Indien.', 'Ich bin in Indien.', 'Ich wohnen Indien.', 'Indien komme ich.'],
        correctAnswer: 'Ich komme aus Indien.',
        explanationHindi: 'Desh batane ke liye "kommen aus" (come from) structure use hota hai: Ich komme aus Indien.',
        explanationEnglish: 'Use "Ich komme aus..." for origin.',
        grammarTopic: 'Personal Introduction'
      }
    ]
  },
  {
    id: 'a1-u3',
    level: 'A1',
    unitNumber: 3,
    title: 'The Trinity: Der, Die, Das & Gender Secrets',
    titleHindi: 'जर्मन आर्टिकल्स: Der, Die, Das का रहस्य',
    description: 'Cracking the biggest nightmare of German learners: noun genders with high-yield shortcut endings.',
    descriptionHindi: 'हर जर्मन शब्द का लिंग (Masculine, Feminine, Neuter) पहचानने की जादुई ट्रिक्स।',
    estimatedMinutes: 20,
    xpReward: 80,
    topics: ['der (Masculine)', 'die (Feminine)', 'das (Neuter)', 'Ending Rules (-ung, -heit, -ment, -chen)'],
    sections: [
      {
        title: 'Why Everything Has a Gender in German',
        titleHindi: 'जर्मन में निर्जीव चीज़ों का भी जेंडर क्यों होता है?',
        explanation: 'In German, every single noun is capitalized and has one of three genders: Der (M), Die (F), or Das (N).',
        explanationHindi: 'हिंदी में भी हम कहते हैं: "कुर्सी गिर **गई**" (स्त्रीलिंग) और "चाकू गिर **गया**" (पुल्लिंग). German में भी ठीक ऐसा ही है, बस यहाँ एक तीसरा जेंडर भी है: "Das" (Neuter / तटस्थ)!\n\n💡 **Color Code जो हमेशा याद रखना**:\n🔵 **DER (Blue)** = Masculine (पुल्लिंग)\n🔴 **DIE (Red)** = Feminine (स्त्रीलिंग)\n🟢 **DAS (Green)** = Neuter (नपुंसक लिंग)\n🟠 **DIE (Orange)** = All Plurals (सभी बहुवचन)',
        germanExamples: [
          { german: 'der Tisch', hindi: 'मेज़ / Table (Masculine)' },
          { german: 'die Lampe', hindi: 'लैंप / Lamp (Feminine)' },
          { german: 'das Buch', hindi: 'किताब / Book (Neuter)' },
          { german: 'die Bücher', hindi: 'किताबें / Books (Plural = Always DIE)' }
        ],
        proTip: 'जर्मनी में सभी Nouns (संज्ञा) का पहला अक्षर CAPITAL में लिखा जाता है! Jaise: das Buch, der Name, die Stadt.'
      },
      {
        title: 'The Magic Endings (100% Guaranteed Rules)',
        titleHindi: 'जादुई प्रत्यय: शब्द देखकर जेंडर पहचानो',
        explanation: 'Memorize these suffixes and you will instantly know 60% of all German genders without guessing!',
        explanationHindi: '1. **100% DIE (Feminine)**: अगर किसी शब्द के अंत में ये आता है:\n   • **-ung**: die Zeitung (अखबार), die Wohnung (घर/अपार्टमेंट), die Rechnung (बिल)\n   • **-heit / -keit**: die Gesundheit (सेहत), die Möglichkeit (अवसर)\n   • **-schaft**: die Mannschaft (टीम), die Freundschaft (दोस्ती)\n   • **-tät**: die Universität (यूनिवर्सिटी)\n\n2. **100% DAS (Neuter)**:\n   • **-chen / -lein** (छोटा रूप): das Mädchen (लड़की), das Brötchen (ब्रेड रोल)\n   • **-ment**: das Dokument (दस्तावेज़), das Instrument\n\n3. **100% DER (Masculine)**:\n   • Days, Months, Seasons: der Montag (सोमवार), der Januar (जनवरी), der Sommer (गर्मी)',
        germanExamples: [
          { german: 'die Wohnung', hindi: 'फ्लैट (-ung ending = 100% DIE)' },
          { german: 'die Universität', hindi: 'यूनिवर्सिटी (-tät ending = 100% DIE)' },
          { german: 'das Mädchen', hindi: 'लड़की (-chen ending = 100% DAS)' },
          { german: 'der Freitag', hindi: 'शुक्रवार (दिन = 100% DER)' }
        ],
        commonMistakeForIndians: 'Mädchen matlab "ladki" hota hai, isliye log "die Mädchen" bol dete hain. Par "-chen" suffix ki wajah se ye hamesha "DAS Mädchen" hota hai!'
      }
    ],
    quiz: [
      {
        id: 'a1-u3-q1',
        type: 'multiple_choice',
        question: '"Wohnung" (Flat/Apartment) ke aage kaun sa article aayega?',
        questionHindi: '"Wohnung" के आगे कौन सा आर्टिकल आएगा?',
        options: ['die', 'der', 'das', 'den'],
        correctAnswer: 'die',
        explanationHindi: 'Ending Trick: Jis bhi word ke piche "-ung" lagta hai, wo 100% Feminine hota hai, isliye DIE Wohnung!',
        explanationEnglish: 'Words ending in -ung are always feminine (die).',
        grammarTopic: 'Noun Genders'
      },
      {
        id: 'a1-u3-q2',
        type: 'multiple_choice',
        question: 'Plural (बहुवचन) shabdon ke aage kaun sa definite article lagta hai?',
        questionHindi: 'बहुवचन शब्दों के आगे कौन सा आर्टिकल लगता है?',
        options: ['die (Hamesha)', 'der', 'das', 'den'],
        correctAnswer: 'die (Hamesha)',
        explanationHindi: 'German mein chahe singular Der ho ya Das ya Die, Plural bante hi sabka article "DIE" ho jata hai!',
        explanationEnglish: 'All plural nouns take the definite article "die".',
        grammarTopic: 'Plural Articles'
      }
    ]
  },
  {
    id: 'a1-u4',
    level: 'A1',
    unitNumber: 4,
    title: 'The German V2 Rule (Word Order)',
    titleHindi: 'जर्मन वाक्य संरचना: Verb का दूसरा स्थान',
    description: 'The golden rule of German grammar: the finite verb is ALWAYS in the second position of a main clause.',
    descriptionHindi: 'जर्मन पुलिस का सबसे कड़ा नियम: क्रिया (Verb) हमेशा पोजीशन 2 पर ही बैठेगी!',
    estimatedMinutes: 18,
    xpReward: 70,
    topics: ['V2 Rule', 'Subject Inversion', 'Time-Manner-Place basics'],
    sections: [
      {
        title: 'The Sacred Position 2 Rule',
        titleHindi: 'पोजीशन 2 का अटूट नियम',
        explanation: 'In a normal German statement, the conjugated verb MUST ALWAYS be in position 2. Position 1 can be anything!',
        explanationHindi: 'जर्मन में एक कानून है: **Verb हमेशा 2nd Position पर रहेगा**।\n\nअगर Position 1 पर Subject है:\n• [Ich] [lerne] [heute] [Deutsch].\n  (1: मैं) (2: सीख रहा हूँ) (3: आज) (4: जर्मन)\n\nलेकिन अगर आपने समय (Time) को पहले बोल दिया:\n• [Heute] [lerne] [ich] [Deutsch]!\n  (1: आज) (2: सीख रहा हूँ) (3: मैं) (4: जर्मन)\n\nदेखा? "Heute" नंबर 1 पर आया, तो "lerne" (verb) अपनी जगह नहीं छोड़ा, वो 2nd पर ही रहा, और "ich" (Subject) 3rd पर चला गया!',
        germanExamples: [
          { german: 'Ich trinke Kaffee.', hindi: 'मैं कॉफ़ी पीता हूँ। (Verb "trinke" = Pos 2)' },
          { german: 'Morgen fliege ich nach Berlin.', hindi: 'कल मैं बर्लिन उड़ रहा हूँ। (Verb "fliege" = Pos 2)' },
          { german: 'In Indien essen wir Roti.', hindi: 'भारत में हम रोटी खाते हैं। (Verb "essen" = Pos 2)' }
        ],
        proTip: 'Position 1 ka matlab "ek word" nahi hota, "ek information block" hota hai! Jaise "Am Wochenende" (Weekend par) pura milkar Position 1 hai, aur verb 2nd par aayega.',
        commonMistakeForIndians: 'English mein bolte hain: "Today I learn German". Indian log German mein bol dete hain: "Heute ich lerne Deutsch" — YE BILKUL GALAT HAI! German mein hoga: "Heute lerne ich Deutsch".'
      }
    ],
    quiz: [
      {
        id: 'a1-u4-q1',
        type: 'sentence_order',
        question: 'Sahi German sentence order chuniye: "Aaj main chai pita hoon"',
        questionHindi: '"आज मैं चाय पीता हूँ" का सही क्रम क्या होगा?',
        options: ['Heute', 'trinke', 'ich', 'Tee.'],
        correctAnswer: 'Heute trinke ich Tee.',
        explanationHindi: 'V2 Rule: "Heute" position 1 par hai, isliye verb "trinke" ko position 2 par aana padega. "ich" position 3 par chala gaya.',
        explanationEnglish: 'Verb takes position 2. Position 1 is Heute, so subject "ich" moves to position 3.',
        grammarTopic: 'V2 Word Order'
      },
      {
        id: 'a1-u4-q2',
        type: 'multiple_choice',
        question: 'Inme se kaun sa sentence grammatically SAHI hai?',
        questionHindi: 'इनमें से कौन सा वाक्य व्याकरण की दृष्टि से सही है?',
        options: [
          'Am Montag fahre ich nach München.',
          'Am Montag ich fahre nach München.',
          'Ich nach München am Montag fahre.',
          'Fahre am Montag ich nach München.'
        ],
        correctAnswer: 'Am Montag fahre ich nach München.',
        explanationHindi: '"Am Montag" (Pos 1) ke turant baad verb "fahre" (Pos 2) aana chahiye. Isliye pehla option bilkul sahi hai!',
        explanationEnglish: 'Inversion occurs when time element starts the sentence.',
        grammarTopic: 'V2 Word Order'
      }
    ]
  },
  {
    id: 'a1-u5',
    level: 'A1',
    unitNumber: 5,
    title: 'The Hindi "को" Bridge: Nominativ vs Akkusativ',
    titleHindi: 'कारक का जादू: Nominativ बनाम Akkusativ',
    description: 'Master German cases by connecting them directly to Indian grammar (कर्ता vs कर्म कारक).',
    descriptionHindi: 'जब भी किसी चीज़ "को" कुछ किया जाए, तो वह Akkusativ बन जाती है। जानिए "der" कब "den" बनता है।',
    estimatedMinutes: 22,
    xpReward: 90,
    topics: ['Nominativ (Subject)', 'Akkusativ (Direct Object)', 'der -> den transformation', 'ein -> einen'],
    sections: [
      {
        title: 'Connecting German Cases to Hindi Karak',
        titleHindi: 'हिंदी व्याकरण से समझें Akkusativ',
        explanation: 'Cases in German are just like Karaka in Hindi/Sanskrit. Nominativ is Karta (Doer) and Akkusativ is Karm (Object).',
        explanationHindi: 'German Cases से डरने की बिल्कुल जरूरत नहीं है!\n\n1. **Nominativ (कर्ता कारक)**: जो काम कर रहा है (Subject).\n   • **Der Mann** schläft. (आदमी सो रहा है - आदमी Subject है)\n\n2. **Akkusativ (कर्म कारक / "को" का नियम)**: जिसके ऊपर काम का असर पड़ रहा है (Direct Object).\n   • Hindi: "मैंने सेब **को** खाया" या "मैं चाय **को** पीता हूँ".\n\n⚡ **The Magic Secret**:\nAkkusativ mein sirf aur sirf **MASCULINE (Der)** badalta hai! Baki sab waise ke waise rehte hain:\n• 🔵 **der -> den** (ein -> **einen**)\n• 🔴 **die -> die** (kuch nahi badalta!)\n• 🟢 **das -> das** (kuch nahi badalta!)\n• 🟠 **die (Plural) -> die** (kuch nahi badalta!)',
        germanExamples: [
          { german: 'Der Apfel ist rot.', hindi: 'सेब लाल है। (Nominativ = Subject = der Apfel)' },
          { german: 'Ich esse den Apfel.', hindi: 'मैं सेब (को) खाता हूँ। (Akkusativ = Object = den Apfel!)' },
          { german: 'Ich habe einen Hund.', hindi: 'मेरे पास एक कुत्ता है। (der Hund -> einen Hund)' },
          { german: 'Ich trinke die Milch.', hindi: 'मैं दूध पीता हूँ। (die Milch does not change)' }
        ],
        proTip: 'Verbs like haben (to have), essen (to eat), trinken (to drink), kaufen (to buy), brauchen (to need) ALWAYS take Akkusativ!',
        commonMistakeForIndians: 'Student bolte hain "Ich habe ein Hund". Galat! Hund masculine hai (der Hund), isliye "Ich habe einen Hund" hoga.'
      }
    ],
    quiz: [
      {
        id: 'a1-u5-q1',
        type: 'multiple_choice',
        question: '"Ich brauche ___ Schlüssel (der Schlüssel = key)". Khali jagah bhariye:',
        questionHindi: '"Ich brauche ___ Schlüssel." सही विकल्प चुनें:',
        options: ['den', 'der', 'das', 'die'],
        correctAnswer: 'den',
        explanationHindi: 'Brauchen (zarurat hona) Akkusativ verb hai. Aur "Schlüssel" masculine hai (der Schlüssel). Akkusativ mein "der" ban jata hai "den"!',
        explanationEnglish: 'Brauchen requires the accusative case. Der Schlüssel becomes den Schlüssel.',
        grammarTopic: 'Akkusativ Case'
      },
      {
        id: 'a1-u5-q2',
        type: 'multiple_choice',
        question: 'Akkusativ case mein inme se kaun sa article badalta hai?',
        questionHindi: 'Akkusativ में इनमें से कौन सा आर्टिकल बदलता है?',
        options: ['Sirf Masculine (der -> den)', 'Feminine (die)', 'Neuter (das)', 'Plural (die)'],
        correctAnswer: 'Sirf Masculine (der -> den)',
        explanationHindi: 'Akkusativ ka sabse bada rahasya: Feminine, Neuter aur Plural bilkul same rehte hain. Sirf Masculine "der" badal kar "den" banta hai.',
        explanationEnglish: 'Only masculine articles change in the accusative case (der to den, ein to einen).',
        grammarTopic: 'Case Rules'
      }
    ]
  },
  {
    id: 'a1-u6',
    level: 'A1',
    unitNumber: 6,
    title: 'The German Train (Deutsche Bahn) & Numbers',
    titleHindi: 'जर्मन ट्रेन और समय व गिनती समझना',
    description: 'Numbers from 0-100, reading the 24-hour clock, and surviving Deutsche Bahn announcements.',
    descriptionHindi: 'जर्मनी में ट्रेन स्टेशन की घोषणाएं समझना, प्लेटफॉर्म बदलना और टिकट समय देखना सीखें।',
    estimatedMinutes: 16,
    xpReward: 75,
    topics: ['Numbers 0-100', '24-hour Time', 'DB Station Announcements', 'Gleis & Verspätung'],
    sections: [
      {
        title: 'The German Backward Numbers Trick',
        titleHindi: 'जर्मन में उल्टी गिनती: पहले इकाई, फिर दहाई',
        explanation: 'From 21 onwards, Germans say the ones first, then "und" (and), then the tens!',
        explanationHindi: 'जैसे हिंदी में हम कहते हैं "पच्चीस" (5 और 20) — German में भी ठीक यही होता है!\n• 21 = einundzwanzig (एक और बीस / one-and-twenty)\n• 25 = fünfundzwanzig (पाँच और बीस / five-and-twenty)\n• 48 = achtundvierzig (आठ और चालीस / eight-and-forty)\n\n💡 ध्यान रखें: अंग्रेजी में "twenty-one" बोलते हैं, लेकिन जर्मन में हिंदी की तरह "एक-और-बीस" बोलते हैं!',
        germanExamples: [
          { german: 'eins, zwei, drei', hindi: 'एक, दो, तीन' },
          { german: 'einundzwanzig', hindi: 'इक्कीस (1 + und + 20)' },
          { german: 'fünfundfünfzig', hindi: 'पचपन (5 + und + 50)' },
          { german: 'hundert', hindi: 'सौ (100)' }
        ],
        proTip: '1 ko eins bolte hain, par jab wo 21 mein judta hai to "s" hat jata hai: einundzwanzig (not einsundzwanzig).'
      },
      {
        title: 'Surviving the Train Station (Am Bahnhof)',
        titleHindi: 'स्टेशन पर जरूरी जर्मन शब्द',
        explanation: 'Essential vocabulary for travelling with Deutsche Bahn (DB) across Germany.',
        explanationHindi: 'जर्मनी में ये 4 शब्द आपकी जान बचाएंगे:\n• **das Gleis**: प्लेटफॉर्म (जैसे Gleis 4 = Platform 4)\n• **die Verspätung**: देरी / Delay (जैसे "15 Minuten Verspätung")\n• **der Zug fällt aus**: ट्रेन रद्द हो गई है! (Train is cancelled)\n• **der Umstieg**: ट्रेन बदलना / Connection change',
        germanExamples: [
          { german: 'Vorsicht an Gleis 3!', hindi: 'प्लेटफॉर्म 3 पर सावधान रहें!' },
          { german: 'Der Zug nach Frankfurt hat 10 Minuten Verspätung.', hindi: 'फ्रैंकफर्ट जाने वाली ट्रेन 10 मिनट लेट है।' },
          { german: 'Entschuldigung, wo ist Gleis 7?', hindi: 'माफ़ कीजिये, प्लेटफॉर्म 7 कहाँ है?' }
        ],
        commonMistakeForIndians: 'Platform ko German mein "Bahnsteig" ya "Gleis" kehte hain. Ticket par hamesha "Gleis" likha hota hai.'
      }
    ],
    quiz: [
      {
        id: 'a1-u6-q1',
        type: 'multiple_choice',
        question: 'German mein "45" ko kaise bolte hain?',
        questionHindi: 'जर्मन में "45" को कैसे बोला जाता है?',
        options: ['fünfundvierzig (5 + und + 40)', 'vierzigundfünf', 'fünfzigvier', 'vierundfünfzig'],
        correctAnswer: 'fünfundvierzig (5 + und + 40)',
        explanationHindi: 'German mein pehle units aate hain phir tens: fünf (5) + und (aur) + vierzig (40) = fünfundvierzig.',
        explanationEnglish: 'Numbers from 21-99 state the units first, then "und", then the tens.',
        grammarTopic: 'German Numbers'
      },
      {
        id: 'a1-u6-q2',
        type: 'multiple_choice',
        question: 'Station announcement mein suna: "Der Zug nach München fällt aus". Iska kya matlab hai?',
        questionHindi: '"Der Zug nach München fällt aus" का क्या अर्थ है?',
        options: ['म्यूनिख वाली ट्रेन कैंसल हो गई है', 'ट्रेन समय पर है', 'ट्रेन प्लेटफॉर्म 2 पर है', 'ट्रेन में खाना मिलेगा'],
        correctAnswer: 'म्यूनिख वाली ट्रेन कैंसल हो गई है',
        explanationHindi: '"Ausfallen" ka matlab hota hai cancel hona. "fällt aus" = cancelled.',
        explanationEnglish: '"fällt aus" means cancelled.',
        grammarTopic: 'Travel German'
      }
    ]
  }
];
