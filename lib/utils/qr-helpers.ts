/**
 * QR Helper Utilities
 *
 * Helper functions for QR code generation and manipulation
 */

import type { DotStyle, EyeStyle } from "@/types";

/**
 * Map dot style to qr-code-styling format
 */
export const DOT_STYLE_MAP: Record<DotStyle, string> = {
  rounded: "rounded",
  square: "square",
  dots: "dots",
  classic: "square",
  soft: "extra-rounded",
  pillow: "classy-rounded",
};

/**
 * Map eye style to qr-code-styling format
 */
export const EYE_STYLE_MAP: Record<EyeStyle, string> = {
  soft: "extra-rounded",
  square: "square",
  round: "dot",
  pillow: "dot",
  classy: "square",
  dot: "dot",
};

/**
 * Calculate QR size based on resolution
 */
export function calculateQRSize(resolution: number): number {
  if (resolution <= 512) return 300;
  if (resolution <= 1024) return 350;
  if (resolution <= 2048) return 450;
  return 600;
}

/**
 * Map dot style to library format
 */
export function mapDotStyle(style: DotStyle): string {
  return DOT_STYLE_MAP[style] || "rounded";
}

/**
 * Map eye style to library format
 */
export function mapEyeStyle(style: EyeStyle): string {
  return EYE_STYLE_MAP[style] || "extra-rounded";
}

/**
 * Generate UUID
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Read file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Format date for filename
 */
export function formatDateForFilename(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

/**
 * Generate filename for QR download
 */
export function generateQRFilename(
  type: string,
  format: string,
  includeTimestamp: boolean = true,
): string {
  const baseFilename = `qrcode_${type.toLowerCase().replace(/\s+/g, "_")}`;

  if (includeTimestamp) {
    const timestamp = formatDateForFilename();
    return `${baseFilename}_${timestamp}.${format}`;
  }

  return `${baseFilename}.${format}`;
}
