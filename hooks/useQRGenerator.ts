"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import QRCodeStyling from "qr-code-styling";

interface QRGeneratorOptions {
  type: string;
  width: number;
  height: number;
  data: string;
  margin: number;
  qrOptions: {
    errorCorrectionLevel: "L" | "M" | "Q" | "H";
  };
  imageOptions: {
    hideBackgroundDots: boolean;
    imageSize: number;
    margin: number;
  };
  dotsOptions: Record<string, unknown>;
  cornersSquareOptions: Record<string, unknown>;
  cornersDotOptions: Record<string, unknown>;
  backgroundOptions: Record<string, unknown>;
}

interface UseQRGeneratorReturn {
  qrRef: React.RefObject<QRCodeStyling | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isGenerating: boolean;
  error: string | null;
  downloadQR: (format: "png" | "jpeg" | "svg" | "pdf") => Promise<void>;
}

/**
 * useQRGenerator Hook
 *
 * Encapsulates QRCodeStyling instance management and QR generation logic.
 * Handles QR code creation, updates, and downloads.
 *
 * Usage:
 * ```
 * const { qrRef, containerRef, isGenerating, downloadQR } = useQRGenerator(options);
 *
 * return (
 *   <div>
 *     <div ref={containerRef} />
 *     <button onClick={() => downloadQR('png')}>Download</button>
 *   </div>
 * );
 * ```
 */
export function useQRGenerator(
  options: QRGeneratorOptions,
  onError?: (error: string) => void
): UseQRGeneratorReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const prevOptionsRef = useRef<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize options to prevent unnecessary re-renders
  const optionsKey = JSON.stringify(options);

  // Generate or update QR code
  useEffect(() => {
    if (!containerRef.current) return;

    const renderQR = () => {
      // Only regenerate if options changed
      if (optionsKey === prevOptionsRef.current && qrRef.current) return;

      prevOptionsRef.current = optionsKey;

      // Clear previous QR code
      containerRef.current!.innerHTML = "";

      // Create new QR code instance
      qrRef.current = new QRCodeStyling(options as never);
      qrRef.current.append(containerRef.current!);
    };

    // setIsGenerating / setError are intentionally synchronous in this effect
    // to reflect real-time QR generation state before rendering starts.
    setIsGenerating(true);
    setError(null);
    renderQR();
    setIsGenerating(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, onError]);

  // Cleanup on unmount
  useEffect(() => {
    const container = containerRef.current;
    return () => {
      if (container) {
        container.innerHTML = "";
      }
      qrRef.current = null;
    };
  }, []);

  // Download QR code
  const downloadQR = useCallback(
    async (format: "png" | "jpeg" | "svg" | "pdf") => {
      if (!qrRef.current) {
        const errorMessage = "QR code not ready";
        setError(errorMessage);
        onError?.(errorMessage);
        return;
      }

      try {
        setIsGenerating(true);
        await qrRef.current.download({
          name: "qrcode",
          extension: format as never,
        });
        setIsGenerating(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : `Failed to download ${format}`;
        setError(errorMessage);
        setIsGenerating(false);
        onError?.(errorMessage);
      }
    },
    [onError]
  );

  return {
    qrRef,
    containerRef,
    isGenerating,
    error,
    downloadQR,
  };
}

export default useQRGenerator;
