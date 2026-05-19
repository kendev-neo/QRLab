<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/QRLab-QR%20Code%20Generator-8B5CF6?style=for-the-badge&logo=qrcode&logoColor=white">
    <img alt="QRLab" src="https://img.shields.io/badge/QRLab-QR%20Code%20Generator-8B5CF6?style=for-the-badge&logo=qrcode&logoColor=white">
  </picture>
</p>

<p align="center">
  <em>QR codes that actually look good. Free, no signup.</em>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#documentation"><strong>Docs</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome">
</p>

---

## Overview

**QRLab** is a modern, feature-rich QR code generator built with cutting-edge web technologies. Create stunning, customizable QR codes with support for **12 content types**, **multiple export formats**, and a beautiful responsive UI — all without requiring signup or payment.

---

## Features

### Core

- **Real-time preview** — See your QR code update instantly as you customize
- **12 QR types** — Website, Text, Wi-Fi, Email, Phone, SMS, WhatsApp, Contact (vCard), Location (Geo), Social, Event (iCal), Payment
- **Multiple export formats** — PNG, JPEG, SVG, PDF
- **Resolution options** — 512px, 1024px, 2048px

### Customization

- **Colors** — Foreground, background, and marker colors
- **Gradients** — Linear and radial gradient support for QR dots
- **Dot styles** — Square, rounded, dots, and more
- **Eye designs** — Customizable QR code eye (finder pattern) styles

### User Experience

- **Responsive design** — Works seamlessly on mobile, tablet, and desktop
- **No signup required** — Completely free, no watermark, no tracking
- **Real-time validation** — Instant feedback on input fields
- **Toast notifications** — Non-intrusive feedback for actions

### Upcoming

- Logo upload
- Frame & label support
- Background images
- QR code history
- Templates & presets
- Batch generation

---

## Demo

<!-- TODO: Add live demo GIF or screenshot -->

```bash
# Run the development server and visit http://localhost:3000
npm run dev
# or with Bun
bun run dev
```

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) 20+ or [Bun](https://bun.sh)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/qrlab.git
cd qrlab

# Install dependencies
npm install
# or with Bun
bun install

# Run development server
npm run dev
# or with Bun
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
# or with Bun
bun run build
bun run start
```

### Lint

```bash
npm run lint
# or with Bun
bun run lint
```

---

## Tech Stack

| Category      | Technology                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router)                                                                      |
| **UI**        | [React 19](https://react.dev)                                                                                      |
| **Language**  | [TypeScript 5](https://www.typescriptlang.org)                                                                     |
| **Styling**   | [Tailwind CSS 4](https://tailwindcss.com)                                                                          |
| **QR**        | [qr-code-styling](https://github.com/kozakdenys/qr-code-styling), [qrcode](https://github.com/soldair/node-qrcode) |
| **Linting**   | [ESLint 9](https://eslint.org) with `eslint-config-next`                                                           |
| **Fonts**     | Geist (body), Quicksand (display) via Google Fonts                                                                 |

---

## Project Structure

```
qrlab/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Home page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/                # React components
│   ├── QRPreview.tsx          # QR code preview with canvas rendering
│   ├── QRTypeSelector.tsx     # QR type selection dropdown
│   ├── CustomizationOptions.tsx # Color, gradient, style controls
│   ├── Header.tsx             # App header with navigation
│   ├── Footer.tsx             # App footer
│   ├── Icons.tsx              # SVG icon components
│   ├── Toast.tsx              # Toast notification component
│   ├── ToastProvider.tsx      # Toast context provider
│   ├── ToastDemo.tsx          # Toast demonstration
│   ├── Spinner.tsx            # Loading spinner
│   ├── ValidationMessage.tsx  # Input validation display
│   └── ErrorBoundary.tsx      # Error boundary wrapper
├── hooks/                     # Custom React hooks
│   ├── useQRForm.ts           # Form state management
│   ├── useQRGenerator.ts      # QR code generation logic
│   ├── useFileUpload.ts       # File upload handling
│   └── useLocalStorage.ts     # Local storage persistence
├── contexts/                  # React contexts
│   └── LangContext.tsx        # Language/theme context
├── lib/
│   ├── constants/             # App constants & defaults
│   │   ├── colors.ts
│   │   ├── defaults.ts
│   │   └── index.ts
│   ├── qr-types/              # QR type handlers (12 types)
│   │   ├── website.ts
│   │   ├── text.ts
│   │   ├── wifi.ts
│   │   ├── email.ts
│   │   ├── phone.ts
│   │   ├── sms.ts
│   │   ├── whatsapp.ts
│   │   ├── contact.ts
│   │   ├── location.ts
│   │   ├── social.ts
│   │   ├── event.ts
│   │   └── payment.ts
│   └── utils/                 # Utility functions
│       ├── validation.ts
│       ├── qr-helpers.ts
│       ├── error-formatter.ts
│       └── index.ts
├── types/                     # TypeScript type definitions
│   ├── qr.types.ts
│   └── index.ts
├── docs/                      # Documentation
├── public/                    # Static assets
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## QR Types

QRLab supports **12 QR content types**, each with its own dedicated form and validation:

| Type         | Description                           | Format                                   |
| ------------ | ------------------------------------- | ---------------------------------------- |
| **Website**  | URL with optional title               | `https://example.com`                    |
| **Text**     | Plain text content                    | Free text                                |
| **Wi-Fi**    | Network credentials                   | SSID, password, encryption type          |
| **Email**    | Email with subject & body             | `mailto:` link                           |
| **Phone**    | Phone number                          | `tel:` link                              |
| **SMS**      | SMS with pre-filled message           | `sms:` link                              |
| **WhatsApp** | WhatsApp chat with pre-filled message | `https://wa.me/` link                    |
| **Contact**  | vCard contact information             | MECARD format                            |
| **Location** | Geographic coordinates                | `geo:` URI                               |
| **Social**   | Social media profile link             | Platform-specific URL                    |
| **Event**    | Calendar event (iCal)                 | VCALENDAR / VEVENT format                |
| **Payment**  | Payment information (BTC, etc.)       | Cryptocurrency address / payment request |

---

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs) folder:

| Document                                         | Description                        |
| ------------------------------------------------ | ---------------------------------- |
| [API Logic](./docs/API_LOGIC.md)                 | Business logic & algorithms        |
| [Components](./docs/COMPONENTS.md)               | Component API & props reference    |
| [Data Models](./docs/DATA_MODELS.md)             | TypeScript types & data structures |
| [Features](./docs/FEATURES.md)                   | Full feature list & roadmap        |
| [Project Structure](./docs/PROJECT_STRUCTURE.md) | Detailed project organization      |
| [Getting Started](./docs/README.md)              | Documentation index & guide        |

---

## Configuration

### TypeScript

```json
{
    "compilerOptions": {
        "target": "ES2017",
        "lib": ["dom", "dom.iterable", "esnext"],
        "strict": true,
        "noEmit": true,
        "moduleResolution": "bundler",
        "jsx": "preserve",
        "paths": { "@/*": ["./*"] }
    }
}
```

### Environment Variables

Create a `.env.local` file (optional):

```env
# No required environment variables by default
# Add any custom configuration here
```

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/qrlab)

The project is optimized for Vercel deployment with zero configuration.

### Other Platforms

- **Netlify** — Static export via `next build && next export`
- **Docker** — Containerized deployment with multi-stage build
- **Any Node.js host** — Standard `npm run build && npm start`

---

## Roadmap

### Phase 1: Core Completion (Q2 2026) ✅

- [x] Documentation & type definitions
- [x] Constants, utilities & QR type handlers
- [x] Input validation & error handling
- [x] Logo upload

### Phase 2: Enhancement (Q3 2026)

- [ ] Frame & label support
- [ ] QR code history & templates
- [ ] Testing suite (Jest + Playwright)
- [ ] Performance optimization & bundle analysis

### Phase 3: Advanced (Q4 2026)

- [ ] QR code scanner
- [ ] Batch export & generation
- [ ] Multi-language support (i18n)
- [ ] REST API access

### Phase 4: Pro Features (2027)

- [ ] User authentication & cloud sync
- [ ] Dynamic/editable QR codes
- [ ] Analytics & tracking
- [ ] Team collaboration

See [FEATURES.md](./docs/FEATURES.md) for the detailed roadmap.

---

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Guidelines

- Use **TypeScript** for all new code
- Follow existing code style and conventions
- Add **validation** for any new input fields
- Update **documentation** for new features
- Ensure **lint** passes: `npm run lint`

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

## Acknowledgments

- [Next.js](https://nextjs.org) — The React framework
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — QR code generation library
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Vercel](https://vercel.com) — Hosting & deployment platform

---

## Support

- 📖 [Documentation](./docs)
- 🐛 [GitHub Issues](https://github.com/yourusername/qrlab/issues)
- 💬 [GitHub Discussions](https://github.com/yourusername/qrlab/discussions)

---

<p align="center">
  <sub>Built with ❤️ by the QRLab Team</sub>
  <br>
  <sub>© 2026 QRLab. MIT License.</sub>
</p>
