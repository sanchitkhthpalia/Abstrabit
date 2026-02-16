"use client";

import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "text-sm",
        style: {
          background: "#020617",
          color: "#e2e8f0",
          border: "1px solid rgba(148, 163, 184, 0.35)"
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#020617"
          }
        },
        error: {
          iconTheme: {
            primary: "#f97373",
            secondary: "#020617"
          }
        }
      }}
    />
  );
};

