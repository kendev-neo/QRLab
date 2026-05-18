"use client";
import React from "react";
import { useToast } from "./ToastProvider";

/**
 * Demo component to test toast notifications
 * This can be temporarily added to the page for testing
 */
const ToastDemo: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 p-4 bg-white rounded-2xl shadow-lg border border-lavender/40">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft mb-2">
        Toast Demo
      </p>
      <button
        onClick={() => showToast("QR code generated successfully!", "success")}
        className="px-3 py-2 text-xs font-semibold rounded-xl bg-mint text-white hover:bg-mint-deep transition"
      >
        Success Toast
      </button>
      <button
        onClick={() => showToast("Failed to generate QR code", "error")}
        className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose text-white hover:bg-rose/90 transition"
      >
        Error Toast
      </button>
      <button
        onClick={() => showToast("Please check your input fields", "warning")}
        className="px-3 py-2 text-xs font-semibold rounded-xl bg-peach text-white hover:bg-peach-deep transition"
      >
        Warning Toast
      </button>
      <button
        onClick={() => showToast("QR code saved to history", "info")}
        className="px-3 py-2 text-xs font-semibold rounded-xl bg-lavender text-white hover:bg-lavender/90 transition"
      >
        Info Toast
      </button>
      <button
        onClick={() => {
          showToast("First notification", "success");
          setTimeout(() => showToast("Second notification", "info"), 500);
          setTimeout(() => showToast("Third notification", "warning"), 1000);
        }}
        className="px-3 py-2 text-xs font-semibold rounded-xl bg-ink text-white hover:bg-ink-soft transition"
      >
        Multiple Toasts
      </button>
    </div>
  );
};

export default ToastDemo;
