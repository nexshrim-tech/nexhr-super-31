
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any;
};

/**
 * Custom hook for managing toast notifications with consistent styling
 */
const useToast = () => {
  const toast = ({ title, description, variant = "default", ...props }: ToastProps) => {
    // Adjust styling based on variant
    const style = variant === "destructive" 
      ? { backgroundColor: "#fee2e2", color: "#dc2626", borderColor: "#f87171" } 
      : {};

    return sonnerToast(title, {
      description,
      style,
      ...props,
    });
  };

  return { toast };
};

// Export both the custom hook and the original toast function from sonner
export { useToast, sonnerToast as toast };
