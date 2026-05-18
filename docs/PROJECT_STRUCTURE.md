# Cấu Trúc Dự Án - QRLab Generator

## Tổng Quan

Dự án QRLab là một ứng dụng web tạo QR code với giao diện đẹp mắt, được xây dựng trên Next.js 16 với React 19 và TypeScript.

## Cấu Trúc Thư Mục

```
qr-generator/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Trang chính (Home page)
│   ├── layout.tsx               # Root layout với fonts và metadata
│   ├── globals.css              # CSS toàn cục và Tailwind config
│   └── favicon.ico              # Favicon
│
├── components/                   # React Components
│   ├── Header.tsx               # Header navigation
│   ├── Footer.tsx               # Footer với links
│   ├── QRTypeSelector.tsx       # Component chọn loại QR code
│   ├── QRPreview.tsx            # Component preview và download QR
│   ├── CustomizationOptions.tsx # Component tùy chỉnh màu sắc, style
│   └── Icons.tsx                # SVG Icons library
│
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── docs/                         # Documentation (sẽ tạo)
│   ├── PROJECT_STRUCTURE.md     # File này
│   ├── DATA_MODELS.md           # Mô hình dữ liệu
│   ├── API_LOGIC.md             # Logic và API
│   ├── FEATURES.md              # Danh sách tính năng
│   └── COMPONENTS.md            # Component documentation
│
├── lib/                          # Utilities và helpers (sẽ tạo)
│   ├── qr-types/                # QR type handlers
│   ├── utils/                   # Utility functions
│   └── constants/               # Constants và configs
│
├── types/                        # TypeScript type definitions (sẽ tạo)
│   ├── qr.types.ts              # QR related types
│   └── index.ts                 # Export all types
│
├── hooks/                        # Custom React hooks (sẽ tạo)
│   ├── useQRGenerator.ts        # QR generation logic
│   └── useFileUpload.ts         # File upload logic
│
├── .next/                        # Next.js build output
├── node_modules/                 # Dependencies
│
├── .gitignore                    # Git ignore rules
├── DESIGN_DOCUMENT.md            # Design system documentation
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies và scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project README

```

## Mô Tả Chi Tiết

### `/app` - Next.js App Router

**page.tsx**

- Component chính của trang home
- Quản lý state cho QR value, type, và customization
- Render các sections: Hero, Features, Editor, Pricing, FAQ, CTA

**layout.tsx**

- Root layout cho toàn bộ app
- Load fonts: Geist (sans), Geist Mono, Quicksand (display)
- Định nghĩa metadata cho SEO

**globals.css**

- Import Tailwind CSS
- Định nghĩa CSS variables (colors, radius, shadows)
- Base styles và utility classes

### `/components` - React Components

**Header.tsx**

- Navigation header
- Logo và navigation links (About, Contact)
- Responsive design

**Footer.tsx**

- Footer với 3 columns: QR Types, Navigation, Legal
- Links đến các trang phụ
- Copyright notice

**QRTypeSelector.tsx**

- Grid 12 loại QR code với icons
- Input field cho QR data
- Props: selectedType, onTypeChange, qrValue, onQrValueChange

**QRPreview.tsx**

- Preview QR code real-time
- Download buttons (PNG, JPEG, SVG, PDF)
- Resolution selector (512px, 1024px, 2048px)
- Sử dụng library: qr-code-styling

**CustomizationOptions.tsx**

- Color presets (Peach, Strawberry, Mint, Sky, Mono)
- Dot color picker
- Eye color picker
- Dot style selector (Rounded, Dots, Square, Classic, Soft, Pillow)
- Eye design selector (Soft, Square, Round, Pillow, Classy, Dot)
- Background color picker
- Logo upload (chưa implement)
- Frame & Label inputs (chưa implement)
- Background image upload (chưa implement)

**Icons.tsx**

- Library các SVG icons
- Icons: Palette, Image, Grid, Download, Check, Chevron, Star, QrCode, Wifi, Mail, Phone, Globe, MessageCircle, MapPin, Users, Calendar, DollarSign, Text

### `/public` - Static Assets

Chứa các file SVG và static assets khác

### Các Thư Mục Sẽ Tạo

**`/lib`** - Business Logic

- Xử lý logic tạo QR code cho từng loại
- Utility functions
- Constants và configurations

**`/types`** - TypeScript Types

- Type definitions cho QR customization
- Interface cho các components
- Enum cho QR types

**`/hooks`** - Custom Hooks

- useQRGenerator: Logic tạo QR code
- useFileUpload: Logic upload file
- useLocalStorage: Lưu history

**`/docs`** - Documentation

- Tài liệu kỹ thuật chi tiết

## Dependencies Chính

### Production Dependencies

- **next**: 16.2.6 - React framework
- **react**: 19.2.4 - UI library
- **react-dom**: 19.2.4 - React DOM renderer
- **qr-code-styling**: ^1.9.2 - QR code generation với styling
- **qrcode**: ^1.5.4 - QR code generation library

### Development Dependencies

- **typescript**: ^5 - Type safety
- **tailwindcss**: ^4 - CSS framework
- **@tailwindcss/postcss**: ^4 - PostCSS plugin
- **eslint**: ^9 - Code linting
- **eslint-config-next**: 16.2.6 - Next.js ESLint config
- **@types/node**: ^20 - Node.js types
- **@types/react**: ^19 - React types
- **@types/react-dom**: ^19 - React DOM types
- **@types/qrcode**: ^1.5.6 - QRCode types

## Scripts

```json
{
  "dev": "next dev", // Development server
  "build": "next build", // Production build
  "start": "next start", // Production server
  "lint": "eslint" // Run linter
}
```

## Routing

Hiện tại chỉ có 1 route:

- `/` - Home page (QR Generator)

Các routes sẽ cần thêm:

- `/about` - About page
- `/contact` - Contact page
- `/blog` - Blog listing
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/wifi-qr-code-generator` - Wi-Fi QR generator
- `/vcard-qr-code-generator` - vCard QR generator
- `/whatsapp-qr-code-generator` - WhatsApp QR generator
- `/payment-qr-code-generator` - Payment QR generator

## State Management

Hiện tại sử dụng React useState trong component chính:

- `qrValue`: string - Nội dung QR code
- `selectedType`: string - Loại QR code đã chọn
- `customization`: QRCustomization - Cấu hình tùy chỉnh

```typescript
interface QRCustomization {
  bgColor: string;
  fgColor: string;
  eyeColor: string;
  useGradient: boolean;
  gradientColors: [string, string];
  dotStyle: string;
  eyeStyle: string;
}
```

## Styling System

### Tailwind CSS 4

- Utility-first CSS framework
- Custom theme trong globals.css
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### CSS Variables

```css
--color-cream: #fff8f0 --color-cream-deep: #f4f1ed --color-ink: #4a4658
  --color-ink-soft: #8b8799 --color-ink-faint: #b8b4c4 --color-mint: #10b981
  --color-mint-deep: #059669 --color-lavender: #a78bfa --color-peach: #fb923c
  --color-peach-deep: #f472b6 --color-rose: #f43f5e --radius-card: 0.75rem
  --radius-sm: 0.25rem --radius-lg: 1rem --radius-full: 9999px --shadow-soft: 0
  4px 6px -1px rgba(0, 0, 0, 0.1);
```

### Fonts

- **Geist**: Body text (sans-serif)
- **Geist Mono**: Code/monospace
- **Quicksand**: Display text (headings, buttons)

## Build & Deployment

### Development

```bash
npm run dev
# Server chạy tại http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Deployment Platforms

- **Vercel** (recommended) - Zero config deployment
- **Netlify** - Static site hosting
- **AWS Amplify** - Full-stack deployment
- **Docker** - Containerized deployment

## Performance Considerations

### Current

- Client-side rendering cho QR generation
- Real-time preview updates
- No caching strategy

### Improvements Needed

- Image optimization
- Code splitting
- Lazy loading components
- Service worker for offline support
- CDN for static assets

## Security Considerations

### Current

- Client-side only (no backend)
- No user authentication
- No data storage

### Future

- Input validation
- XSS protection
- CSRF protection (if adding backend)
- Rate limiting (if adding API)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Accessibility

### Current

- ARIA labels on interactive elements
- Semantic HTML
- Keyboard navigation support
- Focus states

### Improvements Needed

- Screen reader testing
- Color contrast validation
- WCAG 2.1 AA compliance audit
- Keyboard shortcuts

## Testing Strategy (To Be Implemented)

### Unit Tests

- Component rendering
- Utility functions
- QR generation logic

### Integration Tests

- User flows
- Component interactions
- QR download functionality

### E2E Tests

- Complete user journeys
- Cross-browser testing
- Mobile responsiveness

## Version Control

### Git Workflow

- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

## Environment Variables

Hiện tại không có environment variables. Sẽ cần thêm:

```env
NEXT_PUBLIC_SITE_URL=https://qrlab.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_API_URL=https://api.qrlab.app
```

## Monitoring & Analytics

### To Be Added

- Google Analytics
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics

## Documentation Status

- ✅ Design Document (DESIGN_DOCUMENT.md)
- ✅ Project Structure (file này)
- 🔄 Data Models (đang tạo)
- 🔄 API Logic (đang tạo)
- �� Features List (đang tạo)
- 🔄 Component Documentation (đang tạo)
- ❌ Testing Documentation
- ❌ Deployment Guide
- ❌ Contributing Guide

---

**Cập nhật lần cuối:** 2026-05-12  
**Phiên bản:** 0.1.0
