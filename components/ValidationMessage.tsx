"use client";
import React from "react";

export interface ValidationMessageProps {
  message: string;
  visible: boolean;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  visible,
}) => {
  if (!visible || !message) return null;

  return (
    <div
      className="flex items-start gap-2 mt-1.5 animate-fade-in"
      role="alert"
      aria-live="polite"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0 text-rose mt-0.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="text-xs text-rose leading-relaxed">{message}</p>
    </div>
  );
};

export default ValidationMessage;
