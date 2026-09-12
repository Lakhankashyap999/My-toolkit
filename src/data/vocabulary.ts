import { VocabItem } from '@/types';

export const VOCABULARY_DATA: VocabItem[] = [
  // ── A0 Level ─────────────────────────────────────────────────
  {
    id: 'v-001',
    german: 'Hallo',
    hindi: 'नमस्ते / हेलो',
    english: 'Hello',
    category: 'phrases',
    level: 'A0',
    exampleGerman: 'Hallo! Wie geht es dir?',
    exampleHindi: 'नमस्ते! तुम कैसे हो?',
    memoryHook: 'Universal greeting, informal setting mein use karo.',
    tags: ['greetings', 'basics']
  },
  {
    id: 'v-002',
    german: 'Danke',
    hindi: 'धन्यवाद',
    english: 'Thank you',
    category: 'phrases',
    level: 'A0',
    exampleGerman: 'Vielen Dank für Ihre Hilfe!',
    exampleHindi: 'आपकी मदद के लिए बहुत-बहुत धन्यवाद!',
    memoryHook: '"Dhan-ke" sounds like Dhanyavaad in Hindi!',
    tags: ['polite', 'basics']
  },
  {
    id: 'v-003',
    german: 'Bitte',
    hindi: 'कृपया / यहाँ लीजिए / वेलकम',
    english: 'Please / You are welcome / Here you go',
    category: 'phrases',
    level: 'A0',
    exampleGerman: 'Ein Wasser, bitte.',
    exampleHindi: 'एक पानी, कृपया।',
    memoryHook: '"Bitte" 3 jagah kaam aata hai: Please, You are welcome, aur kisi ko cheez thamaate waqt.',
    tags: ['polite', 'basics']
  },
  {
    id: 'v-004',
    german: 'Ja',
    hindi: 'हाँ',
    english: 'Yes',
    category: 'basics',
    level: 'A0',
    exampleGerman: 'Ja, ich verstehe das.',
    exampleHindi: 'हाँ, मैं यह समझता हूँ।',
    tags: ['basics']
  },
  {
    id: 'v-005',
    german: 'Nein',
    hindi: 'नहीं',
    english: 'No',
    category: 'basics',
    level: 'A0',
    exampleGerman: 'Nein, das brauche ich nicht.',
    exampleHindi: 'नहीं, मुझे इसकी ज़रूरत नहीं है।',
    tags: ['basics']
  },
  {
    id: 'v-006',
    german: 'Entschuldigung',
    hindi: 'माफ़ कीजिए / सुनिए',
    english: 'Excuse me / Sorry',
    category: 'phrases',
    level: 'A0',
    exampleGerman: 'Entschuldigung, wo ist der Bahnhof?',
    exampleHindi: 'माफ़ कीजिए, स्टेशन कहाँ है?',
    memoryHook: 'Ent-schul-di-gung: SCH ko "shh" bolo. Strangers se rasta poochte waqt use karo.',
    tags: ['greetings', 'polite']
  },
  {
    id: 'v-007',
    german: 'Wasser',
    article: 'das',
    plural: 'die Wasser',
    hindi: 'पानी',
    english: 'Water',
    category: 'nouns',
    level: 'A0',
    exampleGerman: 'Ich trinke gerne Wasser.',
    exampleHindi: 'मुझे पानी पीना पसंद है।',
    memoryHook: 'Das Wasser — W ko "V" bolo: Vasser.',
    tags: ['food', 'daily']
  },
  {
    id: 'v-008',
    german: 'Brot',
    article: 'das',
    plural: 'die Brote',
    hindi: 'ब्रेड / रोटी',
    english: 'Bread',
    category: 'nouns',
    level: 'A0',
    exampleGerman: 'Das Brot schmeckt sehr gut.',
    exampleHindi: 'ब्रेड बहुत स्वादिष्ट है।',
    tags: ['food']
  },
  {
    id: 'v-009',
    german: 'Kaffee',
    article: 'der',
    plural: 'die Kaffees',
    hindi: 'कॉफ़ी',
    english: 'Coffee',
    category: 'nouns',
    level: 'A0',
    exampleGerman: 'Möchten Sie einen Kaffee?',
    exampleHindi: 'क्या आप कॉफ़ी लेना चाहेंगे?',
    memoryHook: 'Drinks mein mostly DER: der Kaffee, der Tee, der Saft.',
    tags: ['drinks']
  },
  {
    id: 'v-010',
    german: 'Haus',
    article: 'das',
    plural: 'die Häuser',
    hindi: 'घर / मकान',
    english: 'House',
    category: 'nouns',
    level: 'A0',
    exampleGerman: 'Das Haus ist sehr groß.',
    exampleHindi: 'घर बहुत बड़ा है।',
    memoryHook: 'Haus sounds like House. Article is DAS.',
    tags: ['housing']
  },

  // ── A1 Level ─────────────────────────────────────────────────
  {
    id: 'v-011',
    german: 'Wohnung',
    article: 'die',
    plural: 'die Wohnungen',
    hindi: 'फ़्लैट / अपार्टमेंट',
    english: 'Apartment / Flat',
    category: 'nouns',
    level: 'A1',
    exampleGerman: 'Ich suche eine schöne Wohnung in Berlin.',
    exampleHindi: 'मैं बर्लिन में एक अच्छा अपार्टमेंट ढूंढ रहा हूँ।',
    memoryHook: '-ung ending hamesha 100% DIE hoti hai!',
    tags: ['housing', 'bureaucracy']
  },
  {
    id: 'v-012',
    german: 'Bahnhof',
    article: 'der',
    plural: 'die Bahnhöfe',
    hindi: 'रेलवे स्टेशन',
    english: 'Train station',
    category: 'nouns',
    level: 'A1',
    exampleGerman: 'Der Zug kommt am Hauptbahnhof an.',
    exampleHindi: 'ट्रेन मुख्य रेलवे स्टेशन पर आती है।',
    memoryHook: 'Bahn (train) + Hof (court/yard) = der Bahnhof.',
    tags: ['travel', 'places']
  },
  {
    id: 'v-013',
    german: 'Termin',
    article: 'der',
    plural: 'die Termine',
    hindi: 'अपॉइंटमेंट / तय समय',
    english: 'Appointment',
    category: 'nouns',
    level: 'A1',
    exampleGerman: 'Haben Sie einen Termin beim Arzt?',
    exampleHindi: 'क्या डॉक्टर के पास आपका अपॉइंटमेंट है?',
    memoryHook: 'Germany ka sabse zaroori word! Bina Termin ke kahin entry nahi milti.',
    tags: ['bureaucracy', 'daily']
  },
  {
    id: 'v-014',
    german: 'Ausweis',
    article: 'der',
    plural: 'die Ausweise',
    hindi: 'पहचान पत्र (ID Card)',
    english: 'ID card / Identity proof',
    category: 'bureaucracy',
    level: 'A1',
    exampleGerman: 'Bitte zeigen Sie Ihren Ausweis.',
    exampleHindi: 'कृपया अपना पहचान पत्र दिखाइए।',
    memoryHook: 'Aus (out) + weisen (to show) = Jo identity dikhaye = der Ausweis.',
    tags: ['bureaucracy', 'documents']
  },
  {
    id: 'v-015',
    german: 'arbeiten',
    hindi: 'काम करना',
    english: 'To work',
    category: 'verbs',
    level: 'A1',
    exampleGerman: 'Ich arbeite als Krankenpfleger.',
    exampleHindi: 'मैं नर्स के रूप में काम करता हूँ।',
    memoryHook: 'Arbeit = work, arbeiten = to work.',
    tags: ['verbs', 'work']
  },
  {
    id: 'v-016',
    german: 'verstehen',
    hindi: 'समझना',
    english: 'To understand',
    category: 'verbs',
    level: 'A1',
    exampleGerman: 'Ich verstehe das nicht ganz.',
    exampleHindi: 'मैं यह पूरी तरह नहीं समझ पा रहा हूँ।',
    memoryHook: '"Ich verstehe nur Bahnhof" ek German idiom hai jiska matlab hai "mujhe kuch samajh nahi aa raha!"',
    tags: ['verbs', 'basics']
  },
  {
    id: 'v-017',
    german: 'Rechnung',
    article: 'die',
    plural: 'die Rechnungen',
    hindi: 'बिल / इनवॉइस',
    english: 'Bill / Invoice',
    category: 'nouns',
    level: 'A1',
    exampleGerman: 'Die Rechnung bitte!',
    exampleHindi: 'बिल लाइए, कृपया!',
    memoryHook: '-ung ending = DIE! Restaurant mein "Die Rechnung, bitte" standard phrase hai.',
    tags: ['restaurant', 'money']
  },
  {
    id: 'v-018',
    german: 'pünktlich',
    hindi: 'समय पर / पाबंद',
    english: 'Punctual / On time',
    category: 'adjectives',
    level: 'A1',
    exampleGerman: 'In Deutschland muss man immer pünktlich sein.',
    exampleHindi: 'जर्मनी में हमेशा समय का पाबंद होना पड़ता है।',
    memoryHook: 'Punkt = Point. "To the point of time" = pünktlich.',
    tags: ['adjectives', 'culture']
  },

  // ── A2 Level ─────────────────────────────────────────────────
  {
    id: 'v-019',
    german: 'Miete',
    article: 'die',
    plural: 'die Mieten',
    hindi: 'किराया',
    english: 'Rent',
    category: 'nouns',
    level: 'A2',
    exampleGerman: 'Wie hoch ist die Miete inklusive Nebenkosten?',
    exampleHindi: 'अतिरिक्त खर्चों सहित किराया कितना है?',
    memoryHook: 'Kaltmiete = Base rent without heat/water. Warmmiete = Final rent with bills.',
    tags: ['housing', 'money']
  },
  {
    id: 'v-020',
    german: 'Nebenkosten',
    article: 'die',
    plural: 'die Nebenkosten',
    hindi: 'उपयोगिता बिल (पानी, हीटिंग, कचरा)',
    english: 'Utility and maintenance costs',
    category: 'nouns',
    level: 'A2',
    exampleGerman: 'Die Nebenkosten betragen 180 Euro monatlich.',
    exampleHindi: 'उपयोगिता बिल हर महीने 180 यूरो हैं।',
    tags: ['housing', 'bureaucracy']
  },
  {
    id: 'v-021',
    german: 'Versicherung',
    article: 'die',
    plural: 'die Versicherungen',
    hindi: 'बीमा (Insurance)',
    english: 'Insurance',
    category: 'bureaucracy',
    level: 'A2',
    exampleGerman: 'Eine Krankenversicherung ist in Deutschland Pflicht.',
    exampleHindi: 'जर्मनी में स्वास्थ्य बीमा कानूनी रूप से अनिवार्य है।',
    memoryHook: '-ung ending = DIE! Sicher = Safe. Insurance ensures safety.',
    tags: ['bureaucracy', 'health']
  },
  {
    id: 'v-022',
    german: 'Krankmeldung',
    article: 'die',
    plural: 'die Krankmeldungen',
    hindi: 'बीमारी की सूचना (Doctor Sick Certificate)',
    english: 'Sick note / Medical certificate',
    category: 'bureaucracy',
    level: 'A2',
    exampleGerman: 'Ich habe dem Arbeitgeber meine Krankmeldung geschickt.',
    exampleHindi: 'मैंने अपने नियोक्ता को अपना मेडिकल सर्टिफिकेट भेज दिया है।',
    memoryHook: 'Krank (sick) + Meldung (report) = Krankmeldung. 3 din se zyada bimaar hone par mandatory hai.',
    tags: ['work', 'health', 'bureaucracy']
  },
  {
    id: 'v-023',
    german: 'aufstehen',
    hindi: 'जागना / सोकर उठना',
    english: 'To get up',
    category: 'verbs',
    level: 'A2',
    exampleGerman: 'Ich stehe jeden Morgen um 6 Uhr auf.',
    exampleHindi: 'मैं रोज़ सुबह 6 बजे उठता हूँ।',
    memoryHook: 'Separable verb: "auf" sentence ke aakhiri kone mein jata hai (Ich stehe... AUF).',
    tags: ['verbs', 'daily']
  },
  {
    id: 'v-024',
    german: 'anrufen',
    hindi: 'फ़ोन करना',
    english: 'To call by phone',
    category: 'verbs',
    level: 'A2',
    exampleGerman: 'Ich rufe den Kundenservice an.',
    exampleHindi: 'मैं कस्टमर सर्विस को कॉल करता हूँ।',
    memoryHook: 'Separable verb: "an" goes to end (Ich rufe... AN).',
    tags: ['verbs', 'communication']
  },

  // ── B1 Level ─────────────────────────────────────────────────
  {
    id: 'v-025',
    german: 'Ausbildung',
    article: 'die',
    plural: 'die Ausbildungen',
    hindi: 'व्यावसायिक प्रशिक्षण / अप्रेंटिसशिप',
    english: 'Vocational training / Apprenticeship',
    category: 'bureaucracy',
    level: 'B1',
    exampleGerman: 'Ich mache eine duale Ausbildung in der Pflege.',
    exampleHindi: 'मैं नर्सिंग में ड्यूल अप्रेंटिसशिप कर रहा हूँ।',
    memoryHook: 'Aus (out) + Bildung (education) = Real-world skills training while getting paid.',
    tags: ['work', 'ausbildung']
  },
  {
    id: 'v-026',
    german: 'Bewerbung',
    article: 'die',
    plural: 'die Bewerbungen',
    hindi: 'नौकरी का आवेदन',
    english: 'Job application',
    category: 'bureaucracy',
    level: 'B1',
    exampleGerman: 'Ich habe meine Bewerbung per E-Mail gesendet.',
    exampleHindi: 'मैंने अपना आवेदन ईमेल के ज़रिए भेजा है।',
    memoryHook: '-ung ending = DIE! Bewerbungsmappe = Complete job dossier.',
    tags: ['work', 'jobs']
  },
  {
    id: 'v-027',
    german: 'Vorstellungsgespräch',
    article: 'das',
    plural: 'die Vorstellungsgespräche',
    hindi: 'जॉब इंटरव्यू',
    english: 'Job interview',
    category: 'bureaucracy',
    level: 'B1',
    exampleGerman: 'Morgen habe ich ein wichtiges Vorstellungsgespräch.',
    exampleHindi: 'कल मेरा एक महत्वपूर्ण जॉब इंटरव्यू है।',
    memoryHook: 'Vorstellen (introduce) + Gespräch (conversation) = Interview. Article is DAS.',
    tags: ['work', 'jobs']
  },
  {
    id: 'v-028',
    german: 'Probezeit',
    article: 'die',
    plural: 'die Probezeiten',
    hindi: 'परीक्षण अवधि (Probation Period)',
    english: 'Probation period',
    category: 'bureaucracy',
    level: 'B1',
    exampleGerman: 'Während der Probezeit kann mit zwei Wochen Frist gekündigt werden.',
    exampleHindi: 'प्रोबेशन पीरियड के दौरान 2 हफ्ते के नोटिस पर नौकरी छोड़ी या बदली जा सकती है।',
    tags: ['work', 'ausbildung']
  },
  {
    id: 'v-029',
    german: 'Anmeldung',
    article: 'die',
    plural: 'die Anmeldungen',
    hindi: 'पता पंजीकरण (Address Registration)',
    english: 'Residence registration',
    category: 'bureaucracy',
    level: 'B1',
    exampleGerman: 'Die Anmeldung beim Bürgeramt muss innerhalb von 14 Tagen erfolgen.',
    exampleHindi: 'बर्गरएम्प्ट में पता पंजीकरण 14 दिनों के भीतर होना अनिवार्य है।',
    memoryHook: 'Germany land hone ke baad step #1: Anmeldung at Bürgeramt!',
    tags: ['bureaucracy', 'official']
  },

  // ── B2 Level ─────────────────────────────────────────────────
  {
    id: 'v-030',
    german: 'Aufenthaltstitel',
    article: 'der',
    plural: 'die Aufenthaltstitel',
    hindi: 'निवास परमिट (Residence Permit)',
    english: 'Residence permit',
    category: 'bureaucracy',
    level: 'B2',
    exampleGerman: 'Mein elektronischer Aufenthaltstitel wurde verlängert.',
    exampleHindi: 'मेरा इलेक्ट्रॉनिक निवास परमिट आगे बढ़ा दिया गया है।',
    tags: ['bureaucracy', 'visa']
  },
  {
    id: 'v-031',
    german: 'Fachkraft',
    article: 'die',
    plural: 'die Fachkräfte',
    hindi: 'कुशल पेशेवर / विशेषज्ञ',
    english: 'Skilled worker / Specialist',
    category: 'nouns',
    level: 'B2',
    exampleGerman: 'Deutschland sucht dringend qualifizierte Fachkräfte.',
    exampleHindi: 'जर्मनी को कुशल पेशेवरों की बहुत सख्त ज़रूरत है।',
    memoryHook: 'Fach (field/subject) + Kraft (strength/worker) = Skilled professional.',
    tags: ['work', 'society']
  },
  {
    id: 'v-032',
    german: 'Zuverlässigkeit',
    article: 'die',
    hindi: 'विश्वसनीयता / ज़िम्मेदारी',
    english: 'Reliability / Dependability',
    category: 'nouns',
    level: 'B2',
    exampleGerman: 'Zuverlässigkeit ist eine der wichtigsten Eigenschaften am Arbeitsplatz.',
    exampleHindi: 'कार्यस्थल पर विश्वसनीयता सबसे महत्वपूर्ण गुणों में से एक है।',
    memoryHook: '-keit ending = 100% DIE! Germans value this quality above all.',
    tags: ['work', 'culture']
  }
];

// Compatibility alias
export const vocabulary = VOCABULARY_DATA;

export function getVocabByLevel(level: string): VocabItem[] {
  return VOCABULARY_DATA.filter((v) => v.level === level);
}

export function getVocabByCategory(category: string): VocabItem[] {
  return VOCABULARY_DATA.filter((v) => v.category === category);
}
