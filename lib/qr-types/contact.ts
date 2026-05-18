/**
 * Contact QR Type Handler
 *
 * Encodes contact information to vCard 3.0 format
 * Format: BEGIN:VCARD\nVERSION:3.0\n...\nEND:VCARD
 */

import type { ContactQRData } from "../../types/qr.types";
import type { ValidationResult } from "../../types/qr.types";
import { ValidationErrorCode } from "../../types/qr.types";

/**
 * Encode contact data to vCard 3.0 format
 */
export function encodeContactQR(data: ContactQRData): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  // Full name (required)
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  lines.push(`FN:${fullName}`);
  lines.push(`N:${data.lastName};${data.firstName};;;`);

  // Organization
  if (data.organization) {
    lines.push(`ORG:${data.organization}`);
  }

  // Job title
  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  // Work phone
  if (data.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
  }

  // Mobile phone
  if (data.mobile) {
    lines.push(`TEL;TYPE=CELL:${data.mobile}`);
  }

  // Email
  if (data.email) {
    lines.push(`EMAIL:${data.email}`);
  }

  // Website
  if (data.website) {
    lines.push(`URL:${data.website}`);
  }

  // Address
  if (data.address) {
    const addr = data.address;
    const addrLine = [
      "", // PO Box
      "", // Extended address
      addr.street || "",
      addr.city || "",
      addr.state || "",
      addr.zip || "",
      addr.country || "",
    ].join(";");
    lines.push(`ADR;TYPE=WORK:${addrLine}`);
  }

  // Note
  if (data.note) {
    lines.push(`NOTE:${data.note}`);
  }

  lines.push("END:VCARD");

  return lines.join("\n");
}

/**
 * Validate contact QR data
 */
export function validateContactQR(data: ContactQRData): ValidationResult {
  const errors = [];

  if (!data.firstName && !data.lastName) {
    errors.push({
      field: "firstName",
      message: "At least first name or last name is required",
      code: ValidationErrorCode.REQUIRED,
    });
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({
        field: "email",
        message: "Invalid email format",
        code: ValidationErrorCode.INVALID_EMAIL,
      });
    }
  }

  if (data.phone) {
    const cleaned = data.phone.replace(/[^\d]/g, "");
    if (cleaned.length < 7 || cleaned.length > 15) {
      errors.push({
        field: "phone",
        message: "Invalid phone number",
        code: ValidationErrorCode.INVALID_PHONE,
      });
    }
  }

  if (data.mobile) {
    const cleaned = data.mobile.replace(/[^\d]/g, "");
    if (cleaned.length < 7 || cleaned.length > 15) {
      errors.push({
        field: "mobile",
        message: "Invalid mobile number",
        code: ValidationErrorCode.INVALID_PHONE,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
