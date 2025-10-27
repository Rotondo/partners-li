import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBlur } from "@/contexts/BlurContext";

export function BlurToggle() {
  const { isBlurActive, toggleBlur } = useBlur();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleBlur}
            className="fixed top-4 right-4 z-50 bg-background shadow-lg hover:bg-accent"
          >
            {isBlurActive ? (
              <EyeOff className="h-5 w-5 text-destructive" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-sm">
            {isBlurActive 
              ? "Clicar para mostrar dados sensíveis" 
              : "Clicar para ocultar dados sensíveis"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

