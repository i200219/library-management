"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";

interface ToastProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
  duration?: number;
}

interface ToastState {
  open: boolean;
  props: ToastProps | null;
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void;
  toastWithTitle: (props: ToastProps) => void;
} | null>(null);

const Toaster = () => {
  const [toastState, setToastState] = React.useState<ToastState>({
    open: false,
    props: null,
  });

  const toast = React.useCallback((props: ToastProps) => {
    setToastState({ open: true, props });
  }, []);

  const toastWithTitle = React.useCallback(
    ({ title, description, action, duration = 5000 }: ToastProps) => {
      toast({
        title,
        description,
        action,
        duration,
      });

      if (duration > 0) {
        const timeoutId = setTimeout(() => {
          setToastState({ open: false, props: null });
        }, duration);

        // Return cleanup function
        return () => clearTimeout(timeoutId);
      }
    },
    [toast]
  );

  return React.createElement(
    ToastContext.Provider,
    { value: { toast, toastWithTitle } },
    React.createElement(
      ToastPrimitive.Provider,
      { swipeDirection: "right" },
      React.createElement(
        ToastPrimitive.Root,
        {
          open: toastState.open,
          onOpenChange: (open: boolean) => {
            if (!open) {
              setToastState({ open: false, props: null });
            }
          },
          className: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border bg-white/5 p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-top-0",
          style: {
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        },
        toastState.props && React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "div",
            { className: "flex-1" },
            React.createElement(
              ToastPrimitive.Title,
              { className: "text-sm font-semibold text-white" },
              toastState.props.title
            ),
            toastState.props.description && React.createElement(
              ToastPrimitive.Description,
              { className: "mt-1 text-sm text-gray-300" },
              toastState.props.description
            )
          ),
          toastState.props.action && React.createElement(
            ToastPrimitive.Action,
            {
              altText: "Action",
              className: "-mr-1 flex h-8 items-center justify-center rounded-md bg-white/5 p-0 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50",
            },
            toastState.props.action
          ),
          React.createElement(
            ToastPrimitive.Close,
            {
              className: "absolute right-2 top-2 rounded-md p-1 text-white/50 opacity-0 transition-opacity hover:text-white focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50",
            },
            React.createElement(X, { className: "h-4 w-4" })
          )
        )
      ),
      React.createElement(ToastPrimitive.Viewport, {
        className: "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-16 sm:right-16",
      })
    )
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <Toaster /> component");
  }
  return context;
};

export { Toaster };
