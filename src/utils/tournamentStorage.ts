import { StageEvaluation, TournamentBracket, TOURNAMENT_STAGES } from '../types/tournament';
import { storage } from './localStorage';

const TOURNAMENT_STORAGE_KEY = 'skatepark_tournament_evaluations';

export const tournamentStorage = {
  // Get all evaluations
  getEvaluations: (): StageEvaluation[] => {
    try {
      const data = localStorage.getItem(TOURNAMENT_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading tournament evaluations:', error);
      return [];
    }
  },

  // Save evaluations
  saveEvaluations: (evaluations: StageEvaluation[]): void => {
    try {
      localStorage.setItem(TOURNAMENT_STORAGE_KEY, JSON.stringify(evaluations));
    } catch (error) {
      console.error('Error saving tournament evaluations:', error);
    }
  },

  // Add or update evaluation
  saveEvaluation: (evaluation: Omit<StageEvaluation, 'id' | 'evaluatedAt'>): void => {
    const evaluations = tournamentStorage.getEvaluations();
    
    // Check if evaluation already exists for this participant and stage
    const existingIndex = evaluations.findIndex(
      e => e.participantId === evaluation.participantId && e.stage === evaluation.stage
    );

    const newEvaluation: StageEvaluation = {
      ...evaluation,
      id: existingIndex >= 0 ? evaluations[existingIndex].id : crypto.randomUUID(),
      evaluatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      evaluations[existingIndex] = newEvaluation;
    } else {
      evaluations.push(newEvaluation);
    }

    tournamentStorage.saveEvaluations(evaluations);
  },

  // Get evaluations by stage
  getEvaluationsByStage: (stage: string): StageEvaluation[] => {
    return tournamentStorage.getEvaluations().filter(e => e.stage === stage);
  },

  // Get evaluations by participant
  getEvaluationsByParticipant: (participantId: string): StageEvaluation[] => {
    return tournamentStorage.getEvaluations().filter(e => e.participantId === participantId);
  },

  // Generate tournament bracket
  generateBracket: (): TournamentBracket[] => {
    const evaluations = tournamentStorage.getEvaluations();
    const brackets: TournamentBracket[] = [];

    TOURNAMENT_STAGES.forEach(stage => {
      const stageEvaluations = evaluations
        .filter(e => e.stage === stage.id)
        .sort((a, b) => b.score - a.score); // Sort by score descending

      const participants = stageEvaluations.map((eval, index) => ({
        id: eval.participantId,
        name: eval.participantName,
        score: eval.score,
        accepted: eval.accepted,
        position: index + 1
      }));

      // Determine winner (highest score and accepted)
      const winner = participants.find(p => p.accepted && p.position === 1);

      brackets.push({
        stage: stage.name,
        participants,
        winner: winner?.id
      });
    });

    return brackets;
  },

  // Get tournament statistics
  getStatistics: () => {
    const evaluations = tournamentStorage.getEvaluations();
    const skaters = storage.getSkaters();
    
    return {
      totalEvaluations: evaluations.length,
      participantsEvaluated: new Set(evaluations.map(e => e.participantId)).size,
      totalParticipants: skaters.length,
      stagesCompleted: new Set(evaluations.map(e => e.stage)).size,
      averageScore: evaluations.length > 0 
        ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
        : 0,
      acceptanceRate: evaluations.length > 0
        ? Math.round((evaluations.filter(e => e.accepted).length / evaluations.length) * 100)
        : 0
    };
  }
};