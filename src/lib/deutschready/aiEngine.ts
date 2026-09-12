import { DoubtRequest, DoubtResponse } from '@/types';

/**
 * 10-Level Progressive Doubt Ladder Knowledge Engine
 * Generates tailored pedagogical explanations that adapt as the student asks for simpler clarification.
 */
export function generateProgressiveDoubtExplanation(req: DoubtRequest): DoubtResponse {
  const { topic, contextGerman, userAnswer, correctAnswer, currentLevel, language } = req;

  const topicLower = (topic || '').toLowerCase();

  // 1. GENDER / DER DIE DAS TOPIC
  if (topicLower.includes('gender') || topicLower.includes('article') || topicLower.includes('der') || topicLower.includes('die') || topicLower.includes('das')) {
    if (currentLevel === 1) {
      return {
        level: 1,
        title: 'Level 1: Basic Rule (नियम की बुनियादी बात)',
        explanation: 'German mein har noun ka ek gender hota hai: der (Masculine), die (Feminine), ya das (Neuter). Ye cheez ke physical nature se nahi, balki uske word ending se tay hota hai.',
        hindiAnalogy: 'Jaise Hindi mein "kursi" stri-ling hai aur "chammach" purush-ling hai, waise hi German mein har cheez ka gender yaad rakhna padta hai.',
        whyIndiansMakeThisMistake: 'Hum English ki tarah sabko "the" bolne ki aadat rakhte hain, par German mein 3 alag "the" hote hain.',
        visualComparison: {
          germanRule: 'Word endings like -ung, -keit, -schaft are 100% DIE',
          hindiMatch: 'Hindi stri-ling endings (-ई, -आहट)',
          wrongExample: 'der Wohnung / das Zeitung',
          correctExample: 'die Wohnung / die Zeitung'
        },
        quickPracticeQuestion: {
          question: '"Freundschaft" (friendship) ke aage kya aayega?',
          options: ['die', 'der', 'das'],
          correctIndex: 0,
          explanation: '-schaft ending hamesha 100% DIE hoti hai!'
        },
        nextLevelHint: 'Agar abhi bhi dimaag mein nahi baitha, to niche click karo aur Hindi connection samjhein!'
      };
    } else if (currentLevel === 2) {
      return {
        level: 2,
        title: 'Level 2: Hindi Bridge & Word-Ending Hack (हिन्दी कनेक्शन)',
        explanation: 'Ek secret yaad kar lo: 60% words ke gender unke aakhri aksharon (suffixes) se bina soche pehchane ja sakte hain!\n1. -ung = DIE (die Zeitung, die Rechnung)\n2. -chen = DAS (das Mädchen, das Brötchen)\n3. -ment = DAS (das Dokument)\n4. Days/Months = DER (der Montag, der Sommer).',
        hindiAnalogy: 'Jaise Hindi mein "-वट" (सजावट, बनावट) hamesha stri-ling hoti hai, waise hi German mein "-ung" hamesha DIE hota hai.',
        whyIndiansMakeThisMistake: 'Log "Mädchen" (ladki) ko stri-ling soch kar "die Mädchen" bol dete hain, jabki "-chen" ending ki wajah se wo DAS hai!',
        quickPracticeQuestion: {
          question: '"Dokument" (Document) ke aage kya lagega?',
          options: ['das', 'der', 'die'],
          correctIndex: 0,
          explanation: '-ment suffix wale Latin origin shabd 100% DAS hote hain.'
        },
        nextLevelHint: 'Agar abhi bhi confuse ho, to real-life supermarket survival trick dekhein!'
      };
    } else {
      return {
        level: currentLevel,
        title: `Level ${currentLevel}: Germany Survival Shortcut (जर्मनी में क्या करें?)`,
        explanation: 'Agar Germany mein baat karte waqt kisi word ka gender bhool jao, to ghabrao mat! German log tab bhi aapko samajh jayenge. Article ko thoda fast bolo ya plural "die" use karo!',
        hindiAnalogy: 'Jaise koi foreigner Hindi mein "mera kursi toot gaya" bol de, to aap samajh jate hain na? German log bhi Indian accents ko samajhte hain!',
        whyIndiansMakeThisMistake: 'Perfection ke darr se Indian students bolna band kar dete hain. Bolna sabse zaroori hai!',
        nextLevelHint: 'Ab aap ready ho! Niche quiz solve karke aage badho.'
      };
    }
  }

  // 2. V2 WORD ORDER TOPIC
  if (topicLower.includes('v2') || topicLower.includes('order') || topicLower.includes('sentence')) {
    if (currentLevel === 1) {
      return {
        level: 1,
        title: 'Level 1: The Verb Position 2 Rule (क्रिया का दूसरा स्थान)',
        explanation: 'German main sentence ka sabse bada kanoon: Conjugated Verb hamesha number 2 position par aayega. Number 1 par chahe Time aaye, Place aaye ya Subject aaye!',
        hindiAnalogy: 'Train ka engine chahe aage ho ya piche, Guard ka dibba fix hota hai. Waise hi German mein Verb ki seat No. 2 par fix hai.',
        visualComparison: {
          germanRule: 'Pos 1 (Time) + Pos 2 (VERB) + Pos 3 (Subject)',
          hindiMatch: 'समय + क्रिया + कर्ता',
          wrongExample: 'Heute ich gehe nach Hause (English style)',
          correctExample: 'Heute GEHE ich nach Hause (German V2 rule)'
        },
        quickPracticeQuestion: {
          question: '"Morgen ___ ich nach Berlin." (fahren)',
          options: ['fahre', 'ich', 'nach'],
          correctIndex: 0,
          explanation: 'Morgen (Pos 1) ke baad turant verb "fahre" (Pos 2) aayega!'
        },
        nextLevelHint: 'Samajh nahi aaya? Click karein aur dekhein English vs German ka direct muqabla!'
      };
    } else {
      return {
        level: currentLevel,
        title: `Level ${currentLevel}: The German Sentence Anchor (वाक्य का लंगर)`,
        explanation: 'Verb ko ek heavy anchor (langar) samjho jo 2nd stone par gira hua hai. Sentence mein kisi bhi word ko hila lo, par Verb apni 2nd seat nahi chhodega!',
        hindiAnalogy: 'Film mein lead actor (Verb) hamesha 2nd scene mein entry marega!',
        whyIndiansMakeThisMistake: 'Hum English mein sochte hain "Today I go". German mein "Today go I" (Heute gehe ich) hota hai.',
        nextLevelHint: 'Ab test question solve karke check karo!'
      };
    }
  }

  // 3. CASES: NOMINATIV VS AKKUSATIV / DATIV
  if (topicLower.includes('case') || topicLower.includes('akkusativ') || topicLower.includes('dativ') || topicLower.includes('karak')) {
    return {
      level: currentLevel,
      title: `Level ${currentLevel}: The Hindi "को" (Karm Karak) Bridge`,
      explanation: 'German Cases kuch naye nahi hain — ye wahi hain jo hum school mein Hindi vyakaran mein padhte the: "Karta ne, Karm KO, Karan SE".\n\n• Nominativ = Karta (Jo kaam kar raha hai) -> Der Mann\n• Akkusativ = Karm KO (Jiske sath kaam kiya ja raha hai) -> DEN Mann\n\nSabse aasan baat: Akkusativ mein sirf Masculine "der" badal kar "den" banta hai, baki koi nahi badalta!',
      hindiAnalogy: 'Hindi: "Maine kutte KO dekha". German: "Ich sehe DEN Hund" (der Hund -> den Hund).',
      whyIndiansMakeThisMistake: 'English mein "I see the dog" mein "the" change nahi hota. Isliye Indian learners "Ich sehe der Hund" bol dete hain jo galat hai.',
      visualComparison: {
        germanRule: 'der -> den (Masculine only!)',
        hindiMatch: 'को लगाने पर बदलाव',
        wrongExample: 'Ich esse der Apfel',
        correctExample: 'Ich esse DEN Apfel'
      },
      quickPracticeQuestion: {
        question: 'Ich trinke ___ Tee (der Tee).',
        options: ['den', 'der', 'das'],
        correctIndex: 0,
        explanation: 'Trinken Akkusativ verb hai aur Tee masculine hai, isliye der ban gaya DEN!'
      },
      nextLevelHint: 'Abhi bhi shaq hai? Aur practice questions dekhein!'
    };
  }

  // DEFAULT FALLBACK LADDER
  return {
    level: currentLevel,
    title: `Level ${currentLevel}: Step-by-Step Breakdown for "${topic}"`,
    explanation: `Chaliye isko bilkul aasan bhasha mein todte hain. ${contextGerman ? `Jab hum "${contextGerman}" bolte hain, ` : ''}German bhasha mein rules bilkul math ke formula jaise hote hain. Ghabraiye mat!`,
    hindiAnalogy: 'Jaise cycle chalate waqt shuru mein pedal par dhyan dena padta hai, waise hi German rules shuru mein conscious lagte hain par 7 din mein natural ho jate hain.',
    whyIndiansMakeThisMistake: 'Direct English se German translate karne ki koshish karna sabse bada trap hai. German Hindi ke syntax se zyada milti hai!',
    nextLevelHint: 'Niche diye button par click karke iska direct example dekhein.'
  };
}
