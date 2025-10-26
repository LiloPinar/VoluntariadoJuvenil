import { CheckCircle2, Clock, XCircle, Send } from "lucide-react";
import { EnrollmentStatus } from "@/contexts/ProjectContext";

interface EnrollmentStatusStepperProps {
  status: EnrollmentStatus;
  reviewedDate?: string;
  rejectionReason?: string;
}

export const EnrollmentStatusStepper = ({ 
  status, 
  reviewedDate,
  rejectionReason 
}: EnrollmentStatusStepperProps) => {
  const steps = [
    {
      id: 1,
      label: "Enviado",
      icon: Send,
      completed: true,
      active: status === 'pending',
    },
    {
      id: 2,
      label: "Pendiente",
      icon: Clock,
      completed: status === 'approved' || status === 'rejected',
      active: status === 'pending',
    },
    {
      id: 3,
      label: status === 'rejected' ? "Rechazado" : "Aprobado",
      icon: status === 'rejected' ? XCircle : CheckCircle2,
      completed: status === 'approved' || status === 'rejected',
      active: status === 'approved' || status === 'rejected',
    },
  ];

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Línea conectora */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full transition-all duration-500 ${
              status === 'pending' 
                ? 'bg-yellow-500 dark:bg-yellow-600 w-1/2'
                : status === 'approved'
                ? 'bg-green-500 dark:bg-green-600 w-full'
                : status === 'rejected'
                ? 'bg-red-500 dark:bg-red-600 w-full'
                : 'bg-gray-200 dark:bg-gray-700 w-0'
            }`}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
              style={{ flex: 1 }}
            >
              {/* Icono circular */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  transition-all duration-300 border-2
                  ${
                    step.completed && status === 'approved' && isLast
                      ? 'bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-500 text-white'
                      : step.completed && status === 'rejected' && isLast
                      ? 'bg-red-500 dark:bg-red-600 border-red-600 dark:border-red-500 text-white'
                      : step.completed || step.active
                      ? 'bg-yellow-500 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-500 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Label */}
              <span
                className={`
                  mt-1.5 text-[10px] sm:text-xs font-medium text-center
                  transition-colors duration-300
                  ${
                    step.active || step.completed
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-400 dark:text-gray-500'
                  }
                `}
              >
                {step.label}
              </span>

              {/* Fecha de revisión para el paso final */}
              {isLast && (status === 'approved' || status === 'rejected') && reviewedDate && (
                <span className="mt-0.5 text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                  {new Date(reviewedDate).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mensaje de rechazo */}
      {status === 'rejected' && rejectionReason && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-red-900 dark:text-red-200">Motivo del Rechazo:</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">{rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {status === 'approved' && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-green-900 dark:text-green-200">¡Solicitud Aprobada!</p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Tu inscripción ha sido aprobada.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de pendiente */}
      {status === 'pending' && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-yellow-900 dark:text-yellow-200">Solicitud en Revisión</p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Tu solicitud está siendo revisada.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
