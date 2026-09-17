export type AppPage =
  | 'home'
  | 'assistant'
  | 'translation'
  | 'rewrite'
  | 'grammar'
  | 'vocabulary'
  | 'reading'
  | 'writing'
  | 'dashboard'
  | 'progress'
  | 'exam'
  | 'profile';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  image?: string;
  timestamp: string;
  category?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  unit: string;
}

export interface Flashcard {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  arabicMeaning: string;
  definition: string;
  example: string;
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  examNote: string;
  unit: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  text: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}
