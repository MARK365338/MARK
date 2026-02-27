export interface User {
  id: string;
  name: string;
  avatar: string;
  examType: 'CFA' | 'CPA' | 'FRM';
  level: number;
  xp: number;
  streak: number;
  studyMinutes: number;
  status: 'online' | 'offline' | 'studying';
  lastActive?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BattleState {
  opponent: User;
  questions: Question[];
  currentQuestionIndex: number;
  userScore: number;
  opponentScore: number;
  timeLeft: number;
  isFinished: boolean;
}
