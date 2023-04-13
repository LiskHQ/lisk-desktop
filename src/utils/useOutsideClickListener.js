import { useEffect } from 'react';

function useOutsideClickListener(ref, isActive, onToggle) {
  function handleOutsideClick(event) {
    const target = event.target || {};
    if (!ref.current.contains(target)) {
      onToggle();
      window.removeEventListener('click', handleOutsideClick, {
        capture: true,
      });
    }
  }

  useEffect(() => {
    if (isActive) {
      window.addEventListener('click', handleOutsideClick, { capture: true });
    } else {
      window.removeEventListener('click', handleOutsideClick, {
        capture: true,
      });
    }
    return () =>
      window.removeEventListener('click', handleOutsideClick, {
        capture: true,
      });
  }, [isActive]);
}

export default useOutsideClickListener;
