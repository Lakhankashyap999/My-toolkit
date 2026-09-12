import { GermanyScenario } from '@/types';

export const GERMANY_SCENARIOS: GermanyScenario[] = [
  {
    id: 'sc-1',
    title: 'Bürgeramt Anmeldung (City Registration)',
    titleHindi: 'नगर निगम: पता पंजीकरण (Anmeldung)',
    category: 'anmeldung',
    level: 'A1',
    locationName: 'Bürgeramt Mitte, Berlin',
    culturalTips: [
      'Germany aane ke 14 din ke andar Anmeldung karwana kanoonan zaroori hai.',
      'Landlord se "Wohnungsgeberbestätigung" form pehle se sign karwa kar le jayein.',
      'Officer ke aage hamesha "Sie" (Formal) use karein, "Du" bilkul nahi.'
    ],
    steps: [
      {
        id: 's1-step1',
        speaker: 'Herr Becker',
        role: 'Beamter (Officer)',
        germanText: 'Guten Tag. Bitte nehmen Sie Platz. Was kann ich für Sie tun?',
        hindiTranslation: 'नमस्ते। कृपया बैठिए। मैं आपके लिए क्या कर सकता हूँ?',
        englishTranslation: 'Good day. Please take a seat. What can I do for you?',
        culturalNote: 'Formal reception. Eye contact banaye rakhein.',
        userPrompt: 'State that you are here to register your new residential address.',
        userPromptHindi: 'Officer ko bataiye ki aap apna naya address register karwane aaye hain:',
        options: [
          {
            german: 'Guten Tag. Ich möchte meinen Wohnsitz anmelden.',
            hindi: 'नमस्ते। मैं अपना पता रजिस्टर करवाना चाहता हूँ।',
            isCorrect: true,
            feedback: 'Sehr gut! "Ich möchte anmelden" polite aur perfectly formal hai.'
          },
          {
            german: 'Hallo! Gib mir Anmeldung!',
            hindi: 'हेलो! मुझे रजिस्ट्रेशन दे दो!',
            isCorrect: false,
            feedback: 'Galat! Yeh rude aur informal lagta hai. Always use "Guten Tag" and "Ich möchte...".'
          }
        ]
      },
      {
        id: 's1-step2',
        speaker: 'Herr Becker',
        role: 'Beamter (Officer)',
        germanText: 'Haben Sie Ihren Reisepass und die Wohnungsgeberbestätigung dabei?',
        hindiTranslation: 'क्या आपके पास आपका पासपोर्ट और मकान मालिक का सर्टिफिकेट है?',
        englishTranslation: 'Do you have your passport and landlord confirmation with you?',
        culturalNote: 'Bina landlord signature ke registration reject ho jata hai.',
        userPrompt: 'Say that you have all documents ready and hand them over.',
        userPromptHindi: 'Kahiye ki aapke paas sabhi documents hain aur unhe handover karein:',
        options: [
          {
            german: 'Ja, hier sind alle Unterlagen. Bitte sehr.',
            hindi: 'हाँ, यहाँ सभी दस्तावेज़ हैं। यह लीजिए।',
            isCorrect: true,
            feedback: 'Ausgezeichnet! "Bitte sehr" bolkar documents dena respectful German etiquette hai.'
          },
          {
            german: 'Nein, Vermieter hat keine Lust.',
            hindi: 'नहीं, मकान मालिक का मन नहीं था।',
            isCorrect: false,
            feedback: 'Bina documents ke Anmeldung possible nahi hai.'
          }
        ]
      }
    ]
  },

  {
    id: 'sc-2',
    title: 'Deutsche Bahn — Train Delay & Platform Change',
    titleHindi: 'ट्रेन स्टेशन: देरी और प्लेटफॉर्म परिवर्तन',
    category: 'deutsche_bahn',
    level: 'A1',
    locationName: 'Frankfurt Hauptbahnhof',
    culturalTips: [
      'DB trains mein delay (Verspätung) aam baat hai. DB Navigator app hamesha check karein.',
      'Gleiswechsel ka matlab hota hai platform badalna. Announcement dhyan se sunein.'
    ],
    steps: [
      {
        id: 's2-step1',
        speaker: 'Bahnhofsdurchsage',
        role: 'Lautsprecher (Announcement)',
        germanText: 'Achtung an Gleis 4: Der ICE 578 nach München hat heute circa 25 Minuten Verspätung.',
        hindiTranslation: 'प्लेटफॉर्म 4 पर ध्यान दें: म्यूनिख जाने वाली ICE 578 आज लगभग 25 मिनट लेट है।',
        englishTranslation: 'Attention at Platform 4: ICE 578 to Munich has approx. 25 minutes delay today.',
        culturalNote: '"Verspätung" German train system ka sabse common word hai!',
        userPrompt: 'Ask the DB service counter if you will catch your connecting train.',
        userPromptHindi: 'DB counter par jaakar poochhein ki kya aapki connecting train chhut jayegi:',
        options: [
          {
            german: 'Entschuldigung, erreiche ich trotzdem meinen Anschlusszug?',
            hindi: 'माफ़ कीजिए, क्या फिर भी मुझे मेरी कनेक्टिंग ट्रेन मिल पाएगी?',
            isCorrect: true,
            feedback: 'Perfekt! "Anschlusszug" connecting train ke liye technical term hai.'
          },
          {
            german: 'Zug kaputt? Warum so spät?',
            hindi: 'ट्रेन खराब है? इतना लेट क्यों?',
            isCorrect: false,
            feedback: 'Unprofessional sound karta hai. Service desk par politely solution poochhein.'
          }
        ]
      },
      {
        id: 's2-step2',
        speaker: 'DB Mitarbeiter',
        role: 'Service Desk',
        germanText: 'Wahrscheinlich nicht. Aber Ihre Zugbindung ist aufgehoben. Sie können jeden nächsten Zug nehmen.',
        hindiTranslation: 'शायद नहीं। लेकिन आपकी ट्रेन बाउंड्री हटा दी गई है। आप कोई भी अगली ट्रेन ले सकते हैं।',
        englishTranslation: 'Probably not. But your ticket restriction is lifted. You can take any next train.',
        culturalNote: '20+ min delay hone par aap bina extra charge doosri train le sakte hain.',
        userPrompt: 'Thank the officer and ask from which track the next train departs.',
        userPromptHindi: 'Dhanyavaad karein aur agle platform ka number poochhein:',
        options: [
          {
            german: 'Vielen Dank! Von welchem Gleis fährt der nächste Zug ab?',
            hindi: 'बहुत-बहुत धन्यवाद! अगली ट्रेन किस प्लेटफॉर्म से जाएगी?',
            isCorrect: true,
            feedback: 'Richtig! "Von welchem Gleis" platform poochne ka sahi tareeqa hai.'
          },
          {
            german: 'Ok, bye.',
            hindi: 'ठीक है, बाय।',
            isCorrect: false,
            feedback: 'German etiquette mein complete sentence aur "Vielen Dank" bolna zaroori hai.'
          }
        ]
      }
    ]
  },

  {
    id: 'sc-3',
    title: 'Supermarkt Kasse & Pfand Return',
    titleHindi: 'सुपरमार्केट: बिलिंग और बॉटल रीसायकल (Pfand)',
    category: 'supermarkt',
    level: 'A1',
    locationName: 'Aldi Süd / Rewe, München',
    culturalTips: [
      'Germany mein plastic bottles aur cans wapas karke 25 cent "Pfand" refund milta hai.',
      'Cashier scanning bahut tez hoti hai! Apne bags ready rakhein aur saaman jaldi pack karein.'
    ],
    steps: [
      {
        id: 's3-step1',
        speaker: 'Kassiererin',
        role: 'Kassiererin (Cashier)',
        germanText: 'Hallo! Haben Sie eine Payback-Karte? Brauchen Sie eine Tüte?',
        hindiTranslation: 'नमस्ते! क्या आपके पास पेबैक कार्ड है? क्या आपको बैग चाहिए?',
        englishTranslation: 'Hello! Do you have a loyalty card? Do you need a bag?',
        culturalNote: 'Plastic bags free nahi hote, 20-30 cents cost karte hain.',
        userPrompt: 'Say that you do not need a bag, and you want to pay by card.',
        userPromptHindi: 'Kahiye ki aapko bag nahi chahiye, aur aap card se payment karenge:',
        options: [
          {
            german: 'Nein danke, ich habe eine eigene Tasche. Ich bezahle mit Karte, bitte.',
            hindi: 'नहीं धन्यवाद, मेरे पास अपना बैग है। मैं कार्ड से भुगतान करूँगा।',
            isCorrect: true,
            feedback: 'Super! Eco-friendly aur clear communication.'
          },
          {
            german: 'Geldkarte hier nimm.',
            hindi: 'कार्ड यहाँ लो।',
            isCorrect: false,
            feedback: 'Grammar galat hai aur rude lagta hai. "Mit Karte, bitte" standard phrase hai.'
          }
        ]
      }
    ]
  },

  {
    id: 'sc-4',
    title: 'Beim Arzt (Doctor Appointment & Sick Leave)',
    titleHindi: 'डॉक्टर क्लिनिक: लक्षण बताना और सिक लीव (AU)',
    category: 'arzt',
    level: 'A2',
    locationName: 'Hausarztpraxis Dr. Weber, Stuttgart',
    culturalTips: [
      'Bina appointment ke sirf acute emergency mein walk-in allowed hota hai.',
      'Boss ko dikhane ke liye "Arbeitsunfähigkeitsbescheinigung" (AU) doctor se lena zaroori hai.'
    ],
    steps: [
      {
        id: 's4-step1',
        speaker: 'Dr. Weber',
        role: 'Hausarzt (Doctor)',
        germanText: 'Guten Tag Herr Sharma. Was fehlt Ihnen denn? Welche Beschwerden haben Sie?',
        hindiTranslation: 'नमस्ते मिस्टर शर्मा। आपको क्या तकलीफ़ है? क्या लक्षण हैं?',
        englishTranslation: 'Good day Mr. Sharma. What seems to be the problem? What symptoms do you have?',
        culturalNote: 'Doctor ko apne symptoms exact din ke sath batayein.',
        userPrompt: 'Explain that you have had a severe fever and sore throat for two days.',
        userPromptHindi: 'Batayein ki do din se tez bukhar aur gale mein dard hai:',
        options: [
          {
            german: 'Ich habe seit zwei Tagen hohes Fieber und starke Halsschmerzen.',
            hindi: 'मुझे दो दिनों से तेज़ बुखार और गले में बहुत दर्द है।',
            isCorrect: true,
            feedback: 'Sehr gut! "Seit zwei Tagen" + Dativ medical consultation ka perfect sentence hai.'
          },
          {
            german: 'Mein Hals tot und warm.',
            hindi: 'मेरा गला खत्म और गरम।',
            isCorrect: false,
            feedback: 'Incorrect German. Use "Halsschmerzen" and "Fieber".'
          }
        ]
      },
      {
        id: 's4-step2',
        speaker: 'Dr. Weber',
        role: 'Hausarzt (Doctor)',
        germanText: 'Sie haben eine Mandelentzündung. Ich schreibe Sie für vier Tage krank. Brauchen Sie eine Bescheinigung für den Arbeitgeber?',
        hindiTranslation: 'आपको टॉन्सिल इन्फेक्शन है। मैं आपको 4 दिन की सिक लीव दे रहा हूँ। क्या एम्प्लॉयर के लिए सर्टिफिकेट चाहिए?',
        englishTranslation: 'You have tonsillitis. I will sign you off sick for 4 days. Do you need a certificate for the employer?',
        userPrompt: 'Confirm that you need the sick certificate for your employer and ask about medication.',
        userPromptHindi: 'Kahiye ki haan employer ke liye certificate chahiye aur dawa ke baare mein poochhein:',
        options: [
          {
            german: 'Ja bitte, ich brauche die Arbeitsunfähigkeitsbescheinigung. Und brauche ich ein Rezept für die Apotheke?',
            hindi: 'हाँ कृपया, मुझे सिक लीव सर्टिफिकेट चाहिए। और क्या मुझे फार्मेसी के लिए प्रिस्क्रिप्शन की ज़रूरत है?',
            isCorrect: true,
            feedback: 'Hervorragend! Professional terminology aur practical doubt.'
          },
          {
            german: 'Gib mir Papier für Chef.',
            hindi: 'बॉस के लिए कागज़ दो।',
            isCorrect: false,
            feedback: 'Disrespectful tone. Doctor se formal vocabulary mein request karein.'
          }
        ]
      }
    ]
  },

  {
    id: 'sc-5',
    title: 'Wohnungssuche (Apartment Viewing & Landlord)',
    titleHindi: 'मकान ढूंढना: अपार्टमेंट देखना और मकान मालिक से बातचीत',
    category: 'wohnung',
    level: 'A2',
    locationName: 'Wohnungsbesichtigung, Hamburg',
    culturalTips: [
      'Germany mein housing market bahut competitive hai. SCHUFA aur salary slips pehle se ready rakhein.',
      'Apartment viewing (Besichtigung) par time se 5 minute pehle pahuchein.'
    ],
    steps: [
      {
        id: 's5-step1',
        speaker: 'Frau Schneider',
        role: 'Vermieterin (Landlord)',
        germanText: 'Guten Tag! Schön, dass Sie pünktlich sind. Wie gefällt Ihnen die Wohnung?',
        hindiTranslation: 'नमस्ते! अच्छा लगा कि आप समय पर आए। अपार्टमेंट आपको कैसा लगा?',
        englishTranslation: 'Good day! Nice that you are on time. How do you like the flat?',
        culturalNote: 'Landlord se first impression par hi deal depend karti hai.',
        userPrompt: 'Express genuine interest and ask if heating is included in the utility costs.',
        userPromptHindi: 'Kahiye ki apartment bahut pasand aaya aur poochhein ki kya heating charges include hain:',
        options: [
          {
            german: 'Die Wohnung ist sehr hell und gefällt mir gut! Sind die Heizkosten in den Nebenkosten enthalten?',
            hindi: 'अपार्टमेंट बहुत हवादार और अच्छा लगा! क्या हीटिंग के खर्चे उपयोगिता बिल में शामिल हैं?',
            isCorrect: true,
            feedback: 'Perfekt! Politeness + sharp practical awareness.'
          },
          {
            german: 'Ganz okay. Gib mir Schlüssel sofort.',
            hindi: 'ठीक-ठाक है। चाबी तुरंत दो।',
            isCorrect: false,
            feedback: 'Landlords aise attitude se instantly reject kar dete hain.'
          }
        ]
      }
    ]
  },

  {
    id: 'sc-6',
    title: 'Vorstellungsgespräch (Workplace & Ausbildung Interview)',
    titleHindi: 'जॉब इंटरव्यू: अपनी योग्यता बताना और सवाल पूछना',
    category: 'job_interview',
    level: 'B1',
    locationName: 'Klinikum München / IT Solutions GmbH',
    culturalTips: [
      'German interviewers straightforward answers expect karte hain bina kisi show-off ke.',
      'Interview ke aakhir mein 1-2 practical sawal zaroor poochhein — ye interest show karta hai.'
    ],
    steps: [
      {
        id: 's6-step1',
        speaker: 'Herr Hoffmann',
        role: 'Personalchef (HR Manager)',
        germanText: 'Guten Tag! Erzählen Sie mir bitte kurz über Ihren beruflichen Hintergrund und warum Sie in Deutschland arbeiten möchten.',
        hindiTranslation: 'नमस्ते! कृपया संक्षेप में अपने बैकग्राउंड और जर्मनी में काम करने के कारण के बारे में बताइए।',
        englishTranslation: 'Good day! Please tell me briefly about your background and why you want to work in Germany.',
        culturalNote: 'Confidence ke sath German mein apni journey summarise karein.',
        userPrompt: 'Introduce your qualification from India and your enthusiasm for German standards.',
        userPromptHindi: 'Apni qualification batayein aur German work environment ke prati dedication express karein:',
        options: [
          {
            german: 'Ich habe meine Ausbildung in Indien abgeschlossen und lerne intensiv Deutsch. Ich schätze das hohe professionelle Niveau in Deutschland sehr und möchte mich langfristig im Team einbringen.',
            hindi: 'मैंने भारत में अपनी पढ़ाई पूरी की है और गहन जर्मन सीख रहा हूँ। मैं जर्मनी के उच्च पेशेवर स्तर की बहुत कद्र करता हूँ और टीम में लंबा योगदान देना चाहता हूँ।',
            isCorrect: true,
            feedback: 'Ausgezeichnet! Highly professional, culturally attuned and reassuring response.'
          },
          {
            german: 'Ich will Geld verdienen und Visum haben.',
            hindi: 'मुझे पैसे कमाने हैं और वीज़ा चाहिए।',
            isCorrect: false,
            feedback: 'Never mention visas or pure money in German job interviews. Focus on skills and teamwork.'
          }
        ]
      }
    ]
  }
];

// Compatibility alias
export const germanyScenarios = GERMANY_SCENARIOS;
