import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { allProjects } from '@/data/projects';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  FileText,
  AlertCircle,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';

const ManualHoursManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthContext();
  const { manualHoursRecords, approveManualHours, rejectManualHours } = useProjectContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Cargar proyectos desde localStorage
  const projects = (() => {
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  })();

  // Scroll al top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Verificar que sea admin
  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  // Filtrar registros
  const filteredRecords = manualHoursRecords.filter((record) => {
    if (filterStatus === 'all') return true;
    return record.status === filterStatus;
  });

  // Estadísticas
  const pendingCount = manualHoursRecords.filter(r => r.status === 'pending').length;
  const approvedCount = manualHoursRecords.filter(r => r.status === 'approved').length;
  const rejectedCount = manualHoursRecords.filter(r => r.status === 'rejected').length;
  const totalHoursApproved = manualHoursRecords
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.hours, 0);

  // Abrir diálogo de detalles
  const openDetailsDialog = (record: any) => {
    setSelectedRecord(record);
    setShowDetailsDialog(true);
  };

  // Aprobar registro
  const handleApprove = () => {
    if (!selectedRecord) return;

    approveManualHours(selectedRecord.id, user.email);
    setShowApproveDialog(false);
    setShowDetailsDialog(false);
    setSelectedRecord(null);

    toast({
      title: 'Registro aprobado',
      description: `Se aprobaron ${selectedRecord.hours} horas para el usuario`,
      className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    });
  };

  // Rechazar registro
  const handleReject = () => {
    if (!selectedRecord || !rejectionReason.trim()) {
      toast({
        title: 'Motivo requerido',
        description: 'Debes proporcionar un motivo para rechazar el registro',
        variant: 'destructive',
      });
      return;
    }

    rejectManualHours(selectedRecord.id, user.email, rejectionReason);
    setShowRejectDialog(false);
    setShowDetailsDialog(false);
    setSelectedRecord(null);
    setRejectionReason('');

    toast({
      title: 'Registro rechazado',
      description: 'El registro ha sido rechazado',
      variant: 'destructive',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Aprobado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Gestión de Horas Manuales" />
      
      <div className="flex flex-1">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Gestión de Horas Manuales
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Revisa y aprueba registros de horas manuales
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pendientes
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {pendingCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registros por revisar
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Aprobados
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {approvedCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registros aprobados
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Rechazados
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {rejectedCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  No aprobados
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Horas Totales
                  </CardTitle>
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {totalHoursApproved}h
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Horas aprobadas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pendientes ({pendingCount})
                </Button>
                <Button
                  variant={filterStatus === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('approved')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aprobados ({approvedCount})
                </Button>
                <Button
                  variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('rejected')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazados ({rejectedCount})
                </Button>
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  Todos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Registros */}
          <div className="space-y-4">
            {filteredRecords.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay registros</h3>
                  <p className="text-muted-foreground">
                    No hay registros de horas manuales en este estado
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredRecords
                .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
                .map((record) => {
                  const project = projects.find(p => p.id === record.projectId);
                  return (
                    <Card key={record.id} className="border-border bg-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(record.status)}
                              {record.evidence && (
                                <Badge variant="outline" className="text-xs">
                                  <ImageIcon className="h-3 w-3 mr-1" />
                                  Con evidencia
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold mb-1">
                              {project?.title || 'Proyecto desconocido'}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Usuario: {record.userId}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(record.date).toLocaleDateString('es-ES')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {record.hours} horas
                              </span>
                              <span className="text-xs">
                                Enviado: {new Date(record.submittedDate).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                            {record.status === 'rejected' && record.rejectionReason && (
                              <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-xs font-medium text-red-900 dark:text-red-200">
                                  Motivo del rechazo:
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                  {record.rejectionReason}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDetailsDialog(record)}
                              className="flex-1 sm:flex-none"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* Dialog de Detalles */}
      {selectedRecord && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles del Registro</DialogTitle>
              <DialogDescription>
                Revisa la información del registro de horas manuales
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-sm font-medium">Estado</Label>
                <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
              </div>

              <div>
                <Label className="text-sm font-medium">Proyecto</Label>
                <p className="mt-1 text-sm">
                  {projects.find(p => p.id === selectedRecord.projectId)?.title || 'Proyecto desconocido'}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Usuario</Label>
                <p className="mt-1 text-sm">{selectedRecord.userId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Fecha de la actividad</Label>
                  <p className="mt-1 text-sm">
                    {new Date(selectedRecord.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Horas</Label>
                  <p className="mt-1 text-sm font-bold text-primary">{selectedRecord.hours} horas</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Descripción</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{selectedRecord.description}</p>
              </div>

              {selectedRecord.evidence && (
                <div>
                  <Label className="text-sm font-medium">Evidencia</Label>
                  <div className="mt-2">
                    <img
                      src={selectedRecord.evidence}
                      alt="Evidencia"
                      className="w-full rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setShowEvidenceDialog(true)}
                    />
                  </div>
                </div>
              )}

              {selectedRecord.status === 'rejected' && selectedRecord.rejectionReason && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                  <Label className="text-sm font-medium text-red-900 dark:text-red-200">
                    Motivo del rechazo
                  </Label>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {selectedRecord.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
              >
                Cerrar
              </Button>
              {selectedRecord.status === 'pending' && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowRejectDialog(true);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowApproveDialog(true);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Aprobación */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Registro</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas aprobar este registro de {selectedRecord?.hours} horas?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Aprobar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Rechazo */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Registro</DialogTitle>
            <DialogDescription>
              Proporciona un motivo para rechazar este registro
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="rejectionReason">Motivo del rechazo *</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explica por qué se rechaza este registro..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason('');
            }}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Evidencia en grande */}
      {selectedRecord?.evidence && (
        <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Evidencia fotográfica</DialogTitle>
            </DialogHeader>
            <img
              src={selectedRecord.evidence}
              alt="Evidencia"
              className="w-full rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ManualHoursManagement;
