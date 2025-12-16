import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  LogOut,
  Calendar,
  User,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';
import {
  WITHDRAWAL_REASONS,
  TRANSITION_OPTIONS,
  WITHDRAWALS_STORAGE_KEY,
  type WithdrawalRequest,
  type WithdrawalStatus,
} from '@/types/withdrawals';

const WithdrawalManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [adminComments, setAdminComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Cargar solicitudes desde localStorage
  const loadWithdrawals = () => {
    const stored = localStorage.getItem(WITHDRAWALS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setWithdrawals(parsed);
    }
  };

  useEffect(() => {
    loadWithdrawals();

    // Auto-refresh cada 5 segundos
    const interval = setInterval(loadWithdrawals, 5000);
    return () => clearInterval(interval);
  }, []);

  // Guardar cambios en localStorage
  const saveWithdrawals = (updatedWithdrawals: WithdrawalRequest[]) => {
    localStorage.setItem(WITHDRAWALS_STORAGE_KEY, JSON.stringify(updatedWithdrawals));
    setWithdrawals(updatedWithdrawals);
  };

  // Filtrar por estado
  const getWithdrawalsByStatus = (status?: WithdrawalStatus) => {
    if (!status) return withdrawals;
    return withdrawals.filter((w) => w.status === status);
  };

  // Estadísticas
  const stats = {
    total: withdrawals.length,
    pendiente: getWithdrawalsByStatus('pendiente').length,
    aprobada: getWithdrawalsByStatus('aprobada').length,
    rechazada: getWithdrawalsByStatus('rechazada').length,
    cancelada: getWithdrawalsByStatus('cancelada').length,
  };

  // Manejar acciones de aprobación/rechazo
  const handleAction = (withdrawal: WithdrawalRequest, action: 'approve' | 'reject') => {
    setSelectedWithdrawal(withdrawal);
    setActionType(action);
    setAdminComments('');
    setShowActionDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedWithdrawal) return;

    if (actionType === 'reject' && !adminComments.trim()) {
      toast({
        title: 'Comentarios requeridos',
        description: 'Debes proporcionar una razón para rechazar la solicitud',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedWithdrawals = withdrawals.map((w) =>
        w.id === selectedWithdrawal.id
          ? {
              ...w,
              status: actionType === 'approve' ? ('aprobada' as WithdrawalStatus) : ('rechazada' as WithdrawalStatus),
              reviewedDate: new Date().toISOString(),
              reviewedBy: 'Admin',
              reviewerComments: adminComments || undefined,
            }
          : w
      );

      saveWithdrawals(updatedWithdrawals);

      toast({
        title: actionType === 'approve' ? '¡Solicitud aprobada!' : 'Solicitud rechazada',
        description:
          actionType === 'approve'
            ? `La baja de ${selectedWithdrawal.volunteerName} ha sido aprobada`
            : `La solicitud de ${selectedWithdrawal.volunteerName} ha sido rechazada`,
        className:
          actionType === 'approve'
            ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
      });

      setShowActionDialog(false);
      setSelectedWithdrawal(null);
      setAdminComments('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo procesar la solicitud',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Componente de tarjeta de solicitud
  const WithdrawalCard = ({ withdrawal }: { withdrawal: WithdrawalRequest }) => {
    const statusConfig = {
      pendiente: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
        icon: Clock,
      },
      aprobada: {
        color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
        icon: CheckCircle,
      },
      rechazada: {
        color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
        icon: XCircle,
      },
      cancelada: {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200',
        icon: AlertTriangle,
      },
    };

    const config = statusConfig[withdrawal.status];
    const StatusIcon = config.icon;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <LogOut className="h-5 w-5 text-orange-600" />
                {withdrawal.projectTitle}
              </CardTitle>
              <CardDescription className="mt-1">
                Solicitud #{withdrawal.id.slice(-8)}
              </CardDescription>
            </div>
            <Badge className={config.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Información del voluntario */}
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{withdrawal.volunteerName}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {withdrawal.volunteerEmail}
            </div>

            {/* Motivo */}
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <span className="font-medium">Motivo: </span>
                <span className="text-muted-foreground">
                  {WITHDRAWAL_REASONS[withdrawal.reason]}
                </span>
              </div>
            </div>

            {/* Fecha efectiva */}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Fecha efectiva:{' '}
                {new Date(withdrawal.effectiveDate).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Disponibilidad de transición */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Transición:{' '}
                {TRANSITION_OPTIONS.find((opt) => opt.value === withdrawal.transitionAvailability)
                  ?.label}
              </span>
            </div>

            {/* Fecha de solicitud */}
            <div className="text-xs text-muted-foreground">
              Solicitado: {new Date(withdrawal.requestDate).toLocaleDateString('es-ES')}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setSelectedWithdrawal(withdrawal);
                  setShowDetailDialog(true);
                }}
              >
                <FileText className="h-4 w-4 mr-1" />
                Ver Detalle
              </Button>

              {withdrawal.status === 'pendiente' && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleAction(withdrawal, 'approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAction(withdrawal, 'reject')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPage="Gestión de Bajas"
      />
      <div className="flex flex-1">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <LogOut className="h-8 w-8 text-orange-600" />
                Gestión de Solicitudes de Baja
              </h1>
              <Button variant="outline" size="sm" onClick={loadWithdrawals}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
            <p className="text-muted-foreground">
              Revisa y administra las solicitudes de baja de los voluntarios
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total de Solicitudes</CardDescription>
                <CardTitle className="text-3xl">{stats.total}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Todas las bajas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pendientes</CardDescription>
                <CardTitle className="text-3xl text-yellow-600">{stats.pendiente}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Requieren revisión
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Aprobadas</CardDescription>
                <CardTitle className="text-3xl text-green-600">{stats.aprobada}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  Bajas confirmadas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Rechazadas</CardDescription>
                <CardTitle className="text-3xl text-red-600">{stats.rechazada}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  No autorizadas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Canceladas</CardDescription>
                <CardTitle className="text-3xl text-gray-600">{stats.cancelada}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Voluntario canceló
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs por estado */}
          <Tabs defaultValue="pendiente" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
              <TabsTrigger value="pendiente">Pendientes ({stats.pendiente})</TabsTrigger>
              <TabsTrigger value="aprobada">Aprobadas ({stats.aprobada})</TabsTrigger>
              <TabsTrigger value="rechazada">Rechazadas ({stats.rechazada})</TabsTrigger>
              <TabsTrigger value="cancelada">Canceladas ({stats.cancelada})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {withdrawals.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <LogOut className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay solicitudes de baja registradas</p>
                  </CardContent>
                </Card>
              ) : (
                withdrawals.map((withdrawal) => (
                  <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
                ))
              )}
            </TabsContent>

            {(['pendiente', 'aprobada', 'rechazada', 'cancelada'] as WithdrawalStatus[]).map(
              (status) => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {getWithdrawalsByStatus(status).length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <LogOut className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No hay solicitudes {status}s</p>
                      </CardContent>
                    </Card>
                  ) : (
                    getWithdrawalsByStatus(status).map((withdrawal) => (
                      <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
                    ))
                  )}
                </TabsContent>
              )
            )}
          </Tabs>
        </main>
      </div>
      <Footer />

      {/* Diálogo de detalles */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-orange-600" />
              Detalles de la Solicitud
            </DialogTitle>
            <DialogDescription>
              Información completa de la solicitud de baja
            </DialogDescription>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="space-y-4">
              {/* Información del proyecto */}
              <div>
                <Label className="text-sm font-semibold">Proyecto</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedWithdrawal.projectTitle}</p>
              </div>

              {/* Información del voluntario */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Voluntario</Label>
                  <p className="mt-1 p-3 bg-muted rounded-md">
                    {selectedWithdrawal.volunteerName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email</Label>
                  <p className="mt-1 p-3 bg-muted rounded-md text-sm">
                    {selectedWithdrawal.volunteerEmail}
                  </p>
                </div>
              </div>

              {/* Motivo */}
              <div>
                <Label className="text-sm font-semibold">Motivo de la Baja</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">
                  {WITHDRAWAL_REASONS[selectedWithdrawal.reason]}
                </p>
              </div>

              {/* Detalles del motivo */}
              <div>
                <Label className="text-sm font-semibold">Explicación</Label>
                <p className="mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">
                  {selectedWithdrawal.reasonDetails}
                </p>
              </div>

              {/* Fecha efectiva */}
              <div>
                <Label className="text-sm font-semibold">Fecha Efectiva Deseada</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">
                  {new Date(selectedWithdrawal.effectiveDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Disponibilidad de transición */}
              <div>
                <Label className="text-sm font-semibold">Disponibilidad para Transición</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">
                  {
                    TRANSITION_OPTIONS.find(
                      (opt) => opt.value === selectedWithdrawal.transitionAvailability
                    )?.label
                  }
                </p>
              </div>

              {/* Comentarios adicionales */}
              {selectedWithdrawal.additionalComments && (
                <div>
                  <Label className="text-sm font-semibold">Comentarios Adicionales</Label>
                  <p className="mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">
                    {selectedWithdrawal.additionalComments}
                  </p>
                </div>
              )}

              {/* Fecha de solicitud */}
              <div>
                <Label className="text-sm font-semibold">Fecha de Solicitud</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">
                  {new Date(selectedWithdrawal.requestDate).toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Información de revisión */}
              {selectedWithdrawal.reviewedDate && (
                <div className="pt-4 border-t">
                  <Label className="text-sm font-semibold">Información de Revisión</Label>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Revisado por:</span>{' '}
                      {selectedWithdrawal.reviewedBy}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Fecha:</span>{' '}
                      {new Date(selectedWithdrawal.reviewedDate).toLocaleString('es-ES')}
                    </p>
                    {selectedWithdrawal.reviewerComments && (
                      <div>
                        <Label className="text-sm font-semibold">Comentarios del Admin</Label>
                        <p className="mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">
                          {selectedWithdrawal.reviewerComments}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de acción (aprobar/rechazar) */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'approve' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {actionType === 'approve' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? '¿Confirmas que deseas aprobar esta solicitud de baja?'
                : '¿Por qué razón se rechaza esta solicitud?'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>
                Comentarios {actionType === 'reject' ? '(Requeridos)' : '(Opcionales)'}
              </Label>
              <Textarea
                placeholder={
                  actionType === 'approve'
                    ? 'Agrega comentarios adicionales si es necesario...'
                    : 'Explica la razón del rechazo...'
                }
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmAction}
              disabled={isProcessing || (actionType === 'reject' && !adminComments.trim())}
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isProcessing ? 'Procesando...' : actionType === 'approve' ? 'Aprobar' : 'Rechazar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawalManagement;
