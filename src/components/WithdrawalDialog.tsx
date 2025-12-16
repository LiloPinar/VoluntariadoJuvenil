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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Loader2, AlertCircle, Info } from 'lucide-react';
import {
  WITHDRAWAL_REASONS,
  TRANSITION_OPTIONS,
  WITHDRAWALS_STORAGE_KEY,
  type WithdrawalRequest,
  type WithdrawalReason,
} from '@/types/withdrawals';

interface WithdrawalDialogProps {
  projectId: number;
  projectTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  reason: WithdrawalReason | '';
  reasonDetails: string;
  effectiveDate: string;
  transitionAvailability: string;
  additionalComments: string;
}

interface FormErrors {
  reason?: string;
  reasonDetails?: string;
  effectiveDate?: string;
  transitionAvailability?: string;
}

export const WithdrawalDialog = ({
  projectId,
  projectTitle,
  open,
  onOpenChange,
}: WithdrawalDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    reason: '',
    reasonDetails: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    transitionAvailability: '',
    additionalComments: '',
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.reason) {
      newErrors.reason = 'Selecciona un motivo';
    }

    if (!formData.reasonDetails.trim()) {
      newErrors.reasonDetails = 'Explica el motivo de tu solicitud';
    } else if (formData.reasonDetails.length < 20) {
      newErrors.reasonDetails = 'Proporciona más detalles (mínimo 20 caracteres)';
    } else if (formData.reasonDetails.length > 500) {
      newErrors.reasonDetails = 'Los detalles no pueden exceder 500 caracteres';
    }

    if (!formData.effectiveDate) {
      newErrors.effectiveDate = 'Selecciona la fecha efectiva';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.effectiveDate);
      if (selectedDate < today) {
        newErrors.effectiveDate = 'La fecha no puede ser anterior a hoy';
      }
    }

    if (!formData.transitionAvailability) {
      newErrors.transitionAvailability = 'Indica tu disponibilidad para la transición';
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

      const newWithdrawal: WithdrawalRequest = {
        id: `withdrawal-${Date.now()}`,
        projectId,
        projectTitle,
        volunteerId: user?.id || '',
        volunteerName: user?.fullName || '',
        volunteerEmail: user?.email || '',
        reason: formData.reason as WithdrawalReason,
        reasonDetails: formData.reasonDetails,
        effectiveDate: formData.effectiveDate,
        transitionAvailability: formData.transitionAvailability,
        additionalComments: formData.additionalComments || undefined,
        status: 'pendiente',
        requestDate: new Date().toISOString(),
      };

      // Guardar en localStorage
      const stored = localStorage.getItem(WITHDRAWALS_STORAGE_KEY);
      const withdrawals: WithdrawalRequest[] = stored ? JSON.parse(stored) : [];
      withdrawals.push(newWithdrawal);
      localStorage.setItem(WITHDRAWALS_STORAGE_KEY, JSON.stringify(withdrawals));

      toast({
        title: '¡Solicitud enviada!',
        description: 'Tu solicitud de baja será revisada por el coordinador del proyecto.',
        className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      });

      // Resetear formulario
      setFormData({
        reason: '',
        reasonDetails: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        transitionAvailability: '',
        additionalComments: '',
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar la solicitud. Intenta nuevamente.',
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
            <LogOut className="h-5 w-5 text-orange-600" />
            Solicitar Baja del Proyecto
          </DialogTitle>
          <DialogDescription>
            Proyecto: <strong>{projectTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
            Tu solicitud será revisada por el coordinador. Procura proporcionar información clara
            para facilitar el proceso.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la Baja *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => handleInputChange('reason', value)}
            >
              <SelectTrigger className={errors.reason ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecciona el motivo principal" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(WITHDRAWAL_REASONS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reason && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Detalles del motivo */}
          <div className="space-y-2">
            <Label htmlFor="reasonDetails">Explica tu Situación *</Label>
            <Textarea
              id="reasonDetails"
              placeholder="Describe con detalle las razones de tu solicitud de baja..."
              value={formData.reasonDetails}
              onChange={(e) => handleInputChange('reasonDetails', e.target.value)}
              className={`min-h-[100px] ${errors.reasonDetails ? 'border-destructive' : ''}`}
              maxLength={500}
            />
            {errors.reasonDetails && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.reasonDetails}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {formData.reasonDetails.length}/500
            </p>
          </div>

          {/* Fecha efectiva */}
          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Fecha Efectiva Deseada *</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
              className={errors.effectiveDate ? 'border-destructive' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.effectiveDate && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.effectiveDate}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              A partir de qué fecha deseas que se haga efectiva tu baja
            </p>
          </div>

          {/* Disponibilidad para transición */}
          <div className="space-y-2">
            <Label>Disponibilidad para Transición *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRANSITION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('transitionAvailability', option.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.transitionAvailability === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            {errors.transitionAvailability && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.transitionAvailability}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Indica si puedes ayudar con la transición de tus responsabilidades
            </p>
          </div>

          {/* Comentarios adicionales */}
          <div className="space-y-2">
            <Label htmlFor="additionalComments">Comentarios Adicionales (Opcional)</Label>
            <Textarea
              id="additionalComments"
              placeholder="Información adicional que consideres relevante..."
              value={formData.additionalComments}
              onChange={(e) => handleInputChange('additionalComments', e.target.value)}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.additionalComments.length}/300
            </p>
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
            variant="destructive"
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Enviar Solicitud
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
