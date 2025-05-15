
import { toast as sonnerToast, type ToastT } from "sonner";

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

    return sonnerToast(title || description, {
      description: title ? description : undefined,
      style,
      ...props,
    });
  };

  return { toast };
};

// Export both the custom hook and a simplified toast function
export { useToast };

// Export a simplified toast function that can be imported directly
export const toast = (props: ToastProps): ToastT => {
  const style = props.variant === "destructive" 
    ? { backgroundColor: "#fee2e2", color: "#dc2626", borderColor: "#f87171" } 
    : {};

  return sonnerToast(props.title || props.description, {
    description: props.title ? props.description : undefined,
    style,
    ...props,
  });
};
