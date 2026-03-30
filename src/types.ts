export interface Stage {
  id: number;
  name: string;
  objective: string;
  tasks: string[];
  simulation: {
    scenario: string;
    options: {
      text: string;
      impact: {
        budget: number;
        trust: number;
        impact: number;
      };
      feedback: string;
    }[];
  };
  crisis?: {
    scenario: string;
    stakeholders: {
      role: string;
      opinion: string;
    }[];
    options: {
      text: string;
      impact: {
        budget: number;
        trust: number;
        impact: number;
      };
    }[];
  };
}

export interface GameState {
  idea: string;
  audience: string;
  budget: number;
  trust: number;
  impact: number;
  currentStage: number;
  stages: Stage[];
  isGameOver: boolean;
  pitchFeedback?: {
    score: number;
    feedback: string;
    questions: string[];
  };
}
