import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { allProjects, Project, Activity } from '@/data/projects';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  Clock,
  Search,
  Users,
  ListTodo,
  Calendar,
  Filter,
} from 'lucide-react';

const ActivityValidation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthContext();
  const { enrolledProjects } = useProjectContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{
    project: Project;
    activity: Activity;
  } | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Scroll al top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('adminProjects', JSON.stringify(projects));
  }, [projects]);

  // Verificar que sea admin
  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  // Obtener todas las actividades con sus proyectos
  const getAllActivities = () => {
    const activities: Array<{
      project: Project;
      activity: Activity;
      enrolledUsers: string[];
    }> = [];

    projects.forEach(project => {
      if (project.activities && project.activities.length > 0) {
        // Obtener usuarios inscritos en este proyecto
        const enrolledUsers = enrolledProjects
          .filter(e => e.projectId === project.id)
          .map(e => e.userId);

        project.activities.forEach(activity => {
          activities.push({
            project,
            activity,
            enrolledUsers,
          });
        });
      }
    });

    return activities;
  };

  // Filtrar actividades
  const filteredActivities = getAllActivities().filter(({ project, activity }) => {
    const matchesSearch = 
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProject = 
      filterProject === 'all' || project.id.toString() === filterProject;

    return matchesSearch && matchesProject;
  });

  // Abrir diálogo de validación
  const openValidationDialog = (project: Project, activity: Activity) => {
    setSelectedActivity({ project, activity });
    setSelectedUsers(activity.completedBy || []);
    setShowValidationDialog(true);
  };

  // Validar actividad
  const handleValidateActivity = () => {
    if (!selectedActivity) return;

    const { project, activity } = selectedActivity;

    const updatedProjects = projects.map(p => {
      if (p.id === project.id) {
        return {
          ...p,
          activities: p.activities?.map(a => {
            if (a.id === activity.id) {
              return {
                ...a,
                completedBy: selectedUsers,
                isCompleted: selectedUsers.length > 0,
                validatedBy: user?.email,
                validatedAt: new Date().toISOString(),
              };
            }
            return a;
          }),
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    setShowValidationDialog(false);
    setSelectedActivity(null);
    setSelectedUsers([]);

    toast({
      title: 'Actividad validada',
      description: `Se validó la participación de ${selectedUsers.length} usuario(s)`,
      className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    });
  };

  // Toggle usuario en la lista de completados
  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

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
    <div className="flex min-h-screen flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Validación de Actividades" />
      
      <div className="flex flex-1">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Encabezado */}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                Validación de Actividades
              </h1>
              <p className="text-muted-foreground mt-2">
                Valida la participación de voluntarios en las actividades de los proyectos
              </p>
            </div>

            {/* Filtros */}
            <Card>
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="search" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Buscar Actividad
                    </Label>
                    <Input
                      id="search"
                      placeholder="Buscar por nombre de actividad o proyecto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filter-project" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtrar por Proyecto
                    </Label>
                    <Select value={filterProject} onValueChange={setFilterProject}>
                      <SelectTrigger id="filter-project">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los proyectos</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Actividades */}
            <div className="grid gap-4">
              {filteredActivities.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ListTodo className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay actividades</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || filterProject !== 'all'
                        ? 'No se encontraron actividades con los filtros aplicados'
                        : 'Aún no hay actividades creadas en los proyectos'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredActivities.map(({ project, activity, enrolledUsers }) => (
                  <Card key={`${project.id}-${activity.id}`} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{activity.name}</CardTitle>
                            {activity.isCompleted ? (
                              <Badge className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Validada
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                Pendiente
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ListTodo className="h-3 w-3" />
                              {project.title}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={categoryColors[project.category as keyof typeof categoryColors]}
                            >
                              {categoryLabels[project.category as keyof typeof categoryLabels]}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => openValidationDialog(project, activity)}
                          size="sm"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Validar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {activity.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{activity.hours}h</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {activity.completedBy.length} de {enrolledUsers.length} participantes validados
                          </span>
                        </span>
                        {activity.validatedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs">
                              Última validación: {new Date(activity.validatedAt).toLocaleDateString('es-ES')}
                            </span>
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Diálogo de Validación */}
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Validar Participación</DialogTitle>
            <DialogDescription>
              Selecciona los usuarios que completaron la actividad "{selectedActivity?.activity.name}"
            </DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">Proyecto: {selectedActivity.project.title}</p>
                <p className="text-sm text-muted-foreground">
                  Actividad: {selectedActivity.activity.name} ({selectedActivity.activity.hours}h)
                </p>
              </div>

              <div className="space-y-3">
                <Label>Usuarios Inscritos en el Proyecto</Label>
                
                {enrolledProjects
                  .filter(e => e.projectId === selectedActivity.project.id)
                  .map(enrollment => (
                    <div
                      key={enrollment.userId}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={enrollment.userId}
                        checked={selectedUsers.includes(enrollment.userId)}
                        onCheckedChange={() => toggleUser(enrollment.userId)}
                      />
                      <label
                        htmlFor={enrollment.userId}
                        className="flex-1 cursor-pointer"
                      >
                        <p className="font-medium">{enrollment.userId.split('@')[0]}</p>
                        <p className="text-sm text-muted-foreground">{enrollment.userId}</p>
                      </label>
                    </div>
                  ))}

                {enrolledProjects.filter(e => e.projectId === selectedActivity.project.id).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-2 opacity-50" />
                    <p>No hay usuarios inscritos en este proyecto</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium">
                  {selectedUsers.length} usuario(s) seleccionado(s)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Se validarán {selectedActivity.activity.hours}h para cada usuario seleccionado
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValidationDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleValidateActivity}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Validar Actividad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ActivityValidation;
