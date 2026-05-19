import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "../components/ToastProvider";
import ErrorBoundary from "../components/ErrorBoundary";
import { LangProvider } from "../contexts/LangContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const quicksand = Quicksand({
    variable: "--font-quicksand",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "QRLab — QR codes that actually look good. Free, no signup.",
    description:
        "Free QR code generator with logos, colors, gradients, and frame borders. 12 types — Wi-Fi, vCard, WhatsApp, payments. No signup, no watermark.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
                <ErrorBoundary>
                    <LangProvider>
                        <ToastProvider>{children}</ToastProvider>
                    </LangProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
