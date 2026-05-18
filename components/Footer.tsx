"use client";
import React from "react";
import { useLang, t } from "../contexts/LangContext";

const NAV_LINK = "text-xs text-ink-soft transition hover:text-ink";

const Footer: React.FC = () => {
    const { lang } = useLang();
    const tr = t[lang];
    const year = new Date().getFullYear();

    return (
        <footer className="mt-20 border-t border-lavender/20 bg-cream">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
                {/* Top row — brand + columns */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <p className="text-lg font-display font-bold text-ink mb-2">
                            QRLab
                        </p>
                        <p className="text-xs text-ink-soft leading-relaxed max-w-[200px]">
                            {tr.footer_brand_desc}
                        </p>
                    </div>

                    {/* QR Types */}
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-3">
                            {tr.footer_qr_types}
                        </p>
                        <ul className="space-y-2">
                            {tr.footer_qr_items.map(({ label, href }) => (
                                <li key={label}>
                                    <a href={href} className={NAV_LINK}>
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Product */}
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-3">
                            {tr.footer_product}
                        </p>
                        <ul className="space-y-2">
                            {tr.footer_product_items.map(({ label, href }) => (
                                <li key={label}>
                                    <a href={href} className={NAV_LINK}>
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-3">
                            {tr.footer_legal}
                        </p>
                        <ul className="space-y-2">
                            {tr.footer_legal_items.map(({ label, href }) => (
                                <li key={label}>
                                    <a href={href} className={NAV_LINK}>
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom row — copyright */}
                <div className="mt-10 pt-6 border-t border-lavender/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-ink-faint">
                        © {year} QRLab. {tr.footer_rights}
                    </p>
                    <p className="text-xs text-ink-faint">{tr.footer_made}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
