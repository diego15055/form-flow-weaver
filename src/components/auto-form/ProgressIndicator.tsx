
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

export const ProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  stepTitles 
}: ProgressIndicatorProps) => {
  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Etapa {currentStep + 1} de {totalSteps}
        </span>
        <span className="text-sm font-medium">
          {Math.round(progressValue)}%
        </span>
      </div>
      
      <Progress value={progressValue} className="mb-4" />
      
      {stepTitles && (
        <div className="flex justify-between">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`text-xs ${
                index <= currentStep 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground'
              }`}
            >
              {title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
