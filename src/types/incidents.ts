// Tipos de incidencias
export const INCIDENT_TYPES = {
  ACCIDENT: 'Accidente menor',
  HEALTH: 'Problema de salud',
  CONFLICT: 'Conflicto entre voluntarios',
  LOGISTICS: 'Problema logístico',
  RESOURCES: 'Falta de recursos',
  SECURITY: 'Problema de seguridad',
  EQUIPMENT: 'Fallo de equipo/material',
  WEATHER: 'Problema climático',
  OTHER: 'Otro',
} as const;

export type IncidentType = keyof typeof INCIDENT_TYPES;

// Estados de la incidencia
export type IncidentStatus = 'pendiente' | 'en_seguimiento' | 'resuelto' | 'cancelado';

// Severidad de la incidencia
export type IncidentSeverity = 'baja' | 'media' | 'alta' | 'critica';

// Interfaz de incidencia
export interface Incident {
  id: string;
  projectId: number;
  projectTitle: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  type: IncidentType;
  severity: IncidentSeverity;
  date: string; // Fecha y hora del incidente
  reportDate: string; // Fecha y hora del reporte
  description: string;
  peopleInvolved: string;
  location: string;
  evidence?: string; // Base64 de imagen
  status: IncidentStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  resolutionNotes?: string;
}

// Opciones de severidad para el formulario
export const SEVERITY_OPTIONS = [
  { value: 'baja', label: 'Baja', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'media', label: 'Media', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  { value: 'critica', label: 'Crítica', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
] as const;

// Clave de localStorage
export const INCIDENTS_STORAGE_KEY = 'voluntariajoven_incidents';
