"use client";
import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "inline" | "overlay";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md", variant = "inline" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const spinner = (
    <svg
      className={`${sizeClasses[size]} animate-spin text-current`}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="text-white">{spinner}</div>
          <p className="text-sm font-medium text-white">Processing...</p>
        </div>
      </div>
    );
  }

  return <span className="inline-flex items-center justify-center text-current">{spinner}</span>;
};

export default Spinner;
