import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useProjectContext, EnrollmentData } from '@/contexts/ProjectContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  User,
  Phone,
  FileSignature,
  Calendar
} from 'lucide-react';

interface EnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectTitle: string;
  userId: string;
}

const availabilityOptions = [
  { id: 'weekday_morning', label: 'Mañanas entre semana' },
  { id: 'weekday_afternoon', label: 'Tardes entre semana' },
  { id: 'weekday_evening', label: 'Noches entre semana' },
  { id: 'weekend_morning', label: 'Mañanas fin de semana' },
  { id: 'weekend_afternoon', label: 'Tardes fin de semana' },
  { id: 'weekend_evening', label: 'Noches fin de semana' },
];

export const EnrollmentDialog = ({
  open,
  onOpenChange,
  projectId,
  projectTitle,
  userId,
}: EnrollmentDialogProps) => {
  const { enrollProject } = useProjectContext();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    motivation: '',
    availability: [] as string[],
    experience: '',
  });

  // Autocompletar teléfono del perfil cuando se abre el diálogo
  useEffect(() => {
    if (open && user?.phone) {
      setFormData(prev => ({ ...prev, phone: user.phone || '' }));
    }
  }, [open, user]);

  const [documents, setDocuments] = useState({
    idDocument: null as File | null,
    idDocumentPreview: '',
    signature: null as File | null,
    signaturePreview: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manejo de cambio en inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejo de disponibilidad
  const handleAvailabilityChange = (optionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: checked
        ? [...prev.availability, optionId]
        : prev.availability.filter(id => id !== optionId),
    }));
    if (errors.availability) {
      setErrors(prev => ({ ...prev, availability: '' }));
    }
  };

  // Manejo de carga de archivos
  const handleFileChange = (type: 'idDocument' | 'signature', file: File | null) => {
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [type]: 'Solo se permiten archivos PDF, JPG o PNG',
      }));
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [type]: 'El archivo no debe superar los 5MB',
      }));
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setDocuments(prev => ({
        ...prev,
        [type]: file,
        [`${type}Preview`]: base64String,
      }));
    };
    reader.readAsDataURL(file);

    // Limpiar error
    if (errors[type]) {
      setErrors(prev => ({ ...prev, [type]: '' }));
    }
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Ingresa un teléfono válido de 10 dígitos';
    }

    if (!formData.emergencyContact) {
      newErrors.emergencyContact = 'El contacto de emergencia es obligatorio';
    }

    if (!formData.emergencyPhone) {
      newErrors.emergencyPhone = 'El teléfono de emergencia es obligatorio';
    } else if (!/^\d{10}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = 'Ingresa un teléfono válido de 10 dígitos';
    }

    if (!formData.motivation || formData.motivation.length < 50) {
      newErrors.motivation = 'La motivación debe tener al menos 50 caracteres';
    }

    if (formData.availability.length === 0) {
      newErrors.availability = 'Selecciona al menos una opción de disponibilidad';
    }

    if (!documents.idDocument) {
      newErrors.idDocument = 'Debes subir tu documento de identidad';
    }

    if (!documents.signature) {
      newErrors.signature = 'Debes subir tu firma electrónica';
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      const enrollmentData: EnrollmentData = {
        ...formData,
        documents: {
          idDocument: documents.idDocumentPreview,
          signature: documents.signaturePreview,
        },
      };

      enrollProject(projectId, userId, enrollmentData);

      toast({
        title: '¡Solicitud enviada!',
        description: 'Tu inscripción está pendiente de aprobación',
        className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      });

      onOpenChange(false);
      
      // Limpiar formulario
      setFormData({
        phone: '',
        emergencyContact: '',
        emergencyPhone: '',
        motivation: '',
        availability: [],
        experience: '',
      });
      setDocuments({
        idDocument: null,
        idDocumentPreview: '',
        signature: null,
        signaturePreview: '',
      });
    } catch (error) {
      toast({
        title: 'Error al enviar solicitud',
        description: 'Por favor intenta nuevamente',
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
            <FileSignature className="h-5 w-5" />
            Solicitud de Inscripción
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Proyecto: <span className="font-semibold">{projectTitle}</span>
          </p>
        </DialogHeader>

        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-50">
            Completa todos los campos. Tu solicitud será revisada por un administrador.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Información de Contacto
            </h3>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono Personal *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0987654321"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contacto de Emergencia *</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Nombre completo"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className={errors.emergencyContact ? 'border-destructive' : ''}
                />
                {errors.emergencyContact && (
                  <p className="text-sm text-destructive">{errors.emergencyContact}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia *</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  placeholder="0987654321"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className={errors.emergencyPhone ? 'border-destructive' : ''}
                />
                {errors.emergencyPhone && (
                  <p className="text-sm text-destructive">{errors.emergencyPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Motivación */}
          <div className="space-y-2">
            <Label htmlFor="motivation">
              ¿Por qué quieres participar en este proyecto? *
            </Label>
            <Textarea
              id="motivation"
              placeholder="Cuéntanos tu motivación... (mínimo 50 caracteres)"
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              className={errors.motivation ? 'border-destructive min-h-[100px]' : 'min-h-[100px]'}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formData.motivation.length}/50 caracteres mínimo</span>
              {errors.motivation && (
                <span className="text-destructive">{errors.motivation}</span>
              )}
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Disponibilidad *
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availabilityOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={formData.availability.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleAvailabilityChange(option.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.availability && (
              <p className="text-sm text-destructive">{errors.availability}</p>
            )}
          </div>

          {/* Experiencia */}
          <div className="space-y-2">
            <Label htmlFor="experience">Experiencia en Voluntariado (Opcional)</Label>
            <Textarea
              id="experience"
              placeholder="Describe tu experiencia previa en proyectos de voluntariado..."
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Documentos */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentos Requeridos
            </h3>

            {/* Documento de Identidad */}
            <div className="space-y-2">
              <Label htmlFor="idDocument">Copia de Cédula o Identificación *</Label>
              <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors">
                <input
                  id="idDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('idDocument', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="idDocument"
                  className={`flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    errors.idDocument ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {documents.idDocument ? (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">
                          {documents.idDocument.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(documents.idDocument.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-primary mt-2">
                          Clic para cambiar archivo
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8" />
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Seleccionar archivo
                        </p>
                        <p className="text-xs mt-1">
                          PDF, JPG o PNG (máx. 5MB)
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>
              {errors.idDocument && (
                <p className="text-sm text-destructive">{errors.idDocument}</p>
              )}
            </div>

            {/* Firma Electrónica */}
            <div className="space-y-2">
              <Label htmlFor="signature">Firma Electrónica *</Label>
              <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors">
                <input
                  id="signature"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('signature', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="signature"
                  className={`flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    errors.signature ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {documents.signature ? (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">
                          {documents.signature.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(documents.signature.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-primary mt-2">
                          Clic para cambiar archivo
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FileSignature className="h-8 w-8" />
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Seleccionar archivo
                        </p>
                        <p className="text-xs mt-1">
                          Imagen o documento firmado (PDF, JPG, PNG - máx. 5MB)
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>
              {errors.signature && (
                <p className="text-sm text-destructive">{errors.signature}</p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando solicitud...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Enviar Solicitud
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
