/**
 * Website QR Type Handler
 *
 * Encoding and validation for Website/URL QR codes
 */

import type { WebsiteQRData, ValidationResult } from "@/types";
import { ValidationErrorCode } from "@/types";
import { isValidURL } from "@/lib/utils/validation";

/**
 * Encode website URL to QR format
 */
export function encodeWebsiteQR(data: WebsiteQRData): string {
  // Validate URL
  if (!isValidURL(data.url)) {
    throw new Error("Invalid URL format");
  }

  // Ensure protocol
  let url = data.url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  return url;
}

/**
 * Validate website QR data
 */
export function validateWebsiteQR(data: WebsiteQRData): ValidationResult {
  const errors = [];

  if (!data || !data.url) {
    errors.push({
      field: "url",
      message: "URL is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (!isValidURL(data.url)) {
    errors.push({
      field: "url",
      message: "Invalid URL format",
      code: ValidationErrorCode.INVALID_URL,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
