"use client";
import * as React from "react";
import { cn } from "@/lib/utils"; // Helper function for conditional class names

// Define the structure of the toast
interface ToastProps {
  title: string;
  description: string;
  status?: "success" | "error" | "info";
}

// Define the type for the context
interface ToastContextType {
  addToast: (toast: ToastProps) => void;
}

// Create the ToastContext with the proper type (initially undefined)
export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

// Custom hook to use the ToastContext
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// ToastProvider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastList, setToastList] = React.useState<ToastProps[]>([]);

  const addToast = (toast: ToastProps) => {
    setToastList((prev) => [...prev, toast]);
    setTimeout(() => {
      setToastList((prev) => prev.slice(1)); // Remove after a few seconds
    }, 3000); // Display time for 3 seconds
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toastList.map((toast, index) => (
          <div
            key={index}
            className={cn(
              "px-4 py-2 rounded-md text-white",
              toast.status === "success" ? "bg-green-600" : "",
              toast.status === "error" ? "bg-red-600" : "",
              toast.status === "info" ? "bg-blue-600" : ""
            )}
          >
            <strong>{toast.title}</strong>
            <p>{toast.description}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
