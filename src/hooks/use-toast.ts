
import {
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@/components/ui/toast";
import { createContext, useContext, useState, useCallback } from "react";
import React from "react";

export type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

const ToastContext = createContext<{
  toast: (props: ToastProps) => void;
  dismissToast: () => void;
}>({
  toast: () => {},
  dismissToast: () => {},
});

export const ToastContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [toastProps, setToastProps] = useState<ToastProps>({});

  const toast = useCallback((props: ToastProps) => {
    setToastProps(props);
    setOpen(true);
  }, []);

  const dismissToast = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      <ToastProvider>
        <Toast open={open} onOpenChange={setOpen}>
          {toastProps.title && <ToastTitle>{toastProps.title}</ToastTitle>}
          {toastProps.description && (
            <ToastDescription>{toastProps.description}</ToastDescription>
          )}
          {toastProps.action && (
            <ToastAction
              altText="Action"
              onClick={(e) => {
                e.preventDefault();
                if (toastProps.action) {
                  toastProps.action.altText;
                }
              }}
            >
              {toastProps.action}
            </ToastAction>
          )}
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider");
  }
  return context;
};

// Export the toast function directly for convenience
export const toast = (props: ToastProps) => {
  const context = useContext(ToastContext);
  if (!context) {
    console.error("Toast was called outside of ToastContextProvider");
    return;
  }
  context.toast(props);
};
