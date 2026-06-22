'use client';

import { useState } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const clearValue = () => {
    setStoredValue(initialValue);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  };

  return [storedValue, setValue, clearValue];
}

export default useLocalStorage;
