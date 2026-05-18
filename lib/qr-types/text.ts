/**
 * Text QR Type Handler
 *
 * Encodes plain text data directly into QR code
 * No special format — the raw text is used as-is
 */

import type { TextQRData, ValidationResult } from "../../types/qr.types";
import { ValidationErrorCode } from "../../types/qr.types";

/** Maximum characters for QR code with High error correction */
const MAX_QR_TEXT_LENGTH = 2953;

/**
 * Encode plain text data
 */
export function encodeTextQR(data: TextQRData): string {
  if (!data.text) throw new Error("Text is required");
  return data.text;
}

/**
 * Validate text QR data
 */
export function validateTextQR(data: TextQRData): ValidationResult {
  const errors = [];

  if (!data.text || data.text.trim().length === 0) {
    errors.push({
      field: "text",
      message: "Text is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (data.text.length > MAX_QR_TEXT_LENGTH) {
    errors.push({
      field: "text",
      message: `Text too long. Maximum ${MAX_QR_TEXT_LENGTH} characters.`,
      code: ValidationErrorCode.TOO_LONG,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
