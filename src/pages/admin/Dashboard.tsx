import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Menu,
  FileText,
  AlertCircle,
  FolderKanban,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { EnrollmentReviewCard } from '@/components/admin/EnrollmentReviewCard';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { enrolledProjects, getPendingEnrollments, approveEnrollment, rejectEnrollment } = useProjectContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Verificar que sea admin
  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  // Obtener estadísticas
  const pendingEnrollments = getPendingEnrollments();
  const approvedCount = enrolledProjects.filter(e => e.status === 'approved').length;
  const rejectedCount = enrolledProjects.filter(e => e.status === 'rejected').length;
  const totalEnrollments = enrolledProjects.length;

  // Estadísticas de usuarios únicos
  const uniqueUsers = new Set(enrolledProjects.map(e => e.userId)).size;

  const handleApprove = (projectId: number, userId: string) => {
    approveEnrollment(projectId, userId, user.email);
  };

  const handleReject = (projectId: number, userId: string, reason: string) => {
    rejectEnrollment(projectId, userId, reason, user.email);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Panel de Administración" />
      
      <div className="flex flex-1">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Panel de Administración
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Gestiona inscripciones y usuarios
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pendientes
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {pendingEnrollments.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Solicitudes por revisar
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Aprobadas
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {approvedCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Inscripciones activas
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Rechazadas
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {rejectedCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  No aprobadas
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Usuarios
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {uniqueUsers}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Voluntarios únicos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Acceso Rápido a Gestión de Proyectos */}
          <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FolderKanban className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Gestión de Proyectos</h3>
                    <p className="text-sm text-muted-foreground">
                      Administra, crea y edita proyectos de voluntariado
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/admin/projects')}
                  className="w-full sm:w-auto gap-2"
                >
                  <FolderKanban className="h-4 w-4" />
                  Ir a Proyectos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de contenido */}
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                <Clock className="h-4 w-4 mr-2" />
                Pendientes
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Aprobadas
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs sm:text-sm">
                <XCircle className="h-4 w-4 mr-2" />
                Rechazadas
              </TabsTrigger>
            </TabsList>

            {/* Solicitudes Pendientes */}
            <TabsContent value="pending" className="space-y-4">
              {pendingEnrollments.length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay solicitudes pendientes
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Todas las solicitudes han sido procesadas. Las nuevas aparecerán aquí.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingEnrollments.map((enrollment) => (
                  <EnrollmentReviewCard
                    key={`${enrollment.projectId}-${enrollment.userId}`}
                    enrollment={enrollment}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              )}
            </TabsContent>

            {/* Solicitudes Aprobadas */}
            <TabsContent value="approved" className="space-y-4">
              {enrolledProjects.filter(e => e.status === 'approved').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay inscripciones aprobadas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Las inscripciones aprobadas aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                enrolledProjects
                  .filter(e => e.status === 'approved')
                  .map((enrollment) => (
                    <EnrollmentReviewCard
                      key={`${enrollment.projectId}-${enrollment.userId}`}
                      enrollment={enrollment}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      readonly
                    />
                  ))
              )}
            </TabsContent>

            {/* Solicitudes Rechazadas */}
            <TabsContent value="rejected" className="space-y-4">
              {enrolledProjects.filter(e => e.status === 'rejected').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay inscripciones rechazadas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Las inscripciones rechazadas aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                enrolledProjects
                  .filter(e => e.status === 'rejected')
                  .map((enrollment) => (
                    <EnrollmentReviewCard
                      key={`${enrollment.projectId}-${enrollment.userId}`}
                      enrollment={enrollment}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      readonly
                    />
                  ))
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
