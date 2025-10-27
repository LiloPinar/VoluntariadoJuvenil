import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EnrollmentDialog } from '@/components/EnrollmentDialog';
import { EnrollmentStatusStepper } from '@/components/EnrollmentStatusStepper';
import { ProjectActivities } from '@/components/ProjectActivities';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProjectContext } from '@/contexts/ProjectContext';
import { allProjects } from '@/data/projects';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const categoryColors = {
  social: 'bg-accent text-accent-foreground',
  environmental: 'bg-secondary text-secondary-foreground',
  educational: 'bg-primary text-primary-foreground',
};

const categoryLabels = {
  social: 'Social',
  environmental: 'Ambiental',
  educational: 'Educativo',
};

const DetalleProyecto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();
  const { isEnrolled: checkEnrolled, getEnrollmentStatus, unenrollProject, enrolledProjects } = useProjectContext();
  const { toast } = useToast();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileIncompleteDialog, setShowProfileIncompleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar proyectos desde localStorage o usar los predeterminados
  const projects = (() => {
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  })();

  const projectId = parseInt(id || '0');
  const project = projects.find(p => p.id === projectId);

  const isEnrolled = checkEnrolled(projectId, user?.email);
  const enrollmentStatus = getEnrollmentStatus(projectId, user?.email);
  const enrollment = enrolledProjects.find(
    e => e.projectId === projectId && e.userId === user?.email
  );

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Verificar si el perfil está completo
  const isProfileComplete = () => {
    if (!user) return false;
    return !!(user.phone && user.location && user.birthDate);
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    // Si está inscrito, cancelar inscripción (sin validar perfil ni inscripciones abiertas)
    if (isEnrolled) {
      handleUnenroll();
      return;
    }

    // Validar que las inscripciones estén abiertas
    if (!project.isOpenForEnrollment && project.isOpenForEnrollment !== undefined) {
      toast({
        title: 'Inscripciones cerradas',
        description: 'Este proyecto ya no acepta nuevas inscripciones en este momento.',
        variant: 'destructive',
      });
      return;
    }

    // Validar que el perfil esté completo solo al inscribirse
    if (!isProfileComplete()) {
      setShowProfileIncompleteDialog(true);
      return;
    }

    // Mostrar diálogo de inscripción
    setShowEnrollmentDialog(true);
  };

  const handleUnenroll = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      unenrollProject(projectId, user?.email!);
      toast({
        title: 'Inscripción cancelada',
        description: 'Te has desinscrito del proyecto exitosamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cancelar la inscripción.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Detalle del Proyecto" />
        <div className="flex flex-1">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 container px-4 py-12">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Proyecto no encontrado</h2>
              <p className="text-muted-foreground mb-6">
                El proyecto que buscas no existe o ha sido eliminado.
              </p>
              <Button onClick={() => navigate('/proyectos')}>
                Ver todos los proyectos
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Detalle del Proyecto" />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Botón de regreso */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          {/* Estado de inscripción (si está inscrito) */}
          {isEnrolled && enrollment && (
            <Card className="mb-4 sm:mb-6 p-4 sm:p-6 border-border bg-card">
              <EnrollmentStatusStepper
                status={enrollment.status}
                reviewedDate={enrollment.reviewedDate}
                rejectionReason={enrollment.rejectionReason}
              />
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Imagen del proyecto */}
              <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={categoryColors[project.category]}>
                    {categoryLabels[project.category]}
                  </Badge>
                  {project.status === 'completed' && (
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completado
                    </Badge>
                  )}
                  {enrollmentStatus && (
                    <Badge
                      variant="secondary"
                      className={
                        enrollmentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                          : enrollmentStatus === 'approved'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {enrollmentStatus === 'pending'
                        ? 'Pendiente'
                        : enrollmentStatus === 'approved'
                        ? 'Aprobado'
                        : 'Rechazado'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Título y descripción */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
                  {project.title}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Banner de inscripciones cerradas */}
              {!project.isOpenForEnrollment && !isEnrolled && (
                <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                          Inscripciones Cerradas
                        </h3>
                        <p className="text-sm sm:text-base text-orange-800 dark:text-orange-200">
                          Este proyecto actualmente no está aceptando nuevas inscripciones. 
                          Las inscripciones podrían abrirse nuevamente en el futuro. 
                          Te recomendamos explorar otros proyectos disponibles.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Descripción detallada */}
              <Card className="border-border bg-card">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-foreground">
                    <Info className="h-5 w-5 sm:h-6 sm:w-6" />
                    Sobre este proyecto
                  </h2>
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
                    <p>
                      Este es un proyecto de voluntariado de la categoría{' '}
                      <span className="font-semibold text-foreground">
                        {categoryLabels[project.category]}
                      </span>
                      , diseñado para generar un impacto positivo en nuestra comunidad.
                    </p>
                    <p>
                      Durante este proyecto, los voluntarios tendrán la oportunidad de trabajar
                      directamente con la comunidad local, desarrollando habilidades de trabajo en
                      equipo, liderazgo y empatía.
                    </p>
                    <p>
                      La experiencia incluye capacitación previa, materiales necesarios para las
                      actividades, y certificado de participación al finalizar el proyecto con el
                      número de horas completadas.
                    </p>
                    {project.category === 'environmental' && (
                      <p>
                        Contribuirás a la conservación del medio ambiente y aprenderás sobre
                        prácticas sostenibles que puedes aplicar en tu vida diaria.
                      </p>
                    )}
                    {project.category === 'educational' && (
                      <p>
                        Apoyarás la educación y el desarrollo de habilidades en miembros de la
                        comunidad, contribuyendo a su crecimiento personal y profesional.
                      </p>
                    )}
                    {project.category === 'social' && (
                      <p>
                        Trabajarás directamente con grupos en situación de vulnerabilidad,
                        brindando apoyo y generando un cambio significativo en sus vidas.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actividades del Proyecto */}
              {project.activities && project.activities.length > 0 && (
                <ProjectActivities 
                  activities={project.activities}
                  userId={isEnrolled ? user?.email : undefined}
                  showProgress={true}
                />
              )}

              {/* Requisitos */}
              <Card className="border-border bg-card">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
                    Requisitos
                  </h2>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Mayor de 18 años o con autorización de padres/tutores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Compromiso de asistencia puntual</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Actitud positiva y disposición para trabajar en equipo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Completar formulario de inscripción con documentación requerida</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Columna lateral - Información rápida */}
            <div className="lg:space-y-6">
              <Card className="lg:sticky lg:top-6 border-border bg-card">
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground border-b pb-3 border-border">
                    Información del Proyecto
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">Fecha</p>
                        <p className="font-medium text-sm sm:text-base text-foreground">
                          {new Date(project.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">Duración</p>
                        <p className="font-medium text-sm sm:text-base text-foreground">
                          {project.hours} horas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">Voluntarios</p>
                        <p className="font-medium text-sm sm:text-base text-foreground">
                          {project.participants} participantes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">Ubicación</p>
                        <p className="font-medium text-sm sm:text-base text-foreground">
                          {project.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      className="w-full text-sm sm:text-base h-10 sm:h-11"
                      onClick={handleEnrollClick}
                      disabled={
                        isLoading || 
                        project.status === 'completed' || 
                        enrollmentStatus === 'pending' ||
                        (!isEnrolled && !isAuthenticated && !(project.isOpenForEnrollment ?? true)) ||
                        (!isEnrolled && isAuthenticated && !(project.isOpenForEnrollment ?? true))
                      }
                      variant={isEnrolled && isAuthenticated ? 'outline' : 'default'}
                    >
                      {isLoading
                        ? 'Procesando...'
                        : enrollmentStatus === 'pending'
                        ? 'Solicitud Pendiente'
                        : enrollmentStatus === 'rejected'
                        ? 'Solicitud Rechazada'
                        : !(project.isOpenForEnrollment ?? true) && !isEnrolled
                        ? 'Inscripciones Cerradas'
                        : isEnrolled && isAuthenticated
                        ? 'Cancelar inscripción'
                        : 'Inscribirse'}
                    </Button>
                    
                    {/* Mensaje cuando las inscripciones están cerradas */}
                    {!(project.isOpenForEnrollment ?? true) && !isEnrolled && (
                      <p className="text-xs text-center text-orange-600 dark:text-orange-400 mt-2">
                        Las inscripciones están temporalmente cerradas
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* Diálogos */}
      {user?.email && (
        <EnrollmentDialog
          open={showEnrollmentDialog}
          onOpenChange={setShowEnrollmentDialog}
          projectId={projectId}
          projectTitle={project.title}
          userId={user.email}
        />
      )}

      <AlertDialog open={showProfileIncompleteDialog} onOpenChange={setShowProfileIncompleteDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Completa tu perfil
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Para inscribirte en un proyecto, primero debes completar tu información de perfil:
              <ul className="mt-2 list-disc list-inside space-y-1">
                {!user?.phone && <li>Número de teléfono</li>}
                {!user?.location && <li>Ubicación</li>}
                {!user?.birthDate && <li>Fecha de nacimiento</li>}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowProfileIncompleteDialog(false);
                navigate('/profile');
              }}
              className="w-full sm:w-auto"
            >
              Ir a mi perfil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Autenticación requerida
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Debes iniciar sesión o crear una cuenta para inscribirte en proyectos de voluntariado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <Button
              onClick={() => {
                setShowAuthDialog(false);
                navigate('/register');
              }}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Crear cuenta
            </Button>
            <AlertDialogAction
              onClick={() => {
                setShowAuthDialog(false);
                navigate('/login');
              }}
              className="w-full sm:w-auto"
            >
              Iniciar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetalleProyecto;
