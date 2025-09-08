import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Trophy, User, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { storage } from '../utils/localStorage';
import { tournamentStorage } from '../utils/tournamentStorage';
import { TOURNAMENT_STAGES } from '../types/tournament';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Select from './Select';

interface EvaluationFormData {
  stage: string;
  participantId: string;
  score: number;
  accepted: boolean;
}

const StageEvaluationForm: React.FC = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<EvaluationFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const skaters = storage.getSkaters().filter(s => s.estado);
  const watchedStage = watch('stage');
  const watchedParticipant = watch('participantId');
  const watchedScore = watch('score');

  // Get stage info
  const selectedStage = TOURNAMENT_STAGES.find(s => s.id === watchedStage);
  const selectedSkater = skaters.find(s => s.id === watchedParticipant);

  // Check if participant already has evaluation for this stage
  const existingEvaluation = watchedStage && watchedParticipant 
    ? tournamentStorage.getEvaluationsByStage(watchedStage)
        .find(e => e.participantId === watchedParticipant)
    : null;

  const stageOptions = [
    { value: '', label: 'Selecciona una etapa' },
    ...TOURNAMENT_STAGES.map(stage => ({
      value: stage.id,
      label: stage.name
    }))
  ];

  const participantOptions = [
    { value: '', label: 'Selecciona un participante' },
    ...skaters.map(skater => ({
      value: skater.id,
      label: `${skater.nombre} (${skater.especialidad})`
    }))
  ];

  const onSubmit = async (data: EvaluationFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const skater = skaters.find(s => s.id === data.participantId);
      if (!skater) {
        setErrorMessage('Participante no encontrado');
        setIsSubmitting(false);
        return;
      }

      // Validate score range
      if (data.score < 0 || data.score > 100) {
        setErrorMessage('La puntuación debe estar entre 0 y 100');
        setIsSubmitting(false);
        return;
      }

      // Save evaluation
      tournamentStorage.saveEvaluation({
        stage: data.stage,
        participantId: data.participantId,
        participantName: skater.nombre,
        score: Number(data.score),
        accepted: data.accepted,
        evaluatedBy: 'admin'
      });

      setSuccessMessage(
        existingEvaluation 
          ? 'Evaluación actualizada exitosamente'
          : 'Evaluación guardada exitosamente'
      );

      // Reset form after success
      setTimeout(() => {
        reset();
        setSuccessMessage(null);
      }, 2000);

    } catch (error) {
      console.error('Error saving evaluation:', error);
      setErrorMessage('Error al guardar la evaluación');
    }

    setIsSubmitting(false);
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-orange-500/20 rounded-full">
            <Trophy size={24} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Evaluación de Etapa</h2>
            <p className="text-gray-400 text-sm">Asigna puntuaciones y criterios de aceptación</p>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-2">
            <CheckCircle size={20} className="text-green-400" />
            <p className="text-green-300 text-sm">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-300 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Existing Evaluation Warning */}
        {existingEvaluation && (
          <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle size={16} className="text-yellow-400" />
              <p className="text-yellow-300 text-sm font-medium">Evaluación Existente</p>
            </div>
            <p className="text-yellow-200 text-sm">
              Este participante ya tiene una evaluación para esta etapa:
            </p>
            <div className="mt-2 text-xs text-yellow-100 bg-yellow-500/10 p-2 rounded">
              Puntuación: {existingEvaluation.score} | 
              Estado: {existingEvaluation.accepted ? 'Aceptado' : 'Rechazado'} |
              Fecha: {new Date(existingEvaluation.evaluatedAt).toLocaleString()}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Stage Selection */}
          <Select
            label="Etapa del Campeonato"
            {...register('stage', { required: 'Etapa es requerida' })}
            error={errors.stage?.message}
            options={stageOptions}
          />

          {/* Stage Info */}
          {selectedStage && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-300 text-sm">
                <Target size={16} />
                <span>
                  {selectedStage.name} - 
                  {selectedStage.maxParticipants && ` Máx: ${selectedStage.maxParticipants} participantes`}
                  {selectedStage.minScore && ` - Puntuación mínima: ${selectedStage.minScore}`}
                </span>
              </div>
            </div>
          )}

          {/* Participant Selection */}
          <Select
            label="Participante"
            {...register('participantId', { required: 'Participante es requerido' })}
            error={errors.participantId?.message}
            options={participantOptions}
            disabled={!watchedStage}
          />

          {/* Participant Info */}
          {selectedSkater && (
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                {selectedSkater.fotoBase64 ? (
                  <img 
                    src={selectedSkater.fotoBase64} 
                    alt={selectedSkater.nombre}
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <User size={16} className="text-purple-400" />
                  </div>
                )}
                <div className="text-sm">
                  <p className="text-white font-medium">{selectedSkater.nombre}</p>
                  <p className="text-gray-400">
                    {selectedSkater.especialidad} • {selectedSkater.anos_experiencia} años exp. • {selectedSkater.edad} años
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Score Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Puntuación (0-100)"
              type="number"
              min="0"
              max="100"
              step="0.1"
              {...register('score', {
                required: 'Puntuación es requerida',
                valueAsNumber: true,
                min: { value: 0, message: 'Puntuación mínima es 0' },
                max: { value: 100, message: 'Puntuación máxima es 100' }
              })}
              error={errors.score?.message}
              placeholder="85.5"
              disabled={!watchedParticipant}
            />

            {/* Score Indicator */}
            {watchedScore !== undefined && watchedScore >= 0 && (
              <div className="flex items-end">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Indicador de Puntuación
                  </label>
                  <div className="h-10 bg-white/5 border border-white/10 rounded-lg flex items-center px-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      watchedScore >= 90 ? 'bg-green-500/20 text-green-400' :
                      watchedScore >= 80 ? 'bg-blue-500/20 text-blue-400' :
                      watchedScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                      watchedScore >= 60 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {watchedScore >= 90 ? 'Excelente' :
                       watchedScore >= 80 ? 'Muy Bueno' :
                       watchedScore >= 70 ? 'Bueno' :
                       watchedScore >= 60 ? 'Regular' : 'Insuficiente'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Acceptance Criteria */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Criterio de Aceptación
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('accepted')}
                className="w-4 h-4 text-orange-500 bg-white/5 border-white/10 rounded focus:ring-orange-500 focus:ring-2"
                disabled={!watchedParticipant}
              />
              <span className="text-gray-300 text-sm">
                Participante pasa a la siguiente etapa
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              Marca esta casilla si el participante cumple con los criterios para avanzar
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={!watchedStage || !watchedParticipant}
          >
            <Save size={16} className="mr-2" />
            {isSubmitting ? 'Guardando...' : existingEvaluation ? 'Actualizar Evaluación' : 'Guardar Evaluación'}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default StageEvaluationForm;