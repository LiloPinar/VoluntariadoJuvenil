import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notifyEnrollmentApproved, notifyEnrollmentRejected } from '@/lib/notificationHelpers';
import { allProjects } from '@/data/projects';

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface EnrollmentDocuments {
  idDocument: string; // Base64 o URL del documento de identidad
  signature: string; // Base64 o URL de la firma electrónica
}

export interface EnrollmentData {
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  motivation: string;
  availability: string[];
  experience: string;
  documents: EnrollmentDocuments;
}

export interface EnrolledProject {
  projectId: number;
  userId: string;
  enrolledDate: string;
  status: EnrollmentStatus;
  data?: EnrollmentData;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

interface ProjectContextType {
  enrolledProjects: EnrolledProject[];
  isEnrolled: (projectId: number, userId?: string) => boolean;
  getEnrollmentStatus: (projectId: number, userId?: string) => EnrollmentStatus | null;
  enrollProject: (projectId: number, userId: string, data: EnrollmentData) => void;
  unenrollProject: (projectId: number, userId: string) => void;
  getUserEnrolledProjects: (userId: string) => number[];
  getPendingEnrollments: () => EnrolledProject[];
  approveEnrollment: (projectId: number, userId: string, reviewedBy: string) => void;
  rejectEnrollment: (projectId: number, userId: string, reviewedBy: string, reason: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = 'voluntariajoven_enrolled_projects';

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [enrolledProjects, setEnrolledProjects] = useState<EnrolledProject[]>([]);

  // Cargar inscripciones desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEnrolledProjects(parsed);
      } catch (error) {
        console.error('Error loading enrolled projects:', error);
        setEnrolledProjects([]);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambian las inscripciones
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enrolledProjects));
  }, [enrolledProjects]);

  // Verificar si un usuario está inscrito en un proyecto
  const isEnrolled = (projectId: number, userId?: string): boolean => {
    if (!userId) return false;
    return enrolledProjects.some(
      (enrollment) => enrollment.projectId === projectId && enrollment.userId === userId
    );
  };

  // Obtener el estado de inscripción de un proyecto
  const getEnrollmentStatus = (projectId: number, userId?: string): EnrollmentStatus | null => {
    if (!userId) return null;
    const enrollment = enrolledProjects.find(
      (e) => e.projectId === projectId && e.userId === userId
    );
    return enrollment?.status || null;
  };

  // Inscribir usuario en un proyecto con datos adicionales
  const enrollProject = (projectId: number, userId: string, data: EnrollmentData) => {
    // Verificar si ya está inscrito
    if (isEnrolled(projectId, userId)) {
      return;
    }

    const newEnrollment: EnrolledProject = {
      projectId,
      userId,
      enrolledDate: new Date().toISOString(),
      status: 'pending',
      data,
    };

    setEnrolledProjects((prev) => [...prev, newEnrollment]);
  };

  // Desinscribir usuario de un proyecto
  const unenrollProject = (projectId: number, userId: string) => {
    setEnrolledProjects((prev) =>
      prev.filter(
        (enrollment) =>
          !(enrollment.projectId === projectId && enrollment.userId === userId)
      )
    );
  };

  // Obtener todos los IDs de proyectos en los que está inscrito un usuario
  const getUserEnrolledProjects = (userId: string): number[] => {
    return enrolledProjects
      .filter((enrollment) => enrollment.userId === userId)
      .map((enrollment) => enrollment.projectId);
  };

  // Obtener todas las inscripciones pendientes (para administradores)
  const getPendingEnrollments = (): EnrolledProject[] => {
    return enrolledProjects.filter((enrollment) => enrollment.status === 'pending');
  };

  // Aprobar una inscripción
  const approveEnrollment = (projectId: number, userId: string, reviewedBy: string) => {
    setEnrolledProjects((prev) =>
      prev.map((enrollment) =>
        enrollment.projectId === projectId && enrollment.userId === userId
          ? {
              ...enrollment,
              status: 'approved' as EnrollmentStatus,
              reviewedDate: new Date().toISOString(),
              reviewedBy,
            }
          : enrollment
      )
    );

    // Enviar notificación al usuario
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
      notifyEnrollmentApproved(userId, project.title, projectId.toString());
    }
  };

  // Rechazar una inscripción
  const rejectEnrollment = (projectId: number, userId: string, reviewedBy: string, reason: string) => {
    setEnrolledProjects((prev) =>
      prev.map((enrollment) =>
        enrollment.projectId === projectId && enrollment.userId === userId
          ? {
              ...enrollment,
              status: 'rejected' as EnrollmentStatus,
              reviewedDate: new Date().toISOString(),
              reviewedBy,
              rejectionReason: reason,
            }
          : enrollment
      )
    );

    // Enviar notificación al usuario
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
      notifyEnrollmentRejected(userId, project.title, projectId.toString(), reason);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        enrolledProjects,
        isEnrolled,
        getEnrollmentStatus,
        enrollProject,
        unenrollProject,
        getUserEnrolledProjects,
        getPendingEnrollments,
        approveEnrollment,
        rejectEnrollment,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
