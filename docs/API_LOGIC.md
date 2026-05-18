# API & Logic Documentation - QRLab Generator

## Tổng Quan

Tài liệu này mô tả các logic xử lý, algorithms, và data flow trong dự án QRLab Generator.

---

## 1. QR Code Generation Logic

### 1.1 QR Generation Flow

```
User Input → Validation → Encoding → QR Generation → Styling → Preview/Download
```

#### Detailed Flow:

```typescript
// 1. User nhập data
const userInput = "https://example.com";

// 2. Validate input
const validation = validateQRData(userInput, QRType.WEBSITE);
if (!validation.valid) {
  throw new Error(validation.errors[0].message);
}

// 3. Encode data theo format
const encodedData = encodeQRData(userInput, QRType.WEBSITE);

// 4. Generate QR với customization
const qrCode = generateQR(encodedData, customization);

// 5. Render preview
renderQRPreview(qrCode);

// 6. Download khi user click
downloadQR(qrCode, format, resolution);
```

### 1.2 QR Generation Function

```typescript
/**
 * Generate QR code với customization options
 */
function generateQR(
  data: string,
  customization: QRCustomization,
  options?: QRGenerationOptions,
): QRCodeStyling {
  const size = calculateSize(options?.resolution || 1024);
  const dotType = mapDotStyle(customization.dotStyle);
  const eyeType = mapEyeStyle(customization.eyeStyle);

  const qrOptions = {
    type: "canvas" as const,
    width: size,
    height: size,
    data: data,
    margin: 8,

    // Error correction level
    qrOptions: {
      errorCorrectionLevel: "H" as const, // High (30% recovery)
    },

    // Image/Logo options
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 6,
    },

    // Dots styling
    dotsOptions: customization.useGradient
      ? {
          type: dotType,
          roundSize: true,
          gradient: {
            type: "linear" as const,
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color: customization.gradientColors[0] },
              { offset: 1, color: customization.gradientColors[1] },
            ],
          },
        }
      : {
          type: dotType,
          roundSize: true,
          color: customization.fgColor,
        },

    // Corner squares (eyes)
    cornersSquareOptions: {
      type: eyeType,
      color: customization.eyeColor,
    },

    // Corner dots (inner eyes)
    cornersDotOptions: {
      type: "dot" as const,
      color: customization.eyeColor,
    },

    // Background
    backgroundOptions: {
      color: customization.bgColor,
      round: 0,
    },
  };

  return new QRCodeStyling(qrOptions);
}
```

### 1.3 Size Calculation

```typescript
/**
 * Calculate QR size based on resolution
 */
function calculateSize(resolution: number): number {
  if (resolution <= 512) return 300;
  if (resolution <= 1024) return 350;
  if (resolution <= 2048) return 450;
  return 600;
}
```

### 1.4 Style Mapping

```typescript
/**
 * Map dot style to qr-code-styling format
 */
function mapDotStyle(style: DotStyle): string {
  const map: Record<DotStyle, string> = {
    rounded: "rounded",
    square: "square",
    dots: "dots",
    classic: "square",
    soft: "extra-rounded",
    pillow: "classy-rounded",
  };
  return map[style] || "rounded";
}

/**
 * Map eye style to qr-code-styling format
 */
function mapEyeStyle(style: EyeStyle): string {
  const map: Record<EyeStyle, string> = {
    soft: "extra-rounded",
    square: "square",
    round: "dot",
    pillow: "dot",
    classy: "square",
    dot: "dot",
  };
  return map[style] || "extra-rounded";
}
```

---

## 2. QR Type Encoding Logic

### 2.1 Website/URL Encoding

```typescript
/**
 * Encode website URL
 */
function encodeWebsiteQR(data: WebsiteQRData): string {
  // Validate URL
  if (!isValidURL(data.url)) {
    throw new Error("Invalid URL format");
  }

  // Ensure protocol
  let url = data.url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  return url;
}

/**
 * Validate URL
 */
function isValidURL(url: string): boolean {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}
```

### 2.2 Wi-Fi Encoding

```typescript
/**
 * Encode Wi-Fi credentials to QR format
 * Format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
 */
function encodeWiFiQR(data: WiFiQRData): string {
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
```

### 2.3 vCard (Contact) Encoding

```typescript
/**
 * Encode contact to vCard 3.0 format
 */
function encodeContactQR(data: ContactQRData): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  // Name
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  lines.push(`FN:${fullName}`);
  lines.push(`N:${data.lastName};${data.firstName};;;`);

  // Organization
  if (data.organization) {
    lines.push(`ORG:${data.organization}`);
  }

  // Title
  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  // Phone numbers
  if (data.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
  }
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
```

### 2.4 Email Encoding

```typescript
/**
 * Encode email to mailto format
 */
function encodeEmailQR(data: EmailQRData): string {
  const { to, subject, body } = data;

  if (!to || !isValidEmail(to)) {
    throw new Error("Valid email address is required");
  }

  const params = new URLSearchParams();
  if (subject) params.append("subject", subject);
  if (body) params.append("body", body);

  const queryString = params.toString();
  return `mailto:${to}${queryString ? `?${queryString}` : ""}`;
}

/**
 * Validate email address
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### 2.5 SMS Encoding

```typescript
/**
 * Encode SMS to sms format
 */
function encodeSMSQR(data: SMSQRData): string {
  const { phone, message } = data;

  if (!phone) throw new Error("Phone number is required");

  const cleanPhone = cleanPhoneNumber(phone);

  if (message) {
    return `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
  }

  return `sms:${cleanPhone}`;
}

/**
 * Clean phone number (remove spaces, dashes, etc.)
 */
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}
```

### 2.6 Phone Encoding

```typescript
/**
 * Encode phone to tel format
 */
function encodePhoneQR(data: PhoneQRData): string {
  const { phone } = data;

  if (!phone) throw new Error("Phone number is required");

  const cleanPhone = cleanPhoneNumber(phone);
  return `tel:${cleanPhone}`;
}
```

### 2.7 WhatsApp Encoding

```typescript
/**
 * Encode WhatsApp to wa.me format
 */
function encodeWhatsAppQR(data: WhatsAppQRData): string {
  const { phone, message } = data;

  if (!phone) throw new Error("Phone number is required");

  // Remove + and non-digits
  const cleanPhone = phone.replace(/[^\d]/g, "");

  if (message) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  return `https://wa.me/${cleanPhone}`;
}
```

### 2.8 Location Encoding

```typescript
/**
 * Encode location to geo format
 */
function encodeLocationQR(data: LocationQRData): string {
  const { latitude, longitude, label } = data;

  if (!latitude || !longitude) {
    throw new Error("Latitude and longitude are required");
  }

  // Validate coordinates
  if (latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude");
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error("Invalid longitude");
  }

  let geoUri = `geo:${latitude},${longitude}`;

  if (label) {
    geoUri += `?q=${encodeURIComponent(label)}`;
  }

  return geoUri;
}
```

### 2.9 Social Profile Encoding

```typescript
/**
 * Encode social profile URL
 */
function encodeSocialQR(data: SocialQRData): string {
  const { platform, username } = data;

  if (!username) throw new Error("Username is required");

  const baseUrls: Record<SocialPlatform, string> = {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/@",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/in/",
    youtube: "https://youtube.com/@",
    facebook: "https://facebook.com/",
    github: "https://github.com/",
    threads: "https://threads.net/@",
  };

  const baseUrl = baseUrls[platform];
  if (!baseUrl) throw new Error("Invalid platform");

  return `${baseUrl}${username}`;
}
```

### 2.10 Event (Calendar) Encoding

```typescript
/**
 * Encode event to iCalendar format
 */
function encodeEventQR(data: EventQRData): string {
  const { title, location, description, startDate, endDate, allDay } = data;

  if (!title) throw new Error("Event title is required");
  if (!startDate) throw new Error("Start date is required");

  const lines: string[] = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT"];

  // Summary (title)
  lines.push(`SUMMARY:${escapeICalString(title)}`);

  // Dates
  const dtStart = formatICalDate(startDate, allDay);
  const dtEnd = formatICalDate(endDate || startDate, allDay);

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
 * Format date for iCalendar
 */
function formatICalDate(date: Date, allDay: boolean): string {
  if (allDay) {
    // YYYYMMDD
    return date.toISOString().slice(0, 10).replace(/-/g, "");
  } else {
    // YYYYMMDDTHHmmssZ
    return date.toISOString().replace(/[-:]/g, "").slice(0, -5) + "Z";
  }
}

/**
 * Escape special characters in iCalendar strings
 */
function escapeICalString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
```

### 2.11 Payment Encoding

```typescript
/**
 * Encode payment link
 */
function encodePaymentQR(data: PaymentQRData): string {
  const { platform, username, amount, note } = data;

  if (!username) throw new Error("Username is required");

  const baseUrls: Record<PaymentPlatform, string> = {
    paypal: "https://paypal.me/",
    venmo: "https://venmo.com/",
    cashapp: "https://cash.app/$",
    revolut: "https://revolut.me/",
  };

  const baseUrl = baseUrls[platform];
  if (!baseUrl) throw new Error("Invalid payment platform");

  let url = `${baseUrl}${username}`;

  if (amount) {
    url += `/${amount}`;
  }

  if (note && platform === "paypal") {
    url += `?note=${encodeURIComponent(note)}`;
  }

  return url;
}
```

---

## 3. Validation Logic

### 3.1 Input Validation

```typescript
/**
 * Validate QR data based on type
 */
function validateQRData(data: any, type: QRType): ValidationResult {
  const errors: ValidationError[] = [];

  switch (type) {
    case QRType.WEBSITE:
      if (!data || !data.url) {
        errors.push({
          field: "url",
          message: "URL is required",
          code: ValidationErrorCode.REQUIRED,
        });
      } else if (!isValidURL(data.url)) {
        errors.push({
          field: "url",
          message: "Invalid URL format",
          code: ValidationErrorCode.INVALID_FORMAT,
        });
      }
      break;

    case QRType.EMAIL:
      if (!data || !data.to) {
        errors.push({
          field: "to",
          message: "Email address is required",
          code: ValidationErrorCode.REQUIRED,
        });
      } else if (!isValidEmail(data.to)) {
        errors.push({
          field: "to",
          message: "Invalid email format",
          code: ValidationErrorCode.INVALID_EMAIL,
        });
      }
      break;

    case QRType.PHONE:
    case QRType.SMS:
    case QRType.WHATSAPP:
      if (!data || !data.phone) {
        errors.push({
          field: "phone",
          message: "Phone number is required",
          code: ValidationErrorCode.REQUIRED,
        });
      } else if (!isValidPhone(data.phone)) {
        errors.push({
          field: "phone",
          message: "Invalid phone number",
          code: ValidationErrorCode.INVALID_PHONE,
        });
      }
      break;

    case QRType.WIFI:
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
      break;

    // Add more cases...
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phone number
 */
function isValidPhone(phone: string): boolean {
  // Basic validation: at least 7 digits
  const cleaned = phone.replace(/[^\d]/g, "");
  return cleaned.length >= 7 && cleaned.length <= 15;
}
```

### 3.2 Data Length Validation

```typescript
/**
 * Check if data fits in QR code
 */
function validateQRLength(data: string): ValidationResult {
  const errors: ValidationError[] = [];

  // QR code capacity depends on error correction level and mode
  // For High error correction (H) with alphanumeric mode: ~2953 chars
  const MAX_LENGTH = 2953;

  if (data.length > MAX_LENGTH) {
    errors.push({
      field: "data",
      message: `Data too long. Maximum ${MAX_LENGTH} characters.`,
      code: ValidationErrorCode.TOO_LONG,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

## 4. File Upload Logic

### 4.1 Logo Upload

```typescript
/**
 * Handle logo file upload
 */
async function handleLogoUpload(file: File): Promise<LogoUploadResult> {
  // Validate file type
  const validTypes = ["image/png", "image/jpeg", "image/svg+xml"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only PNG, JPEG, and SVG are allowed.");
  }

  // Validate file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  // Read file as data URL
  const dataUrl = await readFileAsDataURL(file);

  // Extract colors from logo (optional)
  const colors = await extractColorsFromImage(dataUrl);

  return {
    file,
    url: dataUrl,
    colors,
  };
}

/**
 * Read file as data URL
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Extract dominant colors from image
 */
async function extractColorsFromImage(imageUrl: string): Promise<string[]> {
  // Create canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Load image
  const img = new Image();
  img.src = imageUrl;
  await new Promise((resolve) => (img.onload = resolve));

  // Draw image
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Extract colors (simplified - use color quantization library in production)
  const colorMap = new Map<string, number>();

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Round to nearest 32 to group similar colors
    const rr = Math.round(r / 32) * 32;
    const gg = Math.round(g / 32) * 32;
    const bb = Math.round(b / 32) * 32;

    const color = `#${rr.toString(16).padStart(2, "0")}${gg.toString(16).padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`;

    colorMap.set(color, (colorMap.get(color) || 0) + 1);
  }

  // Sort by frequency and return top 5
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => color);
}
```

---

## 5. Download Logic

### 5.1 Download QR Code

```typescript
/**
 * Download QR code in specified format
 */
async function downloadQR(
  qrCode: QRCodeStyling,
  format: ExportFormat,
  resolution: number,
  filename: string = "qrcode",
): Promise<void> {
  // Update QR size based on resolution
  qrCode.update({
    width: resolution,
    height: resolution,
  });

  // Download
  try {
    await qrCode.download({
      name: filename,
      extension: format,
    });
  } catch (error) {
    console.error("Download error:", error);
    throw new Error(`Failed to download QR code: ${error.message}`);
  }
}
```

### 5.2 Generate Preview

```typescript
/**
 * Generate QR preview as data URL
 */
async function generateQRPreview(qrCode: QRCodeStyling): Promise<string> {
  return new Promise((resolve, reject) => {
    qrCode.getRawData("png").then((blob) => {
      if (!blob) {
        reject(new Error("Failed to generate preview"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  });
}
```

---

## 6. Local Storage Logic

### 6.1 Save to History

```typescript
/**
 * Save QR to history
 */
async function saveToHistory(
  type: QRType,
  value: string,
  customization: QRCustomization,
  qrCode: QRCodeStyling,
): Promise<void> {
  // Generate thumbnail
  const thumbnail = await generateQRPreview(qrCode);

  // Create history item
  const item: QRHistoryItem = {
    id: generateUUID(),
    type,
    value,
    customization,
    thumbnail,
    createdAt: new Date(),
  };

  // Get existing history
  const history = getHistory();

  // Add new item at beginning
  history.unshift(item);

  // Limit to 50 items
  const limitedHistory = history.slice(0, 50);

  // Save to localStorage
  localStorage.setItem("qr-history", JSON.stringify(limitedHistory));
}

/**
 * Get history from localStorage
 */
function getHistory(): QRHistoryItem[] {
  const data = localStorage.getItem("qr-history");
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Clear history
 */
function clearHistory(): void {
  localStorage.removeItem("qr-history");
}

/**
 * Generate UUID
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
```

---

## 7. Error Handling

### 7.1 Error Types

```typescript
class QRGenerationError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "QRGenerationError";
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class FileUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileUploadError";
  }
}
```

### 7.2 Error Handler

```typescript
/**
 * Global error handler
 */
function handleError(error: Error): void {
  console.error(error);

  if (error instanceof ValidationError) {
    showNotification(`Validation error: ${error.message}`, "error");
  } else if (error instanceof FileUploadError) {
    showNotification(`Upload error: ${error.message}`, "error");
  } else if (error instanceof QRGenerationError) {
    showNotification(`QR generation error: ${error.message}`, "error");
  } else {
    showNotification("An unexpected error occurred", "error");
  }
}
```

---

## 8. Performance Optimization

### 8.1 Debounce QR Updates

```typescript
/**
 * Debounce function to limit QR regeneration
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const debouncedUpdateQR = debounce(updateQR, 300);
```

### 8.2 Memoization

```typescript
/**
 * Memoize QR generation for same inputs
 */
const qrCache = new Map<string, QRCodeStyling>();

function getCachedQR(
  data: string,
  customization: QRCustomization,
): QRCodeStyling | null {
  const key = JSON.stringify({ data, customization });
  return qrCache.get(key) || null;
}

function setCachedQR(
  data: string,
  customization: QRCustomization,
  qrCode: QRCodeStyling,
): void {
  const key = JSON.stringify({ data, customization });
  qrCache.set(key, qrCode);

  // Limit cache size
  if (qrCache.size > 10) {
    const firstKey = qrCache.keys().next().value;
    qrCache.delete(firstKey);
  }
}
```

---

**Cập nhật lần cuối:** 2026-05-12  
**Phiên bản:** 0.1.0
