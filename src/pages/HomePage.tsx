import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, LogIn, Shield, Keyboard as Skateboarding, Trophy, Users, Star } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  const { currentUser, isAdminLoggedIn } = useAuth();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features = [
    {
      id: 'register',
      icon: UserPlus,
      title: 'Registro Rápido',
      description: 'Únete a la comunidad de skateboarding con un proceso de registro simple y rápido'
    },
    {
      id: 'profile',
      icon: Trophy,
      title: 'Perfil Personalizado',
      description: 'Gestiona tu información, especialidad y foto de perfil de manera intuitiva'
    },
    {
      id: 'community',
      icon: Users,
      title: 'Comunidad X Games',
      description: 'Conecta con otros skaters y participa en la cultura del skateboarding'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Skateboarding size={48} className="text-orange-400" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            SkatePark Pro
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          La plataforma definitiva para gestionar participantes en competencias de skateboarding. 
          Inspirada en los <span className="text-orange-400 font-semibold">X Games</span>, 
          diseñada para la comunidad del skateboarding.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          {!currentUser && !isAdminLoggedIn && (
            <>
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-4">
                  <UserPlus size={20} className="mr-2" />
                  Únete Ahora
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                  <LogIn size={20} className="mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/admin-login">
                <Button variant="success" size="lg" className="text-lg px-8 py-4">
                  <Shield size={20} className="mr-2" />
                  Admin
                </Button>
              </Link>
            </>
          )}
          
          {currentUser && (
            <Link to="/profile">
              <Button size="lg" className="text-lg px-8 py-4">
                <Trophy size={20} className="mr-2" />
                Mi Perfil
              </Button>
            </Link>
          )}
          
          {isAdminLoggedIn && (
            <Link to="/admin">
              <Button variant="success" size="lg" className="text-lg px-8 py-4">
                <Users size={20} className="mr-2" />
                Panel Admin
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={feature.id}
              hover
              className={`text-center transition-all duration-300 ${
                hoveredCard === feature.id ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-orange-500/20 rounded-full">
                  <IconComponent size={32} className="text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Stats Section */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 border-orange-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-400">Pro</div>
            <div className="text-gray-300">Nivel de Experiencia</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-400">Local</div>
            <div className="text-gray-300">Almacenamiento</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-400">X Games</div>
            <div className="text-gray-300">Estilo Inspirado</div>
          </div>
        </div>
      </Card>

      {/* Specialties Showcase */}
      <div className="text-center space-y-8">
        <h2 className="text-3xl font-bold text-white">Especialidades de Skateboarding</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {['Street', 'Vert', 'Park', 'Freestyle', 'Longboard', 'Cruising'].map((specialty, index) => (
            <div
              key={specialty}
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-2">
                <Star size={24} className="text-orange-400" />
                <span className="text-white font-medium">{specialty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;