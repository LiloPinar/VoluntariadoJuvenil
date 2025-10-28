import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  AlertCircle,
  Lock,
  LockOpen,
  Upload,
  X,
  Image as ImageIcon,
  ListTodo,
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ActivityManager } from '@/components/admin/ActivityManager';
import { allProjects, Project, Activity } from '@/data/projects';
import { notifyNewProject, notifyProjectUpdate } from '@/lib/notificationHelpers';

const ProjectManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Verificar que sea admin
  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  // Estados
  const [projects, setProjects] = useState<Project[]>(() => {
    // Cargar proyectos desde localStorage o usar los predeterminados
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tempActivities, setTempActivities] = useState<Activity[]>([]);

  // Guardar proyectos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('adminProjects', JSON.stringify(projects));
  }, [projects]);

  // Formulario para agregar/editar proyecto
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'social' as 'social' | 'environmental' | 'educational',
    hours: 2,
    participants: 10,
    location: '',
    date: '',
    status: 'available' as 'available' | 'in-progress' | 'completed',
    isOpenForEnrollment: true,
    image: '',
  });

  // Filtrar proyectos
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'social',
      hours: 2,
      participants: 10,
      location: '',
      date: '',
      status: 'available',
      isOpenForEnrollment: true,
      image: '',
    });
    setImagePreview('');
    setTempActivities([]);
  };

  // Agregar proyecto
  const handleAddProject = () => {
    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    const newProject: Project = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      hours: formData.hours,
      participants: formData.participants,
      location: formData.location,
      date: formData.date,
      status: formData.status,
      isOpenForEnrollment: formData.isOpenForEnrollment,
      image: formData.image || (formData.category === 'social' 
        ? '/src/assets/project-social.jpg'
        : formData.category === 'environmental'
        ? '/src/assets/project-environmental.jpg'
        : '/src/assets/project-educational.jpg'),
      activities: tempActivities.length > 0 ? tempActivities : [],
    };

    setProjects([...projects, newProject]);
    setShowAddDialog(false);
    resetForm();

    // Enviar notificación a todos los usuarios
    notifyNewProject(newProject.title, newProject.id.toString());

    toast({
      title: 'Proyecto creado',
      description: `El proyecto "${newProject.title}" ha sido agregado exitosamente.`,
      className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    });
  };

  // Editar proyecto
  const handleEditProject = () => {
    if (!selectedProject || !formData.title || !formData.description || !formData.location || !formData.date) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    const updatedProjects = projects.map(p =>
      p.id === selectedProject.id
        ? {
            ...p,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            hours: formData.hours,
            participants: formData.participants,
            location: formData.location,
            date: formData.date,
            status: formData.status,
            isOpenForEnrollment: formData.isOpenForEnrollment,
            image: formData.image || p.image,
            activities: tempActivities,
          }
        : p
    );

    setProjects(updatedProjects);
    setShowEditDialog(false);
    setSelectedProject(null);
    resetForm();

    // Enviar notificación de actualización a usuarios inscritos
    notifyProjectUpdate(
      selectedProject.id.toString(),
      formData.title,
      'El proyecto ha sido actualizado con nueva información.'
    );

    toast({
      title: 'Proyecto actualizado',
      description: `El proyecto ha sido editado exitosamente.`,
      className: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    });
  };

  // Eliminar proyecto
  const handleDeleteProject = () => {
    if (!selectedProject) return;

    const updatedProjects = projects.filter(p => p.id !== selectedProject.id);
    setProjects(updatedProjects);
    setShowDeleteDialog(false);
    setSelectedProject(null);

    toast({
      title: 'Proyecto eliminado',
      description: `El proyecto "${selectedProject.title}" ha sido eliminado.`,
      variant: 'destructive',
    });
  };

  // Abrir diálogo de edición
  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      hours: project.hours,
      participants: project.participants,
      location: project.location,
      date: project.date,
      status: project.status,
      isOpenForEnrollment: project.isOpenForEnrollment ?? true,
      image: project.image || '',
    });
    setImagePreview(project.image || '');
    setTempActivities(project.activities || []);
    setShowEditDialog(true);
  };

  // Abrir diálogo de eliminación
  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteDialog(true);
  };

  // Manejar carga de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Archivo inválido',
        description: 'Por favor selecciona una imagen válida',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo muy grande',
        description: 'La imagen debe ser menor a 5MB',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData({ ...formData, image: base64String });
    };
    reader.readAsDataURL(file);
  };

  // Remover imagen
  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  // Toggle para abrir/cerrar inscripciones rápidamente
  const toggleEnrollment = (projectId: number, currentStatus: boolean) => {
    const updatedProjects = projects.map(p =>
      p.id === projectId
        ? { ...p, isOpenForEnrollment: !currentStatus }
        : p
    );
    setProjects(updatedProjects);

    toast({
      title: !currentStatus ? 'Inscripciones abiertas' : 'Inscripciones cerradas',
      description: !currentStatus 
        ? 'Los voluntarios ahora pueden inscribirse en este proyecto.' 
        : 'Los voluntarios ya no pueden inscribirse en este proyecto.',
      className: !currentStatus 
        ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
        : 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
    });
  };

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

  const statusColors = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  };

  const statusLabels = {
    available: 'En Curso',
    'in-progress': 'En progreso',
    completed: 'Completado',
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Gestión de Proyectos" />
      
      <div className="flex flex-1">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderKanban className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    Gestión de Proyectos
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Administra los proyectos de voluntariado
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                Agregar Proyecto
              </Button>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[200px] h-10">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="environmental">Ambiental</SelectItem>
                  <SelectItem value="educational">Educativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}
              </p>
            </div>
          </div>

          {/* Lista de proyectos */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1">
            {filteredProjects.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No se encontraron proyectos
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    {searchQuery || filterCategory !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Comienza agregando tu primer proyecto'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="border-border bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Imagen */}
                      <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Información */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                              {project.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={categoryColors[project.category]}>
                                {categoryLabels[project.category]}
                              </Badge>
                              <Badge variant="outline" className={statusColors[project.status]}>
                                {statusLabels[project.status]}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Botones de acción */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(project)}
                              className="gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Editar</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteDialog(project)}
                              className="gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Eliminar</span>
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>

                        {/* Detalles */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(project.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {project.hours}h
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.participants} voluntarios
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {project.location}
                          </div>
                        </div>

                        {/* Control de Inscripciones */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            {project.isOpenForEnrollment ?? true ? (
                              <LockOpen className="h-4 w-4 text-green-600 dark:text-green-500" />
                            ) : (
                              <Lock className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                            )}
                            <span className="text-sm font-medium text-foreground">
                              Inscripciones {(project.isOpenForEnrollment ?? true) ? 'Abiertas' : 'Cerradas'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`enrollment-${project.id}`} className="text-sm text-muted-foreground">
                              {(project.isOpenForEnrollment ?? true) ? 'Cerrar' : 'Abrir'}
                            </Label>
                            <Switch
                              id={`enrollment-${project.id}`}
                              checked={project.isOpenForEnrollment ?? true}
                              onCheckedChange={() => toggleEnrollment(project.id, project.isOpenForEnrollment ?? true)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
      
      {/* Diálogo Agregar Proyecto */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Agregar Nuevo Proyecto
            </DialogTitle>
            <DialogDescription>
              Completa los datos del nuevo proyecto de voluntariado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-title">Título *</Label>
              <Input
                id="add-title"
                placeholder="Nombre del proyecto"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-description">Descripción *</Label>
              <Textarea
                id="add-description"
                placeholder="Describe el proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v as any })}
                >
                  <SelectTrigger id="add-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="environmental">Ambiental</SelectItem>
                    <SelectItem value="educational">Educativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                >
                  <SelectTrigger id="add-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">En Curso</SelectItem>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-hours">Horas *</Label>
                <Input
                  id="add-hours"
                  type="number"
                  min="1"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-participants">Voluntarios *</Label>
                <Input
                  id="add-participants"
                  type="number"
                  min="1"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-date">Fecha *</Label>
                <Input
                  id="add-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-location">Ubicación *</Label>
              <Input
                id="add-location"
                placeholder="Ej: Parque Central, Manta"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Selector de imagen */}
            <div className="space-y-2">
              <Label>Imagen del Proyecto</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-6 text-center space-y-4">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selecciona una imagen para el proyecto
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG hasta 5MB
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="add-image-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('add-image-input')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Seleccionar Imagen
                  </Button>
                </div>
              )}
            </div>

            {/* Control de Inscripciones */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {formData.isOpenForEnrollment ? (
                  <LockOpen className="h-5 w-5 text-green-600 dark:text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                )}
                <div>
                  <Label htmlFor="add-enrollment" className="text-base font-medium">
                    Permitir Inscripciones
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.isOpenForEnrollment 
                      ? 'Los voluntarios pueden inscribirse en este proyecto'
                      : 'Las inscripciones están cerradas para este proyecto'}
                  </p>
                </div>
              </div>
              <Switch
                id="add-enrollment"
                checked={formData.isOpenForEnrollment}
                onCheckedChange={(checked) => setFormData({ ...formData, isOpenForEnrollment: checked })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProject}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Proyecto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Editar Proyecto */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Proyecto
            </DialogTitle>
            <DialogDescription>
              Modifica los datos del proyecto y gestiona sus actividades
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Información del Proyecto</TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-1">
                <ListTodo className="h-4 w-4" />
                Actividades
                {tempActivities.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {tempActivities.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título *</Label>
                <Input
                  id="edit-title"
                  placeholder="Nombre del proyecto"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción *</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe el proyecto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v as any })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="environmental">Ambiental</SelectItem>
                      <SelectItem value="educational">Educativo</SelectItem>
                    </SelectContent>
                  </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">En Curso</SelectItem>
                    <SelectItem value="in-progress">En progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-hours">Horas *</Label>
                <Input
                  id="edit-hours"
                  type="number"
                  min="1"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-participants">Voluntarios *</Label>
                <Input
                  id="edit-participants"
                  type="number"
                  min="1"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-date">Fecha *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Ubicación *</Label>
              <Input
                id="edit-location"
                placeholder="Ej: Parque Central, Manta"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Selector de imagen */}
            <div className="space-y-2">
              <Label>Imagen del Proyecto</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-6 text-center space-y-4">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selecciona una imagen para el proyecto
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG hasta 5MB
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="edit-image-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('edit-image-input')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Seleccionar Imagen
                  </Button>
                </div>
              )}
            </div>

            {/* Control de Inscripciones */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {formData.isOpenForEnrollment ? (
                  <LockOpen className="h-5 w-5 text-green-600 dark:text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                )}
                <div>
                  <Label htmlFor="edit-enrollment" className="text-base font-medium">
                    Permitir Inscripciones
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.isOpenForEnrollment 
                      ? 'Los voluntarios pueden inscribirse en este proyecto'
                      : 'Las inscripciones están cerradas para este proyecto'}
                  </p>
                </div>
              </div>
              <Switch
                id="edit-enrollment"
                checked={formData.isOpenForEnrollment}
                onCheckedChange={(checked) => setFormData({ ...formData, isOpenForEnrollment: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="activities" className="mt-4">
            <ActivityManager
              projectId={selectedProject?.id || 0}
              projectHours={formData.hours}
              activities={tempActivities}
              onActivitiesChange={setTempActivities}
            />
          </TabsContent>
        </Tabs>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditProject}>
              <Edit className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Confirmar Eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              ¿Eliminar este proyecto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proyecto "{selectedProject?.title}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default ProjectManagement;
