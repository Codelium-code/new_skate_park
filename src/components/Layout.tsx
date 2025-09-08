import React, { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Keyboard as Skateboarding, Home, Users, UserCircle, LogOut, Shield, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser, isAdminLoggedIn, logout, adminLogout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (isAdminLoggedIn) {
      adminLogout();
    } else {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors">
                <Skateboarding size={24} />
                <span className="font-bold text-lg">SkatePark Pro</span>
              </Link>
              
              <div className="flex space-x-6">
                <Link
                  to="/"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-orange-400 bg-orange-500/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Home size={16} />
                  <span>Inicio</span>
                </Link>
                
                {currentUser && (
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'text-orange-400 bg-orange-500/10' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <UserCircle size={16} />
                    <span>Perfil</span>
                  </Link>
                )}
                
                {isAdminLoggedIn && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin') 
                        ? 'text-orange-400 bg-orange-500/10' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Users size={16} />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Link
                  to="/resultados"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/resultados') 
                      ? 'text-orange-400 bg-orange-500/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Trophy size={16} />
                  <span>Resultados</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <span className="text-sm">Hola, {currentUser.nombre}</span>
                  {currentUser.fotoBase64 && (
                    <img 
                      src={currentUser.fotoBase64} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-orange-500/50"
                    />
                  )}
                </div>
              )}
              
              {isAdminLoggedIn && (
                <div className="flex items-center space-x-2 text-green-400">
                  <Shield size={16} />
                  <span className="text-sm">Admin</span>
                </div>
              )}
              
              {(currentUser || isAdminLoggedIn) && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Salir</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;