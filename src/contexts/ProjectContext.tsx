import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  notifyEnrollmentApproved,
  notifyEnrollmentRejected,
} from '@/lib/notificationHelpers';
import { allProjects } from '@/data/projects';

/* =========================
   TIPOS
========================= */

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';
export type ManualHoursStatus = 'pending' | 'approved' | 'rejected';

export interface EnrollmentDocuments {
  idDocument: string;
  signature: string;
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

export interface ManualHoursRecord {
  id: string;
  userId: string;
  projectId: number;
  date: string;
  hours: number;
  description: string;
  evidence?: string;
  status: ManualHoursStatus;
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export type CertificateType = 'project' | 'dateRange' | 'general';
export type CertificatePurpose = 'educational' | 'employment' | 'personal' | 'other';
export type CertificateStatus = 'pending' | 'approved' | 'rejected';

export interface CertificateRequest {
  id: string;
  userId: string;
  type: CertificateType;
  projectId?: number;
  startDate?: string;
  endDate?: string;
  purpose: CertificatePurpose;
  institution?: string;
  observations?: string;
  status: CertificateStatus;
  requestDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  certificateUrl?: string;
}

export interface ProjectFeedback {
  id: string;
  userId: string;
  projectId: number;
  overallSatisfaction: number;
  organization: number;
  communication: number;
  communityImpact: number;
  wouldRecommend: boolean;
  bestAspect: string;
  improvements: string;
  additionalComments?: string;
  allowAnonymous: boolean;
  submittedDate: string;
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

/* =========================
   CONTEXT
========================= */

interface ProjectContextType {
  enrolledProjects: EnrolledProject[];
  manualHoursRecords: ManualHoursRecord[];
  certificateRequests: CertificateRequest[];
  projectFeedbacks: ProjectFeedback[];
  isEnrolled: (projectId: number, userId?: string) => boolean;
  getEnrollmentStatus: (
    projectId: number,
    userId?: string
  ) => EnrollmentStatus | null;
  enrollProject: (
    projectId: number,
    userId: string,
    data: EnrollmentData
  ) => void;
  unenrollProject: (projectId: number, userId: string) => void;
  getUserEnrolledProjects: (userId: string) => number[];
  getPendingEnrollments: () => EnrolledProject[];
  approveEnrollment: (
    projectId: number,
    userId: string,
    reviewedBy: string
  ) => void;
  rejectEnrollment: (
    projectId: number,
    userId: string,
    reviewedBy: string,
    reason: string
  ) => void;
  submitManualHours: (data: Omit<ManualHoursRecord, 'id'>) => void;
  getPendingManualHours: () => ManualHoursRecord[];
  getUserManualHours: (userId: string) => ManualHoursRecord[];
  approveManualHours: (id: string, reviewedBy: string) => void;
  rejectManualHours: (
    id: string,
    reviewedBy: string,
    reason: string
  ) => void;
  submitCertificateRequest: (data: Omit<CertificateRequest, 'id'>) => void;
  getPendingCertificateRequests: () => CertificateRequest[];
  getCertificateRequests: (userId: string) => CertificateRequest[];
  approveCertificateRequest: (
    id: string,
    reviewedBy: string,
    certificateUrl: string
  ) => void;
  rejectCertificateRequest: (
    id: string,
    reviewedBy: string,
    reason: string
  ) => void;
  submitProjectFeedback: (data: Omit<ProjectFeedback, 'id'>) => void;
  hasUserSubmittedFeedback: (projectId: number, userId: string) => boolean;
  getProjectFeedbacks: (projectId: number) => ProjectFeedback[];
  getProjectFeedbackStats: (projectId: number) => {
    averageOverall: number;
    averageOrganization: number;
    averageCommunication: number;
    averageImpact: number;
    recommendationRate: number;
    totalFeedbacks: number;
  } | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'voluntariajoven_enrolled_projects';
const MANUAL_HOURS_STORAGE_KEY = 'voluntariajoven_manual_hours';
const CERTIFICATE_REQUESTS_STORAGE_KEY = 'voluntariajoven_certificate_requests';
const PROJECT_FEEDBACKS_STORAGE_KEY = 'voluntariajoven_project_feedbacks';

/* =========================
   PROVIDER
========================= */

export const ProjectProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [enrolledProjects, setEnrolledProjects] = useState<
    EnrolledProject[]
  >([]);
  const [manualHoursRecords, setManualHoursRecords] = useState<
    ManualHoursRecord[]
  >([]);
  const [certificateRequests, setCertificateRequests] = useState<
    CertificateRequest[]
  >([]);
  const [projectFeedbacks, setProjectFeedbacks] = useState<
    ProjectFeedback[]
  >([]);

  /* ===== CARGA LOCALSTORAGE ===== */

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEnrolledProjects(JSON.parse(stored));
      } catch {
        setEnrolledProjects([]);
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(MANUAL_HOURS_STORAGE_KEY);
    if (stored) {
      try {
        setManualHoursRecords(JSON.parse(stored));
      } catch {
        setManualHoursRecords([]);
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(CERTIFICATE_REQUESTS_STORAGE_KEY);
    if (stored) {
      try {
        setCertificateRequests(JSON.parse(stored));
      } catch {
        setCertificateRequests([]);
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(PROJECT_FEEDBACKS_STORAGE_KEY);
    if (stored) {
      try {
        setProjectFeedbacks(JSON.parse(stored));
      } catch {
        setProjectFeedbacks([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(enrolledProjects)
    );
  }, [enrolledProjects]);

  useEffect(() => {
    try {
      // Intentar guardar todo
      localStorage.setItem(
        MANUAL_HOURS_STORAGE_KEY,
        JSON.stringify(manualHoursRecords)
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage lleno. Guardando sin evidencias...');
        try {
          // Guardar sin el campo evidence para ahorrar espacio
          const recordsWithoutEvidence = manualHoursRecords.map(
            ({ evidence, ...rest }) => rest
          );
          localStorage.setItem(
            MANUAL_HOURS_STORAGE_KEY,
            JSON.stringify(recordsWithoutEvidence)
          );
        } catch (secondError) {
          console.error('No se pudo guardar en localStorage:', secondError);
          // Como último recurso, limpiar registros antiguos aprobados/rechazados
          const recentRecords = manualHoursRecords
            .filter(r => r.status === 'pending' || 
                        (r.reviewedDate && 
                         new Date(r.reviewedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
            .map(({ evidence, ...rest }) => rest);
          
          try {
            localStorage.setItem(
              MANUAL_HOURS_STORAGE_KEY,
              JSON.stringify(recentRecords)
            );
          } catch {
            console.error('Error crítico: No se puede guardar en localStorage');
          }
        }
      }
    }
  }, [manualHoursRecords]);

  useEffect(() => {
    localStorage.setItem(
      CERTIFICATE_REQUESTS_STORAGE_KEY,
      JSON.stringify(certificateRequests)
    );
  }, [certificateRequests]);

  useEffect(() => {
    localStorage.setItem(
      PROJECT_FEEDBACKS_STORAGE_KEY,
      JSON.stringify(projectFeedbacks)
    );
  }, [projectFeedbacks]);

  /* ===== INSCRIPCIONES ===== */

  const isEnrolled = (projectId: number, userId?: string) => {
    if (!userId) return false;
    return enrolledProjects.some(
      (e) => e.projectId === projectId && e.userId === userId
    );
  };

  const getEnrollmentStatus = (
    projectId: number,
    userId?: string
  ): EnrollmentStatus | null => {
    if (!userId) return null;
    const enrollment = enrolledProjects.find(
      (e) => e.projectId === projectId && e.userId === userId
    );
    return enrollment?.status ?? null;
  };

  const enrollProject = (
    projectId: number,
    userId: string,
    data: EnrollmentData
  ) => {
    if (isEnrolled(projectId, userId)) return;

    setEnrolledProjects((prev) => [
      ...prev,
      {
        projectId,
        userId,
        enrolledDate: new Date().toISOString(),
        status: 'pending',
        data,
      },
    ]);
  };

  const unenrollProject = (projectId: number, userId: string) => {
    setEnrolledProjects((prev) =>
      prev.filter(
        (e) => !(e.projectId === projectId && e.userId === userId)
      )
    );
  };

  const getUserEnrolledProjects = (userId: string) =>
    enrolledProjects
      .filter((e) => e.userId === userId)
      .map((e) => e.projectId);

  const getPendingEnrollments = () =>
    enrolledProjects.filter((e) => e.status === 'pending');

  const approveEnrollment = (
    projectId: number,
    userId: string,
    reviewedBy: string
  ) => {
    setEnrolledProjects((prev) =>
      prev.map((e) =>
        e.projectId === projectId && e.userId === userId
          ? {
              ...e,
              status: 'approved',
              reviewedBy,
              reviewedDate: new Date().toISOString(),
            }
          : e
      )
    );

    const project = allProjects.find((p) => p.id === projectId);
    if (project) {
      notifyEnrollmentApproved(
        userId,
        project.title,
        projectId.toString()
      );
    }
  };

  const rejectEnrollment = (
    projectId: number,
    userId: string,
    reviewedBy: string,
    reason: string
  ) => {
    setEnrolledProjects((prev) =>
      prev.map((e) =>
        e.projectId === projectId && e.userId === userId
          ? {
              ...e,
              status: 'rejected',
              reviewedBy,
              reviewedDate: new Date().toISOString(),
              rejectionReason: reason,
            }
          : e
      )
    );

    const project = allProjects.find((p) => p.id === projectId);
    if (project) {
      notifyEnrollmentRejected(
        userId,
        project.title,
        projectId.toString(),
        reason
      );
    }
  };

  /* ===== HORAS MANUALES ===== */

  const submitManualHours = (
    data: Omit<ManualHoursRecord, 'id'>
  ) => {
    setManualHoursRecords((prev) => [
      ...prev,
      {
        ...data,
        id: `manual-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
      },
    ]);
  };

  const getPendingManualHours = () =>
    manualHoursRecords.filter((r) => r.status === 'pending');

  const getUserManualHours = (userId: string) =>
    manualHoursRecords.filter((r) => r.userId === userId);

  const approveManualHours = (id: string, reviewedBy: string) => {
    setManualHoursRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'approved',
              reviewedBy,
              reviewedDate: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const rejectManualHours = (
    id: string,
    reviewedBy: string,
    reason: string
  ) => {
    setManualHoursRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'rejected',
              reviewedBy,
              reviewedDate: new Date().toISOString(),
              rejectionReason: reason,
            }
          : r
      )
    );
  };

  /* ===== CERTIFICADOS ===== */

  const submitCertificateRequest = (
    data: Omit<CertificateRequest, 'id'>
  ) => {
    setCertificateRequests((prev) => [
      ...prev,
      {
        ...data,
        id: `cert-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
      },
    ]);
  };

  const getPendingCertificateRequests = () =>
    certificateRequests.filter((r) => r.status === 'pending');

  const getCertificateRequests = (userId: string) =>
    certificateRequests
      .filter((r) => r.userId === userId)
      .sort((a, b) => 
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );

  const approveCertificateRequest = (
    id: string,
    reviewedBy: string,
    certificateUrl: string
  ) => {
    setCertificateRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'approved',
              reviewedBy,
              reviewedDate: new Date().toISOString(),
              certificateUrl,
            }
          : r
      )
    );
  };

  const rejectCertificateRequest = (
    id: string,
    reviewedBy: string,
    reason: string
  ) => {
    setCertificateRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'rejected',
              reviewedBy,
              reviewedDate: new Date().toISOString(),
              rejectionReason: reason,
            }
          : r
      )
    );
  };

  /* ===== FEEDBACKS DE PROYECTOS ===== */

  const submitProjectFeedback = (data: Omit<ProjectFeedback, 'id'>) => {
    setProjectFeedbacks((prev) => [
      ...prev,
      {
        ...data,
        id: `feedback-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`,
      },
    ]);
  };

  const hasUserSubmittedFeedback = (projectId: number, userId: string): boolean => {
    return projectFeedbacks.some(
      (f) => f.projectId === projectId && f.userId === userId
    );
  };

  const getProjectFeedbacks = (projectId: number): ProjectFeedback[] => {
    return projectFeedbacks.filter((f) => f.projectId === projectId);
  };

  const getProjectFeedbackStats = (projectId: number) => {
    const feedbacks = getProjectFeedbacks(projectId);
    
    if (feedbacks.length === 0) return null;

    const totalFeedbacks = feedbacks.length;
    const averageOverall = feedbacks.reduce((sum, f) => sum + f.overallSatisfaction, 0) / totalFeedbacks;
    const averageOrganization = feedbacks.reduce((sum, f) => sum + f.organization, 0) / totalFeedbacks;
    const averageCommunication = feedbacks.reduce((sum, f) => sum + f.communication, 0) / totalFeedbacks;
    const averageImpact = feedbacks.reduce((sum, f) => sum + f.communityImpact, 0) / totalFeedbacks;
    const recommendationRate = (feedbacks.filter((f) => f.wouldRecommend).length / totalFeedbacks) * 100;

    return {
      averageOverall: Math.round(averageOverall * 10) / 10,
      averageOrganization: Math.round(averageOrganization * 10) / 10,
      averageCommunication: Math.round(averageCommunication * 10) / 10,
      averageImpact: Math.round(averageImpact * 10) / 10,
      recommendationRate: Math.round(recommendationRate),
      totalFeedbacks,
    };
  };

  /* ===== PROVIDER ===== */

  return (
    <ProjectContext.Provider
      value={{
        enrolledProjects,
        manualHoursRecords,
        certificateRequests,
        projectFeedbacks,
        isEnrolled,
        getEnrollmentStatus,
        enrollProject,
        unenrollProject,
        getUserEnrolledProjects,
        getPendingEnrollments,
        approveEnrollment,
        rejectEnrollment,
        submitManualHours,
        getPendingManualHours,
        getUserManualHours,
        approveManualHours,
        rejectManualHours,
        submitCertificateRequest,
        getPendingCertificateRequests,
        getCertificateRequests,
        approveCertificateRequest,
        rejectCertificateRequest,
        submitProjectFeedback,
        hasUserSubmittedFeedback,
        getProjectFeedbacks,
        getProjectFeedbackStats,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error(
      'useProjectContext must be used within a ProjectProvider'
    );
  }
  return context;
};
