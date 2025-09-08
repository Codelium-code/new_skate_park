export interface StageEvaluation {
  id: string;
  stage: string;
  participantId: string;
  participantName: string;
  score: number;
  accepted: boolean;
  evaluatedAt: string;
  evaluatedBy: string; // admin identifier
}

export interface TournamentStage {
  id: string;
  name: string;
  order: number;
  maxParticipants?: number;
  minScore?: number;
}

export interface TournamentBracket {
  stage: string;
  participants: {
    id: string;
    name: string;
    score: number;
    accepted: boolean;
    position?: number;
  }[];
  winner?: string;
}

export const TOURNAMENT_STAGES: TournamentStage[] = [
  { id: 'clasificatoria', name: 'Clasificatoria', order: 1, maxParticipants: 16, minScore: 60 },
  { id: 'octavos', name: 'Octavos de Final', order: 2, maxParticipants: 16, minScore: 65 },
  { id: 'cuartos', name: 'Cuartos de Final', order: 3, maxParticipants: 8, minScore: 70 },
  { id: 'semifinal', name: 'Semifinal', order: 4, maxParticipants: 4, minScore: 75 },
  { id: 'final', name: 'Final', order: 5, maxParticipants: 2, minScore: 80 }
];