import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { Star, Send, Loader2, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectTitle: string;
}

export const ProjectFeedbackDialog = ({
  open,
  onOpenChange,
  projectId,
  projectTitle,
}: ProjectFeedbackDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { submitProjectFeedback } = useProjectContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    overallSatisfaction: 0,
    organization: 0,
    communication: 0,
    communityImpact: 0,
    wouldRecommend: null as boolean | null,
    bestAspect: '',
    improvements: '',
    additionalComments: '',
    allowAnonymous: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRatingChange = (field: string, rating: number) => {
    setFormData((prev) => ({ ...prev, [field]: rating }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.overallSatisfaction === 0) {
      newErrors.overallSatisfaction = 'Debes calificar la satisfacción general';
    }
    if (formData.organization === 0) {
      newErrors.organization = 'Debes calificar la organización';
    }
    if (formData.communication === 0) {
      newErrors.communication = 'Debes calificar la comunicación';
    }
    if (formData.communityImpact === 0) {
      newErrors.communityImpact = 'Debes calificar el impacto';
    }
    if (formData.wouldRecommend === null) {
      newErrors.wouldRecommend = 'Debes indicar si lo recomendarías';
    }
    if (!formData.bestAspect || formData.bestAspect.length < 30) {
      newErrors.bestAspect = 'Describe lo mejor del proyecto (mínimo 30 caracteres)';
    }
    if (!formData.improvements || formData.improvements.length < 30) {
      newErrors.improvements = 'Describe qué se podría mejorar (mínimo 30 caracteres)';
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

      submitProjectFeedback({
        userId: user?.email!,
        projectId,
        overallSatisfaction: formData.overallSatisfaction,
        organization: formData.organization,
        communication: formData.communication,
        communityImpact: formData.communityImpact,
        wouldRecommend: formData.wouldRecommend!,
        bestAspect: formData.bestAspect,
        improvements: formData.improvements,
        additionalComments: formData.additionalComments || undefined,
        allowAnonymous: formData.allowAnonymous,
        submittedDate: new Date().toISOString(),
      });

      toast({
        title: '¡Gracias por tu feedback!',
        description: 'Tu evaluación nos ayudará a mejorar futuros proyectos',
        className: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error al enviar',
        description: 'No se pudo enviar la evaluación. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) => (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={cn(
              'transition-colors hover:scale-110',
              error && 'animate-pulse'
            )}
            disabled={isSubmitting}
          >
            <Star
              className={cn(
                'h-8 w-8',
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              )}
            />
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Evalúa tu experiencia en:</DialogTitle>
          <DialogDescription className="text-base font-medium">
            {projectTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Satisfacción general */}
          <div className="space-y-2">
            <Label className="text-base">
              Satisfacción general <span className="text-destructive">*</span>
            </Label>
            <StarRating
              value={formData.overallSatisfaction}
              onChange={(v) => handleRatingChange('overallSatisfaction', v)}
              error={errors.overallSatisfaction}
            />
          </div>

          {/* Organización */}
          <div className="space-y-2">
            <Label className="text-base">
              Organización del proyecto <span className="text-destructive">*</span>
            </Label>
            <StarRating
              value={formData.organization}
              onChange={(v) => handleRatingChange('organization', v)}
              error={errors.organization}
            />
          </div>

          {/* Comunicación */}
          <div className="space-y-2">
            <Label className="text-base">
              Comunicación con coordinadores <span className="text-destructive">*</span>
            </Label>
            <StarRating
              value={formData.communication}
              onChange={(v) => handleRatingChange('communication', v)}
              error={errors.communication}
            />
          </div>

          {/* Impacto */}
          <div className="space-y-2">
            <Label className="text-base">
              Impacto percibido en la comunidad <span className="text-destructive">*</span>
            </Label>
            <StarRating
              value={formData.communityImpact}
              onChange={(v) => handleRatingChange('communityImpact', v)}
              error={errors.communityImpact}
            />
          </div>

          {/* ¿Lo recomendarías? */}
          <div className="space-y-3">
            <Label className="text-base">
              ¿Lo recomendarías a otros voluntarios? <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={formData.wouldRecommend === true ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handleInputChange('wouldRecommend', true)}
                disabled={isSubmitting}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Sí
              </Button>
              <Button
                type="button"
                variant={formData.wouldRecommend === false ? 'destructive' : 'outline'}
                className="flex-1"
                onClick={() => handleInputChange('wouldRecommend', false)}
                disabled={isSubmitting}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                No
              </Button>
            </div>
            {errors.wouldRecommend && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.wouldRecommend}
              </p>
            )}
          </div>

          {/* Lo mejor */}
          <div className="space-y-2">
            <Label htmlFor="bestAspect" className="text-base">
              ¿Qué fue lo mejor del proyecto? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="bestAspect"
              value={formData.bestAspect}
              onChange={(e) => handleInputChange('bestAspect', e.target.value)}
              placeholder="Describe lo que más te gustó de la experiencia..."
              rows={4}
              className={errors.bestAspect ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formData.bestAspect.length} / 30 caracteres mínimo</span>
            </div>
            {errors.bestAspect && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.bestAspect}
              </p>
            )}
          </div>

          {/* Mejoras */}
          <div className="space-y-2">
            <Label htmlFor="improvements" className="text-base">
              ¿Qué se podría mejorar? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="improvements"
              value={formData.improvements}
              onChange={(e) => handleInputChange('improvements', e.target.value)}
              placeholder="Comparte tus sugerencias constructivas..."
              rows={4}
              className={errors.improvements ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formData.improvements.length} / 30 caracteres mínimo</span>
            </div>
            {errors.improvements && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.improvements}
              </p>
            )}
          </div>

          {/* Comentarios adicionales */}
          <div className="space-y-2">
            <Label htmlFor="additionalComments" className="text-base">
              Comentarios adicionales (opcional)
            </Label>
            <Textarea
              id="additionalComments"
              value={formData.additionalComments}
              onChange={(e) => handleInputChange('additionalComments', e.target.value)}
              placeholder="¿Algo más que quieras compartir?"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Checkbox anónimo */}
          <div className="flex items-center space-x-2 p-4 rounded-lg bg-muted">
            <Checkbox
              id="allowAnonymous"
              checked={formData.allowAnonymous}
              onCheckedChange={(checked) => handleInputChange('allowAnonymous', checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="allowAnonymous" className="text-sm cursor-pointer">
              Permitir publicar mi comentario de forma anónima en las estadísticas del proyecto
            </Label>
          </div>

          {/* Información */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Tu feedback es valioso y nos ayuda a mejorar. Solo puedes evaluar cada proyecto una vez.
            </AlertDescription>
          </Alert>

          {/* Botón de envío */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando evaluación...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Evaluación
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
