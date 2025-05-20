
// Re-export from components/ui/toast
import { useToast as useToastUI, type ToastActionElement } from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export const useToast = useToastUI;

export const toast = useToastUI().toast;
