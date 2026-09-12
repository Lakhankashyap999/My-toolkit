import { GermanyScenario } from '@/types';

export const GERMANY_SCENARIOS: GermanyScenario[] = [
  {
    id: 'sc-1',
    title: 'Bürgeramt: Die Anmeldung (City Registration)',
    titleHindi: 'बर्गरअamt: शहर में पता रजिस्टर कराना',
    category: 'anmeldung',
    level: 'A1',
    locationName: 'Bürgeramt Mitte, Berlin',
    culturalTips: [
      'Germany mein land hone ke 14 din ke andar Anmeldung karana legal requirement hai.',
      'Officer se hamesha "Sie" bol kar baat karein, galti se bhi "du" na bolein.',
      'Saath mein "Wohnungsgeberbestätigung" (landlord ka certificate) aur Passport hona zaroori hai.'
    ],
    steps: [
      {
        id: 's1-step1',
        speaker: 'Herr Müller',
        role: 'Officer',
        germanText: 'Guten Tag! Sie haben einen Termin für die Anmeldung?',
        hindiTranslation: 'नमस्ते! क्या आपका पता पंजीकरण के लिए अपॉइंटमेंट है?',
        englishTranslation: 'Good day! Do you have an appointment for registration?',
        culturalNote: 'Appointments (Termin) are strictly verified at the entrance.',
        userPrompt: 'Officer ko bataiye ki aapka 10:15 par appointment hai aur apna naam bolein:',
        userPromptHindi: 'अधिकारी को बताएं कि आपका 10:15 का अपॉइंटमेंट है और अपना नाम बताएं:',
        options: [
          {
            german: 'Guten Tag! Ja, mein Name ist Lakhan, Termin um 10:15 Uhr.',
            hindi: 'नमस्ते! हाँ, मेरा नाम लाखन है, 10:15 बजे अपॉइंटमेंट है।',
            isCorrect: true,
            feedback: 'Perfect! Respectful, clear, and gives the required details.',
            formalityCheck: 'polite_sie'
          },
          {
            german: 'Hallo Bro! Ich bin hier für Anmeldung.',
            hindi: 'हैलो ब्रो! मैं यहाँ रजिस्ट्रेशन के लिए हूँ।',
            isCorrect: false,
            feedback: 'Achtung! German government offices mein "Bro" ya casual greetings bilkul prohibited hain.',
            formalityCheck: 'rude'
          },
          {
            german: 'Haben Sie Zeit für mich?',
            hindi: 'क्या आपके पास मेरे लिए समय है?',
            isCorrect: false,
            feedback: 'Bina Termin ke Bürgeramt mein entry nahi milti. Appointment mention karna zaroori hai.',
            formalityCheck: 'casual_du'
          }
        ]
      },
      {
        id: 's1-step2',
        speaker: 'Herr Müller',
        role: 'Officer',
        germanText: 'Haben Sie Ihren Pass und die Wohnungsgeberbestätigung dabei?',
        hindiTranslation: 'क्या आपके पास अपना पासपोर्ट और मकान मालिक का पुष्टि-पत्र है?',
        englishTranslation: 'Do you have your passport and landlord confirmation with you?',
        culturalNote: 'Wohnungsgeberbestätigung is a mandatory signed document from your landlord.',
        userPrompt: 'Aapke paas dono documents hain, documents dete hue bolein:',
        userPromptHindi: 'आपके पास दोनों कागज़ हैं, देते हुए क्या कहेंगे:',
        options: [
          {
            german: 'Ja, bitte sehr. Hier sind mein Reisepass und das Dokument vom Vermieter.',
            hindi: 'हाँ, यह लीजिये। यहाँ मेरा पासपोर्ट और मकान मालिक का दस्तावेज़ है।',
            isCorrect: true,
            feedback: 'Ausgezeichnet! "Bitte sehr" bol kar documents dena bahut polite mana jata hai.',
            formalityCheck: 'polite_sie'
          },
          {
            german: 'Nein, brauche ich das?',
            hindi: 'नहीं, क्या इसकी ज़रूरत है?',
            isCorrect: false,
            feedback: 'Is document ke bina Anmeldung reject ho jayegi!',
            formalityCheck: 'casual_du'
          }
        ]
      }
    ]
  },
  {
    id: 'sc-2',
    title: 'Deutsche Bahn: Gleiswechsel & Verspätung',
    titleHindi: 'ट्रेन स्टेशन: देरी और प्लेटफॉर्म बदलना',
    category: 'deutsche_bahn',
    level: 'A1',
    locationName: 'Frankfurt (Main) Hauptbahnhof',
    culturalTips: [
      'Germany mein Deutsche Bahn trains mein delay (Verspätung) aam baat hai.',
      'DB Navigator App hamesha phone mein install rakhein live updates ke liye.',
      'Announcement dhyan se sunein: "Heute von Gleis..." ka matlab platform badal gaya hai!'
    ],
    steps: [
      {
        id: 's2-step1',
        speaker: 'Lautsprecher-Ansage',
        role: 'Conductor',
        germanText: 'Achtung an Gleis 4: ICE 573 nach München hat 25 Minuten Verspätung. Heute von Gleis 9!',
        hindiTranslation: 'प्लेटफॉर्म 4 पर ध्यान दें: म्यूनिख जाने वाली ICE 573 ट्रेन 25 मिनट लेट है। आज प्लेटफॉर्म 9 से छूटेगी!',
        englishTranslation: 'Attention on platform 4: ICE 573 to Munich is delayed by 25 minutes. Today from platform 9!',
        culturalNote: 'Platform change is announced quickly. Watch the electronic boards.',
        userPrompt: 'DB Info counter par officer se confirm karein ki nayi train kahan se jayegi:',
        userPromptHindi: 'इन्फो काउंटर पर पूछें कि क्या ट्रेन सच में प्लेटफॉर्म 9 से जाएगी:',
        options: [
          {
            german: 'Entschuldigung, fährt der Zug nach München wirklich von Gleis 9?',
            hindi: 'माफ़ कीजिये, क्या म्यूनिख जाने वाली ट्रेन सच में प्लेटफॉर्म 9 से जा रही है?',
            isCorrect: true,
            feedback: 'Sehr gut! "Entschuldigung" se start karna polite German etiquette hai.',
            formalityCheck: 'polite_sie'
          },
          {
            german: 'Warum ist der Zug so spät, man?!',
            hindi: 'ट्रेन इतनी लेट क्यों है, यार?!',
            isCorrect: false,
            feedback: 'Officer par gussa hone se help nahi milegi. Polite rehna zaroori hai.',
            formalityCheck: 'rude'
          }
        ]
      }
    ]
  },
  {
    id: 'sc-3',
    title: 'Im Supermarkt: Die Kasse (Aldi / Lidl Checkout)',
    titleHindi: 'सुपरमार्केट: कैश काउंटर पर तेज़ बातचीत',
    category: 'supermarkt',
    level: 'A0',
    locationName: 'Rewe / Lidl, München',
    culturalTips: [
      'German cashiers world ke fastest hote hain! Saaman turant bag mein daalna hota hai.',
      'Plastiktüte (carry bag) free nahi hota, counter se khud utha kar khareedna padta hai.',
      '"Pfand" bottles (beer/water bottles) machine mein daal kar voucher milta hai.'
    ],
    steps: [
      {
        id: 's3-step1',
        speaker: 'Kassiererin',
        role: 'Cashier',
        germanText: 'Hallo! Brauchen Sie den Kassenbon? Zahlen Sie mit Karte oder Bar?',
        hindiTranslation: 'नमस्ते! क्या आपको रसीद चाहिए? कार्ड से भुगतान करेंगे या नकद?',
        englishTranslation: 'Hello! Do you need the receipt? Paying by card or cash?',
        culturalNote: 'Cashiers routinely ask about receipt and payment method in one breath.',
        userPrompt: 'Aap card se payment karna chahte hain aur receipt nahi chahiye. Kaise kahenge?',
        userPromptHindi: 'आप कार्ड से पेमेंट करना चाहते हैं और रसीद नहीं चाहिए:',
        options: [
          {
            german: 'Mit Karte, bitte. Den Bon brauche ich nicht. Danke!',
            hindi: 'कार्ड से, कृपया। रसीद की ज़रूरत नहीं है। धन्यवाद!',
            isCorrect: true,
            feedback: 'Wunderbar! Fast, natural German supermarkt conversation.',
            formalityCheck: 'polite_sie'
          },
          {
            german: 'Ich habe kein Geld, tschüss!',
            hindi: 'मेरे पास पैसा नहीं है, बाय!',
            isCorrect: false,
            feedback: 'Supermarket checkout par ye bilkul nahi bolna chahiye!',
            formalityCheck: 'rude'
          }
        ]
      }
    ]
  },
  {
    id: 'sc-4',
    title: 'Beim Arzt: Krankschreibung (Clinic & Sick Leave)',
    titleHindi: 'डॉक्टर क्लिनिक: बीमारी बताना और मेडिकल लीव',
    category: 'arzt',
    level: 'A1',
    locationName: 'Hausarztpraxis Dr. Schmidt',
    culturalTips: [
      'Job ya university mein agar bimar ho jayein, to 3 din ke andar "AU-Bescheinigung" (Krankschreibung) submit karni hoti hai.',
      'German clinics mein appointment (Termin) zaroori hota hai, emergency mein subah 8 baje "Akutsprechstunde" mein jana hota hai.'
    ],
    steps: [
      {
        id: 's4-step1',
        speaker: 'Dr. Schmidt',
        role: 'Doctor',
        germanText: 'Guten Tag! Was fehlt Ihnen denn? Welche Symptome haben Sie?',
        hindiTranslation: 'नमस्ते! आपको क्या परेशानी है? क्या लक्षण हैं?',
        englishTranslation: 'Good day! What seems to be the problem? What symptoms do you have?',
        culturalNote: '"Was fehlt Ihnen?" is the classic German doctor question for "What is bothering you?".',
        userPrompt: 'Doctor ko bataiye ki kal raat se sir dard aur bukhar hai:',
        userPromptHindi: 'डॉक्टर को बताएं कि कल रात से सिरदर्द और बुखार है:',
        options: [
          {
            german: 'Ich habe seit gestern Kopfschmerzen und hohes Fieber.',
            hindi: 'मुझे कल से सिरदर्द और तेज़ बुखार है।',
            isCorrect: true,
            feedback: 'Klasse! "seit gestern" (since yesterday) + "Kopfschmerzen" (headache) is textbook medical German.',
            formalityCheck: 'polite_sie'
          },
          {
            german: 'Mein Körper ist kaputt.',
            hindi: 'मेरा शरीर टूट चुका है।',
            isCorrect: false,
            feedback: '"Kaputt" machines ke liye use hota hai, bimari ke liye specific words use karein (Kopfschmerzen, Fieber).',
            formalityCheck: 'casual_du'
          }
        ]
      }
    ]
  }
];
