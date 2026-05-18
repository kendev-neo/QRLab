/**
 * Validation Utilities
 *
 * Functions for validating QR data and user inputs
 */

import type {
  ValidationResult,
  ValidationError,
  ValidationErrorCode,
  WebsiteQRData,
  EmailQRData,
  PhoneQRData,
  SMSQRData,
  WhatsAppQRData,
  WiFiQRData,
} from "@/types";
import { LIMITS } from "@/lib/constants";

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  // Basic validation: at least 7 digits
  const cleaned = phone.replace(/[^\d]/g, "");
  return cleaned.length >= 7 && cleaned.length <= 15;
}

/**
 * Clean phone number (remove spaces, dashes, etc.)
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Validate QR data length
 */
export function validateQRLength(data: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (data.length > LIMITS.MAX_TEXT_LENGTH) {
    errors.push({
      field: "data",
      message: `Data too long. Maximum ${LIMITS.MAX_TEXT_LENGTH} characters.`,
      code: "TOO_LONG" as ValidationErrorCode,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Website QR data
 */
export function validateWebsiteQR(data: WebsiteQRData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || !data.url) {
    errors.push({
      field: "url",
      message: "URL is required",
      code: "REQUIRED" as ValidationErrorCode,
    });
  } else if (!isValidURL(data.url)) {
    errors.push({
      field: "url",
      message: "Invalid URL format",
      code: "INVALID_URL" as ValidationErrorCode,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Email QR data
 */
export function validateEmailQR(data: EmailQRData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || !data.to) {
    errors.push({
      field: "to",
      message: "Email address is required",
      code: "REQUIRED" as ValidationErrorCode,
    });
  } else if (!isValidEmail(data.to)) {
    errors.push({
      field: "to",
      message: "Invalid email format",
      code: "INVALID_EMAIL" as ValidationErrorCode,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Phone QR data
 */
export function validatePhoneQR(data: PhoneQRData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || !data.phone) {
    errors.push({
      field: "phone",
      message: "Phone number is required",
      code: "REQUIRED" as ValidationErrorCode,
    });
  } else if (!isValidPhone(data.phone)) {
    errors.push({
      field: "phone",
      message: "Invalid phone number",
      code: "INVALID_PHONE" as ValidationErrorCode,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate SMS QR data
 */
export function validateSMSQR(data: SMSQRData): ValidationResult {
  return validatePhoneQR({ phone: data.phone });
}

/**
 * Validate WhatsApp QR data
 */
export function validateWhatsAppQR(data: WhatsAppQRData): ValidationResult {
  return validatePhoneQR({ phone: data.phone });
}

/**
 * Validate Wi-Fi QR data
 */
export function validateWiFiQR(data: WiFiQRData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || !data.ssid) {
    errors.push({
      field: "ssid",
      message: "Network name (SSID) is required",
      code: "REQUIRED" as ValidationErrorCode,
    });
  }

  if (data.encryption !== "nopass" && !data.password) {
    errors.push({
      field: "password",
      message: "Password is required for encrypted networks",
      code: "REQUIRED" as ValidationErrorCode,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  maxSize: number,
  allowedTypes: string[],
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push({
      field: "file",
      message: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
      code: "INVALID_FORMAT" as ValidationErrorCode,
    });
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    errors.push({
      field: "file",
      message: `File too large. Maximum size is ${maxSizeMB}MB.`,
      code: "TOO_LONG" as ValidationErrorCode,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
