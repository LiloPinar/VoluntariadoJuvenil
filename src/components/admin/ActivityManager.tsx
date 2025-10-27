import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Activity } from '@/data/projects';
import { Plus, Edit, Trash2, Clock, CheckCircle2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityManagerProps {
  projectId: number;
  projectHours: number;
  activities: Activity[];
  onActivitiesChange: (activities: Activity[]) => void;
}

export const ActivityManager = ({
  projectId,
  projectHours,
  activities,
  onActivitiesChange,
}: ActivityManagerProps) => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hours: 1,
  });

  // Calcular horas totales asignadas
  const totalAssignedHours = activities.reduce((sum, act) => sum + act.hours, 0);
  const availableHours = projectHours - totalAssignedHours;

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      hours: 1,
    });
  };

  const handleAddActivity = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Nombre requerido',
        description: 'Por favor ingresa un nombre para la actividad',
        variant: 'destructive',
      });
      return;
    }

    if (formData.hours > availableHours) {
      toast({
        title: 'Horas excedidas',
        description: `Solo hay ${availableHours} horas disponibles en el proyecto`,
        variant: 'destructive',
      });
      return;
    }

    const newActivity: Activity = {
      id: `act-${projectId}-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      hours: formData.hours,
      completedBy: [],
      isCompleted: false,
    };

    onActivitiesChange([...activities, newActivity]);
    setShowAddDialog(false);
    resetForm();

    toast({
      title: 'Actividad creada',
      description: `"${newActivity.name}" ha sido agregada exitosamente`,
      className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    });
  };

  const handleEditActivity = () => {
    if (!selectedActivity || !formData.name.trim()) {
      toast({
        title: 'Nombre requerido',
        description: 'Por favor ingresa un nombre para la actividad',
        variant: 'destructive',
      });
      return;
    }

    const otherActivitiesHours = activities
      .filter(a => a.id !== selectedActivity.id)
      .reduce((sum, act) => sum + act.hours, 0);
    
    if (formData.hours > projectHours - otherActivitiesHours) {
      toast({
        title: 'Horas excedidas',
        description: `Las horas asignadas superan el límite del proyecto`,
        variant: 'destructive',
      });
      return;
    }

    const updatedActivities = activities.map(act =>
      act.id === selectedActivity.id
        ? {
            ...act,
            name: formData.name,
            description: formData.description,
            hours: formData.hours,
          }
        : act
    );

    onActivitiesChange(updatedActivities);
    setShowEditDialog(false);
    setSelectedActivity(null);
    resetForm();

    toast({
      title: 'Actividad actualizada',
      description: 'Los cambios han sido guardados',
      className: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    });
  };

  const handleDeleteActivity = () => {
    if (!selectedActivity) return;

    const updatedActivities = activities.filter(a => a.id !== selectedActivity.id);
    onActivitiesChange(updatedActivities);
    setShowDeleteDialog(false);
    setSelectedActivity(null);

    toast({
      title: 'Actividad eliminada',
      description: `"${selectedActivity.name}" ha sido eliminada`,
      variant: 'destructive',
    });
  };

  const openEditDialog = (activity: Activity) => {
    setSelectedActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      hours: activity.hours,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Actividades del Proyecto</h3>
          <p className="text-sm text-muted-foreground">
            {totalAssignedHours} de {projectHours} horas asignadas
            {availableHours > 0 && ` • ${availableHours} horas disponibles`}
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
          disabled={availableHours <= 0}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Actividad
        </Button>
      </div>

      {/* Lista de Actividades */}
      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Clock className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>No hay actividades definidas</p>
            <p className="text-sm">Agrega actividades para organizar el proyecto</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{activity.name}</h4>
                    {activity.isCompleted && (
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completada
                      </Badge>
                    )}
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {activity.hours}h
                    </span>
                    <span className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {activity.completedBy.length} participantes
                    </span>
                  </div>
                  {activity.validatedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Validada: {new Date(activity.validatedAt).toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(activity)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(activity)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Diálogo Agregar Actividad */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar Actividad</DialogTitle>
            <DialogDescription>
              Define una nueva actividad u objetivo para este proyecto.
              Horas disponibles: {availableHours}h
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="activity-name">Nombre de la Actividad *</Label>
              <Input
                id="activity-name"
                placeholder="Ej: Preparación del terreno"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity-description">Descripción</Label>
              <Textarea
                id="activity-description"
                placeholder="Describe qué se realizará en esta actividad..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity-hours">Horas Asignadas *</Label>
              <Input
                id="activity-hours"
                type="number"
                min="0.5"
                max={availableHours}
                step="0.5"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) || 1 })}
              />
              <p className="text-xs text-muted-foreground">
                Máximo: {availableHours} horas disponibles
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddActivity}>Agregar Actividad</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Editar Actividad */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Actividad</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la actividad.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-activity-name">Nombre de la Actividad *</Label>
              <Input
                id="edit-activity-name"
                placeholder="Ej: Preparación del terreno"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-activity-description">Descripción</Label>
              <Textarea
                id="edit-activity-description"
                placeholder="Describe qué se realizará en esta actividad..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-activity-hours">Horas Asignadas *</Label>
              <Input
                id="edit-activity-hours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) || 1 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditActivity}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo Eliminar Actividad */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar actividad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la actividad "{selectedActivity?.name}".
              {selectedActivity && selectedActivity.completedBy.length > 0 && (
                <span className="block mt-2 text-orange-600 dark:text-orange-400 font-medium">
                  ⚠️ Esta actividad tiene {selectedActivity.completedBy.length} participantes registrados.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteActivity} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
