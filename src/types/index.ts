export type CefrLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2';

export type UiLanguage = 'hinglish' | 'english' | 'german';

export type Gender = 'der' | 'die' | 'das';

export interface VocabItem {
  id: string;
  german: string;
  article?: Gender;
  plural?: string;
  english: string;
  hindi: string;
  category: string;
  level: CefrLevel;
  exampleGerman?: string;
  exampleHindi?: string;
  memoryHook?: string;
  audioText?: string;
  tags?: string[];
  lastReviewed?: number;
  repetitionCount?: number;
  interval?: number;
  easeFactor?: number;
}

export interface QuizQuestion {
  id: string;
  type?: 'multiple_choice' | 'mcq' | 'fill_blank' | 'sentence_order' | 'gender_select' | 'listen_select';
  question: string;
  questionHindi?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanationHindi: string;
  explanationEnglish?: string;
  hint?: string;
  grammarTopic: string;
}

export interface LessonSection {
  title: string;
  titleHindi: string;
  explanation: string;
  explanationHindi: string;
  germanExamples: {
    german: string;
    hindi: string;
    breakdown?: string;
  }[];
  proTip?: string;
  commonMistakeForIndians?: string;
}

export interface LessonUnit {
  id: string;
  level: CefrLevel;
  unitNumber: number;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  estimatedMinutes: number;
  xpReward: number;
  topics: string[];
  sections: LessonSection[];
  quiz: QuizQuestion[];
}

export interface DoubtRequest {
  topic: string;
  contextGerman?: string;
  userQuestion?: string;
  userAnswer?: string;
  correctAnswer?: string;
  currentLevel: number;
  language: UiLanguage;
}

export interface DoubtResponse {
  level: number;
  title: string;
  explanation: string;
  hindiAnalogy: string;
  whyIndiansMakeThisMistake?: string;
  visualComparison?: {
    germanRule: string;
    hindiMatch: string;
    wrongExample: string;
    correctExample: string;
  };
  quickPracticeQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  nextLevelHint: string;
}

export interface GermanyScenarioOption {
  german: string;
  hindi: string;
  isCorrect: boolean;
  feedback: string;
  formalityCheck?: 'polite_sie' | 'casual_du' | 'rude';
}

export interface GermanyScenarioStep {
  id: string;
  speaker: string;
  role: string;
  germanText: string;
  hindiTranslation: string;
  englishTranslation: string;
  culturalNote?: string;
  userPrompt: string;
  userPromptHindi: string;
  options: GermanyScenarioOption[];
}

export interface GermanyScenario {
  id: string;
  title: string;
  titleHindi: string;
  category: string;
  level: CefrLevel;
  locationName: string;
  culturalTips: string[];
  steps: GermanyScenarioStep[];
}

export interface ActiveSession {
  type: 'lesson' | 'scenario' | 'vocab' | 'speaking' | 'practice';
  id: string;
  title: string;
  detail?: string;
  path: string;
  step?: number;
  totalSteps?: number;
  timestamp: number;
}

export interface UserActivity {
  id: string;
  type: 'lesson' | 'scenario' | 'vocab' | 'speaking' | 'practice';
  title: string;
  detail: string;
  path: string;
  timestamp: number;
}

export interface UserProgressState {
  completedLessons: string[];
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  dailyGoalMinutes: number;
  todayMinutesPracticed: number;
  wordsToReview: string[];
  difficultWords: string[];
  uiLanguage: UiLanguage;
  audioSlowMode: boolean;
  userEmail?: string;
  lastActiveSession?: ActiveSession | null;
  activityHistory?: UserActivity[];
}
