import { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { allProjects } from '@/data/projects';
import {
  Award,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Calendar,
  Building,
  MessageSquare,
  Download,
  Send,
  AlertCircle,
} from 'lucide-react';
import type { CertificateRequest } from '@/contexts/ProjectContext';

export default function CertificateManagement() {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const {
    getPendingCertificateRequests,
    approveCertificateRequest,
    rejectCertificateRequest,
  } = useProjectContext();

  const [selectedRequest, setSelectedRequest] = useState<CertificateRequest | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'pending'
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pendingRequests = getPendingCertificateRequests();

  // Cargar proyectos desde localStorage
  const projects = (() => {
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  })();

  const getTypeLabel = (type: string) => {
    const types = {
      project: 'Por proyecto',
      dateRange: 'Por rango de fechas',
      general: 'Certificado general',
    };
    return types[type as keyof typeof types];
  };

  const getPurposeLabel = (purpose: string) => {
    const purposes = {
      educational: 'Educativo',
      employment: 'Laboral',
      personal: 'Personal',
      other: 'Otro',
    };
    return purposes[purpose as keyof typeof purposes];
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

  const handleApprove = () => {
    if (!selectedRequest || !certificateUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Debes ingresar la URL del certificado generado',
        variant: 'destructive',
      });
      return;
    }

    approveCertificateRequest(selectedRequest.id, user?.email || 'admin', certificateUrl);

    toast({
      title: 'Solicitud aprobada',
      description: 'El voluntario será notificado y podrá descargar su certificado',
      className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    });

    setSelectedRequest(null);
    setCertificateUrl('');
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Debes proporcionar una razón para el rechazo',
        variant: 'destructive',
      });
      return;
    }

    rejectCertificateRequest(selectedRequest.id, user?.email || 'admin', rejectionReason);

    toast({
      title: 'Solicitud rechazada',
      description: 'El voluntario ha sido notificado del rechazo',
    });

    setShowRejectDialog(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  const filteredRequests =
    filterStatus === 'all'
      ? pendingRequests
      : pendingRequests.filter((r) => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Award className="h-8 w-8 text-primary" />
                Gestión de Certificados
              </h1>
              <p className="text-muted-foreground">
                Revisa y procesa las solicitudes de certificados de los voluntarios
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Solicitudes Pendientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                    {pendingRequests.filter((r) => r.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Certificados Aprobados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500">
                    {pendingRequests.filter((r) => r.status === 'approved').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Solicitudes Rechazadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-500">
                    {pendingRequests.filter((r) => r.status === 'rejected').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Label htmlFor="status-filter">Estado:</Label>
                  <Select
                    value={filterStatus}
                    onValueChange={(value: any) => setFilterStatus(value)}
                  >
                    <SelectTrigger id="status-filter" className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="approved">Aprobados</SelectItem>
                      <SelectItem value="rejected">Rechazados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de solicitudes */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay solicitudes de certificados</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{getTypeLabel(request.type)}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>{request.userId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Solicitado el{' '}
                                {new Date(request.requestDate).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {request.status === 'pending' && (
                          <Button
                            onClick={() => setSelectedRequest(request)}
                            size="sm"
                            variant="outline"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Revisar
                          </Button>
                        )}
                      </div>

                      <Separator className="my-4" />

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {request.projectId && (
                          <div>
                            <p className="text-muted-foreground mb-1">Proyecto:</p>
                            <p className="font-medium">
                              {projects.find((p) => p.id === request.projectId)?.title}
                            </p>
                          </div>
                        )}

                        {request.startDate && request.endDate && (
                          <div>
                            <p className="text-muted-foreground mb-1">Período:</p>
                            <p className="font-medium">
                              {new Date(request.startDate).toLocaleDateString()} -{' '}
                              {new Date(request.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-muted-foreground mb-1">Propósito:</p>
                          <p className="font-medium">{getPurposeLabel(request.purpose)}</p>
                        </div>

                        {request.institution && (
                          <div>
                            <p className="text-muted-foreground mb-1">Institución:</p>
                            <p className="font-medium">{request.institution}</p>
                          </div>
                        )}

                        {request.observations && (
                          <div className="md:col-span-2">
                            <p className="text-muted-foreground mb-1">Observaciones:</p>
                            <p className="font-medium">{request.observations}</p>
                          </div>
                        )}
                      </div>

                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                          <div className="flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                            <div>
                              <p className="font-medium text-destructive mb-1">Motivo del rechazo:</p>
                              <p className="text-muted-foreground">{request.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Dialog de revisión */}
      <Dialog open={!!selectedRequest && !showRejectDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Revisar Solicitud de Certificado
            </DialogTitle>
            <DialogDescription>
              Revisa la solicitud y genera el certificado o recházala con una razón
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Voluntario:</p>
                  <p className="font-medium">{selectedRequest.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Tipo:</p>
                  <p className="font-medium">{getTypeLabel(selectedRequest.type)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Propósito:</p>
                  <p className="font-medium">{getPurposeLabel(selectedRequest.purpose)}</p>
                </div>
                {selectedRequest.institution && (
                  <div>
                    <p className="text-muted-foreground mb-1">Institución:</p>
                    <p className="font-medium">{selectedRequest.institution}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="certificateUrl">
                  URL del certificado generado <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="certificateUrl"
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  placeholder="https://ejemplo.com/certificado.pdf"
                />
                <p className="text-xs text-muted-foreground">
                  Genera el certificado PDF y proporciona la URL donde el voluntario puede descargarlo
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(true);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Aprobar y Notificar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de rechazo */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Rechazar Solicitud
            </DialogTitle>
            <DialogDescription>
              Proporciona una razón clara del rechazo. El voluntario será notificado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="rejectionReason">
              Motivo del rechazo <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explica por qué se rechaza esta solicitud..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <Send className="h-4 w-4 mr-2" />
              Enviar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
