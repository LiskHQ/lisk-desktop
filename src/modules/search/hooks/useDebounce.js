import { useState, useEffect } from 'react';

/**
 * Sets a debounced value to value (passed in) after the specified delay.
 */
// eslint-disable-next-line import/prefer-default-export
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
