import React, { useEffect, useState } from 'react';
import { Button } from '../../toolbox/buttons/button';
import styles from './toast.css';

const Toast = ({
  toast, timeout, hideToast,
}) => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let timer = setTimeout(() => {
      setHidden(true);
      timer = setTimeout(() => {
        hideToast(toast);
      }, 500);
    }, timeout);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Button
      size="m"
      className={[
        'toast',
        styles[`index-${toast.index}`],
        styles.toast,
        styles[toast.type],
        hidden && styles.hidden,
      ].join(' ')}
    >
      {toast.label}
    </Button>
  );
};

export default Toast;
