"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { encodeQRData, validateQRData } from "../lib/qr-types";
import { ValidationError } from "../types/qr.types";
import { debounce } from "../lib/utils/qr-helpers";

interface UseQRFormReturn {
  fields: Record<string, string>;
  updateField: (fieldName: string, value: string) => void;
  resetForm: () => void;
  errors: ValidationError[];
  validate: () => boolean;
  touchedFields: Set<string>;
  markTouched: (fieldName: string) => void;
}

/**
 * useQRForm Hook
 *
 * Manages form fields for QR code generation with validation and encoding.
 * Automatically encodes fields and validates on blur.
 *
 * Usage:
 * ```
 * const { fields, updateField, errors, validate } = useQRForm("Website", defaultFields);
 *
 * return (
 *   <input
 *     value={fields.url}
 *     onChange={(e) => updateField("url", e.target.value)}
 *     onBlur={() => validate()}
 *   />
 * );
 * ```
 */
export function useQRForm(
  selectedType: string,
  defaultFields: Record<string, Record<string, string>>,
  onEncode?: (encoded: string) => void
): UseQRFormReturn {
  const [fields, setFields] = useState<Record<string, Record<string, string>>>(
    defaultFields
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const debouncedValidateRef = useRef<ReturnType<typeof debounce> | null>(
    null
  );

  // Reset form when type changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFields(() => defaultFields);
    setErrors([]);
    setTouchedFields(new Set());
  }, [selectedType, defaultFields]);

  // Validate and return result
  const validate = useCallback((): boolean => {
    const result = validateQRData(fields[selectedType], selectedType);
    setErrors(result.errors);
    return result.valid;
  }, [fields, selectedType]);

  // Update field and encode
  const updateField = useCallback(
    (fieldName: string, value: string) => {
      setFields((prev) => ({
        ...prev,
        [selectedType]: {
          ...prev[selectedType],
          [fieldName]: value,
        },
      }));

      // Encode and call callback
      try {
        const encoded = encodeQRData(
          {
            ...fields[selectedType],
            [fieldName]: value,
          },
          selectedType
        );
        onEncode?.(encoded);

        // Clear errors for this field if touched
        if (touchedFields.has(fieldName)) {
          validate();
        }
      } catch {
        // Partial input - silently fail
      }
    },
    [fields, selectedType, touchedFields, onEncode, validate]
  );

  // Debounced validation on blur
  useEffect(() => {
    debouncedValidateRef.current = debounce(validate, 300);
  }, [validate]);

  // Mark field as touched and validate
  const markTouched = useCallback(
    (fieldName: string) => {
      setTouchedFields((prev) => {
        const next = new Set(prev);
        next.add(fieldName);
        return next;
      });
      debouncedValidateRef.current?.();
    },
    []
  );

  // Reset form
  const resetForm = useCallback(() => {
    setFields(() => defaultFields);
    setErrors([]);
    setTouchedFields(new Set());
  }, [defaultFields]);

  return {
    fields: fields[selectedType] ?? {},
    updateField,
    resetForm,
    errors,
    validate,
    touchedFields,
    markTouched,
  };
}

export default useQRForm;
