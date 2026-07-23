export interface StudentProgress {
  name: string;
  xp: number;
  stars: number;
  coins: number;
  streak: number;
  badge: string;
  completedUnits: number[];
  completedRevisions: string[];
  scores: Record<string, number>;
  readingProgress: number;
  writingProgress: number;
  lastStudyDate: string | null;
  studentClass?: string;
  averageScore?: number;
  syllabusProgress?: number;
  grammarMastery?: number;
}

export type ActiveTab = 'dashboard' | 'unit' | 'revision';

export interface SoundSettings {
  soundEnabled: boolean;
  congratulationAlert: boolean;
}
