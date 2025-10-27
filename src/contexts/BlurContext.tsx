import { createContext, useContext, useState, ReactNode } from "react";

interface BlurContextType {
  isBlurActive: boolean;
  toggleBlur: () => void;
}

const BlurContext = createContext<BlurContextType | undefined>(undefined);

export function BlurProvider({ children }: { children: ReactNode }) {
  const [isBlurActive, setIsBlurActive] = useState(() => {
    // Carregar do localStorage
    const saved = localStorage.getItem('blurActive');
    return saved === 'true';
  });

  const toggleBlur = () => {
    const newValue = !isBlurActive;
    setIsBlurActive(newValue);
    localStorage.setItem('blurActive', String(newValue));
  };

  return (
    <BlurContext.Provider value={{ isBlurActive, toggleBlur }}>
      {children}
    </BlurContext.Provider>
  );
}

export function useBlur() {
  const context = useContext(BlurContext);
  if (context === undefined) {
    throw new Error('useBlur deve ser usado dentro de BlurProvider');
  }
  return context;
}

