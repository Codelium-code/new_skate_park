import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ToggleLeft, 
  ToggleRight, 
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/localStorage';
import { Skater } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import StageEvaluationForm from '../components/StageEvaluationForm';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAuth();
  const [skaters, setSkaters] = useState<Skater[]>(storage.getSkaters());
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSkater, setSelectedSkater] = useState<Skater | null>(null);
  const [activeTab, setActiveTab] = useState<'participants' | 'tournament'>('participants');

  if (!isAdminLoggedIn) {
    navigate('/admin-login');
    return null;
  }

  const specialtyOptions = [
    { value: 'all', label: 'Todas las especialidades' },
    { value: 'Street', label: 'Street' },
    { value: 'Vert', label: 'Vert' },
    { value: 'Park', label: 'Park' },
    { value: 'Freestyle', label: 'Freestyle' },
    { value: 'Longboard', label: 'Longboard' },
    { value: 'Cruising', label: 'Cruising' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' }
  ];

  // Filter skaters
  const filteredSkaters = useMemo(() => {
    return skaters.filter(skater => {
      const matchesSearch = 
        skater.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skater.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialty = 
        specialtyFilter === 'all' || skater.especialidad === specialtyFilter;
      
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && skater.estado) ||
        (statusFilter === 'inactive' && !skater.estado);

      return matchesSearch && matchesSpecialty && matchesStatus;
    });
  }, [skaters, searchTerm, specialtyFilter, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = skaters.length;
    const active = skaters.filter(s => s.estado).length;
    const inactive = total - active;
    const recent = storage.getRecentRegistrations(7);

    return { total, active, inactive, recent };
  }, [skaters]);

  const toggleSkaterStatus = (skaterId: string) => {
    const skater = skaters.find(s => s.id === skaterId);
    if (skater) {
      const newStatus = !skater.estado;
      storage.updateSkater(skaterId, { estado: newStatus });
      
      // Update local state
      setSkaters(prev => 
        prev.map(s => 
          s.id === skaterId 
            ? { ...s, estado: newStatus, updatedAt: new Date().toISOString() }
            : s
        )
      );
      
      // Update selected skater if viewing details
      if (selectedSkater?.id === skaterId) {
        setSelectedSkater(prev => 
          prev ? { ...prev, estado: newStatus } : null
        );
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Panel Administrativo</h1>
        <p className="text-gray-300">Gestiona todos los participantes de SkatePark Pro</p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mt-6">
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('participants')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'participants'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Users size={16} className="mr-2 inline" />
              Participantes
            </button>
            <button
              onClick={() => setActiveTab('tournament')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tournament'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Trophy size={16} className="mr-2 inline" />
              Evaluaciones
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'tournament' && (
        <div className="space-y-8">
          <StageEvaluationForm />
        </div>
      )}

      {activeTab === 'participants' && (
        <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Users size={24} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-300 text-sm">Total Participantes</div>
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-green-500/20 rounded-full">
              <UserCheck size={24} className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.active}</div>
            <div className="text-gray-300 text-sm">Activos</div>
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-red-500/20 rounded-full">
              <UserX size={24} className="text-red-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.inactive}</div>
            <div className="text-gray-300 text-sm">Inactivos</div>
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <TrendingUp size={24} className="text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.recent}</div>
            <div className="text-gray-300 text-sm">Últimos 7 días</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2 text-white">
            <Filter size={20} className="text-orange-400" />
            <span className="font-medium">Filtros:</span>
          </div>
          
          <div className="flex flex-1 gap-4 w-full lg:w-auto">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              options={specialtyOptions}
            />
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </div>
          
          <div className="text-sm text-gray-400">
            {filteredSkaters.length} de {stats.total} participantes
          </div>
        </div>
      </Card>

      {/* Skaters List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skaters Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Users size={20} className="text-orange-400" />
            <span>Participantes</span>
          </h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredSkaters.map((skater) => (
              <Card 
                key={skater.id}
                hover
                className={`cursor-pointer transition-all duration-200 ${
                  selectedSkater?.id === skater.id ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedSkater(skater)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {skater.fotoBase64 ? (
                      <img 
                        src={skater.fotoBase64} 
                        alt={skater.nombre} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Users size={20} className="text-orange-400" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-white">{skater.nombre}</h3>
                      <p className="text-sm text-gray-400">{skater.email}</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-orange-400">{skater.especialidad}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-blue-400">{skater.edad} años</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-green-400">{skater.nacionalidad}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSkaterStatus(skater.id);
                      }}
                      className={`transition-colors ${
                        skater.estado 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-red-400 hover:text-red-300'
                      }`}
                    >
                      {skater.estado ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                    
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      skater.estado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {skater.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            
            {filteredSkaters.length === 0 && (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No se encontraron participantes</p>
              </div>
            )}
          </div>
        </div>

        {/* Skater Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Eye size={20} className="text-orange-400" />
            <span>Detalles del Participante</span>
          </h2>
          
          {selectedSkater ? (
            <Card>
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                  {selectedSkater.fotoBase64 ? (
                    <img 
                      src={selectedSkater.fotoBase64} 
                      alt={selectedSkater.nombre} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/50"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Users size={24} className="text-orange-400" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedSkater.nombre}</h3>
                    <p className="text-gray-400">{selectedSkater.email}</p>
                  </div>
                </div>
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Edad</p>
                    <p className="text-white font-medium">{selectedSkater.edad} años</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Nacionalidad</p>
                    <p className="text-white font-medium">{selectedSkater.nacionalidad}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Especialidad</p>
                    <p className="text-white font-medium">{selectedSkater.especialidad}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Experiencia</p>
                    <p className="text-white font-medium">{selectedSkater.anos_experiencia} años</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Estado</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedSkater.estado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedSkater.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400">ID</p>
                    <p className="text-white font-mono text-xs">{selectedSkater.id}</p>
                  </div>
                </div>
                
                {/* Timestamps */}
                <div className="grid grid-cols-1 gap-3 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Registrado:</span>
                    <span className="text-white">
                      {new Date(selectedSkater.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Última actualización:</span>
                    <span className="text-white">
                      {new Date(selectedSkater.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="pt-4">
                  <Button
                    onClick={() => toggleSkaterStatus(selectedSkater.id)}
                    variant={selectedSkater.estado ? 'danger' : 'success'}
                    className="w-full"
                  >
                    {selectedSkater.estado ? (
                      <>
                        <ToggleLeft size={16} className="mr-2" />
                        Desactivar Participante
                      </>
                    ) : (
                      <>
                        <ToggleRight size={16} className="mr-2" />
                        Activar Participante
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <Eye size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">
                Selecciona un participante para ver sus detalles
              </p>
            </Card>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;