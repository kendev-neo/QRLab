"use client";
import { useState, useEffect, useCallback } from "react";

interface UseLocalStorageOptions {
  serializer?: (value: unknown) => string;
  deserializer?: (value: string) => unknown;
}

/**
 * useLocalStorage Hook
 *
 * Manages state that persists to localStorage with automatic serialization.
 * Handles SSR safely by only accessing localStorage on client.
 *
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Serialization options
 * @returns [value, setValue, removeValue]
 *
 * @example
 * ```tsx
 * const [history, setHistory, removeHistory] = useLocalStorage("qr-history", []);
 *
 * const addToHistory = (item) => {
 *   setHistory([...history, item]);
 * };
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage only on client
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, serializer(valueToStore));
        }
      } catch (error) {
        console.warn(`Error saving to localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing from localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setStoredValue(deserializer(item));
        }
      }
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
    }
  }, [key, deserializer]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
