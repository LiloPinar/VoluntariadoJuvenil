import { Notification, NotificationType } from '@/contexts/NotificationContext';

/**
 * Verifica si el usuario tiene las notificaciones habilitadas
 */
const isNotificationEnabled = (type: 'project' | 'reminder'): boolean => {
  if (type === 'project') {
    const projectNotifications = localStorage.getItem('projectNotifications');
    return projectNotifications !== 'false'; // Por defecto true si no existe
  }
  if (type === 'reminder') {
    const reminderNotifications = localStorage.getItem('reminderNotifications');
    return reminderNotifications !== 'false'; // Por defecto true si no existe
  }
  return true;
};

/**
 * Envía una notificación a un usuario específico
 */
export const sendNotificationToUser = (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: any
) => {
  const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  const newNotification: Notification = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    message,
    timestamp: Date.now(),
    read: false,
    data,
  };
  
  allNotifications.push(newNotification);
  localStorage.setItem('notifications', JSON.stringify(allNotifications));
};

/**
 * Envía una notificación a todos los usuarios registrados
 */
export const sendNotificationToAllUsers = (
  type: NotificationType,
  title: string,
  message: string,
  data?: any
) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  users.forEach((user: any) => {
    sendNotificationToUser(user.id, type, title, message, data);
  });
};

/**
 * Envía una notificación sobre un nuevo proyecto a todos los usuarios
 */
export const notifyNewProject = (projectTitle: string, projectId: string) => {
  // Verificar si las notificaciones de proyectos están habilitadas
  if (!isNotificationEnabled('project')) {
    return; // No enviar notificaciones si están deshabilitadas
  }
  
  sendNotificationToAllUsers(
    'new_project',
    `Nuevo Proyecto: ${projectTitle}`,
    `Se ha publicado un nuevo proyecto. ¡Únete ahora!`,
    { projectId }
  );
};

/**
 * Envía una notificación sobre actualización de proyecto a usuarios inscritos
 */
export const notifyProjectUpdate = (projectId: string, projectTitle: string, updateMessage: string) => {
  // Verificar si las notificaciones de proyectos están habilitadas
  if (!isNotificationEnabled('project')) {
    return;
  }
  
  const enrollments = JSON.parse(localStorage.getItem('enrollments') || '[]');
  
  // Encontrar todos los usuarios inscritos en este proyecto
  const enrolledUsers = enrollments
    .filter((e: any) => e.projectId === projectId)
    .map((e: any) => e.userId);
  
  // Enviar notificación a cada usuario inscrito
  enrolledUsers.forEach((userId: string) => {
    sendNotificationToUser(
      userId,
      'project_updated',
      `Proyecto Actualizado: ${projectTitle}`,
      updateMessage,
      { projectId }
    );
  });
};

/**
 * Envía notificación de aprobación de inscripción
 */
export const notifyEnrollmentApproved = (
  userId: string,
  projectTitle: string,
  projectId: string
) => {
  sendNotificationToUser(
    userId,
    'enrollment_approved',
    '¡Inscripción Aprobada!',
    `Tu inscripción al proyecto "${projectTitle}" ha sido aprobada. ¡Bienvenido!`,
    { projectId }
  );
};

/**
 * Envía notificación de rechazo de inscripción
 */
export const notifyEnrollmentRejected = (
  userId: string,
  projectTitle: string,
  projectId: string,
  reason?: string
) => {
  sendNotificationToUser(
    userId,
    'enrollment_rejected',
    'Inscripción No Aprobada',
    reason || `Tu inscripción al proyecto "${projectTitle}" no fue aprobada en esta ocasión.`,
    { projectId }
  );
};

/**
 * Envía notificación cuando se completa un objetivo/actividad
 */
export const notifyGoalCompleted = (
  userId: string,
  activityTitle: string,
  projectTitle: string,
  projectId: string,
  hoursEarned: number
) => {
  sendNotificationToUser(
    userId,
    'goal_completed',
    '¡Objetivo Cumplido!',
    `Has completado la actividad "${activityTitle}" del proyecto "${projectTitle}". +${hoursEarned} horas de voluntariado.`,
    { projectId, activityTitle, hoursEarned }
  );
};

/**
 * Envía recordatorio de actividad próxima
 */
export const notifyUpcomingActivity = (
  userId: string,
  activityTitle: string,
  projectTitle: string,
  projectId: string,
  daysUntil: number
) => {
  // Verificar si los recordatorios están habilitados
  if (!isNotificationEnabled('reminder')) {
    return;
  }
  
  sendNotificationToUser(
    userId,
    'reminder',
    'Recordatorio de Actividad',
    `La actividad "${activityTitle}" del proyecto "${projectTitle}" es en ${daysUntil} día${daysUntil !== 1 ? 's' : ''}.`,
    { projectId, activityTitle }
  );
};
