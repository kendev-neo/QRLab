"use client";
import React, { useState, useEffect, useRef } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import type { QRCustomization, DotStyle, EyeStyle } from "@/types";

interface CustomizationOptionsProps {
    customization: QRCustomization;
    onCustomizationChange: (customization: QRCustomization) => void;
}

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-ink-soft">
        {children}
    </h3>
);

// ── Color swatch button ───────────────────────────────────────────────────────
const Swatch: React.FC<{
    color: string;
    selected: boolean;
    onClick: () => void;
    size?: "md" | "lg";
    label?: string;
}> = ({ color, selected, onClick, size = "md", label }) => {
    const dim = size === "lg" ? "w-10 h-10" : "w-9 h-9";
    return (
        <button
            onClick={onClick}
            aria-label={label ?? color}
            className={`${dim} rounded-full transition-transform hover:scale-105 ${
                selected
                    ? "ring-2 ring-offset-1 ring-ink/40"
                    : "ring-1 ring-black/5"
            }`}
            style={{ backgroundColor: color }}
        />
    );
};

// ── Style pill button ─────────────────────────────────────────────────────────
const StylePill: React.FC<{
    label: string;
    selected: boolean;
    activeColor?: string; // tailwind bg class for active state
    onClick: () => void;
}> = ({ label, selected, activeColor = "bg-mint text-white", onClick }) => (
    <button
        onClick={onClick}
        className={`rounded-2xl px-4 py-2.5 text-sm font-display font-semibold transition ${
            selected
                ? activeColor
                : "bg-cream-deep text-ink-soft hover:text-ink"
        }`}
    >
        {label}
    </button>
);

// ── Collapsible accordion section ────────────────────────────────────────────
const CollapsibleSection: React.FC<{
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = React.useState(defaultOpen);
    return (
        <div className="mb-3 rounded-2xl border border-lavender/30 bg-cream-deep/30 overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-cream-deep/60"
                aria-expanded={open}
            >
                <span className="text-[11px] font-bold uppercase tracking-widest text-ink-soft">
                    {title}
                </span>
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-ink-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {open && <div className="px-4 pb-4 pt-1">{children}</div>}
        </div>
    );
};

const CustomizationOptions: React.FC<CustomizationOptionsProps> = ({
    customization,
    onCustomizationChange,
}) => {
    const [selectedPreset, setSelectedPreset] = useState("Peach");
    const [matchDots, setMatchDots] = useState(false);

    // ── Logo upload via useFileUpload hook ────────────────────────────────────────
    const {
        preview: logoPreview,
        error: logoError,
        handleFileSelect: handleLogoFileSelect,
        clear: clearLogo,
    } = useFileUpload({
        maxSize: 2 * 1024 * 1024, // 2MB
        acceptedTypes: [
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/svg+xml",
        ],
    });

    // ── Background image upload via useFileUpload hook ──────────────────────────────
    const {
        preview: bgImagePreview,
        handleFileSelect: handleBgImageFileSelect,
        clear: clearBgImage,
    } = useFileUpload({
        maxSize: 5 * 1024 * 1024, // 5MB
        acceptedTypes: ["image/png", "image/jpeg", "image/webp"],
    });

    // Keep a ref to the latest onCustomizationChange to avoid stale closures in
    // the file-upload effects below (the callback identity changes every render).
    const onChangeRef = useRef(onCustomizationChange);
    useEffect(() => {
        onChangeRef.current = onCustomizationChange;
    });

    // Keep a ref to the latest customization so the upload effects always spread
    // the current snapshot without needing it in their dependency arrays.
    const customizationRef = useRef(customization);
    useEffect(() => {
        customizationRef.current = customization;
    });

    // Sync logo preview to customization state
    useEffect(() => {
        onChangeRef.current({
            ...customizationRef.current,
            logo: logoPreview ?? undefined,
        });
    }, [logoPreview]);

    // Sync background image preview to customization state
    useEffect(() => {
        onChangeRef.current({
            ...customizationRef.current,
            bgImage: bgImagePreview ?? undefined,
        });
    }, [bgImagePreview]);

    // ── Presets ─────────────────────────────────────────────────────────────────
    const presets = [
        { name: "Peach", colors: ["#F472B6", "#FB923C"] as [string, string] },
        {
            name: "Strawberry",
            colors: ["#F43F5E", "#FB7185"] as [string, string],
        },
        { name: "Mint", colors: ["#10B981", "#34D399"] as [string, string] },
        { name: "Sky", colors: ["#3B82F6", "#60A5FA"] as [string, string] },
        { name: "Mono", colors: ["#4A4658", "#8B8799"] as [string, string] },
    ];

    // ── Color palette — pastel/muted tones matching reference ───────────────────
    const COLOR_PALETTE = [
        { hex: "#3D3654", label: "Dark purple" },
        { hex: "#F4A27A", label: "Salmon" },
        { hex: "#B8A9E8", label: "Lavender" },
        { hex: "#5ECFB1", label: "Teal" },
        { hex: "#F48FB1", label: "Pink" },
        { hex: "#90CAF9", label: "Sky blue" },
        { hex: "#81C784", label: "Sage" },
        { hex: "#D4A843", label: "Gold" },
        { hex: "#A1887F", label: "Brown" },
        { hex: "#7B5EA7", label: "Purple" },
        { hex: "#37474F", label: "Navy" },
    ];

    // Dot colors = full palette
    const dotColors = COLOR_PALETTE;

    // Eye colors = palette + black
    const eyeColorPalette = [
        ...COLOR_PALETTE,
        { hex: "#000000", label: "Black" },
    ];

    // ── Dot styles ───────────────────────────────────────────────────────────────
    const dotStyles: { name: string; value: DotStyle }[] = [
        { name: "Rounded", value: "rounded" },
        { name: "Dots", value: "dots" },
        { name: "Classy", value: "classic" },
        { name: "Soft", value: "soft" },
        { name: "Square", value: "square" },
        { name: "Pillow", value: "pillow" },
    ];

    // ── Eye styles ───────────────────────────────────────────────────────────────
    const eyeStyles: { name: string; value: EyeStyle }[] = [
        { name: "Soft", value: "soft" },
        { name: "Round", value: "round" },
        { name: "Pillow", value: "pillow" },
        { name: "Square", value: "square" },
        { name: "Classy", value: "classy" },
        { name: "Circle", value: "dot" },
    ];

    // ── Background colors ────────────────────────────────────────────────────────
    const backgroundColors = [
        { hex: "#FFF8F0", label: "Cream" },
        { hex: "#FFFFFF", label: "White" },
        { hex: "#FFE6E1", label: "Blush" },
        { hex: "#F1ECFF", label: "Lilac" },
        { hex: "#E6F6EF", label: "Mint air" },
        { hex: "#EAF3FF", label: "Sky air" },
        { hex: "#FFF7DA", label: "Butter" },
        { hex: "#F4F1ED", label: "Pearl" },
    ];

    // ── Handlers ─────────────────────────────────────────────────────────────────
    const handlePresetSelect = (preset: (typeof presets)[0]) => {
        setSelectedPreset(preset.name);
        setMatchDots(false);
        onCustomizationChange({
            ...customization,
            fgColor: preset.colors[0],
            eyeColor: preset.colors[0],
            useGradient: true,
            gradientColors: preset.colors,
        });
    };

    const handleDotColorSelect = (hex: string) => {
        onCustomizationChange({
            ...customization,
            fgColor: hex,
            eyeColor: matchDots ? hex : customization.eyeColor,
            // Khi gradient bật: cập nhật gradientColors[0] = màu dot mới
            gradientColors: customization.useGradient
                ? [hex, customization.gradientColors[1]]
                : customization.gradientColors,
        });
    };

    // Màu dot hiện tại — luôn là fgColor (gradientColors[0] được sync = fgColor)
    const currentDotColor = customization.fgColor;

    const handleMatchDots = () => {
        const next = !matchDots;
        setMatchDots(next);
        if (next) {
            onCustomizationChange({
                ...customization,
                eyeColor: currentDotColor,
            });
        }
    };

    const handleEyeColorSelect = (hex: string) => {
        setMatchDots(false);
        onCustomizationChange({ ...customization, eyeColor: hex });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleLogoFileSelect(e.target.files?.[0] || null);
    };

    const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleBgImageFileSelect(e.target.files?.[0] || null);
    };

    const handleReset = () => {
        setSelectedPreset("Peach");
        setMatchDots(false);
        clearLogo();
        clearBgImage();
        onCustomizationChange({
            bgColor: "#FFF8F0",
            fgColor: "#4A4658",
            eyeColor: "#4A4658",
            useGradient: false,
            gradientColors: ["#F472B6", "#FB923C"],
            dotStyle: "rounded",
            eyeStyle: "soft",
            frame: "none",
            frameColor: "#4A4658",
            frameThickness: 2,
            labelText: "",
            labelColor: "#4A4658",
            logo: undefined,
            logoSize: 30,
            logoMargin: 6,
            bgImage: undefined,
            bgImageOpacity: 50,
            bgImageBlur: 0,
        });
    };

    return (
        <div className="bg-white rounded-(--radius-card) p-5 sm:p-6 shadow-(--shadow-soft)">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg sm:text-xl font-display font-bold text-ink">
                    3. Make it look good
                </h2>
                <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-4 py-2 text-sm font-display font-semibold text-lavender transition hover:bg-lavender/10 active:scale-95"
                    aria-label="Reset to defaults"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    Reset
                </button>
            </div>
            <p className="text-xs text-ink-soft mb-5">
                Tap a preset, or tweak each detail.
            </p>

            {/* ── PRESETS ─────────────────────────────────────────────── */}
            <section className="mb-6">
                <SectionLabel>Presets</SectionLabel>
                <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => handlePresetSelect(preset)}
                            aria-label={preset.name}
                            className={`w-10 h-10 rounded-full transition hover:scale-105 ${
                                selectedPreset === preset.name
                                    ? "ring-2 ring-offset-1 ring-ink/30"
                                    : ""
                            }`}
                            style={{
                                background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})`,
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* ── DOT COLOR ───────────────────────────────────────────── */}
            <section className="mb-6">
                <SectionLabel>Dot color</SectionLabel>
                <div className="flex flex-wrap gap-2 mb-3">
                    {dotColors.map(({ hex, label }) => (
                        <Swatch
                            key={hex}
                            color={hex}
                            label={label}
                            size="lg"
                            selected={customization.fgColor === hex}
                            onClick={() => handleDotColorSelect(hex)}
                        />
                    ))}
                </div>

                {/* Use gradient toggle */}
                <label className="inline-flex items-center gap-2 cursor-pointer select-none mt-1">
                    <input
                        type="checkbox"
                        checked={customization.useGradient}
                        onChange={(e) =>
                            onCustomizationChange({
                                ...customization,
                                useGradient: e.target.checked,
                                // Khi bật gradient: sync color[0] = fgColor hiện tại
                                gradientColors: e.target.checked
                                    ? [
                                          customization.fgColor,
                                          customization.gradientColors[1],
                                      ]
                                    : customization.gradientColors,
                            })
                        }
                        className="w-4 h-4 rounded accent-peach"
                    />
                    <span className="text-sm text-ink-soft">Use gradient</span>
                </label>

                {/* Gradient end color — shown as separate swatch row */}
                {customization.useGradient && (
                    <div className="mt-4">
                        <SectionLabel>Gradient end</SectionLabel>
                        <div className="flex flex-wrap gap-2">
                            {[
                                ...COLOR_PALETTE,
                                { hex: "#F472B6", label: "Hot pink" },
                            ].map(({ hex, label }) => (
                                <Swatch
                                    key={hex}
                                    color={hex}
                                    label={label}
                                    size="lg"
                                    selected={
                                        customization.gradientColors[1] === hex
                                    }
                                    onClick={() =>
                                        onCustomizationChange({
                                            ...customization,
                                            gradientColors: [
                                                customization.gradientColors[0],
                                                hex,
                                            ],
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ── DOT STYLE ───────────────────────────────────────────── */}
            <section className="mb-6">
                <SectionLabel>Dot style</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                    {dotStyles.map((s) => (
                        <StylePill
                            key={s.value}
                            label={s.name}
                            selected={customization.dotStyle === s.value}
                            activeColor="bg-mint text-white"
                            onClick={() =>
                                onCustomizationChange({
                                    ...customization,
                                    dotStyle: s.value,
                                })
                            }
                        />
                    ))}
                </div>
            </section>

            {/* ── EYE COLOR ───────────────────────────────────────────── */}
            <section className="mb-6">
                <SectionLabel>Eye color</SectionLabel>
                <div className="flex flex-wrap gap-2">
                    {/* Match dots pill */}
                    <button
                        onClick={handleMatchDots}
                        className={`rounded-full px-3 py-2 text-xs font-display font-semibold transition ${
                            matchDots
                                ? "bg-ink text-white"
                                : "bg-cream-deep text-ink-soft hover:text-ink"
                        }`}
                    >
                        Match dots
                    </button>
                    {eyeColorPalette.map(({ hex, label }) => (
                        <Swatch
                            key={hex}
                            color={hex}
                            label={label}
                            size="lg"
                            selected={
                                !matchDots && customization.eyeColor === hex
                            }
                            onClick={() => handleEyeColorSelect(hex)}
                        />
                    ))}
                </div>
            </section>

            {/* ── EYE DESIGN ──────────────────────────────────────────── */}
            <section className="mb-6">
                <SectionLabel>Eye design</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                    {eyeStyles.map((s) => (
                        <StylePill
                            key={s.value}
                            label={s.name}
                            selected={customization.eyeStyle === s.value}
                            activeColor="bg-peach-deep/30 text-ink"
                            onClick={() =>
                                onCustomizationChange({
                                    ...customization,
                                    eyeStyle: s.value,
                                })
                            }
                        />
                    ))}
                </div>
            </section>

            {/* ── BACKGROUND ──────────────────────────────────────────── */}
            <section className="mb-6">
                <SectionLabel>Background</SectionLabel>
                <div className="flex flex-wrap gap-2">
                    {backgroundColors.map(({ hex, label }) => (
                        <Swatch
                            key={hex}
                            color={hex}
                            label={label}
                            size="lg"
                            selected={customization.bgColor === hex}
                            onClick={() =>
                                onCustomizationChange({
                                    ...customization,
                                    bgColor: hex,
                                })
                            }
                        />
                    ))}
                    {/* Custom color picker */}
                    <label
                        className="w-10 h-10 rounded-full ring-1 ring-black/10 cursor-pointer overflow-hidden flex items-center justify-center hover:scale-105 transition-transform"
                        aria-label="Custom background color"
                    >
                        <input
                            type="color"
                            value={customization.bgColor}
                            onChange={(e) =>
                                onCustomizationChange({
                                    ...customization,
                                    bgColor: e.target.value,
                                })
                            }
                            className="opacity-0 absolute w-0 h-0"
                        />
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-ink-faint"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v8M8 12h8" />
                        </svg>
                    </label>
                </div>
            </section>

            {/* ── BRANDING ────────────────────────────────────────────── */}
            <CollapsibleSection title="Branding">
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-ink-soft">
                            Your logo
                        </span>
                        <span className="text-xs text-ink-faint">
                            Auto-match colors to it
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        {logoPreview ? (
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-cream-deep">
                                {/* eslint-disable-next-line @next/next/no-img-element -- data URL from file upload */}
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="w-full h-full object-contain"
                                />
                                <button
                                    onClick={clearLogo}
                                    className="absolute top-0 right-0 w-5 h-5 bg-rose text-white rounded-full flex items-center justify-center text-xs hover:bg-rose/80 transition"
                                    aria-label="Remove logo"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="logo-upload"
                                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-cream-deep cursor-pointer hover:bg-lavender/20 transition"
                                aria-label="Upload logo"
                            >
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-ink-faint"
                                >
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                <input
                                    type="file"
                                    id="logo-upload"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <span className="text-sm text-ink-soft">
                            {logoPreview
                                ? "Logo uploaded"
                                : "PNG, JPG, or SVG."}
                        </span>
                    </div>
                    {logoError && (
                        <p className="text-xs text-rose mb-2">{logoError}</p>
                    )}
                    <button
                        type="button"
                        onClick={() =>
                            document.getElementById("logo-upload")?.click()
                        }
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-lavender/20 text-lavender font-display font-semibold text-sm py-2.5 transition hover:bg-lavender/30"
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v8M8 12h8" />
                        </svg>
                        Upload a logo to match colors
                    </button>
                </div>
            </CollapsibleSection>

            {/* ── FRAME & LABEL ───────────────────────────────────────── */}
            <CollapsibleSection title="Frame & Label">
                <div className="space-y-4">
                    {/* Frame border select */}
                    <div>
                        <span className="block text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-2">
                            Frame border
                        </span>
                        <select
                            value={customization.frame}
                            onChange={(e) =>
                                onCustomizationChange({
                                    ...customization,
                                    frame: e.target.value,
                                })
                            }
                            className="w-full rounded-2xl border border-lavender/50 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/30 appearance-none cursor-pointer"
                        >
                            <option value="none">None</option>
                            <option value="simple">Simple</option>
                            <option value="rounded">Rounded</option>
                            <option value="double">Double</option>
                            <option value="banner">Banner</option>
                            <option value="speech-bubble">Speech bubble</option>
                        </select>
                    </div>

                    {/* Border color + thickness — only when frame is active */}
                    {customization.frame !== "none" && (
                        <>
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-2">
                                    Border color
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() =>
                                            onCustomizationChange({
                                                ...customization,
                                                frameColor: currentDotColor,
                                            })
                                        }
                                        className={`rounded-full px-3 py-2 text-xs font-display font-semibold transition ${
                                            customization.frameColor ===
                                            currentDotColor
                                                ? "bg-ink text-white"
                                                : "bg-cream-deep text-ink-soft hover:text-ink"
                                        }`}
                                    >
                                        Match dots
                                    </button>
                                    {COLOR_PALETTE.map(({ hex, label }) => (
                                        <Swatch
                                            key={hex}
                                            color={hex}
                                            label={label}
                                            size="lg"
                                            selected={
                                                customization.frameColor === hex
                                            }
                                            onClick={() =>
                                                onCustomizationChange({
                                                    ...customization,
                                                    frameColor: hex,
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-ink-soft">
                                        Thickness
                                    </span>
                                    <span className="text-xs text-ink-soft">
                                        {customization.frameThickness}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={20}
                                    value={customization.frameThickness}
                                    onChange={(e) =>
                                        onCustomizationChange({
                                            ...customization,
                                            frameThickness: Number(
                                                e.target.value,
                                            ),
                                        })
                                    }
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-peach"
                                    style={{
                                        background: `linear-gradient(to right, #FB923C 0%, #FB923C ${(customization.frameThickness / 20) * 100}%, #e5e7eb ${(customization.frameThickness / 20) * 100}%, #e5e7eb 100%)`,
                                    }}
                                />
                            </div>
                        </>
                    )}

                    {/* Label text input */}
                    <div>
                        <span className="block text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-2">
                            Label
                        </span>
                        <input
                            type="text"
                            value={customization.labelText}
                            onChange={(e) =>
                                onCustomizationChange({
                                    ...customization,
                                    labelText: e.target.value,
                                })
                            }
                            placeholder="e.g. WI-FI, SCAN ME..."
                            className="w-full rounded-2xl border border-lavender/50 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/30 placeholder:text-ink-faint"
                        />
                    </div>

                    {/* Label color — only when label has text */}
                    {customization.labelText.trim() !== "" && (
                        <div>
                            <span className="block text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-2">
                                Label color
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {COLOR_PALETTE.map(({ hex, label }) => (
                                    <Swatch
                                        key={hex}
                                        color={hex}
                                        label={label}
                                        size="lg"
                                        selected={
                                            customization.labelColor === hex
                                        }
                                        onClick={() =>
                                            onCustomizationChange({
                                                ...customization,
                                                labelColor: hex,
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            {/* ── BACKGROUND IMAGE ────────────────────────────────────── */}
            <CollapsibleSection title="Background image">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="bg-image-upload"
                            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-cream-deep cursor-pointer hover:bg-lavender/20 transition"
                            aria-label="Upload background image"
                        >
                            {bgImagePreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={bgImagePreview}
                                    alt="Background preview"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-ink-faint"
                                >
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            )}
                            <input
                                type="file"
                                id="bg-image-upload"
                                accept="image/*"
                                onChange={handleBgImageUpload}
                                className="hidden"
                            />
                        </label>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-ink-soft">
                                {bgImagePreview
                                    ? "Image uploaded"
                                    : "PNG, JPG, or WebP."}
                            </span>
                            {bgImagePreview && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        clearBgImage();
                                        onCustomizationChange({
                                            ...customization,
                                            bgImage: undefined,
                                        });
                                    }}
                                    className="text-xs text-rose hover:underline text-left"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    {bgImagePreview && (
                        <>
                            {/* Opacity slider */}
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-2">
                                    Opacity —{" "}
                                    {Math.round(
                                        (customization.bgImageOpacity ?? 0.3) *
                                            100,
                                    )}
                                    %
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={Math.round(
                                        (customization.bgImageOpacity ?? 0.3) *
                                            100,
                                    )}
                                    onChange={(e) =>
                                        onCustomizationChange({
                                            ...customization,
                                            bgImageOpacity:
                                                Number(e.target.value) / 100,
                                        })
                                    }
                                    className="w-full accent-lavender"
                                />
                            </div>

                            {/* Blur slider */}
                            <div>
                                <span className="block text-[11px] font-bold uppercase tracking-widest text-ink-soft mb-2">
                                    Blur — {customization.bgImageBlur ?? 0}px
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="1"
                                    value={customization.bgImageBlur ?? 0}
                                    onChange={(e) =>
                                        onCustomizationChange({
                                            ...customization,
                                            bgImageBlur: Number(e.target.value),
                                        })
                                    }
                                    className="w-full accent-lavender"
                                />
                            </div>
                        </>
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
};

export default CustomizationOptions;
