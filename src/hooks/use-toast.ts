
import { toast as sonnerToast, Toast, ToastOptions } from "sonner";

type ToastProps = ToastOptions & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

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

export { useToast, sonnerToast as toast };
