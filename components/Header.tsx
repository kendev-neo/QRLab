"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang, t } from "../contexts/LangContext";

const Header: React.FC = () => {
    const { lang, setLang } = useLang();
    const tr = t[lang];

    return (
        <header className="bg-cream px-4 py-3 shadow-(--shadow-soft) sticky top-0 z-50 ">
            <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-3 rounded-full bg-white/70 px-3 py-2 shadow-(--shadow-soft) transition hover:bg-white"
                >
                    <span className="inline-flex items-center justify-center rounded-2xl bg-peach-deep/10 text-peach-deep p-2 shadow-(--shadow-soft)">
                        <Image
                            src="/logo.svg"
                            alt="QRLab logo"
                            width={24}
                            height={24}
                            className="h-6 w-6"
                        />
                    </span>
                    <span className="text-2xl font-display font-bold text-ink transition hover:text-peach-deep">
                        QRLab
                    </span>
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
