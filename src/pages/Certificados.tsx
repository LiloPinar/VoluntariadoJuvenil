import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { allProjects } from '@/data/projects';
import {
  Award,
  FileText,
  Send,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  AlertCircle,
  Loader2,
} from 'lucide-react';

type CertificateType = 'project' | 'dateRange' | 'general';
type CertificatePurpose = 'educational' | 'employment' | 'personal' | 'other';

export default function Certificados() {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const {
    enrolledProjects,
    getCertificateRequests,
    submitCertificateRequest,
  } = useProjectContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '' as CertificateType | '',
    projectId: '',
    startDate: '',
    endDate: '',
    purpose: '' as CertificatePurpose | '',
    institution: '',
    observations: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar proyectos desde localStorage
  const projects = (() => {
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  })();

  // Obtener proyectos aprobados del usuario
  const userApprovedProjects = enrolledProjects
    .filter((e) => e.userId === user?.email && e.status === 'approved')
    .map((e) => projects.find((p) => p.id === e.projectId))
    .filter(Boolean);

  // Obtener solicitudes del usuario
  const userRequests = user?.email ? getCertificateRequests(user.email) : [];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Debes seleccionar un tipo de certificado';
    }

    if (formData.type === 'project' && !formData.projectId) {
      newErrors.projectId = 'Debes seleccionar un proyecto';
    }

    if (formData.type === 'dateRange') {
      if (!formData.startDate) {
        newErrors.startDate = 'La fecha de inicio es obligatoria';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'La fecha de fin es obligatoria';
      }
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (start > end) {
          newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
        }
      }
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Debes seleccionar el propósito del certificado';
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

      submitCertificateRequest({
        userId: user?.email!,
        type: formData.type as CertificateType,
        projectId: formData.projectId ? parseInt(formData.projectId) : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        purpose: formData.purpose as CertificatePurpose,
        institution: formData.institution || undefined,
        observations: formData.observations || undefined,
        status: 'pending',
        requestDate: new Date().toISOString(),
      });

      toast({
        title: 'Solicitud enviada',
        description:
          'Tu solicitud de certificado ha sido enviada. Un administrador la revisará pronto.',
        className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      });

      // Resetear formulario
      setFormData({
        type: '',
        projectId: '',
        startDate: '',
        endDate: '',
        purpose: '',
        institution: '',
        observations: '',
      });
    } catch (error) {
      toast({
        title: 'Error al enviar',
        description: 'No se pudo enviar la solicitud. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const, icon: Clock },
      approved: { label: 'Aprobado', variant: 'default' as const, icon: CheckCircle2 },
      rejected: { label: 'Rechazado', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: CertificateType) => {
    const types = {
      project: 'Por proyecto',
      dateRange: 'Por rango de fechas',
      general: 'Certificado general',
    };
    return types[type];
  };

  const getPurposeLabel = (purpose: CertificatePurpose) => {
    const purposes = {
      educational: 'Educativo',
      employment: 'Laboral',
      personal: 'Personal',
      other: 'Otro',
    };
    return purposes[purpose];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header currentPage="certificados" />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            Certificados de Voluntariado
          </h1>
          <p className="text-muted-foreground">
            Solicita certificados oficiales que validen tus horas de voluntariado
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulario de solicitud */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Nueva Solicitud
              </CardTitle>
              <CardDescription>
                Completa el formulario para solicitar un certificado de voluntariado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userApprovedProjects.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No tienes proyectos aprobados. Inscríbete en un proyecto y espera la aprobación
                    para poder solicitar certificados.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Tipo de certificado */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Tipo de certificado <span className="text-destructive">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                        <RadioGroupItem value="project" id="type-project" />
                        <Label htmlFor="type-project" className="flex-1 cursor-pointer">
                          <div className="font-medium">Por proyecto específico</div>
                          <div className="text-xs text-muted-foreground">
                            Certificado de un proyecto completado
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                        <RadioGroupItem value="dateRange" id="type-dateRange" />
                        <Label htmlFor="type-dateRange" className="flex-1 cursor-pointer">
                          <div className="font-medium">Por rango de fechas</div>
                          <div className="text-xs text-muted-foreground">
                            Todas las horas en un período
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                        <RadioGroupItem value="general" id="type-general" />
                        <Label htmlFor="type-general" className="flex-1 cursor-pointer">
                          <div className="font-medium">Certificado general</div>
                          <div className="text-xs text-muted-foreground">
                            Total acumulado de horas
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.type && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.type}
                      </p>
                    )}
                  </div>

                  {/* Proyecto (condicional) */}
                  {formData.type === 'project' && (
                    <div className="space-y-2">
                      <Label htmlFor="projectId">
                        Proyecto <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.projectId}
                        onValueChange={(value) => handleInputChange('projectId', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={errors.projectId ? 'border-destructive' : ''}
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
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.projectId}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rango de fechas (condicional) */}
                  {formData.type === 'dateRange' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">
                          Fecha inicio <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className={errors.startDate ? 'border-destructive' : ''}
                          disabled={isSubmitting}
                        />
                        {errors.startDate && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.startDate}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">
                          Fecha fin <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className={errors.endDate ? 'border-destructive' : ''}
                          disabled={isSubmitting}
                        />
                        {errors.endDate && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.endDate}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Propósito */}
                  <div className="space-y-2">
                    <Label htmlFor="purpose">
                      Propósito del certificado <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.purpose}
                      onValueChange={(value) => handleInputChange('purpose', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.purpose ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecciona el propósito" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educational">Educativo</SelectItem>
                        <SelectItem value="employment">Laboral</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.purpose && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  {/* Institución destinataria */}
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institución destinataria (opcional)</Label>
                    <Input
                      id="institution"
                      type="text"
                      value={formData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      placeholder="Ej: Universidad Nacional"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Observaciones */}
                  <div className="space-y-2">
                    <Label htmlFor="observations">Observaciones adicionales (opcional)</Label>
                    <Textarea
                      id="observations"
                      value={formData.observations}
                      onChange={(e) => handleInputChange('observations', e.target.value)}
                      placeholder="Información adicional que quieras incluir..."
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Botón de envío */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Solicitud
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Mis solicitudes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Mis Solicitudes
              </CardTitle>
              <CardDescription>Historial de solicitudes de certificados</CardDescription>
            </CardHeader>
            <CardContent>
              {userRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tienes solicitudes de certificados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userRequests.map((request) => (
                    <Card key={request.id} className="border-2">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{getTypeLabel(request.type)}</p>
                            <p className="text-xs text-muted-foreground">
                              Solicitado el{' '}
                              {new Date(request.requestDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="space-y-1 text-sm">
                          {request.projectId && (
                            <p>
                              <span className="text-muted-foreground">Proyecto:</span>{' '}
                              {projects.find((p) => p.id === request.projectId)?.title}
                            </p>
                          )}
                          {request.startDate && request.endDate && (
                            <p>
                              <span className="text-muted-foreground">Período:</span>{' '}
                              {new Date(request.startDate).toLocaleDateString()} -{' '}
                              {new Date(request.endDate).toLocaleDateString()}
                            </p>
                          )}
                          <p>
                            <span className="text-muted-foreground">Propósito:</span>{' '}
                            {getPurposeLabel(request.purpose)}
                          </p>
                        </div>

                        {request.status === 'approved' && request.certificateUrl && (
                          <Button size="sm" className="w-full mt-3" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar Certificado
                          </Button>
                        )}

                        {request.status === 'rejected' && request.rejectionReason && (
                          <Alert variant="destructive" className="mt-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              {request.rejectionReason}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
