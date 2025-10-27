import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useLocale } from '@/i18n/LocaleContext';
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProjectContext } from "@/contexts/ProjectContext";
import { allProjects } from "@/data/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Calendar,
  ListTodo,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MisHoras = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useLocale();
  const { user } = useAuthContext();
  const { enrolledProjects } = useProjectContext();
  const navigate = useNavigate();

  // Cargar proyectos desde localStorage
  const projects = (() => {
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  })();

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calcular estadísticas de horas
  const calculateStats = () => {
    let totalHours = 0;
    let completedActivities = 0;
    let totalActivities = 0;
    const projectsWithHours: any[] = [];

    // Obtener proyectos en los que está inscrito el usuario
    const userEnrolledProjectIds = enrolledProjects
      .filter(e => e.userId === user?.email)
      .map(e => e.projectId);

    userEnrolledProjectIds.forEach(projectId => {
      const project = projects.find(p => p.id === projectId);
      if (project && project.activities) {
        let projectHours = 0;
        let projectCompletedActivities = 0;

        project.activities.forEach(activity => {
          totalActivities++;
          if (user?.email && activity.completedBy.includes(user.email)) {
            projectHours += activity.hours;
            totalHours += activity.hours;
            completedActivities++;
            projectCompletedActivities++;
          }
        });

        if (projectHours > 0) {
          projectsWithHours.push({
            id: project.id,
            title: project.title,
            category: project.category,
            hours: projectHours,
            totalProjectHours: project.hours,
            completedActivities: projectCompletedActivities,
            totalActivities: project.activities.length,
            date: project.date,
          });
        }
      }
    });

    return {
      totalHours,
      completedActivities,
      totalActivities,
      projectsWithHours,
    };
  };

  const stats = calculateStats();

  const categoryColors = {
    social: 'bg-accent/10 text-accent border-accent/20',
    environmental: 'bg-secondary/10 text-secondary border-secondary/20',
    educational: 'bg-primary/10 text-primary border-primary/20',
  };

  const categoryLabels = {
    social: 'Social',
    environmental: 'Ambiental',
    educational: 'Educativo',
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Mis Horas" />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 container px-4 py-8">
          <div className="space-y-6">
            {/* Encabezado */}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Clock className="h-8 w-8 text-primary" />
                {t('mis_horas_title')}
              </h1>
              <p className="mt-2 text-muted-foreground">{t('mis_horas_desc')}</p>
            </div>

            {/* Estadísticas Generales */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Total de Horas */}
              <Card className="border-2 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Horas
                  </CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {stats.totalHours}h
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Acumuladas en todos tus proyectos
                  </p>
                </CardContent>
              </Card>

              {/* Actividades Completadas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Actividades Completadas
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.completedActivities}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    De {stats.totalActivities} actividades totales
                  </p>
                  {stats.totalActivities > 0 && (
                    <Progress 
                      value={(stats.completedActivities / stats.totalActivities) * 100} 
                      className="h-2 mt-2"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Proyectos Activos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Proyectos con Horas
                  </CardTitle>
                  <Award className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">
                    {stats.projectsWithHours.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Proyectos donde has acumulado horas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Desglose por Proyecto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Desglose de Horas por Proyecto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.projectsWithHours.length === 0 ? (
                  <div className="text-center py-12">
                    <ListTodo className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aún no has completado actividades</h3>
                    <p className="text-muted-foreground mb-4">
                      Inscríbete en proyectos y completa actividades para empezar a acumular horas
                    </p>
                    <Button onClick={() => navigate('/proyectos')}>
                      Explorar Proyectos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.projectsWithHours
                      .sort((a, b) => b.hours - a.hours)
                      .map((project) => (
                        <div
                          key={project.id}
                          className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/proyecto/${project.id}`)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{project.title}</h3>
                                <Badge 
                                  variant="outline" 
                                  className={categoryColors[project.category as keyof typeof categoryColors]}
                                >
                                  {categoryLabels[project.category as keyof typeof categoryLabels]}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(project.date).toLocaleDateString('es-ES')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ListTodo className="h-3 w-3" />
                                  {project.completedActivities} de {project.totalActivities} actividades
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progreso</span>
                                  <span className="font-medium">
                                    {project.hours}h de {project.totalProjectHours}h
                                    ({((project.hours / project.totalProjectHours) * 100).toFixed(0)}%)
                                  </span>
                                </div>
                                <Progress 
                                  value={(project.hours / project.totalProjectHours) * 100}
                                  className="h-2"
                                />
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-3xl font-bold text-primary">
                                {project.hours}h
                              </div>
                              <p className="text-xs text-muted-foreground">
                                completadas
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mensaje motivacional */}
            {stats.totalHours > 0 && (
              <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        ¡Excelente trabajo! 🎉
                      </h3>
                      <p className="text-muted-foreground">
                        Has contribuido con {stats.totalHours} horas de voluntariado. 
                        Cada hora cuenta y hace la diferencia en nuestra comunidad.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MisHoras;
