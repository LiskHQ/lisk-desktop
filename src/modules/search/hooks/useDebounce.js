import { useState, useEffect, useRef } from 'react';

/**
 * Sets a debounced value to value (passed in) after the specified delay.
 */
// eslint-disable-next-line import/prefer-default-export
export function useDebounce(value, delay) {
  const timeoutHandler = useRef(null);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    clearTimeout(timeoutHandler.current);
    timeoutHandler.current = setTimeout(() => {
      setDebouncedValue(value);
      clearTimeout(timeoutHandler.current);
    }, delay);

    return () => {
      clearTimeout(timeoutHandler.current);
    };
  }, [JSON.stringify(value), delay]);

  return debouncedValue;
}
