import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Target, Users, TrendingUp, Award, Crown, Star } from 'lucide-react';
import { tournamentStorage } from '../utils/tournamentStorage';
import { TOURNAMENT_STAGES } from '../types/tournament';
import Card from '../components/Card';
import Button from '../components/Button';

const TournamentResultsPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  
  const evaluations = tournamentStorage.getEvaluations();
  const brackets = tournamentStorage.generateBracket();
  const statistics = tournamentStorage.getStatistics();

  // Filter evaluations by selected stage
  const filteredEvaluations = useMemo(() => {
    if (selectedStage === 'all') return evaluations;
    return evaluations.filter(e => e.stage === selectedStage);
  }, [evaluations, selectedStage]);

  // Get final champion
  const finalBracket = brackets.find(b => b.stage === 'Final');
  const champion = finalBracket?.participants.find(p => p.accepted && p.position === 1);

  const stageOptions = [
    { value: 'all', label: 'Todas las Etapas' },
    ...TOURNAMENT_STAGES.map(stage => ({
      value: stage.id,
      label: stage.name
    }))
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown size={16} className="text-yellow-400" />;
      case 2: return <Medal size={16} className="text-gray-400" />;
      case 3: return <Award size={16} className="text-orange-400" />;
      default: return <Star size={16} className="text-blue-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Resultados del Campeonato</h1>
        <p className="text-gray-300">Seguimiento completo del torneo de skateboarding</p>
      </div>

      {/* Champion Banner */}
      {champion && (
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-yellow-500/20 rounded-full">
                <Trophy size={48} className="text-yellow-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-1">🏆 CAMPEÓN DEL TORNEO</h2>
              <p className="text-3xl font-bold text-white">{champion.name}</p>
              <p className="text-yellow-300">Puntuación Final: {champion.score}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="text-center">
          <div className="space-y-2">
            <Users size={24} className="mx-auto text-blue-400" />
            <div className="text-2xl font-bold text-white">{statistics.participantsEvaluated}</div>
            <div className="text-xs text-gray-400">Evaluados</div>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="space-y-2">
            <Target size={24} className="mx-auto text-green-400" />
            <div className="text-2xl font-bold text-white">{statistics.totalEvaluations}</div>
            <div className="text-xs text-gray-400">Evaluaciones</div>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="space-y-2">
            <Trophy size={24} className="mx-auto text-orange-400" />
            <div className="text-2xl font-bold text-white">{statistics.stagesCompleted}</div>
            <div className="text-xs text-gray-400">Etapas</div>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="space-y-2">
            <TrendingUp size={24} className="mx-auto text-purple-400" />
            <div className="text-2xl font-bold text-white">{statistics.averageScore}</div>
            <div className="text-xs text-gray-400">Promedio</div>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="space-y-2">
            <Award size={24} className="mx-auto text-yellow-400" />
            <div className="text-2xl font-bold text-white">{statistics.acceptanceRate}%</div>
            <div className="text-xs text-gray-400">Aceptación</div>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="space-y-2">
            <Medal size={24} className="mx-auto text-pink-400" />
            <div className="text-2xl font-bold text-white">{statistics.totalParticipants}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </Card>
      </div>

      {/* Stage Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Resultados por Etapa</h2>
          <div className="flex gap-2 flex-wrap">
            {stageOptions.map(option => (
              <Button
                key={option.value}
                variant={selectedStage === option.value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedStage(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tournament Bracket */}
      <div className="space-y-6">
        {TOURNAMENT_STAGES.map(stage => {
          const stageBracket = brackets.find(b => b.stage === stage.name);
          const stageEvaluations = evaluations.filter(e => e.stage === stage.id);
          
          if (selectedStage !== 'all' && selectedStage !== stage.id) return null;
          if (stageEvaluations.length === 0) return null;

          return (
            <Card key={stage.id}>
              <div className="space-y-4">
                {/* Stage Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Trophy size={20} className="text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{stage.name}</h3>
                      <p className="text-sm text-gray-400">
                        {stageEvaluations.length} participante{stageEvaluations.length !== 1 ? 's' : ''} evaluado{stageEvaluations.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  {stageBracket?.winner && (
                    <div className="flex items-center space-x-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                      <Crown size={16} className="text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-medium">
                        Ganador: {stageBracket.participants.find(p => p.id === stageBracket.winner)?.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Participants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stageEvaluations
                    .sort((a, b) => b.score - a.score)
                    .map((evaluation, index) => (
                    <div
                      key={evaluation.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        evaluation.accepted
                          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                          : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getPositionIcon(index + 1)}
                          <span className="text-white font-medium">#{index + 1}</span>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          evaluation.accepted 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {evaluation.accepted ? 'Clasificado' : 'Eliminado'}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold">{evaluation.participantName}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Puntuación:</span>
                          <span className={`font-bold ${getScoreColor(evaluation.score)}`}>
                            {evaluation.score}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(evaluation.evaluatedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvaluations.length === 0 && (
        <Card className="text-center py-12">
          <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay evaluaciones disponibles</h3>
          <p className="text-gray-400">
            {selectedStage === 'all' 
              ? 'Aún no se han registrado evaluaciones en el campeonato'
              : `No hay evaluaciones para la etapa seleccionada`
            }
          </p>
        </Card>
      )}
    </div>
  );
};

export default TournamentResultsPage;