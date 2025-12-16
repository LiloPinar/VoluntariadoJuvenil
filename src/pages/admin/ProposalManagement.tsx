import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Lightbulb,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Users,
  MapPin,
  Calendar,
  Target,
  Info,
  AlertCircle,
  Heart,
  Leaf,
  GraduationCap,
} from 'lucide-react';
import type { ProjectProposal, ProposalStatus } from '@/pages/PropuestaProyecto';

const STORAGE_KEY = 'voluntariajoven_proposals';

const ProposalManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ProjectProposal | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showNeedsInfoDialog, setShowNeedsInfoDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

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

  // Cargar propuestas desde localStorage
  useEffect(() => {
    const loadProposals = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProposals(parsed);
        } catch (error) {
          console.error('Error loading proposals:', error);
          setProposals([]);
        }
      }
    };

    loadProposals();
  }, []);

  // Guardar propuestas en localStorage
  const saveProposals = (updatedProposals: ProjectProposal[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProposals));
    setProposals(updatedProposals);
  };

  // Estadísticas
  const submittedCount = proposals.filter((p) => p.status === 'submitted' || p.status === 'in_review').length;
  const approvedCount = proposals.filter((p) => p.status === 'approved').length;
  const rejectedCount = proposals.filter((p) => p.status === 'rejected').length;
  const needsInfoCount = proposals.filter((p) => p.status === 'needs_info').length;

  const handleViewDetails = (proposal: ProjectProposal) => {
    setSelectedProposal(proposal);
    setShowDetailsDialog(true);
  };

  const handleApprove = () => {
    if (!selectedProposal) return;

    const updatedProposals = proposals.map((p) =>
      p.id === selectedProposal.id
        ? {
            ...p,
            status: 'approved' as ProposalStatus,
            reviewedDate: new Date().toISOString(),
            reviewedBy: user?.email,
            reviewNotes,
          }
        : p
    );

    saveProposals(updatedProposals);
    setShowApproveDialog(false);
    setShowDetailsDialog(false);
    setReviewNotes('');

    toast({
      title: 'Propuesta aprobada',
      description: 'La propuesta ha sido aprobada exitosamente.',
      className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    });
  };

  const handleReject = () => {
    if (!selectedProposal || !reviewNotes.trim()) {
      toast({
        title: 'Error',
        description: 'Debes proporcionar un motivo de rechazo.',
        variant: 'destructive',
      });
      return;
    }

    const updatedProposals = proposals.map((p) =>
      p.id === selectedProposal.id
        ? {
            ...p,
            status: 'rejected' as ProposalStatus,
            reviewedDate: new Date().toISOString(),
            reviewedBy: user?.email,
            reviewNotes,
          }
        : p
    );

    saveProposals(updatedProposals);
    setShowRejectDialog(false);
    setShowDetailsDialog(false);
    setReviewNotes('');

    toast({
      title: 'Propuesta rechazada',
      description: 'La propuesta ha sido rechazada.',
      variant: 'destructive',
    });
  };

  const handleNeedsInfo = () => {
    if (!selectedProposal || !reviewNotes.trim()) {
      toast({
        title: 'Error',
        description: 'Debes especificar qué información adicional se necesita.',
        variant: 'destructive',
      });
      return;
    }

    const updatedProposals = proposals.map((p) =>
      p.id === selectedProposal.id
        ? {
            ...p,
            status: 'needs_info' as ProposalStatus,
            reviewedDate: new Date().toISOString(),
            reviewedBy: user?.email,
            reviewNotes,
          }
        : p
    );

    saveProposals(updatedProposals);
    setShowNeedsInfoDialog(false);
    setShowDetailsDialog(false);
    setReviewNotes('');

    toast({
      title: 'Solicitud enviada',
      description: 'Se ha solicitado información adicional al usuario.',
    });
  };

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'submitted':
      case 'in_review':
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
            Aprobada
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazada
          </Badge>
        );
      case 'needs_info':
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            <Info className="h-3 w-3 mr-1" />
            Requiere Info
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social':
        return <Heart className="h-4 w-4 text-pink-600" />;
      case 'environmental':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'educational':
        return <GraduationCap className="h-4 w-4 text-blue-600" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const ProposalCard = ({ proposal }: { proposal: ProjectProposal }) => (
    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(proposal.status)}
              <Badge variant="outline" className="text-xs">
                {getCategoryIcon(proposal.category)}
                <span className="ml-1">
                  {proposal.category === 'social'
                    ? 'Social'
                    : proposal.category === 'environmental'
                    ? 'Ambiental'
                    : 'Educativo'}
                </span>
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{proposal.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Propuesto por: {proposal.userName} ({proposal.userEmail})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Fecha: {new Date(proposal.submittedDate).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(proposal)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Ver Detalles
            </Button>
          </div>
        </div>
      </CardHeader>

      {proposal.reviewNotes && (
        <CardContent className="pt-0">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notas de revisión:</p>
            <p className="text-sm">{proposal.reviewNotes}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPage="Gestión de Propuestas"
      />

      <div className="flex flex-1">
        <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  Gestión de Propuestas
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Revisa y gestiona las propuestas de proyectos de voluntarios
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
                  {submittedCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Por revisar</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Aprobadas
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {approvedCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Proyectos activos</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Rechazadas
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {rejectedCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">No aprobadas</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Requieren Info
                  </CardTitle>
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {needsInfoCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Más información</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs con propuestas */}
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">
                Pendientes ({submittedCount})
              </TabsTrigger>
              <TabsTrigger value="approved">Aprobadas ({approvedCount})</TabsTrigger>
              <TabsTrigger value="rejected">Rechazadas ({rejectedCount})</TabsTrigger>
              <TabsTrigger value="needs_info">
                Requieren Info ({needsInfoCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {proposals.filter((p) => p.status === 'submitted' || p.status === 'in_review')
                .length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay propuestas pendientes
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Las nuevas propuestas aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                proposals
                  .filter((p) => p.status === 'submitted' || p.status === 'in_review')
                  .map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />)
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {proposals.filter((p) => p.status === 'approved').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay propuestas aprobadas
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                proposals
                  .filter((p) => p.status === 'approved')
                  .map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />)
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {proposals.filter((p) => p.status === 'rejected').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay propuestas rechazadas
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                proposals
                  .filter((p) => p.status === 'rejected')
                  .map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />)
              )}
            </TabsContent>

            <TabsContent value="needs_info" className="space-y-4">
              {proposals.filter((p) => p.status === 'needs_info').length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No hay propuestas que requieran información
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                proposals
                  .filter((p) => p.status === 'needs_info')
                  .map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} />)
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Dialog de detalles */}
      {selectedProposal && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Detalles de la Propuesta
              </DialogTitle>
              <DialogDescription>
                Revisa la información completa de la propuesta
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Estado */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado actual</p>
                  <div className="mt-1">{getStatusBadge(selectedProposal.status)}</div>
                </div>
                {selectedProposal.reviewedDate && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Revisado por</p>
                    <p className="text-sm">{selectedProposal.reviewedBy}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedProposal.reviewedDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>

              {/* Imagen */}
              {selectedProposal.image && (
                <div>
                  <img
                    src={selectedProposal.image}
                    alt={selectedProposal.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Información básica */}
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Título</Label>
                  <p className="font-semibold">{selectedProposal.title}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Descripción</Label>
                  <p className="text-sm">{selectedProposal.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      Categoría
                    </Label>
                    <p className="text-sm">
                      {selectedProposal.category === 'social'
                        ? 'Social'
                        : selectedProposal.category === 'environmental'
                        ? 'Ambiental'
                        : 'Educativo'}
                    </p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Ubicación
                    </Label>
                    <p className="text-sm">{selectedProposal.location}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Objetivos</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedProposal.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="text-muted-foreground">Público Objetivo</Label>
                  <p className="text-sm">{selectedProposal.targetAudience}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Duración Estimada
                    </Label>
                    <p className="text-sm">{selectedProposal.estimatedDuration}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Voluntarios
                    </Label>
                    <p className="text-sm">{selectedProposal.estimatedVolunteers}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Recursos Necesarios</Label>
                  <p className="text-sm">{selectedProposal.resources}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Horarios Disponibles</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProposal.schedule.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedProposal.additionalInfo && (
                  <div>
                    <Label className="text-muted-foreground">Información Adicional</Label>
                    <p className="text-sm">{selectedProposal.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              {selectedProposal.status === 'submitted' || selectedProposal.status === 'in_review' ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowNeedsInfoDialog(true);
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Más Info
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowRejectDialog(true);
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowApproveDialog(true);
                    }}
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Cerrar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de aprobación */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Aprobar Propuesta
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas aprobar esta propuesta? El proyecto se creará y el
              usuario será notificado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="approve-notes">Notas (opcional)</Label>
            <Textarea
              id="approve-notes"
              placeholder="Comentarios adicionales para el usuario..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReviewNotes('')}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Aprobar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de rechazo */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Rechazar Propuesta
            </DialogTitle>
            <DialogDescription>
              Proporciona un motivo para el rechazo de la propuesta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Motivo del Rechazo *</Label>
            <Textarea
              id="reject-reason"
              placeholder="Explica por qué la propuesta no puede ser aprobada..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setReviewNotes('');
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de solicitar más información */}
      <Dialog open={showNeedsInfoDialog} onOpenChange={setShowNeedsInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Solicitar Más Información
            </DialogTitle>
            <DialogDescription>
              Especifica qué información adicional necesitas del usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="info-request">Información Requerida *</Label>
            <Textarea
              id="info-request"
              placeholder="Describe qué información adicional necesitas para evaluar la propuesta..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNeedsInfoDialog(false);
                setReviewNotes('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleNeedsInfo}>Solicitar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProposalManagement;
