/**
 * Error Formatter Utilities
 *
 * Provides user-friendly error messages for validation errors
 */

import {
  ValidationError,
  ValidationErrorCode,
} from "../../types/qr.types";

/**
 * Format a validation error into a user-friendly message
 */
export function formatValidationError(error: ValidationError): string {
  // If error already has a custom message, use it
  if (error.message) {
    return error.message;
  }

  // Otherwise, generate a message based on error code
  const fieldName = formatFieldName(error.field);

  switch (error.code) {
    case ValidationErrorCode.REQUIRED:
      return `${fieldName} is required`;
    case ValidationErrorCode.INVALID_FORMAT:
      return `${fieldName} has an invalid format`;
    case ValidationErrorCode.TOO_SHORT:
      return `${fieldName} is too short`;
    case ValidationErrorCode.TOO_LONG:
      return `${fieldName} is too long`;
    case ValidationErrorCode.INVALID_URL:
      return `Please enter a valid URL (e.g., https://example.com)`;
    case ValidationErrorCode.INVALID_EMAIL:
      return `Please enter a valid email address`;
    case ValidationErrorCode.INVALID_PHONE:
      return `Please enter a valid phone number (7-15 digits)`;
    default:
      return `${fieldName} is invalid`;
  }
}

/**
 * Get the first error message for a specific field
 */
export function getFieldError(
  errors: ValidationError[],
  field: string
): string | null {
  const error = errors.find((e) => e.field === field);
  return error ? formatValidationError(error) : null;
}

/**
 * Get all error messages for a specific field
 */
export function getFieldErrors(
  errors: ValidationError[],
  field: string
): string[] {
  return errors
    .filter((e) => e.field === field)
    .map((e) => formatValidationError(e));
}

/**
 * Check if a field has any errors
 */
export function hasFieldError(
  errors: ValidationError[],
  field: string
): boolean {
  return errors.some((e) => e.field === field);
}

/**
 * Format field name for display (camelCase -> Title Case)
 */
function formatFieldName(field: string): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    url: "URL",
    ssid: "Network name (SSID)",
    wifi: "Wi-Fi",
    email: "Email address",
    phone: "Phone number",
    firstName: "First name",
    lastName: "Last name",
    startDate: "Start date",
    endDate: "End date",
    latitude: "Latitude",
    longitude: "Longitude",
  };

  if (specialCases[field]) {
    return specialCases[field];
  }

  // Convert camelCase to Title Case
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Get a summary of all errors (for form-level display)
 */
export function getErrorSummary(errors: ValidationError[]): string {
  if (errors.length === 0) return "";
  if (errors.length === 1) return formatValidationError(errors[0]);
  return `Please fix ${errors.length} errors in the form`;
}

/**
 * Group errors by field
 */
export function groupErrorsByField(
  errors: ValidationError[]
): Record<string, ValidationError[]> {
  return errors.reduce(
    (acc, error) => {
      if (!acc[error.field]) {
        acc[error.field] = [];
      }
      acc[error.field].push(error);
      return acc;
    },
    {} as Record<string, ValidationError[]>
  );
}
