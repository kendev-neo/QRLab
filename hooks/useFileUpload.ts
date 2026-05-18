"use client";
import { useState, useCallback } from "react";

interface FileUploadState {
  file: File | null;
  preview: string | null;
  error: string | null;
  isLoading: boolean;
}

interface UseFileUploadOptions {
  maxSize?: number; // bytes, default 5MB
  acceptedTypes?: string[]; // MIME types
  onError?: (error: string) => void;
}

interface UseFileUploadReturn extends FileUploadState {
  handleFileSelect: (file: File | null) => Promise<void>;
  clear: () => void;
}

/**
 * useFileUpload Hook
 *
 * Manages file upload state with validation, preview generation, and error handling.
 * Supports image files with configurable size limits and type validation.
 *
 * @param options - Configuration options
 * @returns File upload state and handlers
 *
 * @example
 * ```tsx
 * const { file, preview, error, handleFileSelect, clear } = useFileUpload({
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   acceptedTypes: ['image/png', 'image/jpeg'],
 * });
 *
 * return (
 *   <div>
 *     <input
 *       type="file"
 *       accept="image/*"
 *       onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
 *     />
 *     {preview && <img src={preview} alt="preview" />}
 *     {error && <p>{error}</p>}
 *   </div>
 * );
 * ```
 */
export function useFileUpload(
  options: UseFileUploadOptions = {}
): UseFileUploadReturn {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    acceptedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    onError,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    file: null,
    preview: null,
    error: null,
    isLoading: false,
  });

  const handleFileSelect = useCallback(
    async (file: File | null) => {
      // Clear state if no file
      if (!file) {
        setState({ file: null, preview: null, error: null, isLoading: false });
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          const error = `Invalid file type. Accepted: ${acceptedTypes.join(", ")}`;
          setState({
            file: null,
            preview: null,
            error,
            isLoading: false,
          });
          onError?.(error);
          return;
        }

        // Validate file size
        if (file.size > maxSize) {
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
          const error = `File too large. Maximum size: ${maxSizeMB}MB`;
          setState({
            file: null,
            preview: null,
            error,
            isLoading: false,
          });
          onError?.(error);
          return;
        }

        // Generate preview
        const reader = new FileReader();
        const preview = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });

        setState({
          file,
          preview,
          error: null,
          isLoading: false,
        });
      } catch (err) {
        const error =
          err instanceof Error ? err.message : "Failed to process file";
        setState({
          file: null,
          preview: null,
          error,
          isLoading: false,
        });
        onError?.(error);
      }
    },
    [acceptedTypes, maxSize, onError]
  );

  const clear = useCallback(() => {
    setState({
      file: null,
      preview: null,
      error: null,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    handleFileSelect,
    clear,
  };
}

export default useFileUpload;