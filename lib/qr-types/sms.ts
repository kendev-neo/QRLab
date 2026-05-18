/**
 * SMS QR Type Handler
 *
 * Encodes SMS data to sms: URI format
 * Format: sms:+1234567890?body=Hello
 */

import type { SMSQRData, ValidationResult } from "../../types/qr.types";
import { ValidationErrorCode } from "../../types/qr.types";

/**
 * Clean phone number — keep only digits and leading +
 */
function cleanPhoneNumber(phone: string): string {
  const hasPlus = phone.trimStart().startsWith("+");
  const digits = phone.replace(/[^\d]/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Encode SMS data to sms: URI
 */
export function encodeSMSQR(data: SMSQRData): string {
  const { phone, message } = data;

  if (!phone) throw new Error("Phone number is required");

  const cleanPhone = cleanPhoneNumber(phone);

  if (message) {
    return `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
  }

  return `sms:${cleanPhone}`;
}

/**
 * Validate SMS QR data
 */
export function validateSMSQR(data: SMSQRData): ValidationResult {
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

  if (data.message && data.message.length > 160) {
    errors.push({
      field: "message",
      message: "Message should not exceed 160 characters",
      code: ValidationErrorCode.TOO_LONG,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
