export interface User {
  id: string;
  name: string;
  email: string;
  streak: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type QuestionCategory = 'angular' | 'javascript' | 'system-design';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ProgressStatus = 'unseen' | 'reviewed' | 'mastered';

export interface Question {
  _id: string;
  category: QuestionCategory;
  topic: string;
  title: string;
  description: string;
  answer: string;
  codeSnippet: string;
  difficulty: Difficulty;
  tags: string[];
  createdAt: string;
}

export interface UserProgress {
  _id: string;
  userId: string;
  questionId: string;
  status: ProgressStatus;
  bookmarked: boolean;
  lastSeenAt: string | null;
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  questionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockTest {
  _id: string;
  category: string;
  difficulty: string;
  durationMinutes: number;
  questions: Question[];
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  status: 'in-progress' | 'completed';
  completedAt: string | null;
}

export interface ProgressSummary {
  total: number;
  reviewed: number;
  mastered: number;
  bookmarked: number;
  streak: number;
  testsCompleted: number;
  avgScore: number;
}

export interface ScoreTrend {
  date: string;
  score: number;
  total: number;
  percentage: number;
  category: string;
}
