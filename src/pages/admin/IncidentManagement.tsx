import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  Info,
} from 'lucide-react';
import {
  INCIDENT_TYPES,
  SEVERITY_OPTIONS,
  INCIDENTS_STORAGE_KEY,
  type Incident,
  type IncidentStatus,
} from '@/types/incidents';

const IncidentManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('pendiente');
  const [adminNotes, setAdminNotes] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

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

  // Cargar incidencias desde localStorage
  useEffect(() => {
    const loadIncidents = () => {
      const stored = localStorage.getItem(INCIDENTS_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setIncidents(parsed);
        } catch (error) {
          console.error('Error loading incidents:', error);
          setIncidents([]);
        }
      }
    };

    loadIncidents();
    
    // Recargar cada 5 segundos para ver nuevas incidencias
    const interval = setInterval(loadIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  // Estadísticas
  const stats = useMemo(() => {
    return {
      pendiente: incidents.filter((i) => i.status === 'pendiente').length,
      en_seguimiento: incidents.filter((i) => i.status === 'en_seguimiento').length,
      resuelto: incidents.filter((i) => i.status === 'resuelto').length,
      cancelado: incidents.filter((i) => i.status === 'cancelado').length,
      alta: incidents.filter((i) => i.severity === 'alta' || i.severity === 'critica').length,
    };
  }, [incidents]);

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
    setAdminNotes(incident.adminNotes || '');
    setResolutionNotes(incident.resolutionNotes || '');
    setShowDetailsDialog(true);
  };

  const handleChangeStatus = () => {
    if (!selectedIncident) return;

    if (newStatus === 'resuelto' && !resolutionNotes.trim()) {
      toast({
        title: 'Error',
        description: 'Debes proporcionar notas de resolución.',
        variant: 'destructive',
      });
      return;
    }

    const updatedIncidents = incidents.map((i) =>
      i.id === selectedIncident.id
        ? {
            ...i,
            status: newStatus,
            adminNotes: adminNotes || i.adminNotes,
            resolutionNotes: newStatus === 'resuelto' ? resolutionNotes : i.resolutionNotes,
            reviewedBy: user?.email,
            reviewedDate: new Date().toISOString(),
          }
        : i
    );

    localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(updatedIncidents));
    setIncidents(updatedIncidents);
    setShowStatusDialog(false);
    setShowDetailsDialog(false);
    setAdminNotes('');
    setResolutionNotes('');

    const statusLabels = {
      pendiente: 'Pendiente',
      en_seguimiento: 'En Seguimiento',
      resuelto: 'Resuelto',
      cancelado: 'Cancelado',
    };

    toast({
      title: 'Estado actualizado',
      description: `La incidencia ahora está marcada como "${statusLabels[newStatus]}".`,
      className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    });
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'pendiente':
        return (
          <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'en_seguimiento':
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            <Info className="h-3 w-3 mr-1" />
            En Seguimiento
          </Badge>
        );
      case 'resuelto':
        return (
          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Resuelto
          </Badge>
        );
      case 'cancelado':
        return (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    const option = SEVERITY_OPTIONS.find((o) => o.value === severity);
    return <Badge className={option?.color}>{option?.label}</Badge>;
  };

  const IncidentCard = ({ incident }: { incident: Incident }) => (
    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {getStatusBadge(incident.status)}
              {getSeverityBadge(incident.severity)}
              <Badge variant="outline" className="text-xs">
                {INCIDENT_TYPES[incident.type]}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{incident.projectTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reportado por: {incident.reporterName}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(incident.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {incident.location}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(incident)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Ver Detalles
            </Button>
          </div>
        </div>
      </CardHeader>

      {(incident.adminNotes || incident.resolutionNotes) && (
        <CardContent className="pt-0">
          <div className="p-3 bg-muted rounded-lg space-y-2">
            {incident.adminNotes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Notas del administrador:
                </p>
                <p className="text-sm">{incident.adminNotes}</p>
              </div>
            )}
            {incident.resolutionNotes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Resolución:
                </p>
                <p className="text-sm">{incident.resolutionNotes}</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPage="Gestión de Incidencias"
      />

      <div className="flex flex-1">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Gestión de Incidencias
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Monitorea y gestiona las incidencias reportadas en proyectos
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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
                  {stats.pendiente}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    En Seguimiento
                  </CardTitle>
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stats.en_seguimiento}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resueltas
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stats.resuelto}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Canceladas
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {stats.cancelado}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-200">
                    Alta Prioridad
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-orange-200">
                  {stats.alta}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs con incidencias */}
          <Tabs defaultValue="pendiente" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="pendiente">Pendientes ({stats.pendiente})</TabsTrigger>
              <TabsTrigger value="en_seguimiento">
                En Seguimiento ({stats.en_seguimiento})
              </TabsTrigger>
              <TabsTrigger value="resuelto">Resueltas ({stats.resuelto})</TabsTrigger>
              <TabsTrigger value="cancelado">Canceladas ({stats.cancelado})</TabsTrigger>
            </TabsList>

            <TabsContent value="pendiente" className="space-y-4">
              {incidents.filter((i) => i.status === 'pendiente').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay incidencias pendientes
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Las nuevas incidencias aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                incidents
                  .filter((i) => i.status === 'pendiente')
                  .map((incident) => <IncidentCard key={incident.id} incident={incident} />)
              )}
            </TabsContent>

            <TabsContent value="en_seguimiento" className="space-y-4">
              {incidents.filter((i) => i.status === 'en_seguimiento').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay incidencias en seguimiento
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                incidents
                  .filter((i) => i.status === 'en_seguimiento')
                  .map((incident) => <IncidentCard key={incident.id} incident={incident} />)
              )}
            </TabsContent>

            <TabsContent value="resuelto" className="space-y-4">
              {incidents.filter((i) => i.status === 'resuelto').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay incidencias resueltas
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                incidents
                  .filter((i) => i.status === 'resuelto')
                  .map((incident) => <IncidentCard key={incident.id} incident={incident} />)
              )}
            </TabsContent>

            <TabsContent value="cancelado" className="space-y-4">
              {incidents.filter((i) => i.status === 'cancelado').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay incidencias canceladas
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                incidents
                  .filter((i) => i.status === 'cancelado')
                  .map((incident) => <IncidentCard key={incident.id} incident={incident} />)
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Dialog de detalles */}
      {selectedIncident && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Detalles de la Incidencia
              </DialogTitle>
              <DialogDescription>Información completa del reporte</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Estado y severidad */}
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(selectedIncident.status)}
                {getSeverityBadge(selectedIncident.severity)}
                <Badge variant="outline">{INCIDENT_TYPES[selectedIncident.type]}</Badge>
              </div>

              {/* Evidencia */}
              {selectedIncident.evidence && (
                <div>
                  <Label>Evidencia Fotográfica</Label>
                  <img
                    src={selectedIncident.evidence}
                    alt="Evidencia"
                    className="w-full h-48 object-cover rounded-lg mt-2"
                  />
                </div>
              )}

              {/* Información del incidente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha y Hora
                  </Label>
                  <p className="text-sm">
                    {new Date(selectedIncident.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div>
                  <Label className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Ubicación
                  </Label>
                  <p className="text-sm">{selectedIncident.location}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Proyecto</Label>
                <p className="text-sm font-semibold">{selectedIncident.projectTitle}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Reportado por</Label>
                <p className="text-sm">
                  {selectedIncident.reporterName} ({selectedIncident.reporterEmail})
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">Descripción</Label>
                <p className="text-sm">{selectedIncident.description}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Personas Involucradas</Label>
                <p className="text-sm">{selectedIncident.peopleInvolved}</p>
              </div>

              {selectedIncident.reviewedBy && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Revisado por {selectedIncident.reviewedBy} el{' '}
                    {new Date(selectedIncident.reviewedDate!).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              {selectedIncident.status !== 'resuelto' && selectedIncident.status !== 'cancelado' && (
                <Button
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setShowStatusDialog(true);
                  }}
                >
                  Cambiar Estado
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para cambiar estado */}
      {selectedIncident && (
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Actualizar Estado de Incidencia</DialogTitle>
              <DialogDescription>
                Cambia el estado de seguimiento de esta incidencia
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nuevo Estado</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as IncidentStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_seguimiento">En Seguimiento</SelectItem>
                    <SelectItem value="resuelto">Resuelto</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Notas del Administrador (opcional)</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Comentarios adicionales sobre el caso..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {newStatus === 'resuelto' && (
                <div className="space-y-2">
                  <Label htmlFor="resolution-notes">Notas de Resolución *</Label>
                  <Textarea
                    id="resolution-notes"
                    placeholder="Describe cómo se resolvió el incidente..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusDialog(false);
                  setAdminNotes('');
                  setResolutionNotes('');
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleChangeStatus}>Actualizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default IncidentManagement;
