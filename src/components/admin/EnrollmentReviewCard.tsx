import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { allProjects } from '@/data/projects';
import { EnrolledProject } from '@/contexts/ProjectContext';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface EnrollmentReviewCardProps {
  enrollment: EnrolledProject;
  onApprove: (projectId: number, userId: string) => void;
  onReject: (projectId: number, userId: string, reason: string) => void;
  readonly?: boolean;
}

export const EnrollmentReviewCard = ({
  enrollment,
  onApprove,
  onReject,
  readonly = false,
}: EnrollmentReviewCardProps) => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ type: string; data: string } | null>(null);

  const project = allProjects.find(p => p.id === enrollment.projectId);
  
  if (!project) return null;

  const handleViewDocument = (type: 'idDocument' | 'signature') => {
    const document = enrollment.data?.documents?.[type];
    if (document) {
      setSelectedDocument({
        type: type === 'idDocument' ? 'Cédula' : 'Firma Electrónica',
        data: document,
      });
      setShowDocumentDialog(true);
    }
  };

  const handleDownloadDocument = (type: 'idDocument' | 'signature') => {
    const doc = enrollment.data?.documents?.[type];
    if (doc) {
      const link = window.document.createElement('a');
      link.href = doc;
      link.download = `${type}-${enrollment.userId}.pdf`;
      link.click();
    }
  };

  const handleApproveClick = () => {
    onApprove(enrollment.projectId, enrollment.userId);
    setShowApproveDialog(false);
  };

  const handleRejectClick = () => {
    if (rejectionReason.trim()) {
      onReject(enrollment.projectId, enrollment.userId, rejectionReason);
      setShowRejectDialog(false);
      setRejectionReason('');
    }
  };

  const getStatusBadge = () => {
    switch (enrollment.status) {
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
    }
  };

  return (
    <>
      <Card className="border-border bg-card hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge()}
                <Badge variant="outline" className="text-xs">
                  {project.category === 'social' ? 'Social' : project.category === 'environmental' ? 'Ambiental' : 'Educativo'}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Solicitante: {enrollment.userId}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Fecha de solicitud: {new Date(enrollment.enrolledDate).toLocaleDateString('es-ES', {
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
                onClick={() => setShowDetailsDialog(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
              {!readonly && enrollment.status === 'pending' && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowApproveDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {enrollment.status === 'rejected' && enrollment.rejectionReason && (
          <CardContent className="pt-0">
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-900 dark:text-red-200">
                    Motivo del rechazo:
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    {enrollment.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Dialog de Detalles */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
            <DialogDescription>
              Información completa del voluntario y su solicitud
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Información del Proyecto */}
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Proyecto
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-foreground"><span className="font-medium">Nombre:</span> {project.title}</p>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </div>

            {/* Información Personal */}
            {enrollment.data && (
              <>
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Información Personal
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{enrollment.data.phone}</span>
                    </div>
                    {enrollment.data.emergencyContact && (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground">Contacto de emergencia</p>
                          <p className="text-foreground">{enrollment.data.emergencyContact}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Teléfono de emergencia</p>
                          <p className="text-foreground">{enrollment.data.emergencyPhone}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Motivación */}
                {enrollment.data.motivation && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Motivación</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {enrollment.data.motivation}
                    </p>
                  </div>
                )}

                {/* Disponibilidad */}
                {enrollment.data.availability && enrollment.data.availability.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Disponibilidad
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {enrollment.data.availability.map((slot) => (
                        <Badge key={slot} variant="secondary" className="text-xs">
                          {slot.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experiencia */}
                {enrollment.data.experience && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Experiencia Previa</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {enrollment.data.experience}
                    </p>
                  </div>
                )}

                {/* Documentos */}
                {enrollment.data.documents && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Documentos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {enrollment.data.documents.idDocument && (
                        <div className="p-3 border border-border rounded-lg bg-card">
                          <p className="text-sm font-medium text-foreground mb-2">Cédula de Identidad</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument('idDocument')}
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadDocument('idDocument')}
                              className="flex-1"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Descargar
                            </Button>
                          </div>
                        </div>
                      )}
                      {enrollment.data.documents.signature && (
                        <div className="p-3 border border-border rounded-lg bg-card">
                          <p className="text-sm font-medium text-foreground mb-2">Firma Electrónica</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDocument('signature')}
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadDocument('signature')}
                              className="flex-1"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Descargar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Documento */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.type}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh] bg-muted rounded-lg flex items-center justify-center">
            {selectedDocument?.data && (
              <iframe
                src={selectedDocument.data}
                className="w-full h-full rounded-lg"
                title={selectedDocument.type}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Aprobación */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Aprobar Solicitud
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas aprobar la solicitud de <strong>{enrollment.userId}</strong> para el proyecto <strong>{project.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveClick}
              className="bg-green-600 hover:bg-green-700"
            >
              Aprobar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Rechazo */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Rechazar Solicitud
            </DialogTitle>
            <DialogDescription>
              Por favor, proporciona un motivo para el rechazo de la solicitud.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Motivo del rechazo *</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explica por qué se rechaza esta solicitud..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px] mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Este mensaje será visible para el voluntario
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectClick}
              disabled={!rejectionReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

