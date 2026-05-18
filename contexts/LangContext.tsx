"use client";
import React, { createContext, useContext, useState } from "react";

export type Lang = "en" | "vi";

interface LangContextValue {
    lang: Lang;
    setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
    lang: "en",
    setLang: () => {},
});

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [lang, setLang] = useState<Lang>("en");
    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
};

export const useLang = () => useContext(LangContext);

// ─── Translation dictionary ─────────────────────────────────────────────────

export const t = {
    en: {
        // Header
        nav_faq: "FAQ",
        nav_create: "Create QR",

        // Hero
        hero_tagline:
            "Free QR code generator with logos, colors, gradients, and frame borders. 12 types — Wi-Fi, vCard, WhatsApp, payments. No signup, no watermark.",
        hero_cta: "Create a QR Code",

        // Features strip
        feat_colors: "Custom colors",
        feat_logo: "Add a logo",
        feat_types: "12 QR types",
        feat_formats: "PNG, SVG, PDF",

        // FAQ
        faq_heading: "Frequently asked questions",
        faq: [
            {
                q: "Is QRLab free?",
                a: "Yes — completely free, with unlimited QR codes and downloads. No signup, no watermark, no attribution required.",
            },
            {
                q: "Do I need an account?",
                a: "No. The entire generator runs in your browser — you can design and download QR codes without signing up.",
            },
            {
                q: "Will my QR code keep working forever?",
                a: "Yes. These are static QR codes — the destination is encoded inside the image itself, so the QR keeps working with no servers involved and never expires.",
            },
            {
                q: "Can I add my company logo?",
                a: "Yes. Upload any logo (PNG, JPG, or SVG) and click Match colors from logo to auto-theme the QR around it. Error correction is automatically bumped to the highest level so the code still scans reliably.",
            },
            {
                q: "What QR types are supported?",
                a: "Twelve: website, plain text, Wi-Fi, contact card (vCard), email, SMS, phone, WhatsApp, location, social profile (Instagram, TikTok, X, LinkedIn, YouTube, Facebook, GitHub, Threads), calendar event, and payment links (PayPal, Venmo, Cash App, Revolut).",
            },
            {
                q: "What formats can I download?",
                a: "PNG, JPEG, SVG, and PDF — at resolutions from 512 px up to 3200 px. SVG is vector and stays sharp at any size.",
            },
        ],

        // CTA section
        cta_heading: "Ready to make something beautiful?",
        cta_sub:
            "Create a stunning QR code in seconds. Free, no signup, no watermark.",
        cta_btn: "Create a QR Code",

        // Footer
        footer_brand_desc:
            "Free QR code generator with logos, colors, and gradients. No signup, no watermark.",
        footer_qr_types: "QR Types",
        footer_qr_items: [
            { label: "Website", href: "#editor" },
            { label: "Wi-Fi", href: "#editor" },
            { label: "Contact", href: "#editor" },
            { label: "WhatsApp", href: "#editor" },
            { label: "Location", href: "#editor" },
            { label: "Pay me", href: "#editor" },
        ],
        footer_product: "Product",
        footer_product_items: [
            { label: "Features", href: "#editor" },
            { label: "FAQ", href: "#faq" },
        ],
        footer_legal: "Legal",
        footer_legal_items: [
            { label: "Privacy policy", href: "/privacy" },
            { label: "Terms of use", href: "/terms" },
        ],
        footer_rights: "All rights reserved.",
        footer_made: "Made with ♥ by Kendev — free forever, no watermark.",
    },

    vi: {
        // Header
        nav_faq: "FAQ",
        nav_create: "Tạo QR",

        // Hero
        hero_tagline:
            "Tạo mã QR miễn phí với logo, màu sắc, gradient và viền khung. 12 loại — Wi-Fi, vCard, WhatsApp, thanh toán. Không đăng ký, không watermark.",
        hero_cta: "Tạo mã QR",

        // Features strip
        feat_colors: "Tùy chỉnh màu sắc",
        feat_logo: "Thêm logo",
        feat_types: "12 loại QR",
        feat_formats: "PNG, SVG, PDF",

        // FAQ
        faq_heading: "Câu hỏi thường gặp",
        faq: [
            {
                q: "QRLab có miễn phí không?",
                a: "Có — hoàn toàn miễn phí, tạo không giới hạn mã QR và tải xuống. Không cần đăng ký, không watermark, không cần ghi nguồn.",
            },
            {
                q: "Tôi có cần tạo tài khoản không?",
                a: "Không. Toàn bộ trình tạo QR chạy ngay trên trình duyệt — bạn có thể thiết kế và tải mã QR mà không cần đăng ký.",
            },
            {
                q: "Mã QR có hoạt động mãi không?",
                a: "Có. Đây là mã QR tĩnh — đích đến được mã hóa ngay trong hình ảnh, không cần server và không bao giờ hết hạn.",
            },
            {
                q: "Tôi có thể thêm logo công ty không?",
                a: "Có. Tải lên bất kỳ logo nào (PNG, JPG hoặc SVG) và nhấn 'Lấy màu từ logo' để tự động tạo chủ đề QR theo logo. Mức sửa lỗi tự động được nâng cao nhất để mã vẫn quét được.",
            },
            {
                q: "Hỗ trợ những loại QR nào?",
                a: "12 loại: website, văn bản, Wi-Fi, danh bạ (vCard), email, SMS, điện thoại, WhatsApp, vị trí, mạng xã hội (Instagram, TikTok, X, LinkedIn, YouTube, Facebook, GitHub, Threads), sự kiện lịch và liên kết thanh toán (PayPal, Venmo, Cash App, Revolut).",
            },
            {
                q: "Có thể tải xuống định dạng nào?",
                a: "PNG, JPEG, SVG và PDF — với độ phân giải từ 512 px đến 3200 px. SVG là vector, sắc nét ở mọi kích thước.",
            },
        ],

        // CTA section
        cta_heading: "Sẵn sàng tạo điều gì đó đẹp chưa?",
        cta_sub:
            "Tạo mã QR ấn tượng trong vài giây. Miễn phí, không đăng ký, không watermark.",
        cta_btn: "Tạo mã QR",

        // Footer
        footer_brand_desc:
            "Tạo mã QR miễn phí với logo, màu sắc và gradient. Không đăng ký, không watermark.",
        footer_qr_types: "Loại QR",
        footer_qr_items: [
            { label: "Website", href: "#editor" },
            { label: "Wi-Fi", href: "#editor" },
            { label: "Danh bạ", href: "#editor" },
            { label: "WhatsApp", href: "#editor" },
            { label: "Vị trí", href: "#editor" },
            { label: "Thanh toán", href: "#editor" },
        ],
        footer_product: "Sản phẩm",
        footer_product_items: [
            { label: "Tính năng", href: "#editor" },
            { label: "FAQ", href: "#faq" },
        ],
        footer_legal: "Pháp lý",
        footer_legal_items: [
            { label: "Chính sách bảo mật", href: "/privacy" },
            { label: "Điều khoản sử dụng", href: "/terms" },
        ],
        footer_rights: "Bảo lưu mọi quyền.",
        footer_made:
            "Tạo bởi Kendev với ♥ — miễn phí mãi mãi, không watermark.",
    },
} as const;

export type Translations = (typeof t)["en"];
