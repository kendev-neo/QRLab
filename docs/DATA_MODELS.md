# Mô Hình Dữ Liệu - QRLab Generator

## Tổng Quan

Tài liệu này mô tả các data models, interfaces, và types được sử dụng trong dự án QRLab Generator.

---

## 1. QR Customization Models

### 1.1 QRCustomization Interface

Interface chính cho việc tùy chỉnh QR code.

```typescript
interface QRCustomization {
  // Màu nền QR code
  bgColor: string; // Hex color, ví dụ: "#FFF8F0"

  // Màu chấm/dot của QR code
  fgColor: string; // Hex color, ví dụ: "#4A4658"

  // Màu của 3 góc eye (position markers)
  eyeColor: string; // Hex color, ví dụ: "#4A4658"

  // Có sử dụng gradient không
  useGradient: boolean; // true/false

  // Màu gradient (nếu useGradient = true)
  gradientColors: [string, string]; // [startColor, endColor]

  // Kiểu dáng của dots
  dotStyle: DotStyle; // "rounded" | "square" | "dots" | "classic" | "soft" | "pillow"

  // Kiểu dáng của eyes
  eyeStyle: EyeStyle; // "soft" | "square" | "round" | "pillow" | "classy" | "dot"

  // Logo (optional - chưa implement)
  logo?: LogoConfig;

  // Frame (optional - chưa implement)
  frame?: FrameConfig;

  // Background image (optional - chưa implement)
  backgroundImage?: BackgroundImageConfig;
}
```

### 1.2 DotStyle Type

```typescript
type DotStyle =
  | "rounded" // Bo tròn nhẹ
  | "square" // Vuông góc cạnh
  | "dots" // Chấm tròn
  | "classic" // Kiểu cổ điển (vuông)
  | "soft" // Bo tròn mềm mại
  | "pillow"; // Dạng gối (classy-rounded)

// Mapping sang qr-code-styling library
const DOT_STYLE_MAP: Record<DotStyle, string> = {
  rounded: "rounded",
  square: "square",
  dots: "dots",
  classic: "square",
  soft: "extra-rounded",
  pillow: "classy-rounded",
};
```

### 1.3 EyeStyle Type

```typescript
type EyeStyle =
  | "soft" // Bo tròn mềm
  | "square" // Vuông góc cạnh
  | "round" // Tròn hoàn toàn
  | "pillow" // Dạng gối
  | "classy" // Kiểu sang trọng
  | "dot"; // Chấm tròn

// Mapping sang qr-code-styling library
const EYE_STYLE_MAP: Record<EyeStyle, string> = {
  soft: "extra-rounded",
  square: "square",
  round: "dot",
  pillow: "dot",
  classy: "square",
  dot: "dot",
};
```

### 1.4 LogoConfig Interface (Chưa implement)

```typescript
interface LogoConfig {
  // File logo
  file: File | null;

  // URL của logo (sau khi upload)
  url: string;

  // Kích thước logo (% của QR code)
  size: number; // 0.1 - 0.5 (10% - 50%)

  // Margin xung quanh logo
  margin: number; // pixels

  // Có ẩn dots phía sau logo không
  hideBackgroundDots: boolean;

  // Có match màu từ logo không
  matchColors: boolean;
}
```

### 1.5 FrameConfig Interface (Chưa implement)

```typescript
interface FrameConfig {
  // Có hiển thị frame không
  enabled: boolean;

  // Kiểu frame
  style: FrameStyle;

  // Màu frame
  color: string;

  // Text label
  label: string;

  // Font của label
  labelFont: string;

  // Màu text label
  labelColor: string;

  // Vị trí label
  labelPosition: "top" | "bottom";
}

type FrameStyle =
  | "none"
  | "simple" // Viền đơn giản
  | "rounded" // Viền bo tròn
  | "banner" // Dạng banner
  | "speech-bubble"; // Dạng bong bóng chat
```

### 1.6 BackgroundImageConfig Interface (Chưa implement)

```typescript
interface BackgroundImageConfig {
  // File background image
  file: File | null;

  // URL của background image
  url: string;

  // Độ mờ của background
  opacity: number; // 0 - 1

  // Blur effect
  blur: number; // 0 - 10
}
```

---

## 2. QR Type Models

### 2.1 QRType Enum

```typescript
enum QRType {
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
```

### 2.2 QRTypeConfig Interface

```typescript
interface QRTypeConfig {
  // Tên hiển thị
  name: string;

  // Icon component
  icon: React.ComponentType<IconProps>;

  // Placeholder cho input
  placeholder: string;

  // Hàm encode data thành QR string
  encode: (data: any) => string;

  // Hàm validate input
  validate: (data: any) => ValidationResult;

  // Form fields cho type này
  fields: QRTypeField[];
}
```

### 2.3 QRTypeField Interface

```typescript
interface QRTypeField {
  // Tên field
  name: string;

  // Label hiển thị
  label: string;

  // Loại input
  type: "text" | "email" | "tel" | "url" | "textarea" | "select" | "password";

  // Placeholder
  placeholder: string;

  // Có bắt buộc không
  required: boolean;

  // Validation pattern (regex)
  pattern?: string;

  // Options cho select
  options?: Array<{ value: string; label: string }>;

  // Giá trị mặc định
  defaultValue?: string;
}
```

### 2.4 Specific QR Type Data Models

#### Website QR Data

```typescript
interface WebsiteQRData {
  url: string; // URL đầy đủ
}
```

#### Text QR Data

```typescript
interface TextQRData {
  text: string; // Plain text
}
```

#### Wi-Fi QR Data

```typescript
interface WiFiQRData {
  ssid: string; // Tên mạng
  password: string; // Mật khẩu
  encryption: "WPA" | "WEP" | "nopass"; // Loại mã hóa
  hidden: boolean; // Mạng ẩn hay không
}

// Format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
```

#### Contact (vCard) QR Data

```typescript
interface ContactQRData {
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

// Format: vCard 3.0
```

#### Email QR Data

```typescript
interface EmailQRData {
  to: string; // Email người nhận
  subject?: string; // Tiêu đề
  body?: string; // Nội dung
}

// Format: mailto:email@example.com?subject=Hello&body=Message
```

#### SMS QR Data

```typescript
interface SMSQRData {
  phone: string; // Số điện thoại
  message?: string; // Nội dung tin nhắn
}

// Format: sms:+1234567890?body=Hello
```

#### Phone QR Data

```typescript
interface PhoneQRData {
  phone: string; // Số điện thoại
}

// Format: tel:+1234567890
```

#### WhatsApp QR Data

```typescript
interface WhatsAppQRData {
  phone: string; // Số điện thoại (với country code)
  message?: string; // Tin nhắn mặc định
}

// Format: https://wa.me/1234567890?text=Hello
```

#### Location QR Data

```typescript
interface LocationQRData {
  latitude: number;
  longitude: number;
  label?: string; // Tên địa điểm
}

// Format: geo:37.7749,-122.4194?q=San+Francisco
```

#### Social Profile QR Data

```typescript
interface SocialQRData {
  platform: SocialPlatform;
  username: string;
}

type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "facebook"
  | "github"
  | "threads";

// Format: https://instagram.com/username
```

#### Event (Calendar) QR Data

```typescript
interface EventQRData {
  title: string;
  location?: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
}

// Format: iCalendar (BEGIN:VEVENT...)
```

#### Payment QR Data

```typescript
interface PaymentQRData {
  platform: PaymentPlatform;
  username: string;
  amount?: number;
  note?: string;
}

type PaymentPlatform = "paypal" | "venmo" | "cashapp" | "revolut";

// Format: https://paypal.me/username/amount
```

---

## 3. UI State Models

### 3.1 ColorPreset Interface

```typescript
interface ColorPreset {
  name: string;
  colors: [string, string]; // [color1, color2] for gradient
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: "Peach", colors: ["#F472B6", "#FB923C"] },
  { name: "Strawberry", colors: ["#F43F5E", "#FB7185"] },
  { name: "Mint", colors: ["#10B981", "#34D399"] },
  { name: "Sky", colors: ["#3B82F6", "#60A5FA"] },
  { name: "Mono", colors: ["#4A4658", "#8B8799"] },
];
```

### 3.2 ExportFormat Type

```typescript
type ExportFormat = "png" | "jpeg" | "svg" | "pdf";

interface ExportOptions {
  format: ExportFormat;
  resolution: number; // 512, 1024, 2048, 3200
  quality?: number; // 0.1 - 1.0 (for JPEG)
  filename?: string;
}
```

### 3.3 QRGeneratorState Interface

```typescript
interface QRGeneratorState {
  // QR data
  qrValue: string;
  selectedType: QRType;

  // Customization
  customization: QRCustomization;

  // Export settings
  exportFormat: ExportFormat;
  resolution: number;

  // UI state
  isGenerating: boolean;
  error: string | null;

  // History (localStorage)
  history?: QRHistoryItem[];
}
```

### 3.4 QRHistoryItem Interface

```typescript
interface QRHistoryItem {
  id: string; // UUID
  type: QRType;
  value: string;
  customization: QRCustomization;
  thumbnail: string; // Base64 image
  createdAt: Date;
}
```

---

## 4. Validation Models

### 4.1 ValidationResult Interface

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: ValidationErrorCode;
}

enum ValidationErrorCode {
  REQUIRED = "REQUIRED",
  INVALID_FORMAT = "INVALID_FORMAT",
  TOO_SHORT = "TOO_SHORT",
  TOO_LONG = "TOO_LONG",
  INVALID_URL = "INVALID_URL",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_PHONE = "INVALID_PHONE",
}
```

---

## 5. Component Props Models

### 5.1 QRTypeSelectorProps

```typescript
interface QRTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  qrValue: string;
  onQrValueChange: (value: string) => void;
}
```

### 5.2 QRPreviewProps

```typescript
interface QRPreviewProps {
  qrValue: string;
  customization: QRCustomization;
}
```

### 5.3 CustomizationOptionsProps

```typescript
interface CustomizationOptionsProps {
  customization: QRCustomization;
  onCustomizationChange: (customization: QRCustomization) => void;
}
```

### 5.4 IconProps

```typescript
interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}
```

---

## 6. API Response Models (Future)

### 6.1 QRGenerationResponse

```typescript
interface QRGenerationResponse {
  success: boolean;
  data?: {
    qrCode: string; // Base64 image
    url?: string; // URL to download
  };
  error?: {
    code: string;
    message: string;
  };
}
```

### 6.2 AnalyticsData (Future)

```typescript
interface AnalyticsData {
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
```

---

## 7. Constants

### 7.1 Color Constants

```typescript
const COLORS = {
  // Primary colors
  cream: "#FFF8F0",
  creamDeep: "#F4F1ED",
  ink: "#4A4658",
  inkSoft: "#8B8799",
  inkFaint: "#B8B4C4",

  // Accent colors
  mint: "#10B981",
  mintDeep: "#059669",
  lavender: "#A78BFA",
  peach: "#FB923C",
  peachDeep: "#F472B6",
  rose: "#F43F5E",

  // QR background colors
  white: "#FFFFFF",
  blush: "#FFE6E1",
  lilac: "#F1ECFF",
  mintAir: "#E6F6EF",
  skyAir: "#EAF3FF",
  butter: "#FFF7DA",
  pearl: "#F4F1ED",
} as const;
```

### 7.2 Default Values

```typescript
const DEFAULT_CUSTOMIZATION: QRCustomization = {
  bgColor: "#FFF8F0",
  fgColor: "#4A4658",
  eyeColor: "#4A4658",
  useGradient: false,
  gradientColors: ["#F472B6", "#FB923C"],
  dotStyle: "rounded",
  eyeStyle: "soft",
};

const DEFAULT_RESOLUTION = 1024;
const DEFAULT_FORMAT: ExportFormat = "png";
const DEFAULT_QR_VALUE = "https://example.com";
const DEFAULT_QR_TYPE = QRType.WEBSITE;
```

### 7.3 Limits

```typescript
const LIMITS = {
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
```

---

## 8. Type Guards

```typescript
// Type guard cho QR types
function isWebsiteQRData(data: any): data is WebsiteQRData {
  return typeof data === "object" && typeof data.url === "string";
}

function isWiFiQRData(data: any): data is WiFiQRData {
  return (
    typeof data === "object" &&
    typeof data.ssid === "string" &&
    typeof data.password === "string" &&
    ["WPA", "WEP", "nopass"].includes(data.encryption)
  );
}

// Type guard cho validation
function isValidationError(error: any): error is ValidationError {
  return (
    typeof error === "object" &&
    typeof error.field === "string" &&
    typeof error.message === "string" &&
    Object.values(ValidationErrorCode).includes(error.code)
  );
}
```

---

## 9. Utility Types

```typescript
// Partial customization (cho updates)
type PartialCustomization = Partial<QRCustomization>;

// Required fields only
type RequiredQRData<T> = Required<Pick<T, keyof T>>;

// Omit sensitive data
type PublicQRData<T> = Omit<T, "password" | "sensitive">;

// Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

---

## 10. Migration Notes

### From Current to New Structure

**Current:**

```typescript
// Inline interface trong component
interface QRCustomization {
  bgColor: string;
  fgColor: string;
  // ...
}
```

**New:**

```typescript
// Import từ types
import { QRCustomization } from "@/types/qr.types";
```

### Breaking Changes

- Tất cả types sẽ được move vào `/types` directory
- Component props sẽ được standardize
- Validation sẽ được centralize

---

**Cập nhật lần cuối:** 2026-05-12  
**Phiên bản:** 0.1.0
