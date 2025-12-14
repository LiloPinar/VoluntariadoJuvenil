import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLocale } from '@/i18n/LocaleContext';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  FileText,
  Users,
  MapPin,
  Calendar,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  Send,
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Heart,
  Leaf,
  GraduationCap,
  Info,
} from 'lucide-react';

// Tipos de propuesta
export type ProposalStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'needs_info';

export interface ProjectProposal {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  title: string;
  description: string;
  category: 'social' | 'environmental' | 'educational';
  objectives: string[];
  targetAudience: string;
  location: string;
  estimatedDuration: string;
  estimatedVolunteers: number;
  resources: string;
  schedule: string[];
  additionalInfo: string;
  status: ProposalStatus;
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  image?: string;
}

interface FormData {
  title: string;
  description: string;
  category: 'social' | 'environmental' | 'educational' | '';
  objectives: string[];
  targetAudience: string;
  location: string;
  estimatedDuration: string;
  estimatedVolunteers: string;
  resources: string;
  schedule: string[];
  additionalInfo: string;
  image: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  objectives?: string;
  targetAudience?: string;
  location?: string;
  estimatedDuration?: string;
  estimatedVolunteers?: string;
  resources?: string;
  schedule?: string;
}

const STORAGE_KEY = 'voluntariajoven_proposals';

const scheduleOptions = [
  { id: 'weekday_morning', label: 'Lunes a Viernes - Mañana (8:00 - 12:00)' },
  { id: 'weekday_afternoon', label: 'Lunes a Viernes - Tarde (14:00 - 18:00)' },
  { id: 'weekday_evening', label: 'Lunes a Viernes - Noche (18:00 - 21:00)' },
  { id: 'saturday_morning', label: 'Sábados - Mañana (8:00 - 12:00)' },
  { id: 'saturday_afternoon', label: 'Sábados - Tarde (14:00 - 18:00)' },
  { id: 'sunday_morning', label: 'Domingos - Mañana (8:00 - 12:00)' },
  { id: 'sunday_afternoon', label: 'Domingos - Tarde (14:00 - 18:00)' },
];

const durationOptions = [
  { value: '1_week', label: '1 semana' },
  { value: '2_weeks', label: '2 semanas' },
  { value: '1_month', label: '1 mes' },
  { value: '2_months', label: '2 meses' },
  { value: '3_months', label: '3 meses' },
  { value: '6_months', label: '6 meses' },
  { value: '1_year', label: '1 año' },
  { value: 'ongoing', label: 'Continuo / Sin fecha límite' },
];

const PropuestaProyecto = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentObjective, setCurrentObjective] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    objectives: [],
    targetAudience: '',
    location: '',
    estimatedDuration: '',
    estimatedVolunteers: '',
    resources: '',
    schedule: [],
    additionalInfo: '',
    image: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthContext();
  const { t } = useLocale();
  const navigate = useNavigate();

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando cambia
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleScheduleChange = (scheduleId: string, checked: boolean) => {
    const newSchedule = checked
      ? [...formData.schedule, scheduleId]
      : formData.schedule.filter((s) => s !== scheduleId);
    handleInputChange('schedule', newSchedule);
  };

  const handleAddObjective = () => {
    if (currentObjective.trim() && formData.objectives.length < 5) {
      handleInputChange('objectives', [...formData.objectives, currentObjective.trim()]);
      setCurrentObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index);
    handleInputChange('objectives', newObjectives);
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
        handleInputChange('image', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    handleInputChange('image', '');
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 10) {
      newErrors.title = 'El título debe tener al menos 10 caracteres';
    } else if (formData.title.length > 100) {
      newErrors.title = 'El título no puede exceder 100 caracteres';
    }

    // Descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La descripción debe tener al menos 50 caracteres';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    // Categoría
    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    // Objetivos
    if (formData.objectives.length === 0) {
      newErrors.objectives = 'Agrega al menos un objetivo';
    }

    // Público objetivo
    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'El público objetivo es requerido';
    } else if (formData.targetAudience.length < 10) {
      newErrors.targetAudience = 'Describe mejor el público objetivo (mínimo 10 caracteres)';
    }

    // Ubicación
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    // Duración estimada
    if (!formData.estimatedDuration) {
      newErrors.estimatedDuration = 'Selecciona la duración estimada';
    }

    // Número de voluntarios
    if (!formData.estimatedVolunteers) {
      newErrors.estimatedVolunteers = 'Ingresa el número de voluntarios';
    } else {
      const num = parseInt(formData.estimatedVolunteers);
      if (isNaN(num) || num < 1) {
        newErrors.estimatedVolunteers = 'Ingresa un número válido';
      } else if (num > 500) {
        newErrors.estimatedVolunteers = 'El máximo es 500 voluntarios';
      }
    }

    // Recursos
    if (!formData.resources.trim()) {
      newErrors.resources = 'Describe los recursos necesarios';
    }

    // Horarios
    if (formData.schedule.length === 0) {
      newErrors.schedule = 'Selecciona al menos un horario disponible';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Formulario incompleto',
        description: 'Por favor revisa los campos marcados con error',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de envío
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newProposal: ProjectProposal = {
        id: `proposal-${Date.now()}`,
        userId: user?.id || '',
        userEmail: user?.email || '',
        userName: user?.fullName || '',
        title: formData.title,
        description: formData.description,
        category: formData.category as 'social' | 'environmental' | 'educational',
        objectives: formData.objectives,
        targetAudience: formData.targetAudience,
        location: formData.location,
        estimatedDuration: formData.estimatedDuration,
        estimatedVolunteers: parseInt(formData.estimatedVolunteers),
        resources: formData.resources,
        schedule: formData.schedule,
        additionalInfo: formData.additionalInfo,
        status: 'submitted',
        submittedDate: new Date().toISOString(),
        image: formData.image,
      };

      // Guardar en localStorage
      const storedProposals = localStorage.getItem(STORAGE_KEY);
      const proposals: ProjectProposal[] = storedProposals
        ? JSON.parse(storedProposals)
        : [];
      proposals.push(newProposal);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));

      toast({
        title: '¡Propuesta enviada!',
        description: 'Tu propuesta ha sido enviada y será revisada por nuestro equipo.',
        className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      });

      // Redirigir a mis proyectos
      navigate('/mis-proyectos');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar la propuesta. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social':
        return Heart;
      case 'environmental':
        return Leaf;
      case 'educational':
        return GraduationCap;
      default:
        return Target;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPage="Proponer Proyecto"
      />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 container max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Botón Volver */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Proponer Nuevo Proyecto
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Comparte tu idea y ayuda a crear impacto en la comunidad
                </p>
              </div>
            </div>
          </div>

          {/* Alerta informativa */}
          <Alert className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
              <strong>¿Cómo funciona?</strong> Tu propuesta será revisada por nuestro equipo. 
              Si es aprobada, el proyecto se publicará y podrás ser el coordinador. 
              Te notificaremos el estado de tu propuesta.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información del Proyecto
                </CardTitle>
                <CardDescription>
                  Describe tu idea de proyecto de voluntariado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Limpieza de Playas Comunitaria"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={errors.title ? 'border-destructive' : ''}
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.title.length}/100
                  </p>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Detallada *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe en detalle el proyecto: qué se hará, por qué es importante, y cómo beneficiará a la comunidad..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`min-h-[120px] ${errors.description ? 'border-destructive' : ''}`}
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

                {/* Categoría */}
                <div className="space-y-2">
                  <Label>Categoría *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'social', label: 'Social', icon: Heart, color: 'text-pink-600' },
                      { value: 'environmental', label: 'Ambiental', icon: Leaf, color: 'text-green-600' },
                      { value: 'educational', label: 'Educativo', icon: GraduationCap, color: 'text-blue-600' },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleInputChange('category', cat.value)}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.category === cat.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <cat.icon className={`h-6 w-6 ${cat.color}`} />
                        <span className="font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Imagen del proyecto */}
                <div className="space-y-2">
                  <Label>Imagen del Proyecto (Opcional)</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
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
                        id="project-image"
                      />
                      <label
                        htmlFor="project-image"
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
              </CardContent>
            </Card>

            {/* Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos del Proyecto
                </CardTitle>
                <CardDescription>
                  Define los objetivos específicos que se buscan alcanzar (máximo 5)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe un objetivo y presiona Agregar"
                    value={currentObjective}
                    onChange={(e) => setCurrentObjective(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddObjective();
                      }
                    }}
                    disabled={formData.objectives.length >= 5}
                  />
                  <Button
                    type="button"
                    onClick={handleAddObjective}
                    disabled={!currentObjective.trim() || formData.objectives.length >= 5}
                  >
                    Agregar
                  </Button>
                </div>

                {formData.objectives.length > 0 && (
                  <ul className="space-y-2">
                    {formData.objectives.map((objective, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="flex-1">{objective}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveObjective(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}

                {errors.objectives && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.objectives}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  {formData.objectives.length}/5 objetivos agregados
                </p>
              </CardContent>
            </Card>

            {/* Detalles del proyecto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Detalles y Logística
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Público objetivo */}
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Público Objetivo *</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="Describe a quiénes beneficiará el proyecto (ej: niños de escuelas públicas, adultos mayores, comunidades rurales...)"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    className={errors.targetAudience ? 'border-destructive' : ''}
                  />
                  {errors.targetAudience && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.targetAudience}
                    </p>
                  )}
                </div>

                {/* Ubicación */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Ubicación *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Ciudad, Provincia o Dirección específica"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Duración estimada */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Duración Estimada *
                    </Label>
                    <Select
                      value={formData.estimatedDuration}
                      onValueChange={(value) => handleInputChange('estimatedDuration', value)}
                    >
                      <SelectTrigger className={errors.estimatedDuration ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecciona la duración" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.estimatedDuration && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.estimatedDuration}
                      </p>
                    )}
                  </div>

                  {/* Número de voluntarios */}
                  <div className="space-y-2">
                    <Label htmlFor="volunteers" className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Voluntarios Necesarios *
                    </Label>
                    <Input
                      id="volunteers"
                      type="number"
                      min="1"
                      max="500"
                      placeholder="Ej: 20"
                      value={formData.estimatedVolunteers}
                      onChange={(e) => handleInputChange('estimatedVolunteers', e.target.value)}
                      className={errors.estimatedVolunteers ? 'border-destructive' : ''}
                    />
                    {errors.estimatedVolunteers && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.estimatedVolunteers}
                      </p>
                    )}
                  </div>
                </div>

                {/* Recursos necesarios */}
                <div className="space-y-2">
                  <Label htmlFor="resources">Recursos Necesarios *</Label>
                  <Textarea
                    id="resources"
                    placeholder="Describe los recursos materiales, financieros o logísticos necesarios..."
                    value={formData.resources}
                    onChange={(e) => handleInputChange('resources', e.target.value)}
                    className={errors.resources ? 'border-destructive' : ''}
                  />
                  {errors.resources && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.resources}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Disponibilidad horaria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Disponibilidad Horaria
                </CardTitle>
                <CardDescription>
                  Selecciona los horarios en los que se podría realizar el proyecto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scheduleOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.schedule.includes(option.id)
                          ? 'bg-primary/5 border-primary'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        checked={formData.schedule.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleScheduleChange(option.id, checked as boolean)
                        }
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.schedule && (
                  <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                    <AlertCircle className="h-3 w-3" />
                    {errors.schedule}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Información Adicional
                </CardTitle>
                <CardDescription>
                  Cualquier detalle extra que quieras compartir sobre tu propuesta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Experiencia previa con proyectos similares, alianzas potenciales, consideraciones especiales, etc."
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {formData.additionalInfo.length}/500
                </p>
              </CardContent>
            </Card>

            {/* Resumen y botón de envío */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      ¿Listo para enviar tu propuesta?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Asegúrate de haber completado todos los campos requeridos
                    </p>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="gap-2 w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar Propuesta
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PropuestaProyecto;
