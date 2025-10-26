import { Clock, Users, MapPin, Calendar, CheckCircle2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { EnrollmentDialog } from "@/components/EnrollmentDialog";

interface ProjectCardProps {
  id?: number;
  title: string;
  description: string;
  category: "social" | "environmental" | "educational";
  hours: number;
  participants: number;
  location: string;
  image: string;
  date?: string;
  status?: "available" | "in-progress" | "completed";
  enrolled?: boolean;
}

const categoryColors = {
  social: "bg-accent text-accent-foreground",
  environmental: "bg-secondary text-secondary-foreground",
  educational: "bg-primary text-primary-foreground",
};

const categoryLabels = {
  social: "Social",
  environmental: "Ambiental",
  educational: "Educativo",
};

export const ProjectCard = ({
  id,
  title,
  description,
  category,
  hours,
  participants,
  location,
  image,
  date,
  status = "available",
  enrolled = false,
}: ProjectCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
  const [showProfileIncompleteDialog, setShowProfileIncompleteDialog] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthContext();
  const { isEnrolled: checkEnrolled, getEnrollmentStatus, unenrollProject } = useProjectContext();
  const navigate = useNavigate();

  // Verificar si el usuario está inscrito usando el contexto
  const isEnrolled = id ? checkEnrolled(id, user?.email) : false;
  const enrollmentStatus = id ? getEnrollmentStatus(id, user?.email) : null;

  // Verificar si el perfil está completo
  const isProfileComplete = () => {
    if (!user) return false;
    return !!(user.phone && user.location && user.birthDate);
  };

  const handleEnrollClick = () => {
    // Validar que el usuario esté autenticado
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    // Si está inscrito, cancelar inscripción (sin validar perfil)
    if (isEnrolled) {
      handleUnenroll();
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
    if (!user?.email || !id) return;
    
    setIsLoading(true);
    
    // Simulación de desinscripción
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    unenrollProject(id, user.email);
    
    setIsLoading(false);
    
    toast({
      title: "Inscripción cancelada",
      description: "Te has dado de baja del proyecto",
      variant: "default",
    });
  };

  const handleGoToLogin = () => {
    setShowAuthDialog(false);
    navigate("/login", { state: { returnTo: "/proyectos" } });
  };

  const handleGoToRegister = () => {
    setShowAuthDialog(false);
    navigate("/register", { state: { returnTo: "/proyectos" } });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/proyecto/${id}`);
    }
  };

  return (
    <>
      <Card 
        className="group overflow-hidden transition-all hover:shadow-lg flex flex-col h-full cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge
            className={`absolute right-3 top-3 sm:right-4 sm:top-4 text-xs ${categoryColors[category]}`}
          >
            {categoryLabels[category]}
          </Badge>
          {isEnrolled && isAuthenticated && (
            <Badge
              className={`absolute left-3 top-3 sm:left-4 sm:top-4 text-xs ${
                enrollmentStatus === 'pending' 
                  ? 'bg-yellow-500' 
                  : enrollmentStatus === 'approved' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              } text-white`}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {enrollmentStatus === 'pending' && 'Pendiente'}
              {enrollmentStatus === 'approved' && 'Aprobado'}
              {enrollmentStatus === 'rejected' && 'Rechazado'}
            </Badge>
          )}
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-1 text-base sm:text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-xs sm:text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-3">
          <div className="flex flex-col gap-2 text-xs sm:text-sm text-muted-foreground">
            {date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>{formatDate(date)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span>{hours}h</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span>{participants} voluntarios</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            className="w-full bg-primary hover:bg-primary-hover text-sm sm:text-base h-9 sm:h-10"
            onClick={(e) => {
              e.stopPropagation(); // Prevenir que el clic active la navegación
              handleEnrollClick();
            }}
            disabled={isLoading || status === "completed" || enrollmentStatus === 'pending'}
            variant={isEnrolled && isAuthenticated ? "outline" : "default"}
          >
            {isLoading ? (
              "Procesando..."
            ) : enrollmentStatus === 'pending' ? (
              "Solicitud Pendiente"
            ) : enrollmentStatus === 'rejected' ? (
              "Solicitud Rechazada"
            ) : isEnrolled && isAuthenticated ? (
              "Cancelar inscripción"
            ) : (
              "Inscribirse"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Diálogo de inscripción */}
      {id && user?.email && (
        <EnrollmentDialog
          open={showEnrollmentDialog}
          onOpenChange={setShowEnrollmentDialog}
          projectId={id}
          projectTitle={title}
          userId={user.email}
        />
      )}

      {/* Diálogo de perfil incompleto */}
      <AlertDialog open={showProfileIncompleteDialog} onOpenChange={setShowProfileIncompleteDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
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
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowProfileIncompleteDialog(false);
                navigate('/configuracion');
              }}
              className="w-full sm:w-auto"
            >
              Ir a mi perfil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de autenticación requerida */}
      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Autenticación requerida
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Debes iniciar sesión o crear una cuenta para inscribirte en proyectos de voluntariado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancelar
            </AlertDialogCancel>
            <Button 
              onClick={handleGoToRegister}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Crear cuenta
            </Button>
            <AlertDialogAction 
              onClick={handleGoToLogin}
              className="w-full sm:w-auto"
            >
              Iniciar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
