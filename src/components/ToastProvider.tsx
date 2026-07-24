// Copyright (C) 2026 Jonathan Cilley <jonathan.cilley@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  type: "success" | "info" | "error";
  title: string;
  message?: string;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Render Container */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "380px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-fade-in-up"
            style={{
              pointerEvents: "auto",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "rgba(18, 21, 38, 0.95)",
              border: `1px solid ${
                toast.type === "success"
                  ? "rgba(16, 185, 129, 0.4)"
                  : toast.type === "error"
                  ? "rgba(239, 68, 68, 0.4)"
                  : "rgba(99, 102, 241, 0.4)"
              }`,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              backdropFilter: "blur(12px)",
            }}
          >
            {toast.type === "success" && (
              <CheckCircle2 style={{ width: 20, height: 20, color: "var(--success)", flexShrink: 0, marginTop: "2px" }} />
            )}
            {toast.type === "error" && (
              <AlertCircle style={{ width: 20, height: 20, color: "var(--danger)", flexShrink: 0, marginTop: "2px" }} />
            )}
            {toast.type === "info" && (
              <Info style={{ width: 20, height: 20, color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
            )}

            <div style={{ flex: 1 }}>
              <h5 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                {toast.title}
              </h5>
              {toast.message && (
                <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
