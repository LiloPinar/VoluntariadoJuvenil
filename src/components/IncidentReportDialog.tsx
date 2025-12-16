import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Upload, X, Loader2, AlertCircle } from 'lucide-react';
import {
  INCIDENT_TYPES,
  SEVERITY_OPTIONS,
  INCIDENTS_STORAGE_KEY,
  type Incident,
  type IncidentType,
  type IncidentSeverity,
} from '@/types/incidents';

interface IncidentReportDialogProps {
  projectId: number;
  projectTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  type: IncidentType | '';
  severity: IncidentSeverity | '';
  date: string;
  time: string;
  description: string;
  peopleInvolved: string;
  location: string;
  evidence: string;
}

interface FormErrors {
  type?: string;
  severity?: string;
  date?: string;
  time?: string;
  description?: string;
  peopleInvolved?: string;
  location?: string;
}

export const IncidentReportDialog = ({
  projectId,
  projectTitle,
  open,
  onOpenChange,
}: IncidentReportDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    type: '',
    severity: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    description: '',
    peopleInvolved: '',
    location: '',
    evidence: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { user } = useAuthContext();
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'La imagen no puede exceder 5MB',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        handleInputChange('evidence', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    handleInputChange('evidence', '');
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.type) {
      newErrors.type = 'Selecciona el tipo de incidencia';
    }

    if (!formData.severity) {
      newErrors.severity = 'Selecciona la severidad';
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!formData.time) {
      newErrors.time = 'La hora es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    if (!formData.peopleInvolved.trim()) {
      newErrors.peopleInvolved = 'Especifica las personas involucradas';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newIncident: Incident = {
        id: `incident-${Date.now()}`,
        projectId,
        projectTitle,
        reporterId: user?.id || '',
        reporterName: user?.fullName || '',
        reporterEmail: user?.email || '',
        type: formData.type as IncidentType,
        severity: formData.severity as IncidentSeverity,
        date: `${formData.date}T${formData.time}`,
        reportDate: new Date().toISOString(),
        description: formData.description,
        peopleInvolved: formData.peopleInvolved,
        location: formData.location,
        evidence: formData.evidence || undefined,
        status: 'pendiente',
      };

      // Guardar en localStorage
      const stored = localStorage.getItem(INCIDENTS_STORAGE_KEY);
      const incidents: Incident[] = stored ? JSON.parse(stored) : [];
      incidents.push(newIncident);
      localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));

      toast({
        title: '¡Incidencia reportada!',
        description: 'Tu reporte ha sido enviado. El equipo lo revisará pronto.',
        className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      });

      // Resetear formulario
      setFormData({
        type: '',
        severity: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        description: '',
        peopleInvolved: '',
        location: '',
        evidence: '',
      });
      setImagePreview('');
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el reporte. Intenta nuevamente.',
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
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Reportar Incidencia
          </DialogTitle>
          <DialogDescription>
            Documenta cualquier situación imprevista ocurrida en el proyecto: <strong>{projectTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de incidencia */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Incidencia *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecciona el tipo de incidencia" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INCIDENT_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.type}
              </p>
            )}
          </div>

          {/* Severidad */}
          <div className="space-y-2">
            <Label>Severidad *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEVERITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('severity', option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.severity === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Badge className={option.color}>{option.label}</Badge>
                </button>
              ))}
            </div>
            {errors.severity && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.severity}
              </p>
            )}
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha del Incidente *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={errors.date ? 'border-destructive' : ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora del Incidente *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={errors.time ? 'border-destructive' : ''}
              />
              {errors.time && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.time}
                </p>
              )}
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación del Incidente *</Label>
            <Input
              id="location"
              placeholder="Lugar específico donde ocurrió"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Detallada *</Label>
            <Textarea
              id="description"
              placeholder="Describe qué sucedió, cómo ocurrió, las circunstancias, etc."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`min-h-[100px] ${errors.description ? 'border-destructive' : ''}`}
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {formData.description.length}/1000
            </p>
          </div>

          {/* Personas involucradas */}
          <div className="space-y-2">
            <Label htmlFor="peopleInvolved">Personas Involucradas *</Label>
            <Textarea
              id="peopleInvolved"
              placeholder="Nombres de las personas directa o indirectamente involucradas"
              value={formData.peopleInvolved}
              onChange={(e) => handleInputChange('peopleInvolved', e.target.value)}
              className={errors.peopleInvolved ? 'border-destructive' : ''}
            />
            {errors.peopleInvolved && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.peopleInvolved}
              </p>
            )}
          </div>

          {/* Evidencia fotográfica */}
          <div className="space-y-2">
            <Label>Evidencia Fotográfica (Opcional)</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Evidencia"
                  className="w-full h-48 object-cover rounded-lg"
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
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="incident-evidence"
                />
                <label
                  htmlFor="incident-evidence"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Clic para subir una imagen (máx 5MB)
                  </span>
                </label>
              </div>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Reportar Incidencia
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
