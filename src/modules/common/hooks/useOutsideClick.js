import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useOutsideClick = (ref, callback = () => {}) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref?.current && !ref.current.contains(event.target)) {
        callback?.()
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, [ref]);
}