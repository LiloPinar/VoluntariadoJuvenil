// Estados de la solicitud de baja
export type WithdrawalStatus = 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada';

// Motivos predefinidos para solicitar baja
export const WITHDRAWAL_REASONS = {
  PERSONAL: 'Motivos personales',
  ACADEMIC: 'Compromisos académicos',
  WORK: 'Compromisos laborales',
  HEALTH: 'Problemas de salud',
  RELOCATION: 'Cambio de residencia',
  SCHEDULE: 'Incompatibilidad de horarios',
  OTHER: 'Otro motivo',
} as const;

export type WithdrawalReason = keyof typeof WITHDRAWAL_REASONS;

// Opciones de disponibilidad para transición
export const TRANSITION_OPTIONS = [
  { value: 'immediate', label: 'Baja inmediata' },
  { value: 'one_week', label: 'Disponible 1 semana más' },
  { value: 'two_weeks', label: 'Disponible 2 semanas más' },
  { value: 'one_month', label: 'Disponible 1 mes más' },
] as const;

// Interfaz de solicitud de baja
export interface WithdrawalRequest {
  id: string;
  projectId: number;
  projectTitle: string;
  volunteerId: string;
  volunteerName: string;
  volunteerEmail: string;
  reason: WithdrawalReason;
  reasonDetails: string;
  effectiveDate: string;
  transitionAvailability: string;
  additionalComments?: string;
  status: WithdrawalStatus;
  requestDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewerComments?: string;
}

// Clave de localStorage
export const WITHDRAWALS_STORAGE_KEY = 'voluntariajoven_withdrawals';
