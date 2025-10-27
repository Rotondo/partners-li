import { useBlur } from "@/contexts/BlurContext";

/**
 * Hook para aplicar blur em dados sensíveis
 * Retorna uma classe CSS que aplica blur quando ativo
 */
export function useBlurSensitiveData() {
  const { isBlurActive } = useBlur();

  return {
    blurClass: isBlurActive ? 'blur-sensitivity-active' : '',
    isBlurActive,
  };
}

