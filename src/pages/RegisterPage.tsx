import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { storage } from '../utils/localStorage';
import { useImageUpload } from '../hooks/useImageUpload';
import { validateEmail, validatePassword, validateName, validateExperience } from '../utils/validators';
import { validateAge, validateNationality } from '../utils/validators';
import { Skater, SkateSpecialty } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

interface RegisterFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  anos_experiencia: number;
  especialidad: SkateSpecialty;
  edad: number;
  nacionalidad: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm<RegisterFormData>();
  const { preview, uploadImage, resetUpload } = useImageUpload();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  const specialtyOptions = [
    { value: '', label: 'Selecciona tu especialidad' },
    { value: 'Street', label: 'Street' },
    { value: 'Vert', label: 'Vert' },
    { value: 'Park', label: 'Park' },
    { value: 'Freestyle', label: 'Freestyle' },
    { value: 'Longboard', label: 'Longboard' },
    { value: 'Cruising', label: 'Cruising' }
  ];

  // Real-time email validation
  React.useEffect(() => {
    if (watchedEmail && !errors.email) {
      setEmailCheckStatus('checking');
      const timeoutId = setTimeout(() => {
        const emailError = validateEmail(watchedEmail);
        if (!emailError) {
          const isTaken = storage.isEmailTaken(watchedEmail);
          if (isTaken) {
            setError('email', { message: 'Este email ya está registrado' });
            setEmailCheckStatus('taken');
          } else {
            clearErrors('email');
            setEmailCheckStatus('available');
          }
        } else {
          setEmailCheckStatus('idle');
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setEmailCheckStatus('idle');
    }
  }, [watchedEmail, errors.email, setError, clearErrors]);

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

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);

    try {
      // Final validation
      const emailError = validateEmail(data.email);
      const passwordError = validatePassword(data.password);
      const nameError = validateName(data.nombre);
      const experienceError = validateExperience(data.anos_experiencia);
      const ageError = validateAge(data.edad);
      const nationalityError = validateNationality(data.nacionalidad);

      if (emailError) {
        setError('email', { message: emailError });
        setIsSubmitting(false);
        return;
      }

      if (passwordError) {
        setError('password', { message: passwordError });
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
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', { message: 'Las contraseñas no coinciden' });
        setIsSubmitting(false);
        return;
      }

      if (storage.isEmailTaken(data.email)) {
        setError('email', { message: 'Este email ya está registrado' });
        setIsSubmitting(false);
        return;
      }

      // Create new skater
      const newSkater: Skater = {
        id: crypto.randomUUID(),
        nombre: data.nombre.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
        anos_experiencia: Number(data.anos_experiencia),
        especialidad: data.especialidad,
        edad: Number(data.edad),
        nacionalidad: data.nacionalidad.trim(),
        fotoBase64: preview || undefined,
        estado: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      storage.addSkater(newSkater);

      // Simulate a brief delay for better UX
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: '¡Registro exitoso! Ahora puedes iniciar sesión.',
            email: data.email 
          } 
        });
      }, 1000);

    } catch (error) {
      console.error('Registration error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Únete a SkatePark Pro</h1>
          <p className="text-gray-300">Crea tu cuenta y forma parte de la comunidad</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Photo Upload */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-orange-500/50 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={24} className="text-orange-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Click para subir foto de perfil (opcional)
            </p>
          </div>

          {/* Name */}
          <Input
            label="Nombre completo"
            {...register('nombre', {
              required: 'Nombre es requerido',
              validate: validateName
            })}
            error={errors.nombre?.message}
            placeholder="Tu nombre completo"
          />

          {/* Email */}
          <div className="relative">
            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email es requerido',
                validate: validateEmail
              })}
              error={errors.email?.message}
              placeholder="tu@email.com"
            />
            {emailCheckStatus === 'checking' && (
              <div className="absolute right-3 top-8 animate-spin">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
              </div>
            )}
            {emailCheckStatus === 'available' && (
              <CheckCircle size={16} className="absolute right-3 top-8 text-green-400" />
            )}
          </div>

          {/* Experience Years */}
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
            placeholder="0"
          />

          {/* Age */}
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
            placeholder="18"
          />

          {/* Nationality */}
          <Input
            label="Nacionalidad"
            {...register('nacionalidad', {
              required: 'Nacionalidad es requerida',
              validate: validateNationality
            })}
            error={errors.nacionalidad?.message}
            placeholder="Ej: México, España, Argentina"
          />
          {/* Specialty */}
          <Select
            label="Especialidad"
            {...register('especialidad', {
              required: 'Especialidad es requerida'
            })}
            error={errors.especialidad?.message}
            options={specialtyOptions}
          />

          {/* Password */}
          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Contraseña es requerida',
                validate: validatePassword
              })}
              error={errors.password?.message}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm Password */}
          <Input
            label="Confirmar contraseña"
            type={showPassword ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Confirmación de contraseña es requerida',
              validate: (value) => 
                value === watchedPassword || 'Las contraseñas no coinciden'
            })}
            error={errors.confirmPassword?.message}
            placeholder="Repite tu contraseña"
          />

          <Button 
            type="submit" 
            className="w-full"
            loading={isSubmitting}
            disabled={emailCheckStatus === 'taken' || emailCheckStatus === 'checking'}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;