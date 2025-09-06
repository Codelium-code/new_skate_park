import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, Trash2, AlertTriangle, CheckCircle, Edit, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useImageUpload } from '../hooks/useImageUpload';
import { validateEmail, validateName, validateExperience } from '../utils/validators';
import { validateAge, validateNationality } from '../utils/validators';
import { storage } from '../utils/localStorage';
import { SkateSpecialty } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

interface ProfileFormData {
  nombre: string;
  email: string;
  anos_experiencia: number;
  especialidad: SkateSpecialty;
  edad: number;
  nacionalidad: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser, logout } = useAuth();
  const { preview, uploadImage, setPreview } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setError, clearErrors, reset } = useForm<ProfileFormData>({
    defaultValues: currentUser ? {
      nombre: currentUser.nombre,
      email: currentUser.email,
      anos_experiencia: currentUser.anos_experiencia,
      especialidad: currentUser.especialidad as SkateSpecialty,
      edad: currentUser.edad,
      nacionalidad: currentUser.nacionalidad
    } : undefined
  });

  React.useEffect(() => {
    if (currentUser?.fotoBase64) {
      setPreview(currentUser.fotoBase64);
    }
  }, [currentUser, setPreview]);

  const specialtyOptions = [
    { value: 'Street', label: 'Street' },
    { value: 'Vert', label: 'Vert' },
    { value: 'Park', label: 'Park' },
    { value: 'Freestyle', label: 'Freestyle' },
    { value: 'Longboard', label: 'Longboard' },
    { value: 'Cruising', label: 'Cruising' }
  ];

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadImage(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    clearErrors();

    try {
      // Validate data
      const emailError = validateEmail(data.email);
      const nameError = validateName(data.nombre);
      const experienceError = validateExperience(data.anos_experiencia);
      const ageError = validateAge(data.edad);
      const nationalityError = validateNationality(data.nacionalidad);

      if (emailError) {
        setError('email', { message: emailError });
        setIsSubmitting(false);
        return;
      }

      if (nameError) {
        setError('nombre', { message: nameError });
        setIsSubmitting(false);
        return;
      }

      if (experienceError) {
        setError('anos_experiencia', { message: experienceError });
        setIsSubmitting(false);
        return;
      }

      if (ageError) {
        setError('edad', { message: ageError });
        setIsSubmitting(false);
        return;
      }

      if (nationalityError) {
        setError('nacionalidad', { message: nationalityError });
        setIsSubmitting(false);
        return;
      }
      // Check if email is taken by another user
      if (data.email !== currentUser.email && storage.isEmailTaken(data.email, currentUser.id)) {
        setError('email', { message: 'Este email ya está registrado' });
        setIsSubmitting(false);
        return;
      }

      // Update user data
      const updates = {
        nombre: data.nombre.trim(),
        email: data.email.toLowerCase().trim(),
        anos_experiencia: Number(data.anos_experiencia),
        especialidad: data.especialidad,
        edad: Number(data.edad),
        nacionalidad: data.nacionalidad.trim(),
        fotoBase64: preview || undefined
      };

      updateCurrentUser(updates);
      setIsEditing(false);
      setSuccessMessage('Perfil actualizado exitosamente');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
      console.error('Profile update error:', error);
    }

    setIsSubmitting(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      nombre: currentUser.nombre,
      email: currentUser.email,
      anos_experiencia: currentUser.anos_experiencia,
      especialidad: currentUser.especialidad as SkateSpecialty,
      edad: currentUser.edad,
      nacionalidad: currentUser.nacionalidad
    });
    setPreview(currentUser.fotoBase64 || null);
    clearErrors();
  };

  const handleDeleteAccount = () => {
    storage.deleteSkater(currentUser.id);
    logout();
    navigate('/', { 
      state: { 
        message: 'Cuenta eliminada exitosamente' 
      } 
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-gray-300">Gestiona tu información personal y preferencias</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-2">
          <CheckCircle size={20} className="text-green-400" />
          <p className="text-green-300 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Profile Card */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <User size={24} className="text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Información Personal</h2>
          </div>
          
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="secondary"
              size="sm"
            >
              <Edit size={16} className="mr-2" />
              Editar
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Photo */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-dashed border-orange-500/50 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-orange-400" />
                )}
              </div>
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </div>
            {isEditing && (
              <p className="text-sm text-gray-400 mt-2">
                Click para cambiar foto de perfil
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre completo"
              {...register('nombre', {
                required: 'Nombre es requerido',
                validate: validateName
              })}
              error={errors.nombre?.message}
              disabled={!isEditing}
            />

            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email es requerido',
                validate: validateEmail
              })}
              error={errors.email?.message}
              disabled={!isEditing}
            />

            <Input
              label="Edad"
              type="number"
              min="10"
              max="80"
              {...register('edad', {
                required: 'Edad es requerida',
                valueAsNumber: true,
                validate: validateAge
              })}
              error={errors.edad?.message}
              disabled={!isEditing}
            />

            <Input
              label="Nacionalidad"
              {...register('nacionalidad', {
                required: 'Nacionalidad es requerida',
                validate: validateNationality
              })}
              error={errors.nacionalidad?.message}
              disabled={!isEditing}
            />
            <Input
              label="Años de experiencia"
              type="number"
              min="0"
              max="50"
              {...register('anos_experiencia', {
                required: 'Años de experiencia es requerido',
                valueAsNumber: true,
                validate: validateExperience
              })}
              error={errors.anos_experiencia?.message}
              disabled={!isEditing}
            />

            <Select
              label="Especialidad"
              {...register('especialidad', {
                required: 'Especialidad es requerida'
              })}
              error={errors.especialidad?.message}
              options={specialtyOptions}
              disabled={!isEditing}
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex flex-wrap gap-4 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Account Information */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Información de Cuenta</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Estado</p>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              currentUser.estado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {currentUser.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div>
            <p className="text-gray-400">Miembro desde</p>
            <p className="text-white">
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Última actualización</p>
            <p className="text-white">
              {new Date(currentUser.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400">ID de usuario</p>
            <p className="text-white text-xs font-mono">
              {currentUser.id.substring(0, 8)}...
            </p>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20 bg-red-500/5">
        <div className="flex items-start space-x-3">
          <AlertTriangle size={20} className="text-red-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Zona de Peligro</h3>
            <p className="text-red-300 text-sm mb-4">
              Eliminar tu cuenta es una acción permanente e irreversible. 
              Todos tus datos serán eliminados.
            </p>
            
            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={16} className="mr-2" />
                Eliminar Cuenta
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-300 text-sm font-medium">
                  ¿Estás seguro? Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    Sí, eliminar mi cuenta
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;