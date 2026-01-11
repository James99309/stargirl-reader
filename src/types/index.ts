// User Progress
export interface UserProgress {
  streak: number;
  lastReadDate: string | null;
  totalXP: number;
  hearts: number;
  maxHearts: number;
  dailyGoalMinutes: number;
  currentChapter: number;
  currentSection: number;
  chaptersCompleted: number[];
  achievements: string[];
  wordsLearned: string[];
  onboardingCompleted: boolean;
  totalReadingTime: number; // Total reading time in seconds
}

// Vocabulary Item
export interface VocabularyItem {
  word: string;
  definition: string;
  pronunciation: string;
  phonetic: string;
  partOfSpeech: string;
  contexts: VocabularyContext[];
  similarWords: string[];
  masteryLevel: number; // 0-100
  lastReviewed: string | null;
  nextReview: string | null;
  timesCorrect: number;
  timesIncorrect: number;
  isNew: boolean;
  isSaved: boolean;
}

export interface VocabularyContext {
  sentence: string;
  chapterId: number;
}

// Chapter Structure
export interface Section {
  id: number;
  paragraphs: string[];
  checkpointQuestion?: ComprehensionQuestion;
}

export interface Chapter {
  id: number;
  title: string;
  sections: Section[];
  vocabulary: VocabularyItem[];
}

// Quiz & Comprehension
export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReviewQuestion {
  id: string;
  type: 'fill_blank' | 'meaning' | 'context_match' | 'spelling';
  word: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  context: string;
}

// Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

// App State
export interface ReadingSession {
  startTime: number;
  currentChapter: number;
  currentSection: number;
  xpEarned: number;
  wordsViewed: string[];
}

// Leaderboard
export interface LeaderboardEntry {
  username: string;
  totalXP: number;
  level: number;
  rank: number;
  isSuperMember?: boolean;
  location?: string;
}

// Review Quiz
export interface ReviewQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ReviewQuiz {
  id: string;
  title: string;
  subtitle: string;
  afterChapter: number;
  unlockCondition: number;
  questions: ReviewQuizQuestion[];
}
