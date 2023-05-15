import { useEffect } from 'react';

function useOutsideClickListener(ref, isActive, onToggle) {
  function removeClickEventListener(eventListener) {
    window.removeEventListener('click', eventListener, {
      capture: true,
    });
  }

  function handleOutsideClick(event) {
    const target = event.target || {};
    if (!ref.current.contains(target)) {
      onToggle();
      removeClickEventListener(handleOutsideClick);
    }
  }

  useEffect(() => {
    if (isActive) {
      window.addEventListener('click', handleOutsideClick, { capture: true });
    } else {
      removeClickEventListener(handleOutsideClick);
    }
    return () => removeClickEventListener(handleOutsideClick);
  }, [isActive]);
}

export default useOutsideClickListener;
