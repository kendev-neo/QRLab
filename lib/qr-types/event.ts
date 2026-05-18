/**
 * Event QR Type Handler
 *
 * Encodes calendar event data to iCalendar (iCal) format
 * Format: BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n...\nEND:VEVENT\nEND:VCALENDAR
 */

import type { EventQRData, ValidationResult } from "../../types/qr.types";
import { ValidationErrorCode } from "../../types/qr.types";

/**
 * Format a Date object to iCalendar date string
 * - All-day: YYYYMMDD
 * - Timed: YYYYMMDDTHHmmssZ
 */
function formatICalDate(date: Date, allDay: boolean): string {
    if (allDay) {
        return date.toISOString().slice(0, 10).replace(/-/g, "");
    }
    // Remove dashes, colons, and trailing milliseconds, then append Z
    return date.toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
}

/**
 * Escape special characters in iCalendar text fields
 */
function escapeICalString(str: string): string {
    return str
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

/**
 * Encode event data to iCalendar format
 */
export function encodeEventQR(data: EventQRData): string {
    const { title, location, description, startDate, endDate, allDay } = data;

    if (!title) throw new Error("Event title is required");
    if (!startDate) throw new Error("Start date is required");

    const lines: string[] = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//QRLab Generator//EN",
        "BEGIN:VEVENT",
    ];

    // Summary (title)
    lines.push(`SUMMARY:${escapeICalString(title)}`);

    // Dates
    const effectiveEnd = endDate || startDate;
    const dtStart = formatICalDate(startDate, allDay);
    const dtEnd = formatICalDate(effectiveEnd, allDay);

    if (allDay) {
        lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
        lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    } else {
        lines.push(`DTSTART:${dtStart}`);
        lines.push(`DTEND:${dtEnd}`);
    }

    // Location
    if (location) {
        lines.push(`LOCATION:${escapeICalString(location)}`);
    }

    // Description
    if (description) {
        lines.push(`DESCRIPTION:${escapeICalString(description)}`);
    }

    lines.push("END:VEVENT", "END:VCALENDAR");

    return lines.join("\n");
}

/**
 * Validate event QR data
 */
export function validateEventQR(data: EventQRData): ValidationResult {
    const errors = [];

    if (!data.title || data.title.trim().length === 0) {
        errors.push({
            field: "title",
            message: "Event title is required",
            code: ValidationErrorCode.REQUIRED,
        });
    }

    if (!data.startDate) {
        errors.push({
            field: "startDate",
            message: "Start date is required",
            code: ValidationErrorCode.REQUIRED,
        });
    }

    if (data.startDate && data.endDate) {
        if (data.endDate < data.startDate) {
            errors.push({
                field: "endDate",
                message: "End date must be after start date",
                code: ValidationErrorCode.INVALID_FORMAT,
            });
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
