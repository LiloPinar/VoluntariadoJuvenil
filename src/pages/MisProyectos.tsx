import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { useLocale } from '@/i18n/LocaleContext';
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { EnrollmentStatusStepper } from "@/components/EnrollmentStatusStepper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin, Search, BookmarkCheck, Filter } from "lucide-react";
import { allProjects, getProjectTitle, getProjectDescription } from "@/data/projects";
import { useProjectContext, EnrollmentStatus } from "@/contexts/ProjectContext";

type SortBy = "recent" | "hours-asc" | "hours-desc" | "date-asc" | "date-desc";
type StatusFilter = "all" | EnrollmentStatus;

const MisProyectos = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { t, locale } = useLocale();
  const { isAuthenticated, user } = useAuthContext();
  const { getUserEnrolledProjects, enrolledProjects } = useProjectContext();
  const navigate = useNavigate();

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Obtener IDs de proyectos inscritos del usuario actual
  const enrolledProjectIds = useMemo(() => {
    if (!user?.email) return [];
    return getUserEnrolledProjects(user.email);
  }, [user, getUserEnrolledProjects, enrolledProjects]);

  // Filtrar proyectos para mostrar solo los inscritos
  const myEnrolledProjects = useMemo(() => {
    return allProjects
      .filter(project => enrolledProjectIds.includes(project.id))
      .map(project => {
        // Encontrar los datos de inscripción
        const enrollment = enrolledProjects.find(
          e => e.projectId === project.id && e.userId === user?.email
        );
        return {
          ...project,
          enrolled: true,
          enrolledDate: enrollment?.enrolledDate || new Date().toISOString(),
          enrollmentStatus: enrollment?.status || 'pending',
          enrollmentData: enrollment?.data,
          reviewedDate: enrollment?.reviewedDate,
          reviewedBy: enrollment?.reviewedBy,
          rejectionReason: enrollment?.rejectionReason,
        };
      });
  }, [enrolledProjectIds, enrolledProjects, user]);

  // Calcular estadísticas
  const totalHours = useMemo(() => {
    return myEnrolledProjects.reduce((sum, project) => sum + project.hours, 0);
  }, [myEnrolledProjects]);

  const totalProjects = myEnrolledProjects.length;

  const approvedProjects = useMemo(() => {
    return myEnrolledProjects.filter(p => p.enrollmentStatus === 'approved').length;
  }, [myEnrolledProjects]);

  const pendingProjects = useMemo(() => {
    return myEnrolledProjects.filter(p => p.enrollmentStatus === 'pending').length;
  }, [myEnrolledProjects]);

  // Próximo proyecto (el más cercano en fecha)
  const nextProject = useMemo(() => {
    const upcoming = [...myEnrolledProjects]
      .filter(p => new Date(p.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0];
  }, [myEnrolledProjects]);

  // Ordenar proyectos
  const sortedProjects = useMemo(() => {
    let projects = [...myEnrolledProjects];

    // Aplicar filtro de estado
    if (statusFilter !== "all") {
      projects = projects.filter(p => p.enrollmentStatus === statusFilter);
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case "recent":
        projects.sort((a, b) => new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime());
        break;
      case "hours-asc":
        projects.sort((a, b) => a.hours - b.hours);
        break;
      case "hours-desc":
        projects.sort((a, b) => b.hours - a.hours);
        break;
      case "date-asc":
        projects.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "date-desc":
        projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    return projects;
  }, [myEnrolledProjects, sortBy, statusFilter]);

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Mis Proyectos" />
        <div className="flex flex-1">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-md mx-auto">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <BookmarkCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Inicia sesión para ver tus proyectos</h2>
              <p className="text-muted-foreground mb-6">
                Debes estar autenticado para ver los proyectos en los que te has inscrito.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/login')} className="w-full sm:w-auto">
                  Iniciar sesión
                </Button>
                <Button onClick={() => navigate('/register')} variant="outline" className="w-full sm:w-auto">
                  Crear cuenta
                </Button>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Mis Proyectos" />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-2">
              <BookmarkCheck className="h-6 w-6 sm:h-8 sm:w-8" />
              {t('mis_proyectos_title')}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('mis_proyectos_desc')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 sm:p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">{totalProjects}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total inscritos</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <BookmarkCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">{approvedProjects}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('aprobados')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">{pendingProjects}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('pendientes')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-accent/10">
                  <Calendar className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {nextProject ? new Date(nextProject.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '-'}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('proximo_proyecto')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          {sortedProjects.length > 0 && (
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {sortedProjects.length} {sortedProjects.length === 1 ? 'proyecto' : 'proyectos'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('todos_proyectos')}</SelectItem>
                    <SelectItem value="pending">
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{t('pendientes')}</Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="approved">
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">{t('aprobados')}</Badge>
                      </span>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Rechazados</Badge>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                  <SelectTrigger className="w-full sm:w-[200px] h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="date-asc">Fecha más cercana</SelectItem>
                    <SelectItem value="date-desc">Fecha más lejana</SelectItem>
                    <SelectItem value="hours-asc">Menos horas</SelectItem>
                    <SelectItem value="hours-desc">Más horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {sortedProjects.length > 0 ? (
            <div className="space-y-4">
              {sortedProjects.map(project => {
                const enrollment = enrolledProjects.find(
                  e => e.projectId === project.id && e.userId === user?.email
                );
                
                return (
                  <div key={project.id} className="space-y-3">
                    {/* Estado de inscripción compacto */}
                    <Card className="p-4 border-border bg-card">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
                        <Badge
                          variant="secondary"
                          className={
                            enrollment?.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                              : enrollment?.status === 'approved'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                          }
                        >
                          {enrollment?.status === 'pending'
                            ? 'Pendiente'
                            : enrollment?.status === 'approved'
                            ? 'Aprobado'
                            : 'Rechazado'}
                        </Badge>
                      </div>
                      <EnrollmentStatusStepper
                        status={enrollment?.status || 'pending'}
                        reviewedDate={enrollment?.reviewedDate}
                        rejectionReason={enrollment?.rejectionReason}
                      />
                    </Card>
                    
                    {/* Tarjeta del proyecto */}
                    <ProjectCard 
                      id={project.id}
                      title={getProjectTitle(project, locale)}
                      description={getProjectDescription(project, locale)}
                      category={project.category}
                      hours={project.hours}
                      participants={project.participants}
                      location={project.location}
                      image={project.image}
                      date={project.date}
                      status={project.status}
                      isOpenForEnrollment={project.isOpenForEnrollment}
                      enrolled={!!enrollment}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <BookmarkCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {statusFilter === 'all' 
                  ? 'No tienes proyectos inscritos' 
                  : `No tienes proyectos ${
                      statusFilter === 'pending' ? 'pendientes' : 
                      statusFilter === 'approved' ? 'aprobados' : 
                      'rechazados'
                    }`
                }
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {statusFilter === 'all' 
                  ? 'Explora los proyectos disponibles y únete a uno'
                  : 'Cambia el filtro para ver otros proyectos'
                }
              </p>
              {statusFilter === 'all' ? (
                <Button onClick={() => navigate('/proyectos')}>
                  Explorar proyectos
                </Button>
              ) : (
                <Button onClick={() => setStatusFilter('all')} variant="outline">
                  Ver todos los proyectos
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MisProyectos;
