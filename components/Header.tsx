"use client";
import React from "react";
import Link from "next/link";
import { useLang, t } from "../contexts/LangContext";

const Header: React.FC = () => {
    const { lang, setLang } = useLang();
    const tr = t[lang];

    return (
        <header className="bg-cream px-4 py-3 shadow-(--shadow-soft) sticky top-0 z-50">
            <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-display font-bold text-ink hover:text-peach-deep transition"
                >
                    QRLab
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-1 sm:gap-2">
                    <a
                        href="#faq"
                        className="rounded-full px-3 py-1.5 text-sm font-display font-semibold text-ink-soft transition hover:bg-cream-deep hover:text-ink"
                    >
                        {tr.nav_faq}
                    </a>
                    <a
                        href="#editor"
                        className="rounded-full px-4 py-1.5 text-sm font-display font-semibold bg-peach-deep text-white hover:bg-[color-mix(in_oklab,var(--color-peach-deep)_88%,black)] transition shadow-(--shadow-soft)"
                    >
                        {tr.nav_create}
                    </a>

                    {/* Language switcher */}
                    <div className="flex items-center gap-0.5 ml-2 rounded-full border border-lavender/40 overflow-hidden text-xs font-display font-semibold">
                        <button
                            onClick={() => setLang("en")}
                            className={`px-2.5 py-1 transition ${
                                lang === "en"
                                    ? "bg-ink text-cream"
                                    : "text-ink-soft hover:bg-cream-deep"
                            }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLang("vi")}
                            className={`px-2.5 py-1 transition ${
                                lang === "vi"
                                    ? "bg-ink text-cream"
                                    : "text-ink-soft hover:bg-cream-deep"
                            }`}
                        >
                            VI
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
