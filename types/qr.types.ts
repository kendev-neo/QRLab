/**
 * QR Code Type Definitions
 *
 * This file contains all TypeScript types and interfaces
 * used throughout the QR Generator application.
 */

// ============================================================================
// QR Customization Types
// ============================================================================

export interface QRCustomization {
    bgColor: string;
    fgColor: string;
    eyeColor: string;
    useGradient: boolean;
    gradientColors: [string, string];
    dotStyle: DotStyle;
    eyeStyle: EyeStyle;
    // Flat logo fields (data URL approach used in components)
    logo?: string;
    logoSize?: number;
    logoMargin?: number;
    // Flat frame/label fields
    frame: string;
    frameColor: string;
    frameThickness: number;
    labelText: string;
    labelColor: string;
    // Flat background image fields
    bgImage?: string;
    bgImageOpacity?: number;
    bgImageBlur?: number;
}

export type DotStyle =
    | "rounded"
    | "square"
    | "dots"
    | "classic"
    | "soft"
    | "pillow";

export type EyeStyle =
    | "soft"
    | "square"
    | "round"
    | "pillow"
    | "classy"
    | "dot";

export interface LogoConfig {
    file: File | null;
    url: string;
    size: number;
    margin: number;
    hideBackgroundDots: boolean;
    matchColors: boolean;
}

export interface FrameConfig {
    enabled: boolean;
    style: FrameStyle;
    color: string;
    label: string;
    labelFont: string;
    labelColor: string;
    labelPosition: "top" | "bottom";
}

export type FrameStyle =
    | "none"
    | "simple"
    | "rounded"
    | "double"
    | "banner"
    | "speech-bubble";

export interface BackgroundImageConfig {
    file: File | null;
    url: string;
    opacity: number;
    blur: number;
}

// ============================================================================
// QR Type Definitions
// ============================================================================

export enum QRType {
    WEBSITE = "Website",
    TEXT = "Text",
    WIFI = "Wi-Fi",
    CONTACT = "Contact",
    EMAIL = "Email",
    SMS = "SMS",
    PHONE = "Phone",
    WHATSAPP = "WhatsApp",
    LOCATION = "Location",
    SOCIAL = "Social",
    EVENT = "Event",
    PAYMENT = "Pay me",
}

export interface QRTypeConfig {
    name: string;
    icon: React.ComponentType<IconProps>;
    placeholder: string;
    encode: (data: Record<string, unknown>) => string;
    validate: (data: Record<string, unknown>) => ValidationResult;
    fields: QRTypeField[];
}

export interface QRTypeField {
    name: string;
    label: string;
    type: "text" | "email" | "tel" | "url" | "textarea" | "select" | "password";
    placeholder: string;
    required: boolean;
    pattern?: string;
    options?: Array<{ value: string; label: string }>;
    defaultValue?: string;
}

// ============================================================================
// Specific QR Type Data Models
// ============================================================================

export interface WebsiteQRData {
    url: string;
}

export interface TextQRData {
    text: string;
}

export interface WiFiQRData {
    ssid: string;
    password: string;
    encryption: "WPA" | "WEP" | "nopass";
    hidden: boolean;
}

export interface ContactQRData {
    firstName: string;
    lastName: string;
    organization?: string;
    title?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    website?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    note?: string;
}

export interface EmailQRData {
    to: string;
    subject?: string;
    body?: string;
}

export interface SMSQRData {
    phone: string;
    message?: string;
}

export interface PhoneQRData {
    phone: string;
}

export interface WhatsAppQRData {
    phone: string;
    message?: string;
}

export interface LocationQRData {
    latitude: number;
    longitude: number;
    label?: string;
}

export interface SocialQRData {
    platform: SocialPlatform;
    username: string;
}

export type SocialPlatform =
    | "instagram"
    | "tiktok"
    | "twitter"
    | "linkedin"
    | "youtube"
    | "facebook"
    | "github"
    | "threads";

export interface EventQRData {
    title: string;
    location?: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
}

export interface PaymentQRData {
    platform: PaymentPlatform;
    username: string;
    amount?: number;
    note?: string;
}

export type PaymentPlatform = "paypal" | "venmo" | "cashapp" | "revolut";

// ============================================================================
// UI State Types
// ============================================================================

export interface ColorPreset {
    name: string;
    colors: [string, string];
}

export type ExportFormat = "png" | "jpeg" | "svg" | "pdf";

export interface ExportOptions {
    format: ExportFormat;
    resolution: number;
    quality?: number;
    filename?: string;
}

export interface QRGeneratorState {
    qrValue: string;
    selectedType: QRType;
    customization: QRCustomization;
    exportFormat: ExportFormat;
    resolution: number;
    isGenerating: boolean;
    error: string | null;
    history?: QRHistoryItem[];
}

export interface QRHistoryItem {
    id: string;
    type: QRType;
    value: string;
    customization: QRCustomization;
    thumbnail: string;
    createdAt: Date;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
    code: ValidationErrorCode;
}

export enum ValidationErrorCode {
    REQUIRED = "REQUIRED",
    INVALID_FORMAT = "INVALID_FORMAT",
    TOO_SHORT = "TOO_SHORT",
    TOO_LONG = "TOO_LONG",
    INVALID_URL = "INVALID_URL",
    INVALID_EMAIL = "INVALID_EMAIL",
    INVALID_PHONE = "INVALID_PHONE",
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface QRTypeSelectorProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
    qrValue: string;
    onQrValueChange: (value: string) => void;
}

export interface QRPreviewProps {
    qrValue: string;
    customization: QRCustomization;
}

export interface CustomizationOptionsProps {
    customization: QRCustomization;
    onCustomizationChange: (customization: QRCustomization) => void;
}

export interface IconProps {
    width?: number;
    height?: number;
    className?: string;
}

// ============================================================================
// API Response Types (Future)
// ============================================================================

export interface QRGenerationResponse {
    success: boolean;
    data?: {
        qrCode: string;
        url?: string;
    };
    error?: {
        code: string;
        message: string;
    };
}

export interface AnalyticsData {
    qrId: string;
    scans: number;
    lastScanned: Date;
    locations: Array<{
        country: string;
        city: string;
        count: number;
    }>;
    devices: Array<{
        type: "mobile" | "desktop" | "tablet";
        count: number;
    }>;
}

// ============================================================================
// Utility Types
// ============================================================================

export type PartialCustomization = Partial<QRCustomization>;

export type RequiredQRData<T> = Required<Pick<T, keyof T>>;

export type PublicQRData<T> = Omit<T, "password" | "sensitive">;

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// ============================================================================
// Type Guards
// ============================================================================

export function isWebsiteQRData(data: unknown): data is WebsiteQRData {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof (data as WebsiteQRData).url === "string"
    );
}

export function isWiFiQRData(data: unknown): data is WiFiQRData {
    return (
        typeof data === "object" &&
        data !== null &&
        typeof (data as WiFiQRData).ssid === "string" &&
        typeof (data as WiFiQRData).password === "string" &&
        ["WPA", "WEP", "nopass"].includes((data as WiFiQRData).encryption)
    );
}

export function isValidationError(error: unknown): error is ValidationError {
    return (
        typeof error === "object" &&
        error !== null &&
        typeof (error as ValidationError).field === "string" &&
        typeof (error as ValidationError).message === "string" &&
        Object.values(ValidationErrorCode).includes(
            (error as ValidationError).code,
        )
    );
}

// ============================================================================
// File Upload Types
// ============================================================================

export interface LogoUploadResult {
    file: File;
    url: string;
    colors: string[];
}

export interface FileUploadOptions {
    maxSize: number;
    allowedTypes: string[];
    onSuccess?: (result: LogoUploadResult) => void;
    onError?: (error: Error) => void;
}
