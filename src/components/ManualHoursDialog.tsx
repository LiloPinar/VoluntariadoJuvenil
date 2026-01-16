import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { allProjects } from '@/data/projects';
import { 
  Upload, 
  FileImage, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Clock,
  Calendar,
  FileText,
  X
} from 'lucide-react';

interface ManualHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualHoursDialog = ({
  open,
  onOpenChange,
}: ManualHoursDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { enrolledProjects, submitManualHours } = useProjectContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar proyectos desde localStorage
  const projects = (() => {
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  })();

  // Obtener proyectos aprobados del usuario
  const userApprovedProjects = enrolledProjects
    .filter(e => e.userId === user?.email && e.status === 'approved')
    .map(e => {
      const project = projects.find(p => p.id === e.projectId);
      return project ? { id: project.id, title: project.title } : null;
    })
    .filter(p => p !== null);

  const [formData, setFormData] = useState({
    projectId: '',
    date: '',
    hours: '',
    description: '',
  });

  const [evidence, setEvidence] = useState<{
    file: File | null;
    preview: string;
  }>({
    file: null,
    preview: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resetear formulario cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      setFormData({
        projectId: '',
        date: '',
        hours: '',
        description: '',
      });
      setEvidence({ file: null, preview: '' });
      setErrors({});
    }
  }, [open]);

  // Comprimir imagen antes de guardar
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionar si es muy grande (max 800px)
          let width = img.width;
          let height = img.height;
          const maxSize = 800;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprimir a JPEG con calidad 0.6 para ahorrar espacio
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Manejo de cambio en inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejo de carga de imagen
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        evidence: 'Solo se permiten imágenes (JPG, PNG, GIF)',
      }));
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        evidence: 'La imagen no debe superar los 5MB',
      }));
      return;
    }

    try {
      // Comprimir la imagen
      const compressedDataUrl = await compressImage(file);
      
      setEvidence({
        file,
        preview: compressedDataUrl,
      });

      // Limpiar error
      if (errors.evidence) {
        setErrors(prev => ({ ...prev, evidence: '' }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        evidence: 'Error al procesar la imagen',
      }));
    }
  };

  // Remover evidencia
  const removeEvidence = () => {
    setEvidence({ file: null, preview: '' });
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectId) {
      newErrors.projectId = 'Debes seleccionar un proyecto';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        newErrors.date = 'La fecha no puede ser futura';
      }
    }

    if (!formData.hours) {
      newErrors.hours = 'Las horas son obligatorias';
    } else {
      const hours = parseFloat(formData.hours);
      if (isNaN(hours) || hours < 0.5) {
        newErrors.hours = 'Mínimo 0.5 horas';
      } else if (hours > 12) {
        newErrors.hours = 'Máximo 12 horas por registro';
      }
    }

    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Formulario incompleto',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Guardar registro de horas manuales
      submitManualHours({
        userId: user?.email!,
        projectId: parseInt(formData.projectId),
        date: formData.date,
        hours: parseFloat(formData.hours),
        description: formData.description,
        evidence: evidence.preview || undefined,
        status: 'pending',
        submittedDate: new Date().toISOString(),
      });

      toast({
        title: 'Registro enviado',
        description: 'Tu registro de horas ha sido enviado. Un administrador lo revisará pronto.',
        className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error al enviar',
        description: 'No se pudo registrar las horas. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5 text-primary" />
            Registrar Horas Manualmente
          </DialogTitle>
          <DialogDescription>
            Reporta horas de trabajo independiente o actividades no programadas. 
            Tu registro será revisado por un administrador.
          </DialogDescription>
        </DialogHeader>

        {userApprovedProjects.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No tienes proyectos aprobados. Inscríbete en un proyecto y espera la aprobación para poder registrar horas.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            
            {/* Proyecto */}
            <div className="space-y-2">
              <Label htmlFor="projectId" className="text-sm font-medium">
                Proyecto <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => handleInputChange('projectId', value)}
              >
                <SelectTrigger 
                  className={errors.projectId ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                >
                  <SelectValue placeholder="Selecciona el proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {userApprovedProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.projectId}
                </p>
              )}
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Fecha de la actividad <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={`pl-10 ${errors.date ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.date && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Horas */}
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-sm font-medium">
                Cantidad de horas <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="12"
                  placeholder="Ej: 2.5"
                  value={formData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  className={`pl-10 ${errors.hours ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Mínimo 0.5 horas, máximo 12 horas por registro
              </p>
              {errors.hours && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.hours}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción de lo realizado <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe detalladamente las actividades realizadas..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`min-h-[120px] ${errors.description ? 'border-destructive' : ''}`}
                disabled={isSubmitting}
              />
              <div className="flex justify-between text-xs">
                <span className={formData.description.length < 20 ? 'text-destructive' : 'text-muted-foreground'}>
                  {formData.description.length} / 20 caracteres mínimo
                </span>
              </div>
              {errors.description && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Evidencia/Foto */}
            <div className="space-y-2">
              <Label htmlFor="evidence" className="text-sm font-medium">
                Evidencia fotográfica <span className="text-muted-foreground">(Opcional)</span>
              </Label>
              
              {!evidence.preview ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="evidence"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="evidence"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="p-3 bg-muted rounded-full">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sube una imagen</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG o GIF. Máximo 5MB
                      </p>
                    </div>
                  </Label>
                </div>
              ) : (
                <div className="relative border rounded-lg overflow-hidden">
                  <img
                    src={evidence.preview}
                    alt="Evidencia"
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeEvidence}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {errors.evidence && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.evidence}
                </p>
              )}
            </div>

            {/* Alerta informativa */}
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Tu registro quedará en estado "pendiente" hasta que un administrador lo revise y apruebe.
                Si es aprobado, las horas se sumarán a tu total automáticamente.
              </AlertDescription>
            </Alert>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || userApprovedProjects.length === 0}
                className="flex-1 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Registrar Horas
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
