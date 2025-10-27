import { Activity } from '@/data/projects';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react';

interface ProjectActivitiesProps {
  activities: Activity[];
  userId?: string;
  showProgress?: boolean;
}

export const ProjectActivities = ({ 
  activities = [], 
  userId,
  showProgress = true 
}: ProjectActivitiesProps) => {
  
  // Calcular estadísticas
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.isCompleted).length;
  const userCompletedActivities = userId 
    ? activities.filter(a => a.completedBy.includes(userId)).length 
    : 0;
  
  const totalHours = activities.reduce((sum, a) => sum + a.hours, 0);
  const completedHours = activities
    .filter(a => a.isCompleted)
    .reduce((sum, a) => sum + a.hours, 0);
  const userCompletedHours = userId
    ? activities
        .filter(a => a.completedBy.includes(userId))
        .reduce((sum, a) => sum + a.hours, 0)
    : 0;

  const progressPercentage = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
  const userProgressPercentage = totalHours > 0 ? (userCompletedHours / totalHours) * 100 : 0;

  // Determinar el estado de una actividad para el usuario
  const getActivityStatus = (activity: Activity) => {
    if (userId && activity.completedBy.includes(userId)) {
      return 'completed';
    }
    if (activity.isCompleted) {
      return 'in-progress';
    }
    return 'not-started';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          label: 'Completada',
          color: 'text-green-600 dark:text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800',
        };
      case 'in-progress':
        return {
          icon: PlayCircle,
          label: 'En Progreso',
          color: 'text-blue-600 dark:text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-950',
          borderColor: 'border-blue-200 dark:border-blue-800',
        };
      case 'not-started':
        return {
          icon: Circle,
          label: 'Sin Empezar',
          color: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900',
          borderColor: 'border-gray-200 dark:border-gray-700',
        };
      default:
        return {
          icon: Circle,
          label: 'Desconocido',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Actividades del Proyecto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Circle className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>Este proyecto aún no tiene actividades definidas</p>
            <p className="text-sm mt-1">El administrador agregará actividades próximamente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Actividades del Proyecto
        </CardTitle>
        
        {showProgress && (
          <div className="space-y-3 mt-4">
            {/* Progreso General del Proyecto */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progreso General</span>
                <span className="font-medium">
                  {completedActivities} de {totalActivities} actividades ({progressPercentage.toFixed(0)}%)
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {completedHours}h de {totalHours}h completadas
              </p>
            </div>

            {/* Progreso Personal del Usuario */}
            {userId && (
              <div className="border-t pt-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Tu Progreso</span>
                  <span className="font-medium text-primary">
                    {userCompletedActivities} de {totalActivities} actividades ({userProgressPercentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={userProgressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Has acumulado <span className="font-semibold text-primary">{userCompletedHours}h</span> de {totalHours}h
                </p>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const status = getActivityStatus(activity);
            const statusConfig = getStatusConfig(status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={activity.id}
                className={`border rounded-lg p-4 ${statusConfig.borderColor} ${statusConfig.bgColor} transition-all`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                      <h4 className="font-medium">{activity.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`${statusConfig.bgColor} ${statusConfig.color} ${statusConfig.borderColor}`}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mb-2 ml-7">
                        {activity.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm ml-7">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3" />
                        {activity.hours}h
                      </span>
                      
                      {activity.isCompleted && (
                        <span className="text-muted-foreground">
                          {activity.completedBy.length} participantes completaron
                        </span>
                      )}
                    </div>

                    {activity.validatedAt && userId && activity.completedBy.includes(userId) && (
                      <p className="text-xs text-muted-foreground mt-2 ml-7">
                        ✓ Validada el {new Date(activity.validatedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de Horas */}
        {userId && userCompletedHours > 0 && (
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de horas acumuladas</p>
                <p className="text-2xl font-bold text-primary">{userCompletedHours}h</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
