import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

interface AdminLoginFormData {
  password: string;
}

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const success = adminLogin(data.password);
      
      if (success) {
        navigate('/admin');
      } else {
        setLoginError('Contraseña de administrador incorrecta');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setLoginError('Error al iniciar sesión como administrador');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Shield size={32} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Acceso Administrativo</h1>
          <p className="text-gray-300">Panel de administración de SkatePark Pro</p>
        </div>

        {loginError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-300 text-sm">{loginError}</p>
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-300 text-sm">
            <strong>Contraseña por defecto:</strong> admin123
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Contraseña de Administrador"
            type="password"
            {...register('password', {
              required: 'Contraseña es requerida'
            })}
            error={errors.password?.message}
            placeholder="Ingresa la contraseña de admin"
          />

          <Button 
            type="submit" 
            variant="success"
            className="w-full"
            loading={isSubmitting}
          >
            <Shield size={16} className="mr-2" />
            {isSubmitting ? 'Verificando...' : 'Acceder como Admin'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
          >
            ← Volver al login de usuarios
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginPage;