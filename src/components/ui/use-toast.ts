// Simplified toast implementation
import { useState } from 'react';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

// Create a simple toast function for direct import
export const toast = (props: ToastProps) => {
  console.log('Toast:', props);
  // In a real implementation, this would show a toast notification
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props]);
    // In a real implementation, we would also handle removing toasts after a timeout
  };

  return { toast: showToast, toasts };
} 