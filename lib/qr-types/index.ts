/**
 * QR Types Index
 *
 * Central export point for all QR type handlers.
 * Each handler provides an encode function and a validate function.
 */

// ── Re-export all handlers ────────────────────────────────────────────────────
export * from "./website";
export * from "./wifi";
export * from "./email";
export * from "./phone";
export * from "./contact";
export * from "./sms";
export * from "./whatsapp";
export * from "./location";
export * from "./social";
export * from "./event";
export * from "./payment";
export * from "./text";

// ── Import encoders ───────────────────────────────────────────────────────────
import { encodeWebsiteQR } from "./website";
import { encodeWiFiQR } from "./wifi";
import { encodeEmailQR } from "./email";
import { encodePhoneQR } from "./phone";
import { encodeContactQR } from "./contact";
import { encodeSMSQR } from "./sms";
import { encodeWhatsAppQR } from "./whatsapp";
import { encodeLocationQR } from "./location";
import { encodeSocialQR } from "./social";
import { encodeEventQR } from "./event";
import { encodePaymentQR } from "./payment";
import { encodeTextQR } from "./text";

// ── Import validators ─────────────────────────────────────────────────────────
import { validateWebsiteQR } from "./website";
import { validateWiFiQR } from "./wifi";
import { validateEmailQR } from "./email";
import { validatePhoneQR } from "./phone";
import { validateContactQR } from "./contact";
import { validateSMSQR } from "./sms";
import { validateWhatsAppQR } from "./whatsapp";
import { validateLocationQR } from "./location";
import { validateSocialQR } from "./social";
import { validateEventQR } from "./event";
import { validatePaymentQR } from "./payment";
import { validateTextQR } from "./text";

import type {
    ValidationResult,
    WebsiteQRData,
    WiFiQRData,
    EmailQRData,
    PhoneQRData,
    ContactQRData,
    SMSQRData,
    WhatsAppQRData,
    LocationQRData,
    SocialQRData,
    EventQRData,
    PaymentQRData,
    TextQRData,
} from "../../types/qr.types";

/** Union of all possible raw form data shapes */
export type QRFormData = Record<string, unknown>;

// ── QR type string constants (matches QRType enum values) ─────────────────────
export const QR_TYPE_WEBSITE = "Website";
export const QR_TYPE_WIFI = "Wi-Fi";
export const QR_TYPE_EMAIL = "Email";
export const QR_TYPE_PHONE = "Phone";
export const QR_TYPE_CONTACT = "Contact";
export const QR_TYPE_SMS = "SMS";
export const QR_TYPE_WHATSAPP = "WhatsApp";
export const QR_TYPE_LOCATION = "Location";
export const QR_TYPE_SOCIAL = "Social";
export const QR_TYPE_EVENT = "Event";
export const QR_TYPE_PAYMENT = "Pay me";
export const QR_TYPE_TEXT = "Text";

/**
 * Encode QR data based on type string.
 * Returns the encoded string ready to be passed to the QR renderer.
 *
 * @param data  - Raw data object for the selected QR type
 * @param type  - QR type string (matches QRType enum values)
 */
export function encodeQRData(data: QRFormData, type: string): string {
    switch (type) {
        case QR_TYPE_WEBSITE:
            return encodeWebsiteQR(data as unknown as WebsiteQRData);
        case QR_TYPE_WIFI:
            return encodeWiFiQR(data as unknown as WiFiQRData);
        case QR_TYPE_EMAIL:
            return encodeEmailQR(data as unknown as EmailQRData);
        case QR_TYPE_PHONE:
            return encodePhoneQR(data as unknown as PhoneQRData);
        case QR_TYPE_CONTACT:
            return encodeContactQR(data as unknown as ContactQRData);
        case QR_TYPE_SMS:
            return encodeSMSQR(data as unknown as SMSQRData);
        case QR_TYPE_WHATSAPP:
            return encodeWhatsAppQR(data as unknown as WhatsAppQRData);
        case QR_TYPE_LOCATION: {
            // Form passes strings — convert to numbers
            const loc = data as unknown as LocationQRData;
            return encodeLocationQR({
                ...loc,
                latitude: loc.latitude ? Number(loc.latitude) : 0,
                longitude: loc.longitude ? Number(loc.longitude) : 0,
            });
        }
        case QR_TYPE_SOCIAL:
            return encodeSocialQR(data as unknown as SocialQRData);
        case QR_TYPE_EVENT: {
            // Form passes string dates — convert to Date objects
            const ev = data as unknown as Omit<
                EventQRData,
                "startDate" | "endDate" | "allDay"
            > & {
                startDate: string;
                endDate: string;
                allDay: boolean | string;
            };
            return encodeEventQR({
                ...ev,
                startDate: ev.startDate ? new Date(ev.startDate) : new Date(),
                endDate: ev.endDate ? new Date(ev.endDate) : new Date(),
                allDay: ev.allDay === true || String(ev.allDay) === "true",
            });
        }
        case QR_TYPE_PAYMENT: {
            const pay = data as unknown as PaymentQRData;
            return encodePaymentQR({
                ...pay,
                amount: pay.amount ? Number(pay.amount) : undefined,
            });
        }
        case QR_TYPE_TEXT:
            return encodeTextQR(data as unknown as TextQRData);
        default: {
            // Fallback: try common fields
            const d = data as { url?: string; text?: string };
            return d.url ?? d.text ?? "";
        }
    }
}

/**
 * Validate QR data based on type string.
 * Returns a ValidationResult with valid flag and error list.
 *
 * @param data  - Raw data object for the selected QR type
 * @param type  - QR type string (matches QRType enum values)
 */
export function validateQRData(
    data: QRFormData,
    type: string,
): ValidationResult {
    switch (type) {
        case QR_TYPE_WEBSITE:
            return validateWebsiteQR(data as unknown as WebsiteQRData);
        case QR_TYPE_WIFI:
            return validateWiFiQR(data as unknown as WiFiQRData);
        case QR_TYPE_EMAIL:
            return validateEmailQR(data as unknown as EmailQRData);
        case QR_TYPE_PHONE:
            return validatePhoneQR(data as unknown as PhoneQRData);
        case QR_TYPE_CONTACT:
            return validateContactQR(data as unknown as ContactQRData);
        case QR_TYPE_SMS:
            return validateSMSQR(data as unknown as SMSQRData);
        case QR_TYPE_WHATSAPP:
            return validateWhatsAppQR(data as unknown as WhatsAppQRData);
        case QR_TYPE_LOCATION:
            return validateLocationQR(data as unknown as LocationQRData);
        case QR_TYPE_SOCIAL:
            return validateSocialQR(data as unknown as SocialQRData);
        case QR_TYPE_EVENT:
            return validateEventQR(data as unknown as EventQRData);
        case QR_TYPE_PAYMENT:
            return validatePaymentQR(data as unknown as PaymentQRData);
        case QR_TYPE_TEXT:
            return validateTextQR(data as unknown as TextQRData);
        default:
            return { valid: true, errors: [] };
    }
}
