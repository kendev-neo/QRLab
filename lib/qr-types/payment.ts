/**
 * Payment QR Type Handler
 *
 * Encodes payment data to platform-specific URLs
 * Supported: PayPal, Venmo, Cash App, Revolut
 */

import type {
  PaymentQRData,
  PaymentPlatform,
  ValidationResult,
} from "../../types/qr.types";
import { ValidationErrorCode } from "../../types/qr.types";

/**
 * Base URLs for each supported payment platform
 */
const PAYMENT_BASE_URLS: Record<PaymentPlatform, string> = {
  paypal: "https://paypal.me/",
  venmo: "https://venmo.com/",
  cashapp: "https://cash.app/$",
  revolut: "https://revolut.me/",
};

/**
 * Encode payment data to platform URL
 */
export function encodePaymentQR(data: PaymentQRData): string {
  const { platform, username, amount, note } = data;

  if (!username) throw new Error("Username is required");

  const baseUrl = PAYMENT_BASE_URLS[platform];
  if (!baseUrl) throw new Error(`Unsupported payment platform: ${platform}`);

  let url = `${baseUrl}${username}`;

  // Append amount if provided
  if (amount && amount > 0) {
    url += `/${amount}`;
  }

  // PayPal supports a note query param
  if (note && platform === "paypal") {
    url += `?note=${encodeURIComponent(note)}`;
  }

  return url;
}

/**
 * Validate payment QR data
 */
export function validatePaymentQR(data: PaymentQRData): ValidationResult {
  const errors = [];

  if (!data.platform) {
    errors.push({
      field: "platform",
      message: "Payment platform is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (!PAYMENT_BASE_URLS[data.platform]) {
    errors.push({
      field: "platform",
      message: "Unsupported payment platform",
      code: ValidationErrorCode.INVALID_FORMAT,
    });
  }

  if (!data.username || data.username.trim().length === 0) {
    errors.push({
      field: "username",
      message: "Username / handle is required",
      code: ValidationErrorCode.REQUIRED,
    });
  }

  if (data.amount !== undefined && data.amount !== null) {
    if (isNaN(data.amount) || data.amount < 0) {
      errors.push({
        field: "amount",
        message: "Amount must be a positive number",
        code: ValidationErrorCode.INVALID_FORMAT,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get all supported payment platforms
 */
export function getSupportedPaymentPlatforms(): PaymentPlatform[] {
  return Object.keys(PAYMENT_BASE_URLS) as PaymentPlatform[];
}
