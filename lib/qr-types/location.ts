/**
 * Location QR Type Handler
 *
 * Encodes geographic coordinates to geo: URI format
 * Format: geo:37.7749,-122.4194?q=San+Francisco
 */

import type { LocationQRData, ValidationResult } from "../../types/qr.types";
import { ValidationErrorCode } from "../../types/qr.types";

/**
 * Encode location data to geo: URI
 */
export function encodeLocationQR(data: LocationQRData): string {
  const { latitude, longitude, label } = data;

  if (latitude === undefined || latitude === null) {
    throw new Error("Latitude is required");
  }
  if (longitude === undefined || longitude === null) {
    throw new Error("Longitude is required");
  }

  // Validate coordinate ranges
  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90");
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180");
  }

  let geoUri = `geo:${latitude},${longitude}`;

  if (label) {
    geoUri += `?q=${encodeURIComponent(label)}`;
  }

  return geoUri;
}

/**
 * Validate location QR data
 */
export function validateLocationQR(data: LocationQRData): ValidationResult {
  const errors = [];

  if (
    data.latitude === undefined ||
    data.latitude === null ||
    isNaN(data.latitude)
  ) {
    errors.push({
      field: "latitude",
      message: "Latitude is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (data.latitude < -90 || data.latitude > 90) {
    errors.push({
      field: "latitude",
      message: "Latitude must be between -90 and 90",
      code: ValidationErrorCode.INVALID_FORMAT,
    });
  }

  if (
    data.longitude === undefined ||
    data.longitude === null ||
    isNaN(data.longitude)
  ) {
    errors.push({
      field: "longitude",
      message: "Longitude is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (data.longitude < -180 || data.longitude > 180) {
    errors.push({
      field: "longitude",
      message: "Longitude must be between -180 and 180",
      code: ValidationErrorCode.INVALID_FORMAT,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
