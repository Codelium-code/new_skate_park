export interface Skater {
  id: string;
  nombre: string;
  email: string;
  password: string;
  anos_experiencia: number;
  especialidad: string;
  edad: number;
  nacionalidad: string;
  fotoBase64?: string;
  estado: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SkateSpecialty = 'Street' | 'Vert' | 'Park' | 'Freestyle' | 'Longboard' | 'Cruising';

export interface DashboardStats {
  totalParticipants: number;
  activeParticipants: number;
  inactiveParticipants: number;
  recentRegistrations: number;
}