export interface Item {
  id: string;
  name: string;
  expertRank: number;
  rationale: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  themeColor: string;
  items: Item[];
  expertEntity: string; // "NASA" or "Coast Guard"
  survivalTips: string[];
}

export type Phase = 'HOME' | 'INTRO' | 'PERSONAL_RANKING' | 'TEAM_RANKING' | 'RESULTS';

export interface GameState {
  scenarioId: string | null;
  phase: Phase;
  personalRanking: string[]; // Array of item IDs in order
  teamRanking: string[]; // Array of item IDs in order
}