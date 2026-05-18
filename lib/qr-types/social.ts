/**
 * Social Profile QR Type Handler
 *
 * Encodes social media profile data to platform URLs
 * Format: https://instagram.com/username
 */

import type {
  SocialQRData,
  SocialPlatform,
  ValidationResult,
} from "../../types/qr.types";
import { ValidationErrorCode } from "../../types/qr.types";

/**
 * Base URLs for each supported social platform
 */
const SOCIAL_BASE_URLS: Record<SocialPlatform, string> = {
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/@",
  twitter: "https://twitter.com/",
  linkedin: "https://linkedin.com/in/",
  youtube: "https://youtube.com/@",
  facebook: "https://facebook.com/",
  github: "https://github.com/",
  threads: "https://threads.net/@",
};

/**
 * Encode social profile data to platform URL
 */
export function encodeSocialQR(data: SocialQRData): string {
  const { platform, username } = data;

  if (!username) throw new Error("Username is required");

  const baseUrl = SOCIAL_BASE_URLS[platform];
  if (!baseUrl) throw new Error(`Unsupported platform: ${platform}`);

  // Strip leading @ if user accidentally included it
  const cleanUsername = username.replace(/^@/, "");

  return `${baseUrl}${cleanUsername}`;
}

/**
 * Validate social QR data
 */
export function validateSocialQR(data: SocialQRData): ValidationResult {
  const errors = [];

  if (!data.platform) {
    errors.push({
      field: "platform",
      message: "Platform is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (!SOCIAL_BASE_URLS[data.platform]) {
    errors.push({
      field: "platform",
      message: "Unsupported social platform",
      code: ValidationErrorCode.INVALID_FORMAT,
    });
  }

  if (!data.username) {
    errors.push({
      field: "username",
      message: "Username is required",
      code: ValidationErrorCode.REQUIRED,
    });
  } else if (data.username.trim().length < 1) {
    errors.push({
      field: "username",
      message: "Username cannot be empty",
      code: ValidationErrorCode.TOO_SHORT,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get all supported social platforms
 */
export function getSupportedPlatforms(): SocialPlatform[] {
  return Object.keys(SOCIAL_BASE_URLS) as SocialPlatform[];
}
