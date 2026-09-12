import { QuizQuestion } from '@/types';

export const PLACEMENT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'pq-1',
    type: 'multiple_choice',
    question: 'Welches Wort passt? "Hallo, wie ___ du?"',
    questionHindi: 'खाली स्थान भरें: "Hallo, wie ___ du?"',
    options: ['heißt', 'heiße', 'heißen', 'heiß'],
    correctAnswer: 'heißt',
    explanationHindi: '"du" ke sath verb ending "-st" hoti hai: Wie heißt du? (A0/A1 Beginner)',
    explanationEnglish: 'For "du" (informal you), regular verb ends in -st (or -t for heißen).',
    grammarTopic: 'Verb Conjugation'
  },
  {
    id: 'pq-2',
    type: 'multiple_choice',
    question: 'Welcher Artikel gehört zu "Zeitung"?',
    questionHindi: '"Zeitung" (अखबार) के आगे कौन सा आर्टिकल आएगा?',
    options: ['die', 'der', 'das', 'den'],
    correctAnswer: 'die',
    explanationHindi: 'Ending "-ung" wale sabhi German shabd 100% Feminine (die) hote hain.',
    explanationEnglish: 'Words ending in -ung are always feminine.',
    grammarTopic: 'Noun Gender Rules'
  },
  {
    id: 'pq-3',
    type: 'multiple_choice',
    question: 'Wählen Sie den richtigen Satz (V2 Rule):',
    questionHindi: 'सही वाक्य क्रम चुनें (V2 Rule):',
    options: [
      'Heute lerne ich Deutsch.',
      'Heute ich lerne Deutsch.',
      'Heute Deutsch ich lerne.',
      'Lerne heute ich Deutsch.'
    ],
    correctAnswer: 'Heute lerne ich Deutsch.',
    explanationHindi: 'German mein Verb hamesha position 2 par aata hai. "Heute" (1) + "lerne" (2) + "ich" (3).',
    explanationEnglish: 'In a main clause, the conjugated verb must be in the 2nd position.',
    grammarTopic: 'V2 Word Order'
  },
  {
    id: 'pq-4',
    type: 'multiple_choice',
    question: '"Ich kaufe ___ Tisch (der Tisch)." Welcher Akkusativ-Artikel ist richtig?',
    questionHindi: '"Ich kaufe ___ Tisch." Akkusativ में कौन सा आर्टिकल सही है?',
    options: ['den', 'der', 'das', 'die'],
    correctAnswer: 'den',
    explanationHindi: 'Kaufen Akkusativ verb hai. Masculine "der Tisch" Akkusativ mein "den Tisch" ban jata hai.',
    explanationEnglish: 'Masculine der transforms to den in the accusative case.',
    grammarTopic: 'Akkusativ Case'
  },
  {
    id: 'pq-5',
    type: 'multiple_choice',
    question: 'Was bedeutet die Lautsprecher-Ansage: "Zug fällt aus"?',
    questionHindi: 'स्टेशन घोषणा "Zug fällt aus" का क्या अर्थ है?',
    options: ['ट्रेन कैंसल हो गई है', 'ट्रेन 5 मिनट लेट है', 'ट्रेन प्लेटफॉर्म 1 पर आ रही है', 'टिकट चेक हो रहे हैं'],
    correctAnswer: 'ट्रेन कैंसल हो गई है',
    explanationHindi: 'Ausfallen matlab cancel hona. German travel mein ye word aam taur par use hota hai.',
    explanationEnglish: 'Zug fällt aus means the train is cancelled.',
    grammarTopic: 'Travel German'
  },
  {
    id: 'pq-6',
    type: 'multiple_choice',
    question: 'Welches Modalverb passt: "Ich ___ sehr gut Deutsch sprechen."',
    questionHindi: 'सही मोडल वर्ब चुनें: "Ich ___ sehr gut Deutsch sprechen."',
    options: ['kann', 'muss', 'darf', 'willst'],
    correctAnswer: 'kann',
    explanationHindi: 'Ability / kshamta dikhane ke liye "können" use hota hai. Ich kann sprechen.',
    explanationEnglish: 'Können denotes ability.',
    grammarTopic: 'Modal Verbs'
  }
];
