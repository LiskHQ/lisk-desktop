import { useCallback, useEffect } from 'react';

export const useRestrictWindowActions = ({ actions, window }) => {
  const restrictAction = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    actions?.forEach((action) => action && window.addEventListener(action, restrictAction));
    return () => {
      actions?.forEach((action) => action && window?.removeEventListener(action, restrictAction));
    };
  }, [actions, window, restrictAction]);
};
