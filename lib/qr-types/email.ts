/**
 * Email QR Type Handler
 *
 * Encoding and validation for Email QR codes
 * Format: mailto:email@example.com?subject=Hello&body=Message
 */

import type { EmailQRData, ValidationResult } from "@/types";
import { ValidationErrorCode } from "@/types";
import { isValidEmail } from "@/lib/utils/validation";

/**
 * Encode email to mailto format
 */
export function encodeEmailQR(data: EmailQRData): string {
  const { to, subject, body } = data;

  if (!to || !isValidEmail(to)) {
    throw new Error("Valid email address is required");
  }

  const params = new URLSearchParams();
  if (subject) params.append("subject", subject);
  if (body) params.append("body", body);

  const queryString = params.toString();
  return `mailto:${to}${queryString ? `?${queryString}` : ""}`;
}

/**
 * Validate email QR data
 */
export function validateEmailQR(data: EmailQRData): ValidationResult {
  const errors = [];

  if (!data || !data.to) {
    errors.push({
      field: "to",
      message: "Email address is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (!isValidEmail(data.to)) {
    errors.push({
      field: "to",
      message: "Invalid email format",
      code: ValidationErrorCode.INVALID_EMAIL,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
