"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import QRCodeStyling from "qr-code-styling";
import { useToast } from "./ToastProvider";
import Spinner from "./Spinner";
import type { QRCustomization } from "@/types";

interface QRPreviewProps {
    qrValue: string;
    customization: QRCustomization;
}

// ── Style maps ────────────────────────────────────────────────────────────────
const DOT_STYLE_MAP: Record<string, string> = {
    rounded: "rounded",
    square: "square",
    dots: "dots",
    classic: "classy",
    soft: "extra-rounded",
    pillow: "classy-rounded",
};

const EYE_STYLE_MAP: Record<string, string> = {
    soft: "extra-rounded",
    square: "square",
    round: "dot",
    pillow: "classy-rounded",
    classy: "classy",
    dot: "dot",
};

const INNER_DOT_MAP: Record<string, string> = {
    soft: "dot",
    square: "square",
    round: "dot",
    pillow: "classy-rounded",
    classy: "classy",
    dot: "square",
};

// ── Download icon ─────────────────────────────────────────────────────────────
const DownloadIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

// ── QR canvas size (fixed, independent of frame/label) ───────────────────────
const QR_SIZE = 260; // px — consistent across all resolutions for preview

// ── Main component ────────────────────────────────────────────────────────────
const QRPreview: React.FC<QRPreviewProps> = ({ qrValue, customization }) => {
    const { showToast } = useToast();

    // containerRef is ALWAYS in the DOM — never conditionally mounted/unmounted
    const containerRef = useRef<HTMLDivElement>(null);
    const qrRef = useRef<QRCodeStyling | null>(null);
    const prevKeyRef = useRef<string>("");
    const [resolution, setResolution] = useState(1024);
    const [format, setFormat] = useState("png");
    const [isDownloading, setIsDownloading] = useState(false);

    // Derived values
    const frame = customization.frame ?? "none";
    const frameColor = customization.frameColor ?? customization.eyeColor;
    const frameThickness = customization.frameThickness ?? 2;
    const labelText = (customization.labelText ?? "").trim();
    const labelColor = customization.labelColor ?? customization.fgColor;
    const bgColor = customization.bgColor;
    const hasFrame = frame !== "none";
    const hasLabel = labelText !== "";

    // ── Build QR options ────────────────────────────────────────────────────────
    const buildOptions = useCallback((): Record<string, unknown> => {
        const dotType = DOT_STYLE_MAP[customization.dotStyle] || "rounded";
        const eyeType =
            EYE_STYLE_MAP[customization.eyeStyle] || "extra-rounded";
        const innerDotType = INNER_DOT_MAP[customization.eyeStyle] || "dot";

        const opts: Record<string, unknown> = {
            type: "canvas",
            width: QR_SIZE,
            height: QR_SIZE,
            data: qrValue,
            margin: 8,
            qrOptions: { errorCorrectionLevel: "H" },
            imageOptions: {
                hideBackgroundDots: true,
                imageSize: 0.4,
                margin: 6,
            },
            dotsOptions: customization.useGradient
                ? {
                      type: dotType,
                      roundSize: true,
                      gradient: {
                          type: "linear",
                          rotation: Math.PI / 4,
                          colorStops: [
                              {
                                  offset: 0,
                                  color: customization.gradientColors[0],
                              },
                              {
                                  offset: 1,
                                  color: customization.gradientColors[1],
                              },
                          ],
                      },
                  }
                : {
                      type: dotType,
                      roundSize: true,
                      color: customization.fgColor,
                  },
            cornersSquareOptions: {
                type: eyeType,
                color: customization.eyeColor,
            },
            cornersDotOptions: {
                type: innerDotType,
                color: customization.eyeColor,
            },
            // When a background image is set, use transparent background so the
            // image overlay beneath the canvas shows through; otherwise use the
            // solid colour chosen by the user.
            backgroundOptions: {
                round: 0,
                color: customization.bgImage
                    ? "transparent"
                    : customization.bgColor,
            },
        };

        // Add logo if present — cap at 35% so QR remains scannable (EC=H covers 30%)
        if (customization.logo) {
            const rawSize = (customization.logoSize ?? 30) / 100;
            opts.image = customization.logo;
            opts.imageOptions = {
                hideBackgroundDots: true,
                imageSize: Math.min(rawSize, 0.35),
                margin: customization.logoMargin ?? 6,
            };
        }

        return opts;
    }, [qrValue, customization]);

    // ── Render / update QR ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current) return;

        const opts = buildOptions();
        const key = JSON.stringify(opts);
        if (key === prevKeyRef.current && qrRef.current) return;

        prevKeyRef.current = key;

        try {
            containerRef.current.innerHTML = "";
            qrRef.current = new QRCodeStyling(opts as never);
            qrRef.current.append(containerRef.current);
        } catch (error) {
            console.error("QR generation error:", error);
            showToast(
                "Failed to generate QR code. Please check your input.",
                "error",
            );
        }
    }, [buildOptions, showToast]);

    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (containerRef.current) containerRef.current.innerHTML = "";
            qrRef.current = null;
        };
    }, []);

    // ── Download ───────────────────────────────────────────────────────────────
    const handleDownload = async (ext: string) => {
        if (!qrRef.current) {
            showToast("QR code not ready. Please wait a moment.", "warning");
            return;
        }

        setIsDownloading(true);
        setFormat(ext);

        const dlSize =
            resolution <= 512 ? 512 : resolution <= 1024 ? 1024 : 2048;

        if (ext === "svg" || ext === "pdf") {
            try {
                await qrRef.current.download({
                    name: "qrcode",
                    extension: ext as never,
                });
                showToast(
                    `QR code downloaded as ${ext.toUpperCase()}`,
                    "success",
                );
            } catch (e) {
                console.error("Download error:", e);
                showToast(
                    `Failed to download ${ext.toUpperCase()} file`,
                    "error",
                );
            } finally {
                setIsDownloading(false);
            }
            return;
        }

        if (!hasFrame && !hasLabel) {
            try {
                await qrRef.current.download({
                    name: "qrcode",
                    extension: ext as never,
                });
                showToast(
                    `QR code downloaded as ${ext.toUpperCase()}`,
                    "success",
                );
            } catch (e) {
                console.error("Download error:", e);
                showToast(
                    `Failed to download ${ext.toUpperCase()} file`,
                    "error",
                );
            } finally {
                setIsDownloading(false);
            }
            return;
        }

        try {
            // Build a high-res QR for download
            const dlOpts = { ...buildOptions(), width: dlSize, height: dlSize };
            const dlQr = new QRCodeStyling(dlOpts as never);
            const blob = await dlQr.getRawData("png");
            if (!blob) return;

            const img = new Image();
            const url = URL.createObjectURL(blob as Blob);
            img.src = url;
            await new Promise<void>((res) => {
                img.onload = () => res();
            });
            URL.revokeObjectURL(url);

            const qrW = img.width;
            const qrH = img.height;
            const t = Math.round(frameThickness * (dlSize / QR_SIZE));
            const pad = hasFrame ? t + Math.round(12 * (dlSize / QR_SIZE)) : 0;
            const innerPad =
                hasFrame && frame === "double"
                    ? t + Math.round(6 * (dlSize / QR_SIZE))
                    : 0;
            const totalPad = pad + innerPad;
            const fontSize = Math.round(dlSize * 0.045);
            const labelH = hasLabel
                ? fontSize + Math.round(20 * (dlSize / QR_SIZE))
                : 0;
            const cW = qrW + totalPad * 2;
            const cH = qrH + totalPad * 2 + labelH;

            const canvas = document.createElement("canvas");
            canvas.width = cW;
            canvas.height = cH;
            const ctx = canvas.getContext("2d")!;

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, cW, cH);

            const drawRR = (
                x: number,
                y: number,
                w: number,
                h: number,
                r: number,
            ) => {
                const rr = Math.min(r, w / 2, h / 2);
                ctx.beginPath();
                ctx.moveTo(x + rr, y);
                ctx.lineTo(x + w - rr, y);
                ctx.arcTo(x + w, y, x + w, y + rr, rr);
                ctx.lineTo(x + w, y + h - rr);
                ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
                ctx.lineTo(x + rr, y + h);
                ctx.arcTo(x, y + h, x, y + h - rr, rr);
                ctx.lineTo(x, y + rr);
                ctx.arcTo(x, y, x + rr, y, rr);
                ctx.closePath();
            };

            if (hasFrame) {
                const scale = dlSize / QR_SIZE;
                const RADII: Record<string, number> = {
                    simple: 8,
                    rounded: 20,
                    double: 20,
                    banner: 8,
                    "speech-bubble": 20,
                };
                const r = Math.round((RADII[frame] ?? 8) * scale);
                ctx.strokeStyle = frameColor;
                if (frame === "double") {
                    ctx.lineWidth = t;
                    drawRR(t / 2, t / 2, cW - t, cH - t, r);
                    ctx.stroke();
                    const innerT = Math.max(2, t);
                    const inset = t + Math.round(6 * scale);
                    ctx.lineWidth = innerT;
                    drawRR(
                        inset + innerT / 2,
                        inset + innerT / 2,
                        cW - inset * 2 - innerT,
                        cH - inset * 2 - innerT,
                        Math.max(4, r - inset),
                    );
                    ctx.stroke();
                } else {
                    ctx.lineWidth = t;
                    drawRR(t / 2, t / 2, cW - t, cH - t, r);
                    ctx.stroke();
                }
            }

            ctx.drawImage(img, totalPad, totalPad, qrW, qrH);

            if (hasLabel) {
                ctx.fillStyle = labelColor;
                ctx.font = `700 ${fontSize}px sans-serif`;
                ctx.textAlign = "center";
                ctx.fillText(
                    labelText.toUpperCase(),
                    cW / 2,
                    totalPad +
                        qrH +
                        fontSize +
                        Math.round(6 * (dlSize / QR_SIZE)),
                );
            }

            const mime = ext === "jpeg" ? "image/jpeg" : "image/png";
            const a = document.createElement("a");
            a.href = canvas.toDataURL(mime, 0.95);
            a.download = `qrcode.${ext}`;
            a.click();
            showToast(`QR code downloaded as ${ext.toUpperCase()}`, "success");
        } catch (e) {
            console.error("Download error:", e);
            showToast("Failed to download QR code with frame/label", "error");
        } finally {
            setIsDownloading(false);
        }
    };

    // ── Preview layout ─────────────────────────────────────────────────────────
    // containerRef div is ALWAYS in the DOM at the same tree position.
    // Wrapper uses inline-flex column — label flows naturally below canvas.
    // Frame border + padding applied to wrapper via CSS only (no DOM structure change).

    const t = frameThickness;
    const PAD = 12;
    const INNER_GAP = frame === "double" ? t + 6 : 0;
    const totalPad = PAD + INNER_GAP;

    const borderRadius =
        frame === "rounded" || frame === "double" || frame === "speech-bubble"
            ? "20px"
            : "8px";

    const wrapperStyle: React.CSSProperties = {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: hasLabel ? "10px" : "0px",
        ...(hasFrame
            ? {
                  padding: `${totalPad}px`,
                  borderStyle: "solid",
                  borderWidth: `${t}px`,
                  borderColor: frameColor,
                  borderRadius,
                  backgroundColor: bgColor,
                  boxShadow:
                      frame === "double"
                          ? `inset 0 0 0 ${INNER_GAP - t}px ${bgColor}, inset 0 0 0 ${INNER_GAP}px ${frameColor}`
                          : undefined,
              }
            : {}),
    };

    const labelStyle: React.CSSProperties = {
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: labelColor,
        lineHeight: 1,
        textAlign: "center",
        maxWidth: `${QR_SIZE}px`,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        paddingBottom: hasFrame ? "4px" : "0px",
    };

    return (
        <div className="bg-white rounded-(--radius-card) p-4 sm:p-6 shadow-(--shadow-soft)">
            <h2 className="text-lg sm:text-xl font-display font-bold text-ink mb-1">
                2. Preview
            </h2>
            <p className="text-xs text-ink-soft mb-4">
                Scan it with your phone — it works in real time.
            </p>

            {/* Preview area with loading state */}
            <div className="flex items-center justify-center bg-white rounded-[2rem] p-6 mb-5 overflow-hidden min-h-[320px] border border-lavender/20 relative">
                <div style={wrapperStyle} className="w-full max-w-[420px]">
                    {/* QR canvas with optional background image overlay */}
                    <div
                        style={{
                            position: "relative",
                            display: "block",
                            lineHeight: 0,
                            flexShrink: 0,
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 2px 16px 0 rgba(100,90,160,0.08)",
                        }}
                    >
                        {/* Background image overlay — rendered BEHIND the QR canvas */}
                        {customization.bgImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={customization.bgImage}
                                alt=""
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    opacity:
                                        customization.bgImageOpacity ?? 0.3,
                                    filter: `blur(${customization.bgImageBlur ?? 0}px)`,
                                    pointerEvents: "none",
                                    zIndex: 0,
                                }}
                            />
                        )}
                        {/* QR canvas — containerRef NEVER unmounts */}
                        <div
                            ref={containerRef}
                            style={{
                                display: "block",
                                position: "relative",
                                zIndex: 1,
                            }}
                            className="[&>canvas]:block"
                        />
                    </div>
                    {/* Label — in normal flow below canvas */}
                    {hasLabel && <p style={labelStyle}>{labelText}</p>}
                </div>
            </div>

            {/* Download buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {["png", "jpeg", "svg", "pdf"].map((f) => (
                    <button
                        key={f}
                        onClick={() => handleDownload(f)}
                        disabled={isDownloading}
                        className={`flex items-center justify-center gap-2 rounded-full py-3 text-sm font-display font-semibold transition duration-200 ${
                            isDownloading ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-[0.5px]"
                        } ${
                            format === f
                                ? "bg-peach text-white shadow-(--shadow-soft)"
                                : "border border-lavender/30 bg-white text-ink-soft hover:text-ink"
                        }`}
                    >
                        {isDownloading && format === f ? (
                            <>
                                <Spinner size="sm" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <DownloadIcon />
                                {f.toUpperCase()}
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Resolution selector */}
            <div className="flex items-center justify-center gap-3">
                <select
                    value={resolution}
                    onChange={(e) => setResolution(Number(e.target.value))}
                    className="rounded-xl border border-lavender/60 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm outline-none focus:border-mint-deep focus:ring-4 focus:ring-mint/40"
                >
                    <option value={512}>512 px</option>
                    <option value={1024}>1024 px</option>
                    <option value={2048}>2048 px</option>
                </select>
                <span className="text-xs sm:text-sm text-ink-soft">
                    Resolution
                </span>
            </div>
        </div>
    );
};

export default QRPreview;
