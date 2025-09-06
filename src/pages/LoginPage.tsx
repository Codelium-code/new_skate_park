import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for success message from registration
  useEffect(() => {
    const state = location.state as any;
    if (state?.message) {
      setSuccessMessage(state.message);
      if (state.email) {
        setValue('email', state.email);
      }
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const success = login(data.email.toLowerCase().trim(), data.password);
      
      if (success) {
        navigate('/profile');
      } else {
        setLoginError('Email o contraseña incorrectos, o tu cuenta está desactivada');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
          <p className="text-gray-300">Accede a tu cuenta de SkatePark Pro</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-2">
            <CheckCircle size={20} className="text-green-400" />
            <p className="text-green-300 text-sm">{successMessage}</p>
          </div>
        )}

        {loginError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-300 text-sm">{loginError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email es requerido',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido'
              }
            })}
            error={errors.email?.message}
            placeholder="tu@email.com"
          />

          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Contraseña es requerida'
              })}
              error={errors.password?.message}
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            loading={isSubmitting}
          >
            <LogIn size={16} className="mr-2" />
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-orange-400 hover:text-orange-300 transition-colors">
              Regístrate aquí
            </Link>
          </p>
          
          <div className="border-t border-white/10 pt-4">
            <Link
              to="/admin-login"
              className="text-green-400 hover:text-green-300 transition-colors text-sm"
            >
              Acceso Administrativo
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;