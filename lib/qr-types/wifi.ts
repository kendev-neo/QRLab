/**
 * Wi-Fi QR Type Handler
 *
 * Encoding and validation for Wi-Fi QR codes
 * Format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
 */

import type { WiFiQRData, ValidationResult } from "@/types";
import { ValidationErrorCode } from "@/types";

/**
 * Escape special characters in Wi-Fi strings
 */
function escapeWiFiString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/:/g, "\\:")
    .replace(/,/g, "\\,")
    .replace(/"/g, '\\"');
}

/**
 * Encode Wi-Fi credentials to QR format
 */
export function encodeWiFiQR(data: WiFiQRData): string {
  const { ssid, password, encryption, hidden } = data;

  // Validate
  if (!ssid) throw new Error("SSID is required");
  if (encryption !== "nopass" && !password) {
    throw new Error("Password is required for encrypted networks");
  }

  // Escape special characters
  const escapedSSID = escapeWiFiString(ssid);
  const escapedPassword = password ? escapeWiFiString(password) : "";

  // Build QR string
  const parts = [`T:${encryption}`, `S:${escapedSSID}`];

  if (encryption !== "nopass") {
    parts.push(`P:${escapedPassword}`);
  }

  parts.push(`H:${hidden}`);

  return `WIFI:${parts.join(";")};`;
}

/**
 * Validate Wi-Fi QR data
 */
export function validateWiFiQR(data: WiFiQRData): ValidationResult {
  const errors = [];

  if (!data || !data.ssid) {
    errors.push({
      field: "ssid",
      message: "Network name (SSID) is required",
      code: ValidationErrorCode.REQUIRED,
    });
  }

  if (data.encryption !== "nopass" && !data.password) {
    errors.push({
      field: "password",
      message: "Password is required for encrypted networks",
      code: ValidationErrorCode.REQUIRED,
    });
  }

  if (!["WPA", "WEP", "nopass"].includes(data.encryption)) {
    errors.push({
      field: "encryption",
      message: "Invalid encryption type",
      code: ValidationErrorCode.INVALID_FORMAT,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
