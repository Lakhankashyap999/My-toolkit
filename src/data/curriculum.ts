import { LessonUnit } from '@/types';

export const CURRICULUM_DATA: LessonUnit[] = [
  // ─────────────────────────────────────────────────────────────
  // A0 — Absolute Beginner
  // ─────────────────────────────────────────────────────────────
  {
    id: 'a0-u1',
    level: 'A0',
    unitNumber: 1,
    title: 'Alphabets & Pronunciation (Aussprache)',
    titleHindi: 'जर्मन वर्णमाला और सही उच्चारण',
    description: 'Learn the 29 German letters, special umlauts (ä, ö, ü), and tricky consonant clusters.',
    descriptionHindi: 'German alphabet, ä, ö, ü umlauts aur sch/ch jaise sounds ko bolna sikhein.',
    estimatedMinutes: 20,
    xpReward: 50,
    topics: ['Alphabets', 'Umlauts', 'Phonetics', 'Aussprache'],
    sections: [
      {
        title: 'German Alphabet — 29 Letters Overview',
        titleHindi: 'जर्मन वर्णमाला का परिचय',
        explanation: 'German uses the standard 26 Latin letters plus three umlaut vowels (ä, ö, ü) and the sharp S (ß). Every letter is pronounced consistently.',
        explanationHindi: 'German mein 26 normal letters + 3 umlauts (ä, ö, ü) + 1 special letter (ß) hote hain. English ki tarah yahan letters silence nahi hote, sabka sound clear hota hai.',
        germanExamples: [
          { german: 'A B C D E F G', hindi: 'आ, बे, त्से, दे, ए, एफ, गे', breakdown: 'Ah, Bay, Tsay, Day, Ay, Ef, Gay' },
          { german: 'H I J K L M N', hindi: 'हा, ई, यॉट, का, एल, एम, एन', breakdown: 'Ha, Ee, Yot, Kah, El, Em, En' },
          { german: 'O P Q R S T U', hindi: 'ओ, पे, कू, एर, एस, ते, ऊ', breakdown: 'Oh, Pay, Koo, Er, Es, Tay, Oo' },
          { german: 'V W X Y Z', hindi: 'फाउ, वे, इक्स, इप्सिलॉन, त्सेट', breakdown: 'Fau, Vay, Iks, Ypsilon, Tset' },
        ],
        proTip: 'German mein V ko "F" (फ) aur W ko "V" (व) bolte hain! Jaise: Volkswagen = Folks-vaagen.',
        commonMistakeForIndians: 'Indian learners aksar "W" aur "V" ko swap kar dete hain. Yaad rakhein: W = Hindi "व" (Wasser = Vasser), V = Hindi "फ" (Vater = Fater).',
      },
      {
        title: 'Umlauts (ä, ö, ü) and Eszett (ß)',
        titleHindi: 'उम्लाउट्स और स्पेशल लेटर्स',
        explanation: 'Umlauts are vowel modifications that change the meaning of words. They are crucial for correct German communication.',
        explanationHindi: 'Umlauts (ä, ö, ü) dimaag mein bitha lo:\n• ä = English "e" in "bed" (Mädchen)\n• ö = Lips gol karo (O shape) aur bolo "E" (schön)\n• ü = Whistle shape lips banao aur bolo "Ee" (über)\n• ß = Double S ki tarah sharp "स" sound (Straße).',
        germanExamples: [
          { german: 'das Mädchen', hindi: 'लड़की (Girl)', breakdown: 'Mayd-khen' },
          { german: 'schön', hindi: 'सुंदर (Beautiful)', breakdown: 'Shern' },
          { german: 'die Tür', hindi: 'दरवाज़ा (Door)', breakdown: 'Teer (whistling lips)' },
          { german: 'die Straße', hindi: 'सड़क (Street)', breakdown: 'Shtraa-se' },
        ],
        proTip: 'Agar keyboard par Umlaut na ho, to "ä" ki jagah "ae", "ö" ki jagah "oe", "ü" ki jagah "ue" likh sakte ho!',
      },
    ],
    quiz: [
      {
        id: 'a0-u1-q1',
        question: 'German mein letter "W" ka sahi sound kya hai?',
        questionHindi: '"Wasser" mein W ka pronunciation kya hoga?',
        options: ['Hindi "व" (V sound jaise Very)', 'Hindi "डब्लू" (W sound jaise Water)', 'Hindi "फ" (F sound jaise Father)', 'Silent hota hai'],
        correctAnswer: 'Hindi "व" (V sound jaise Very)',
        explanationHindi: 'German "W" ko English "V" ki tarah pronounce karte hain. Isliye "Wasser" = "Vasser".',
        grammarTopic: 'German Pronunciation',
      },
      {
        id: 'a0-u1-q2',
        question: '"die Straße" mein "ß" ka matlab kya hai?',
        options: ['Sharp "ss" (स sound)', 'Letter B (ब sound)', 'Silent letter', 'German G'],
        correctAnswer: 'Sharp "ss" (स sound)',
        explanationHindi: '"ß" (Eszett) ka sound double "s" (स) hota hai. Straße = Shtraase.',
        grammarTopic: 'Special Letters',
      },
    ],
  },

  {
    id: 'a0-u2',
    level: 'A0',
    unitNumber: 2,
    title: 'Greetings & Introductions (Begrüßungen)',
    titleHindi: 'अभिवादन और अपना परिचय',
    description: 'Master formal and informal greetings, asking names, and saying goodbye.',
    descriptionHindi: 'Formal (Sie) aur informal (du) greetings, namaste aur parichay dena.',
    estimatedMinutes: 20,
    xpReward: 50,
    topics: ['Greetings', 'Introductions', 'Du vs Sie', 'Basics'],
    sections: [
      {
        title: 'Formal vs Informal Greetings',
        titleHindi: 'औपचारिक बनाम अनौपचारिक अभिवादन',
        explanation: 'In German culture, the distinction between formal (strangers, offices, elders) and informal (friends, peers) is strictly observed.',
        explanationHindi: 'Germany mein izzat (formality) bahut matter karti hai:\n• Formal: Guten Morgen (morning), Guten Tag (day), Guten Abend (evening), Auf Wiedersehen (bye)\n• Informal: Hallo, Hi, Tschüss (bye), Bis bald (see you soon).',
        germanExamples: [
          { german: 'Guten Tag, wie geht es Ihnen?', hindi: 'नमस्ते, आप कैसे हैं? (Formal)', breakdown: 'Goo-ten Tahg, vee gayt es Ee-nen?' },
          { german: 'Hallo! Wie geht\'s dir?', hindi: 'हेलो! तू कैसा है? (Informal)', breakdown: 'Ha-lo! Vee gayts deer?' },
          { german: 'Auf Wiedersehen!', hindi: 'फिर मिलेंगे! (Formal goodbye)', breakdown: 'Owf Vee-der-zay-en!' },
        ],
        proTip: 'Bürgeramt, train station ya doctor ke paas HAMESHA "Guten Tag" aur "Auf Wiedersehen" bolein!',
        commonMistakeForIndians: 'Officials ya interviewers ko kabhi "Hi" ya "Tschüss" na bolein. Yeh bohot informal maana jaata hai.',
      },
      {
        title: 'Introducing Yourself (Sich Vorstellen)',
        titleHindi: 'अपना परिचय देना',
        explanation: 'Key phrases for stating your name, origin country, and current residence.',
        explanationHindi: 'Apna parichay dene ke 3 sabse aasaan aur standard tareeqe:',
        germanExamples: [
          { german: 'Ich heiße Rahul.', hindi: 'मेरा नाम राहुल है।', breakdown: 'I am called Rahul.' },
          { german: 'Ich komme aus Indien.', hindi: 'मैं भारत से हूँ।', breakdown: 'I come from India.' },
          { german: 'Ich wohne in Berlin.', hindi: 'मैं बर्लिन में रहता हूँ।', breakdown: 'I live in Berlin.' },
        ],
      },
    ],
    quiz: [
      {
        id: 'a0-u2-q1',
        question: 'Doctor ke clinic mein enter karte waqt kya bolenge?',
        options: ['Guten Tag!', 'Tschüss!', 'Was geht, Bro?', 'Bis später!'],
        correctAnswer: 'Guten Tag!',
        explanationHindi: 'Formal jagahon par "Guten Tag" (Good day) standard greeting hai.',
        grammarTopic: 'Greetings',
      },
      {
        id: 'a0-u2-q2',
        question: '"I come from India" ka sahi German anuvaad kya hai?',
        options: ['Ich komme aus Indien.', 'Ich bin nach Indien.', 'Ich komme in Indien.', 'Mein Name ist Indien.'],
        correctAnswer: 'Ich komme aus Indien.',
        explanationHindi: 'Origin batane ke liye "kommen aus + [country]" use hota hai: Ich komme aus Indien.',
        grammarTopic: 'Self Introduction',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // A1 — Beginner Foundations
  // ─────────────────────────────────────────────────────────────
  {
    id: 'a1-u3',
    level: 'A1',
    unitNumber: 3,
    title: 'Der, Die, Das — Articles & Gender System',
    titleHindi: 'Der, Die, Das — जर्मन आर्टिकल्स और लिंग',
    description: 'Learn the three grammatical genders and foolproof suffix shortcuts.',
    descriptionHindi: 'Nouns ke 3 genders — masculine, feminine, neuter aur unke secret suffix rules.',
    estimatedMinutes: 25,
    xpReward: 70,
    topics: ['Der Die Das', 'Articles', 'Gender', 'Noun Endings'],
    sections: [
      {
        title: 'The 3 Genders in German',
        titleHindi: 'तीन आर्टिकल्स: Der (M), Die (F), Das (N)',
        explanation: 'Every German noun has a grammatical gender that has nothing to do with biological gender. You must learn every noun with its article.',
        explanationHindi: 'Hindi mein 2 genders hote hain (ladka/ladki), par German mein 3 hote hain:\n• DER (Masculine / पुल्लिंग)\n• DIE (Feminine / स्त्रीलिंग)\n• DAS (Neuter / नपुंसकलिंग)\nAur Plural (बहुवचन) ke liye HAMESHA "DIE" hota hai!',
        germanExamples: [
          { german: 'der Mann / der Tisch', hindi: 'आदमी / मेज़ (Masculine)' },
          { german: 'die Frau / die Lampe', hindi: 'औरत / लैंप (Feminine)' },
          { german: 'das Kind / das Buch', hindi: 'बच्चा / किताब (Neuter)' },
          { german: 'die Kinder / die Bücher', hindi: 'बच्चे / किताबें (Plural = Always DIE)' },
        ],
        proTip: 'Plural mein gender ka jhanjhat hi nahi hai! Sabhi plurals "die" lete hain.',
      },
      {
        title: 'Golden Suffix Rules (70% Accuracy Hack)',
        titleHindi: 'गोल्डन रूल्स: वर्ड की एंडिंग देखकर आर्टिकल पहचानो',
        explanation: 'German noun endings reveal their grammatical gender in 70%+ of cases.',
        explanationHindi: 'Ye shortcuts yaad kar lo, article rattne ki zaroorat nahi padegi:\n🔴 100% DIE: -ung, -heit, -keit, -schaft, -tion, -tät (Wohnung, Freiheit, Situation)\n🟢 100% DAS: -chen, -lein, -ment, -um (Mädchen, Dokument, Zentrum)\n🔵 100% DER: Days, months, seasons, compass directions, -er professions (Montag, Sommer, Lehrer).',
        germanExamples: [
          { german: 'die Wohnung', hindi: 'अपार्टमेंट (-ung = DIE)' },
          { german: 'das Dokument', hindi: 'दस्तावेज़ (-ment = DAS)' },
          { german: 'der Montag', hindi: 'सोमवार (Days = DER)' },
        ],
        commonMistakeForIndians: '"Mädchen" (girl) female hai, phir bhi uska article "DAS" hai kyunki word "-chen" par end hota hai! Grammar always beats biological gender.',
      },
    ],
    quiz: [
      {
        id: 'a1-u3-q1',
        question: '"Wohnung" (Apartment) ka sahi article kya hai?',
        options: ['die Wohnung', 'der Wohnung', 'das Wohnung', 'den Wohnung'],
        correctAnswer: 'die Wohnung',
        explanationHindi: '-ung par khatam hone wale sabhi German shabdon ka article DIE hota hai.',
        grammarTopic: 'Noun Genders',
      },
      {
        id: 'a1-u3-q2',
        question: 'Plural nouns (e.g. Bücher, Tische) ke sath kaun sa article lagta hai?',
        options: ['die (Hamesha)', 'der', 'das', 'Gender ke hisaab se badalta hai'],
        correctAnswer: 'die (Hamesha)',
        explanationHindi: 'Plural mein chahe noun masculine ho, feminine ho ya neuter — article hamesha "die" hi hota hai!',
        grammarTopic: 'Plural Articles',
      },
    ],
  },

  {
    id: 'a1-u4',
    level: 'A1',
    unitNumber: 4,
    title: 'The V2 Rule — German Word Order',
    titleHindi: 'V2 नियम — जर्मन वाक्य रचना का मूल मंत्र',
    description: 'The conjugated verb must ALWAYS occupy the second position in declarative sentences.',
    descriptionHindi: 'Verb hamesha position 2 par baithta hai chahe shuruat kisi se bhi ho.',
    estimatedMinutes: 25,
    xpReward: 80,
    topics: ['Word Order', 'V2 Rule', 'Inversion', 'Syntax'],
    sections: [
      {
        title: 'Position 2 is Fixed for Verbs',
        titleHindi: 'कन्ज्युगेटेड वर्ब हमेशा सीट नंबर 2 पर!',
        explanation: 'In German main clauses, the conjugated verb is firmly locked into the second position. The first position can hold the subject, a time phrase, or a location.',
        explanationHindi: 'German grammar ka sabse bada traffic rule: Verb HAMESHA 2nd position par rahega.\nAgar aap time se shuru karte ho ("Heute..."), to subject (ich) verb ke peeche chala jayega (Inversion).',
        germanExamples: [
          { german: 'Ich lerne heute Deutsch.', hindi: 'मैं आज जर्मन सीख रहा हूँ। (Normal: Subj + Verb + Time + Obj)' },
          { german: 'Heute lerne ich Deutsch.', hindi: 'आज सीखता हूँ मैं जर्मन। (Time + Verb + Subj + Obj)' },
          { german: 'In Berlin wohnen wir.', hindi: 'बर्लिन में रहते हैं हम। (Place + Verb + Subj)' },
        ],
        proTip: 'Yaad rakho: "Position 1" ka matlab 1 word nahi, 1 idea/element hota hai. "Am Montag" = Position 1 pura ek saath!',
        commonMistakeForIndians: 'English/Hindi sochte waqt log bolte hain: "Heute ich lerne Deutsch" (❌ GALAT!). Sahi hai: "Heute lerne ich Deutsch" (✅ SAHI!).',
      },
    ],
    quiz: [
      {
        id: 'a1-u4-q1',
        question: '"Today I am going to Berlin" ka sahi German sentence kaun sa hai?',
        options: [
          'Heute fahre ich nach Berlin.',
          'Heute ich fahre nach Berlin.',
          'Ich heute fahre nach Berlin.',
          'Fahre heute ich nach Berlin.'
        ],
        correctAnswer: 'Heute fahre ich nach Berlin.',
        explanationHindi: 'Heute (Pos 1) + fahre (Pos 2 - Verb) + ich (Pos 3 - Subject) + nach Berlin. V2 Rule followed!',
        grammarTopic: 'V2 Word Order',
      },
    ],
  },

  {
    id: 'a1-u5',
    level: 'A1',
    unitNumber: 5,
    title: 'Nominativ vs Akkusativ — Direct Objects',
    titleHindi: 'नोमिनाटिव बनाम आकुज़ाटिव (कर्म कारक)',
    description: 'Understand how masculine articles transform from der → den when receiving an action.',
    descriptionHindi: 'Subject aur direct object ka fark — sirf masculine badalta hai (der → den, ein → einen).',
    estimatedMinutes: 30,
    xpReward: 90,
    topics: ['Cases', 'Nominativ', 'Akkusativ', 'Articles Change'],
    sections: [
      {
        title: 'The Great Masculine Shift',
        titleHindi: 'सिर्फ मस्कुलिन बदलता है: Der बन जाता है Den!',
        explanation: 'Nominative is the subject (who acts). Accusative is the direct object (who receives the action). In Accusative, only masculine changes.',
        explanationHindi: 'Akkusativ case mein good news ye hai ki Feminine (die) aur Neuter (das) BILKUL NAHI BADALTE! Sirf Masculine badalta hai:\n• der → den\n• ein → einen\n• kein → keinen',
        germanExamples: [
          { german: 'Der Apfel ist rot.', hindi: 'सेब लाल है। (Nominativ: Der Apfel = Subject)' },
          { german: 'Ich esse den Apfel.', hindi: 'मैं सेब खा रहा हूँ। (Akkusativ: den Apfel = Object)' },
          { german: 'Ich habe einen Termin.', hindi: 'मेरा एक अपॉइंटमेंट है। (der Termin → einen Termin)' },
          { german: 'Ich sehe die Frau und das Kind.', hindi: 'मैं औरत और बच्चे को देखता हूँ। (No change for die / das!)' },
        ],
        proTip: 'Verbs like haben, brauchen, sehen, kaufen, essen, trinken HAMESHA Akkusativ lete hain!',
      },
    ],
    quiz: [
      {
        id: 'a1-u5-q1',
        question: '"Ich brauche ___ Ausweis." (der Ausweis = ID card)',
        options: ['den', 'der', 'dem', 'das'],
        correctAnswer: 'den',
        explanationHindi: 'Brauchen requires Akkusativ. Ausweis is masculine (der Ausweis). In Akkusativ: der → den.',
        grammarTopic: 'Akkusativ Case',
      },
    ],
  },

  {
    id: 'a1-u6',
    level: 'A1',
    unitNumber: 6,
    title: 'Modal Verbs (Modalverben) & Sentence Bracket',
    titleHindi: 'मोडाल वर्ब्स (können, müssen, möchten)',
    description: 'Express ability, necessity, and desires with the German verb bracket (Satzklammer).',
    descriptionHindi: 'Können, müssen, möchten ke sath sentence structure: main verb aakhir mein jata hai.',
    estimatedMinutes: 30,
    xpReward: 90,
    topics: ['Modalverben', 'Sentence Bracket', 'Können', 'Müssen', 'Möchten'],
    sections: [
      {
        title: 'The Verb Bracket (Satzklammer)',
        titleHindi: 'वर्ब ब्रैकेट: दूसरा वर्ब वाक्य के आखिर में!',
        explanation: 'When using a modal verb (can, must, want), the modal verb goes in position 2, and the second main verb is pushed to the very end in infinitive form.',
        explanationHindi: 'Formula:\n[Subject] + [MODAL VERB in pos 2] + ... + [MAIN VERB at the END in infinitive]\nJaise: "Ich kann Deutsch sprechen" (Main bol sakta hoon German bolna).',
        germanExamples: [
          { german: 'Ich kann Deutsch sprechen.', hindi: 'मैं जर्मन बोल सकता हूँ। (können = ability)' },
          { german: 'Wir müssen heute arbeiten.', hindi: 'हमें आज काम करना पड़ेगा। (müssen = obligation)' },
          { german: 'Ich möchte einen Kaffee trinken.', hindi: 'मैं कॉफ़ी पीना चाहता हूँ। (möchten = polite wish)' },
        ],
        proTip: 'Cafe ya restaurant mein kabhi "Ich will..." mat bolo (rude lagta hai). Hamesha "Ich möchte..." bolo!',
      },
    ],
    quiz: [
      {
        id: 'a1-u6-q1',
        question: '"We must learn German" ka sahi kram kya hai?',
        options: [
          'Wir müssen Deutsch lernen.',
          'Wir lernen müssen Deutsch.',
          'Wir müssen lernen Deutsch.',
          'Lernen wir müssen Deutsch.'
        ],
        correctAnswer: 'Wir müssen Deutsch lernen.',
        explanationHindi: 'Modal verb (müssen) position 2 par, aur main verb (lernen) sentence ke bilkul END mein infinitive form mein.',
        grammarTopic: 'Modal Verbs',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // A2 — Elementary Proficiency
  // ─────────────────────────────────────────────────────────────
  {
    id: 'a2-u7',
    level: 'A2',
    unitNumber: 7,
    title: 'Perfekt Past Tense (Das Perfekt)',
    titleHindi: 'परफेक्ट टेंस — बातचीत में भूतकाल',
    description: 'Master conversational past tense with haben/sein + Partizip II.',
    descriptionHindi: 'Daily conversation mein beeta hua kal batana — haben/sein aur ge-...-t / ge-...-en.',
    estimatedMinutes: 35,
    xpReward: 100,
    topics: ['Perfekt', 'Past Tense', 'Haben vs Sein', 'Partizip II'],
    sections: [
      {
        title: 'How Perfekt Works in Spoken German',
        titleHindi: 'स्पोकन जर्मन का पास्ट टेंस',
        explanation: 'In everyday spoken German, past events are narrated using the Perfekt tense: an auxiliary verb (haben or sein) in position 2, and the Partizip II form at the end.',
        explanationHindi: 'Spoken German mein 95% baatein Perfekt mein hoti hain:\n[Subject] + [haben/sein (pos 2)] + [rest of sentence] + [Partizip II (END)]\n• haben: regular activities (gearbeitet, gemacht, gekauft)\n• sein: movement/state change (gefahren, gegangen, aufgestanden).',
        germanExamples: [
          { german: 'Ich habe gestern gearbeitet.', hindi: 'मैंने कल काम किया। (haben + gearbeitet)' },
          { german: 'Wir sind nach Frankfurt gefahren.', hindi: 'हम फ्रैंकफर्ट गए। (sein + gefahren - movement)' },
          { german: 'Er ist um 7 Uhr aufgestanden.', hindi: 'वह 7 बजे उठा। (sein + state change)' },
        ],
        proTip: 'Agar verb movement (A to B travel) ya state change dikhata hai, to SEIN use karo. Baaki sabke sath HABEN!',
      },
    ],
    quiz: [
      {
        id: 'a2-u7-q1',
        question: '"Yesterday I traveled to Berlin" — kaun sa auxiliary aayega?',
        options: [
          'Gestern bin ich nach Berlin gefahren.',
          'Gestern habe ich nach Berlin gefahren.',
          'Gestern war ich nach Berlin gefahren.',
          'Gestern fahre ich nach Berlin.'
        ],
        correctAnswer: 'Gestern bin ich nach Berlin gefahren.',
        explanationHindi: 'Fahren (travel) movement verb hai, isliye "sein" auxiliary use hota hai (ich bin gefahren).',
        grammarTopic: 'Perfekt with Sein',
      },
    ],
  },

  {
    id: 'a2-u8',
    level: 'A2',
    unitNumber: 8,
    title: 'Dativ Case & Essential Prepositions',
    titleHindi: 'डाटिव केस (संप्रदान कारक) और प्रपोजिशन्स',
    description: 'Learn the indirect object case and prepositions that always demand Dativ.',
    descriptionHindi: 'Dativ mein articles: der/das → dem, die → der. Prepositions: mit, bei, nach, von, zu, seit, aus.',
    estimatedMinutes: 35,
    xpReward: 100,
    topics: ['Dativ', 'Cases', 'Prepositions', 'Indirect Objects'],
    sections: [
      {
        title: 'Dativ Article Transformation',
        titleHindi: 'डाटिव में आर्टिकल्स कैसे बदलते हैं?',
        explanation: 'Dativ indicates the indirect receiver of an action, answering "to whom?".',
        explanationHindi: 'Dativ chart yaad kar lo:\n• der → DEM\n• das → DEM\n• die (fem) → DER (Feminine "der" ban jata hai!)\n• die (plural) → DEN (+ noun par -n judta hai)\nFixed Dativ Prepositions: aus, bei, mit, nach, seit, von, zu.',
        germanExamples: [
          { german: 'Ich fahre mit dem Bus.', hindi: 'मैं बस से जा रहा हूँ। (der Bus → mit dem Bus)' },
          { german: 'Ich wohne bei einer Familie.', hindi: 'मैं एक परिवार के साथ रहता हूँ। (die Familie → bei einer Familie)' },
          { german: 'Ich helfe dem Mann.', hindi: 'मैं उस आदमी की मदद करता हूँ। (helfen always takes Dativ)' },
        ],
        proTip: 'Gaadi, train ya bus se travel karte waqt hamesha "mit dem..." bolo (mit dem Zug, mit dem Auto, mit dem Bus).',
      },
    ],
    quiz: [
      {
        id: 'a2-u8-q1',
        question: '"Ich fahre mit ___ Zug." (der Zug = Train)',
        options: ['dem', 'den', 'der', 'das'],
        correctAnswer: 'dem',
        explanationHindi: '"mit" hamesha Dativ mangta hai. der Zug Dativ mein "dem Zug" ban jata hai.',
        grammarTopic: 'Dativ Prepositions',
      },
    ],
  },

  {
    id: 'a2-u9',
    level: 'A2',
    unitNumber: 9,
    title: 'Subordinate Clauses with "Weil" & "Dass"',
    titleHindi: 'सबऑर्डिनेट क्लॉज़: Weil (क्योंकि) और Dass (कि)',
    description: 'Learn how subordinating conjunctions kick the verb all the way to the sentence end.',
    descriptionHindi: 'Weil aur dass aane par verb sentence ke aakhiri kone mein fek diya jata hai.',
    estimatedMinutes: 30,
    xpReward: 100,
    topics: ['Weil', 'Dass', 'Subordinate Clauses', 'Nebensatz'],
    sections: [
      {
        title: 'The "Verb-at-the-End" Phenomenon',
        titleHindi: 'कंजंक्शन आते ही वर्ब सबसे आखिर में!',
        explanation: 'Subordinating conjunctions like weil (because), dass (that), and wenn (if/when) force the conjugated verb into the final position of the subordinate clause.',
        explanationHindi: 'Normal: "Ich möchte in Deutschland arbeiten."\nWeil ke sath: "...weil ich in Deutschland arbeiten MÖCHTE." (Conjugated verb aakhiri slot par!)',
        germanExamples: [
          { german: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.', hindi: 'मैं जर्मन सीख रहा हूँ क्योंकि मैं जर्मनी में काम करना चाहता हूँ।' },
          { german: 'Ich weiß, dass Deutsch sehr wichtig ist.', hindi: 'मुझे पता है कि जर्मन बहुत महत्वपूर्ण है।' },
        ],
      },
    ],
    quiz: [
      {
        id: 'a2-u9-q1',
        question: '"Ich lerne fleißig, weil ___"',
        options: [
          'ich die Prüfung bestehen will.',
          'ich will die Prüfung bestehen.',
          'will ich die Prüfung bestehen.',
          'ich die Prüfung will bestehen.'
        ],
        correctAnswer: 'ich die Prüfung bestehen will.',
        explanationHindi: 'Weil subordinate clause banata hai — conjugated verb "will" bilkul aakhiri position par aayega.',
        grammarTopic: 'Weil Subordinate Clause',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // B1 — Intermediate & Vocational Mastery
  // ─────────────────────────────────────────────────────────────
  {
    id: 'b1-u10',
    level: 'B1',
    unitNumber: 10,
    title: 'Polite Requests with Konjunktiv II (Könnten, Würden, Hätte)',
    titleHindi: 'विनम्र जर्मन: Konjunktiv II (Könnten, Würden)',
    description: 'Master polite requests, customer service communication, and hypothetical scenarios.',
    descriptionHindi: 'Office, hospital aur daily life mein polite request karne ka formula.',
    estimatedMinutes: 35,
    xpReward: 120,
    topics: ['Konjunktiv II', 'Politeness', 'Würden', 'Könnten', 'Workplace'],
    sections: [
      {
        title: 'Sounding Respectful in Professional Settings',
        titleHindi: 'ऑफिस और अस्पताल में विनम्रता',
        explanation: 'Instead of direct commands or "ich will", Germans use Konjunktiv II to express courtesy, diplomacy, and hypothetical situations.',
        explanationHindi: 'Direct order mat do! Ye polite forms use karo:\n• Könnten Sie mir bitte helfen? (Kya aap kripya meri madad kar sakte hain?)\n• Ich würde gerne einen Termin vereinbaren. (Main appointment lena chahta hoon.)\n• Ich hätte gerne ein Glas Wasser. (Kripya mujhe paani ka glass milega?)',
        germanExamples: [
          { german: 'Könnten Sie das bitte wiederholen?', hindi: 'क्या आप कृपया इसे दोहरा सकते हैं?' },
          { german: 'Ich würde mich über eine Antwort freuen.', hindi: 'मुझे आपके उत्तर की प्रतीक्षा रहेगी (Email standard).' },
          { german: 'Wenn ich Zeit hätte, würde ich kommen.', hindi: 'अगर मेरे पास समय होता, तो मैं आता।' },
        ],
        proTip: 'German emails mein closing line: "Ich würde mich über eine positive Rückmeldung sehr freuen" — recruiters impress ho jayenge!',
      },
    ],
    quiz: [
      {
        id: 'b1-u10-q1',
        question: 'Colleague ya boss se politely repeat karne ko kaise kahenge?',
        options: [
          'Könnten Sie das bitte wiederholen?',
          'Wiederhole das sofort!',
          'Ich will das nochmal hören.',
          'Was hast du gesagt?'
        ],
        correctAnswer: 'Könnten Sie das bitte wiederholen?',
        explanationHindi: '"Könnten Sie bitte..." sabse polite aur professional tarika hai kisi request ke liye.',
        grammarTopic: 'Konjunktiv II',
      },
    ],
  },

  {
    id: 'b1-u11',
    level: 'B1',
    unitNumber: 11,
    title: 'The Passive Voice (Das Passiv)',
    titleHindi: 'पैसिव वॉइस — जब काम पर ध्यान हो, कर्ता पर नहीं',
    description: 'Learn process-oriented communication essential for healthcare, tech, and bureaucracy.',
    descriptionHindi: 'Werden + Partizip II — Hospital reports aur official paperwork mein sabse zyada use hota hai.',
    estimatedMinutes: 35,
    xpReward: 120,
    topics: ['Passiv', 'Process German', 'Vorgangspassiv', 'Healthcare German'],
    sections: [
      {
        title: 'Formation: Werden + Partizip II',
        titleHindi: 'पैसिव वॉइस का फॉर्मूला',
        explanation: 'Passive voice focuses on the action or process rather than who performed it. It is dominant in German technical documentation, nursing handover notes, and official letters.',
        explanationHindi: 'Formula: [Subject] + [werden (conjugated)] + ... + [Partizip II]\nJaise: "Der Patient wird untersucht" (Patient ki jaanch ki ja rahi hai).',
        germanExamples: [
          { german: 'Die Dokumente werden heute geprüft.', hindi: 'दस्तावेज़ों की जाँच आज की जा रही है।' },
          { german: 'Der Patient wurde erfolgreich operiert.', hindi: 'मरीज़ का सफल ऑपरेशन किया गया था (Präteritum Passiv).' },
          { german: 'Hier wird Deutsch gesprochen.', hindi: 'यहाँ जर्मन बोली जाती है।' },
        ],
        proTip: 'Ausbildung nursing mein handover ke waqt Passiv har sentence mein use hota hai!',
      },
    ],
    quiz: [
      {
        id: 'b1-u11-q1',
        question: '"The application is being processed" ka sahi German kya hai?',
        options: [
          'Der Antrag wird bearbeitet.',
          'Der Antrag hat bearbeitet.',
          'Der Antrag bearbeitet wird.',
          'Der Antrag ist bearbeiten.'
        ],
        correctAnswer: 'Der Antrag wird bearbeitet.',
        explanationHindi: 'Present passive: wird (conjugated form of werden) + bearbeitet (Partizip II).',
        grammarTopic: 'Passiv Voice',
      },
    ],
  },

  {
    id: 'b1-u12',
    level: 'B1',
    unitNumber: 12,
    title: 'Berufsdeutsch — Formal German for Work & Ausbildung',
    titleHindi: 'कार्यस्थल की जर्मन — ईमेल, अनुबंध और अधिकार',
    description: 'Master formal emails, Ausbildungsvertrag legal terms, and German workplace culture.',
    descriptionHindi: 'Formal email drafting, appointment letters (Vertrag), sick notice (Krankmeldung) aur workplace rules.',
    estimatedMinutes: 40,
    xpReward: 130,
    topics: ['Berufsdeutsch', 'Emails', 'Ausbildung', 'Workplace Rights'],
    sections: [
      {
        title: 'Professional Email Blueprint',
        titleHindi: 'जर्मन में फॉर्मल ईमेल लिखने का ढांचा',
        explanation: 'German business emails follow a very formal etiquette that determines how employers and authorities perceive you.',
        explanationHindi: 'Formal email structure:\n1. Anrede: "Sehr geehrte Damen und Herren," (unknown) ya "Sehr geehrte Frau Müller," / "Sehr geehrter Herr Schmidt,"\n2. First letter of body is SMALL (unless noun):\n   "ich schreibe Ihnen bezüglich meiner Bewerbung..."\n3. Ending: "Mit freundlichen Grüßen," + Your Name.',
        germanExamples: [
          { german: 'Sehr geehrte Damen und Herren, anbei finden Sie meinen Lebenslauf.', hindi: 'आदरणीय महोदय/महोदया, साथ में मेरा बायोडाटा संलग्न है।' },
          { german: 'Ich bitte um eine Bestätigung des Termins.', hindi: 'कृपया अपॉइंटमेंट की पुष्टि करें।' },
          { german: 'Ich bin heute leider krank und kann nicht zur Schicht kommen.', hindi: 'मैं आज अस्वस्थ हूँ और शिफ्ट पर नहीं आ सकता।' },
        ],
      },
      {
        title: 'Ausbildungsvertrag & Sick Leave (Krankmeldung)',
        titleHindi: 'कॉन्ट्रैक्ट की शर्तें और बीमारी की सूचना',
        explanation: 'Crucial terms you must understand before signing your apprenticeship or employment contract.',
        explanationHindi: 'Zaroori legal terms:\n• Probezeit (1-4 months trial period)\n• Urlaubstage (minimum 20-30 days per year)\n• Krankmeldung / AU-Bescheinigung (Doctor sick note, legally required if absent >3 days).\nWorkplace rule: Agar beemar ho, to kaam shuru hone se PEHLE call/email karo!',
        germanExamples: [
          { german: 'die Probezeit beträgt drei Monate.', hindi: 'परीक्षण अवधि 3 महीने है।' },
          { german: 'Ich reiche die Arbeitsunfähigkeitsbescheinigung morgen ein.', hindi: 'मैं कल डॉक्टर का सिक नोट जमा करूँगा।' },
        ],
      },
    ],
    quiz: [
      {
        id: 'b1-u12-q1',
        question: 'Anjaan recipient ko formal email bhejte waqt salutation kya hoga?',
        options: [
          'Sehr geehrte Damen und Herren,',
          'Hallo zusammen,',
          'Liebe Leute,',
          'Guten Tag Freunde,'
        ],
        correctAnswer: 'Sehr geehrte Damen und Herren,',
        explanationHindi: 'Standard formal salutation for unknown recipient is "Sehr geehrte Damen und Herren,".',
        grammarTopic: 'Business German',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // B2 — Advanced Fluency & Complex Structures
  // ─────────────────────────────────────────────────────────────
  {
    id: 'b2-u13',
    level: 'B2',
    unitNumber: 13,
    title: 'Infinitiv with "zu" & Multi-Part Connectors',
    titleHindi: 'इन्फिनिटिव कंस्ट्रक्शंस (um... zu, ohne... zu)',
    description: 'Learn sophisticated sentence structures using zu, um... zu, ohne... zu, and anstatt... zu.',
    descriptionHindi: 'Uddeshya (um... zu) aur bina kisi kaam ke (ohne... zu) jaisi advanced sentences banana.',
    estimatedMinutes: 40,
    xpReward: 140,
    topics: ['Zu + Infinitiv', 'Um Zu', 'Ohne Zu', 'Advanced Syntax'],
    sections: [
      {
        title: 'Purpose and Condition Clauses',
        titleHindi: 'मकसद और शर्तें व्यक्त करना',
        explanation: 'Infinitive clauses allow you to link ideas seamlessly without repeatedly stating the subject.',
        explanationHindi: '• um... zu = In order to (उद्देश्य)\n  "Ich lerne Deutsch, um in München zu studieren."\n• ohne... zu = Without doing (किए बिना)\n  "Er ging, ohne ein Wort zu sagen."\n• anstatt... zu = Instead of doing (के बजाय)\n  "Anstatt zu schlafen, lernte sie."',
        germanExamples: [
          { german: 'Ich bin hier, um meine Deutschkenntnisse zu verbessern.', hindi: 'मैं यहाँ अपने जर्मन ज्ञान को सुधारने के लिए हूँ।' },
          { german: 'Es ist wichtig, pünktlich zu sein.', hindi: 'समय का पाबंद होना बहुत महत्वपूर्ण है।' },
        ],
      },
    ],
    quiz: [
      {
        id: 'b2-u13-q1',
        question: '"I practice daily in order to pass the exam":',
        options: [
          'Ich übe täglich, um die Prüfung zu bestehen.',
          'Ich übe täglich, für die Prüfung bestehen.',
          'Ich übe täglich, weil die Prüfung bestehen.',
          'Ich übe täglich, um bestehen die Prüfung.'
        ],
        correctAnswer: 'Ich übe täglich, um die Prüfung zu bestehen.',
        explanationHindi: 'um [object] zu [verb infinitive] is the correct purpose construction in German.',
        grammarTopic: 'Infinitive Constructions',
      },
    ],
  },

  {
    id: 'b2-u14',
    level: 'B2',
    unitNumber: 14,
    title: 'Advanced Nominal Style & Participles (Partizip I & II)',
    titleHindi: 'पार्टिसिपल और एडवांस जर्मन (Partizipialkonstruktionen)',
    description: 'Read German newspapers, bureaucratic notices, and university texts like a native.',
    descriptionHindi: 'German newspapers aur university level texts ko asani se decode karna.',
    estimatedMinutes: 45,
    xpReward: 150,
    topics: ['Partizip I', 'Partizip II', 'Nominalstil', 'Advanced Reading'],
    sections: [
      {
        title: 'Turning Relative Clauses into Concise Participles',
        titleHindi: 'लंबी बातों को छोटा और सटीक बनाना',
        explanation: 'Advanced German frequently transforms clunky relative clauses into elegant participial adjectives before the noun.',
        explanationHindi: 'Partizip I (verb + d + ending): Present continuous action\nRelative: "Der Zug, der ankommt"\nAdvanced Participle: "der ankommende Zug" (Aane wali train)\n\nPartizip II: Completed action\nRelative: "Die Dokumente, die geprüft wurden"\nAdvanced: "die geprüften Dokumente" (Check kiye gaye documents).',
        germanExamples: [
          { german: 'die steigenden Lebenshaltungskosten in Deutschland', hindi: 'जर्मनी में बढ़ती हुई जीवन यापन लागत (Partizip I)' },
          { german: 'die vom Arzt unterschriebene Bescheinigung', hindi: 'डॉक्टर द्वारा हस्ताक्षरित प्रमाणपत्र (Partizip II)' },
        ],
      },
    ],
    quiz: [
      {
        id: 'b2-u14-q1',
        question: '"The rising costs" ko Partizip I mein kaise likhenge?',
        options: [
          'die steigenden Kosten',
          'die gesteigerten Kosten',
          'die Kosten steigen',
          'die steigen Kosten'
        ],
        correctAnswer: 'die steigenden Kosten',
        explanationHindi: 'steigen + d = steigend (Partizip I) + plural adjective ending -en = die steigenden Kosten.',
        grammarTopic: 'Partizip I',
      },
    ],
  },
];

// Alias exports for compatibility
export const curriculum = CURRICULUM_DATA;

export function getUnitsByLevel(level: string): LessonUnit[] {
  return CURRICULUM_DATA.filter((u) => u.level === level);
}

export function getUnitById(id: string): LessonUnit | undefined {
  return CURRICULUM_DATA.find((u) => u.id === id);
}
