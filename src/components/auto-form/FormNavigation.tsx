
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface FormNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  hasSteps: boolean;
  submitButtonText: string;
  onPrevious: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const FormNavigation = ({
  isFirstStep,
  isLastStep,
  isSubmitting,
  hasSteps,
  submitButtonText,
  onPrevious,
  onNext,
  disabled = false
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between items-center pt-4">
      <div>
        {!isFirstStep && hasSteps && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        )}
      </div>
      
      <div className="flex gap-2">
        {!isLastStep && hasSteps ? (
          <Button
            type="button"
            onClick={onNext}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            Próximo
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting || disabled}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Salvando..." : submitButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};
