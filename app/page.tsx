"use client";
import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import Header from "../components/Header";
import QRTypeSelector from "../components/QRTypeSelector";
import QRPreview from "../components/QRPreview";
import CustomizationOptions from "../components/CustomizationOptions";
import Footer from "../components/Footer";
import {
    PaletteIcon,
    ImageIcon,
    GridIcon,
    DownloadIcon,
    QrCodeIcon,
} from "../components/Icons";
import { DEFAULT_CUSTOMIZATION } from "../lib/constants/defaults";
import { useLang, t } from "../contexts/LangContext";

const HERO_TEXTS: Record<"en" | "vi", [string, string]> = {
    en: [
        "QR codes that actually look good.",
        "QR codes that actually look good.",
    ],
    vi: ["Mã QR đẹp thật sự.", "Mã QR đẹp thật sự."],
};

const HomePage: React.FC = () => {
    const [qrValue, setQrValue] = useState("https://example.com");
    const [selectedType, setSelectedType] = useState("Website");
    const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);
    const { lang } = useLang();
    const tr = t[lang];

    const heroText =
        lang === "vi"
            ? "Mã QR đẹp thật sự."
            : "QR codes that actually look good.";

    return (
        <div className="min-h-screen flex flex-col bg-cream">
            <Header />

            <main className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
                {/* Hero Section */}
                <section className="mt-16 sm:mt-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink leading-tight whitespace-nowrap">
                            <TypeAnimation
                                key={lang}
                                sequence={[heroText, 3000, "", 800]}
                                speed={60}
                                deletionSpeed={75}
                                cursor={true}
                                repeat={Infinity}
                                style={{ display: "inline" }}
                            />
                        </h1>
                        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-ink-soft leading-relaxed">
                            {tr.hero_tagline}
                        </p>
                        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                            <a
                                href="#editor"
                                className="inline-flex items-center justify-center gap-1.5 rounded-full font-display font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 bg-peach-deep text-white hover:bg-[color-mix(in_oklab,var(--color-peach-deep)_88%,black)] shadow-(--shadow-soft) px-5 py-2.5 text-sm sm:text-base"
                            >
                                <QrCodeIcon width={18} height={18} />
                                {tr.hero_cta}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features strip */}
                <section className="mt-14 sm:mt-16">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { icon: PaletteIcon, label: tr.feat_colors },
                            { icon: ImageIcon, label: tr.feat_logo },
                            { icon: GridIcon, label: tr.feat_types },
                            { icon: DownloadIcon, label: tr.feat_formats },
                        ].map((f) => (
                            <div
                                key={f.label}
                                className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-3 py-4 sm:py-5 shadow-(--shadow-soft) text-center"
                            >
                                <f.icon
                                    width={28}
                                    height={28}
                                    className="text-peach-deep"
                                />
                                <span className="text-xs sm:text-sm font-display font-semibold text-ink">
                                    {f.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Main Editor Section */}
                <section
                    id="editor"
                    className="scroll-mt-28 mt-14 sm:scroll-mt-32 sm:mt-16"
                >
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)]">
                        <div className="order-1 min-w-0">
                            <QRTypeSelector
                                selectedType={selectedType}
                                onTypeChange={setSelectedType}
                                onQrValueChange={setQrValue}
                            />
                        </div>

                        <div className="order-2 min-w-0 lg:sticky lg:top-22 lg:self-start">
                            <QRPreview
                                qrValue={qrValue}
                                customization={customization}
                            />
                        </div>

                        <div className="order-3 min-w-0">
                            <CustomizationOptions
                                customization={customization}
                                onCustomizationChange={setCustomization}
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="mt-16 sm:mt-20 max-w-3xl mx-auto">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                            {tr.faq_heading}
                        </h2>
                    </div>
                    <dl className="mt-8 sm:mt-10 divide-y divide-lavender/40 rounded-(--radius-card) bg-white shadow-(--shadow-soft)">
                        {tr.faq.map((faq, i) => (
                            <div key={i} className="px-5 py-4 sm:px-6 sm:py-5">
                                <dt className="font-display text-sm sm:text-base font-semibold text-ink">
                                    {faq.q}
                                </dt>
                                <dd className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft">
                                    {faq.a}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* CTA Section */}
                <section className="mt-16 sm:mt-20">
                    <div className="rounded-(--radius-card) bg-white px-6 py-10 sm:py-14 shadow-(--shadow-soft) text-center">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                            {tr.cta_heading}
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-ink-soft max-w-lg mx-auto">
                            {tr.cta_sub}
                        </p>
                        <a
                            href="#editor"
                            className="mt-6 sm:mt-8 inline-flex items-center justify-center gap-1.5 rounded-full font-display font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 bg-peach-deep text-white hover:bg-[color-mix(in_oklab,var(--color-peach-deep)_88%,black)] shadow-(--shadow-soft) px-6 py-3 text-sm sm:text-base"
                        >
                            <QrCodeIcon width={20} height={20} />
                            {tr.cta_btn}
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
