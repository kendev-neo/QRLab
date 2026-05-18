/**
 * Default Values
 *
 * Default configurations and initial values
 */

import type { QRCustomization, ExportFormat } from "@/types";

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
    bgColor: "#FFF8F0",
    fgColor: "#4A4658",
    eyeColor: "#4A4658",
    useGradient: false,
    gradientColors: ["#F472B6", "#FB923C"],
    dotStyle: "rounded",
    eyeStyle: "soft",
    // Logo fields
    logo: undefined,
    logoSize: 40,
    logoMargin: 4,
    // Frame & label fields
    frame: "none",
    frameColor: "#4A4658",
    frameThickness: 4,
    labelText: "",
    labelColor: "#4A4658",
    // Background image fields
    bgImage: undefined,
    bgImageOpacity: 0.3,
    bgImageBlur: 0,
};

export const DEFAULT_RESOLUTION = 1024;

export const DEFAULT_FORMAT: ExportFormat = "png";

export const DEFAULT_QR_VALUE = "https://example.com";

export const DEFAULT_QR_TYPE = "Website";

export const LIMITS = {
    // QR code data limits
    MAX_TEXT_LENGTH: 2953, // Alphanumeric mode
    MAX_BINARY_LENGTH: 1817, // Binary mode

    // File upload limits
    MAX_LOGO_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_BG_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB

    // Resolution limits
    MIN_RESOLUTION: 512,
    MAX_RESOLUTION: 3200,

    // History limits
    MAX_HISTORY_ITEMS: 50,
} as const;

export const RESOLUTIONS = [512, 1024, 2048, 3200] as const;

export const EXPORT_FORMATS = ["png", "jpeg", "svg", "pdf"] as const;
