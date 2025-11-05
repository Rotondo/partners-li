import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function MobileMenuButton({ onClick, isOpen }: MobileMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-40"
      onClick={onClick}
      aria-controls="app-sidebar"
      aria-expanded={isOpen}
      aria-label="Abrir menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}
