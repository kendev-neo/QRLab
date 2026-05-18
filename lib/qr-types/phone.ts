/**
 * Phone QR Type Handler
 *
 * Encoding and validation for Phone QR codes
 * Format: tel:+1234567890
 */

import type { PhoneQRData, ValidationResult } from "@/types";
import { ValidationErrorCode } from "@/types";
import { isValidPhone, cleanPhoneNumber } from "@/lib/utils/validation";

/**
 * Encode phone to tel format
 */
export function encodePhoneQR(data: PhoneQRData): string {
  const { phone } = data;

  if (!phone) throw new Error("Phone number is required");

  const cleanPhone = cleanPhoneNumber(phone);
  return `tel:${cleanPhone}`;
}

/**
 * Validate phone QR data
 */
export function validatePhoneQR(data: PhoneQRData): ValidationResult {
  const errors = [];

  if (!data || !data.phone) {
    errors.push({
      field: "phone",
      message: "Phone number is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (!isValidPhone(data.phone)) {
    errors.push({
      field: "phone",
      message: "Invalid phone number",
      code: ValidationErrorCode.INVALID_PHONE,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
