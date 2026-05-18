/**
 * WhatsApp QR Type Handler
 *
 * Encodes WhatsApp data to wa.me URL format
 * Format: https://wa.me/1234567890?text=Hello
 */

import type { WhatsAppQRData, ValidationResult } from "../../types/qr.types";
import { ValidationErrorCode } from "../../types/qr.types";

/**
 * Encode WhatsApp data to wa.me URL
 */
export function encodeWhatsAppQR(data: WhatsAppQRData): string {
  const { phone, message } = data;

  if (!phone) throw new Error("Phone number is required");

  // Remove all non-digit characters (including +)
  const cleanPhone = phone.replace(/[^\d]/g, "");

  if (message) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  return `https://wa.me/${cleanPhone}`;
}

/**
 * Validate WhatsApp QR data
 */
export function validateWhatsAppQR(data: WhatsAppQRData): ValidationResult {
  const errors = [];

  if (!data.phone) {
    errors.push({
      field: "phone",
      message: "Phone number is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else {
    const cleaned = data.phone.replace(/[^\d]/g, "");
    if (cleaned.length < 7 || cleaned.length > 15) {
      errors.push({
        field: "phone",
        message: "Invalid phone number (7–15 digits)",
        code: ValidationErrorCode.INVALID_PHONE,
      });
    }
  }

  if (data.message && data.message.length > 4096) {
    errors.push({
      field: "message",
      message: "Message too long (max 4096 characters)",
      code: ValidationErrorCode.TOO_LONG,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
