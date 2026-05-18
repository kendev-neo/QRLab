# Component Documentation - QRLab Generator

## Tổng Quan

Tài liệu này mô tả chi tiết các React components trong dự án, bao gồm props, state, và usage examples.

---

## 1. Layout Components

### 1.1 RootLayout

**File:** `app/layout.tsx`

**Mô tả:** Root layout component cho toàn bộ ứng dụng

**Props:**

```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}
```

**Features:**

- Load Google Fonts (Geist, Geist Mono, Quicksand)
- Set metadata cho SEO
- Apply global styles
- Set lang attribute

**Usage:**

```tsx
// Automatically used by Next.js App Router
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable}`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
```

**Metadata:**

```typescript
export const metadata: Metadata = {
  title: "QRLab — QR codes that actually look good. Free, no signup.",
  description:
    "Free QR code generator with logos, colors, gradients, and frame borders. 12 types — Wi-Fi, vCard, WhatsApp, payments. No signup, no watermark.",
};
```

---

### 1.2 Header

**File:** `components/Header.tsx`

**Mô tả:** Navigation header với logo và links

**Props:** None

**State:** None

**Features:**

- Logo/brand name
- Navigation links (About, Contact)
- Responsive layout
- Hover effects

**Structure:**

```tsx
<header>
  <div className="container">
    <div className="logo">QRLab</div>
    <nav>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
</header>
```

**Styling:**

- Background: cream
- Shadow: soft
- Responsive: flex-col on mobile, flex-row on desktop

**Usage:**

```tsx
import Header from "@/components/Header";

<Header />;
```

---

### 1.3 Footer

**File:** `components/Footer.tsx`

**Mô tả:** Footer với links và copyright

**Props:** None

**State:** None

**Features:**

- 3-column grid layout
- QR Types links
- Navigation links
- Legal links
- Copyright notice
- Responsive layout

**Structure:**

```tsx
<footer>
  <div className="grid lg:grid-cols-3">
    <div>
      <h3>QR Types</h3>
      <nav>
        <a href="/wifi-qr-code-generator">Wi-Fi QR</a>
        <a href="/vcard-qr-code-generator">vCard QR</a>
        {/* ... */}
      </nav>
    </div>
    <div>
      <h3>Navigation</h3>
      <nav>{/* ... */}</nav>
    </div>
    <div>
      <h3>Legal</h3>
      <nav>{/* ... */}</nav>
    </div>
  </div>
  <div className="copyright">© {new Date().getFullYear()} QRLab</div>
</footer>
```

**Usage:**

```tsx
import Footer from "@/components/Footer";

<Footer />;
```

---

## 2. Core Components

### 2.1 HomePage

**File:** `app/page.tsx`

**Mô tả:** Main page component với tất cả sections

**Props:** None

**State:**

```typescript
const [qrValue, setQrValue] = useState<string>("https://example.com");
const [selectedType, setSelectedType] = useState<string>("Website");
const [customization, setCustomization] = useState<QRCustomization>({
  bgColor: "#FFF8F0",
  fgColor: "#4A4658",
  eyeColor: "#4A4658",
  useGradient: false,
  gradientColors: ["#F472B6", "#FB923C"],
  dotStyle: "rounded",
  eyeStyle: "soft",
});
```

**Sections:**

1. Hero Section - Headline và CTA buttons
2. Features Strip - 4 feature cards
3. Editor Section - 3-column grid (Type Selector, Preview, Customization)
4. Pricing Section - 3 pricing cards
5. FAQ Section - 6 FAQ items
6. CTA Section - Final call-to-action

**Data Flow:**

```
HomePage (state)
  ├─> QRTypeSelector (qrValue, selectedType)
  ├─> QRPreview (qrValue, customization)
  └─> CustomizationOptions (customization)
```

**Usage:**

```tsx
// Automatically rendered by Next.js at /
export default function HomePage() {
  // State management
  // Render sections
}
```

---

### 2.2 QRTypeSelector

**File:** `components/QRTypeSelector.tsx`

**Mô tả:** Component chọn loại QR code và nhập data

**Props:**

```typescript
interface QRTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  qrValue: string;
  onQrValueChange: (value: string) => void;
}
```

**State:**

```typescript
const [inputValue, setInputValue] = useState<string>(qrValue);
```

**Features:**

- Grid 12 QR types với icons
- Type selection
- Input field với placeholder động
- Sync với parent state

**QR Types:**

```typescript
const qrTypes = [
  { name: "Website", icon: GlobeIcon, placeholder: "https://example.com" },
  { name: "Text", icon: TextIcon, placeholder: "Your text here" },
  { name: "Wi-Fi", icon: WifiIcon, placeholder: "Network name" },
  { name: "Contact", icon: UsersIcon, placeholder: "Contact info" },
  { name: "Email", icon: MailIcon, placeholder: "email@example.com" },
  { name: "SMS", icon: MessageCircleIcon, placeholder: "Phone number" },
  { name: "Phone", icon: PhoneIcon, placeholder: "+1234567890" },
  { name: "WhatsApp", icon: MessageCircleIcon, placeholder: "Phone number" },
  { name: "Location", icon: MapPinIcon, placeholder: "Address" },
  { name: "Social", icon: UsersIcon, placeholder: "Profile URL" },
  { name: "Event", icon: CalendarIcon, placeholder: "Event details" },
  { name: "Pay me", icon: DollarSignIcon, placeholder: "Payment info" },
];
```

**Event Handlers:**

```typescript
const handleTypeSelect = (type: string) => {
  onTypeChange(type);
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newValue = e.target.value;
  setInputValue(newValue);
  onQrValueChange(newValue);
};
```

**Usage:**

```tsx
<QRTypeSelector
  selectedType={selectedType}
  onTypeChange={setSelectedType}
  qrValue={qrValue}
  onQrValueChange={setQrValue}
/>
```

**Improvements Needed:**

- [ ] Multi-field forms cho từng QR type
- [ ] Validation
- [ ] Error messages
- [ ] Character counter

---

### 2.3 QRPreview

**File:** `components/QRPreview.tsx`

**Mô tả:** Component preview và download QR code

**Props:**

```typescript
interface QRPreviewProps {
  qrValue: string;
  customization: QRCustomization;
}
```

**State:**

```typescript
const [resolution, setResolution] = useState<number>(1024);
const [format, setFormat] = useState<string>("png");
```

**Refs:**

```typescript
const containerRef = useRef<HTMLDivElement>(null);
const qrRef = useRef<QRCodeStyling | null>(null);
const prevOptsRef = useRef<string>("");
```

**Features:**

- Real-time QR preview
- Download buttons (PNG, JPEG, SVG, PDF)
- Resolution selector (512px, 1024px, 2048px)
- Auto-regenerate on changes

**QR Generation:**

```typescript
const buildOptions = useCallback(() => {
  const size = resolution <= 512 ? 300 : resolution <= 1024 ? 350 : 450;
  const dotType = DOT_STYLE_MAP[customization.dotStyle] || "rounded";
  const eyeType = EYE_STYLE_MAP[customization.eyeStyle] || "extra-rounded";

  return {
    type: "canvas",
    width: size,
    height: size,
    data: qrValue,
    margin: 8,
    qrOptions: { errorCorrectionLevel: "H" },
    dotsOptions: {
      /* ... */
    },
    cornersSquareOptions: {
      /* ... */
    },
    cornersDotOptions: {
      /* ... */
    },
    backgroundOptions: {
      /* ... */
    },
  };
}, [qrValue, customization, resolution]);
```

**Download Handler:**

```typescript
const handleDownload = async (ext: string) => {
  if (!qrRef.current) return;
  setFormat(ext);

  setTimeout(async () => {
    try {
      await qrRef.current?.download({
        name: "qrcode",
        extension: ext,
      });
    } catch (e) {
      console.error("Download error:", e);
    }
  }, 50);
};
```

**Usage:**

```tsx
<QRPreview qrValue={qrValue} customization={customization} />
```

**Improvements Needed:**

- [ ] Loading state
- [ ] Error handling
- [ ] Copy to clipboard
- [ ] Share functionality
- [ ] Preview zoom

---

### 2.4 CustomizationOptions

**File:** `components/CustomizationOptions.tsx`

**Mô tả:** Component tùy chỉnh màu sắc và style QR code

**Props:**

```typescript
interface CustomizationOptionsProps {
  customization: QRCustomization;
  onCustomizationChange: (customization: QRCustomization) => void;
}
```

**State:**

```typescript
const [selectedPreset, setSelectedPreset] = useState<string>("Peach");
const [logoFile, setLogoFile] = useState<File | null>(null);
const [bgImageFile, setBgImageFile] = useState<File | null>(null);
```

**Features:**

- Color presets (5 presets)
- Dot color picker (11 colors + custom)
- Eye color picker (11 colors + custom)
- Background color picker (8 colors + custom)
- Gradient toggle và color pickers
- Dot style selector (6 styles)
- Eye design selector (6 styles)
- Logo upload (UI only)
- Frame & Label inputs (UI only)
- Background image upload (UI only)

**Presets:**

```typescript
const presets = [
  { name: "Peach", colors: ["#F472B6", "#FB923C"] },
  { name: "Strawberry", colors: ["#F43F5E", "#FB7185"] },
  { name: "Mint", colors: ["#10B981", "#34D399"] },
  { name: "Sky", colors: ["#3B82F6", "#60A5FA"] },
  { name: "Mono", colors: ["#4A4658", "#8B8799"] },
];
```

**Event Handlers:**

```typescript
const handlePresetSelect = (presetName: string) => {
  setSelectedPreset(presetName);
  const preset = presets.find((p) => p.name === presetName);
  if (preset) {
    onCustomizationChange({
      ...customization,
      fgColor: preset.colors[0],
      eyeColor: preset.colors[0],
      useGradient: true,
      gradientColors: [preset.colors[0], preset.colors[1]],
    });
  }
};

const handleDotColorSelect = (color: string) => {
  onCustomizationChange({
    ...customization,
    fgColor: color,
    eyeColor: color,
    useGradient: false,
  });
};

// ... more handlers
```

**Usage:**

```tsx
<CustomizationOptions
  customization={customization}
  onCustomizationChange={setCustomization}
/>
```

**Improvements Needed:**

- [ ] Implement logo upload logic
- [ ] Implement frame & label logic
- [ ] Implement background image logic
- [ ] Split into smaller sub-components
- [ ] Add color picker library
- [ ] Add tooltips

---

## 3. Icon Components

### 3.1 Icons

**File:** `components/Icons.tsx`

**Mô tả:** Library các SVG icon components

**Props:**

```typescript
interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}
```

**Available Icons:**

- PaletteIcon
- ImageIcon
- GridIcon
- DownloadIcon
- CheckIcon
- ChevronDownIcon
- StarIcon
- QrCodeIcon
- WifiIcon
- MailIcon
- PhoneIcon
- GlobeIcon
- MessageCircleIcon
- MapPinIcon
- UsersIcon
- CalendarIcon
- DollarSignIcon
- TextIcon

**Icon Template:**

```tsx
export const IconName: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  className,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="..." />
  </svg>
);
```

**Usage:**

```tsx
import { QrCodeIcon, DownloadIcon } from "@/components/Icons";

<QrCodeIcon width={20} height={20} className="text-peach-deep" />
<DownloadIcon width={16} height={16} />
```

**Styling:**

- Sử dụng `currentColor` để inherit màu từ parent
- Stroke width: 1.75 (consistent)
- Round linecap và linejoin

---

## 4. Component Patterns

### 4.1 Controlled Components

Tất cả form components đều là controlled components:

```tsx
// Parent component
const [value, setValue] = useState("");

// Child component
<Input value={value} onChange={setValue} />;
```

### 4.2 Composition Pattern

Components được compose từ các components nhỏ hơn:

```tsx
<HomePage>
  <Header />
  <main>
    <HeroSection />
    <FeaturesSection />
    <EditorSection>
      <QRTypeSelector />
      <QRPreview />
      <CustomizationOptions />
    </EditorSection>
    <PricingSection />
    <FAQSection />
    <CTASection />
  </main>
  <Footer />
</HomePage>
```

### 4.3 Props Drilling

Hiện tại sử dụng props drilling cho state management:

```
HomePage (state)
  └─> EditorSection
      ├─> QRTypeSelector (props)
      ├─> QRPreview (props)
      └─> CustomizationOptions (props)
```

**Improvement:** Sử dụng Context API hoặc state management library

---

## 5. Component Refactoring Plan

### 5.1 Split Large Components

**CustomizationOptions.tsx** (400+ lines) nên được split thành:

```
CustomizationOptions/
├── index.tsx                 # Main component
├── ColorPresets.tsx          # Preset buttons
├── DotColorPicker.tsx        # Dot color section
├── EyeColorPicker.tsx        # Eye color section
├── BackgroundPicker.tsx      # Background section
├── StyleSelector.tsx         # Dot & eye style
├── LogoUpload.tsx            # Logo upload section
├── FrameOptions.tsx          # Frame & label section
└── BackgroundImage.tsx       # Background image section
```

### 5.2 Extract Business Logic

Tách logic ra khỏi components:

```tsx
// Before
const QRPreview = ({ qrValue, customization }) => {
  // 100+ lines of QR generation logic
  // ...
};

// After
const QRPreview = ({ qrValue, customization }) => {
  const qrCode = useQRGenerator(qrValue, customization);

  return (
    <div>
      <QRCanvas qrCode={qrCode} />
      <DownloadButtons qrCode={qrCode} />
    </div>
  );
};
```

### 5.3 Create Custom Hooks

```typescript
// hooks/useQRGenerator.ts
export function useQRGenerator(value: string, customization: QRCustomization) {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  useEffect(() => {
    const qr = generateQR(value, customization);
    setQrCode(qr);
  }, [value, customization]);

  return qrCode;
}

// hooks/useFileUpload.ts
export function useFileUpload(options: FileUploadOptions) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleUpload = async (file: File) => {
    // Validation and processing
  };

  return { file, preview, error, handleUpload };
}
```

### 5.4 Add Error Boundaries

```tsx
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <QRPreview />
</ErrorBoundary>;
```

### 5.5 Add Loading States

```tsx
// components/QRPreview.tsx
const QRPreview = ({ qrValue, customization }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <QRCanvas />;
};
```

---

## 6. Component Testing

### 6.1 Unit Tests

```typescript
// __tests__/components/QRTypeSelector.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import QRTypeSelector from "@/components/QRTypeSelector";

describe("QRTypeSelector", () => {
  it("renders all QR types", () => {
    render(
      <QRTypeSelector
        selectedType="Website"
        onTypeChange={jest.fn()}
        qrValue=""
        onQrValueChange={jest.fn()}
      />
    );

    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Wi-Fi")).toBeInTheDocument();
    // ... test all types
  });

  it("calls onTypeChange when type is selected", () => {
    const onTypeChange = jest.fn();
    render(
      <QRTypeSelector
        selectedType="Website"
        onTypeChange={onTypeChange}
        qrValue=""
        onQrValueChange={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Email"));
    expect(onTypeChange).toHaveBeenCalledWith("Email");
  });

  it("updates input value", () => {
    const onQrValueChange = jest.fn();
    render(
      <QRTypeSelector
        selectedType="Website"
        onTypeChange={jest.fn()}
        qrValue=""
        onQrValueChange={onQrValueChange}
      />
    );

    const input = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(input, { target: { value: "https://test.com" } });

    expect(onQrValueChange).toHaveBeenCalledWith("https://test.com");
  });
});
```

### 6.2 Integration Tests

```typescript
// __tests__/integration/qr-generation.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "@/app/page";

describe("QR Generation Flow", () => {
  it("generates QR code when user inputs URL", async () => {
    render(<HomePage />);

    // Select Website type
    fireEvent.click(screen.getByText("Website"));

    // Enter URL
    const input = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(input, { target: { value: "https://test.com" } });

    // Wait for QR to generate
    await waitFor(() => {
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  it("updates QR when customization changes", async () => {
    render(<HomePage />);

    // Change dot color
    const colorButton = screen.getByTitle("Mint");
    fireEvent.click(colorButton);

    // QR should regenerate
    await waitFor(() => {
      // Assert QR updated
    });
  });
});
```

---

## 7. Component Best Practices

### 7.1 TypeScript

- ✅ Sử dụng TypeScript cho tất cả components
- ✅ Define interfaces cho props
- ✅ Avoid `any` type
- ✅ Use strict mode

### 7.2 Performance

- ✅ Use `React.memo` cho components không thay đổi thường xuyên
- ✅ Use `useCallback` cho event handlers
- ✅ Use `useMemo` cho expensive calculations
- ✅ Debounce input handlers

### 7.3 Accessibility

- ✅ Use semantic HTML
- ✅ Add ARIA labels
- ✅ Support keyboard navigation
- ✅ Add focus states
- ✅ Test with screen readers

### 7.4 Code Style

- ✅ Consistent naming (PascalCase cho components)
- ✅ One component per file
- ✅ Props destructuring
- ✅ Early returns
- ✅ Meaningful variable names

---

**Cập nhật lần cuối:** 2026-05-12  
**Phiên bản:** 0.1.0
