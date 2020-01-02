import React, { useEffect } from 'react';
import { Button } from '../../toolbox/buttons/button';

const Toast = ({
  label, className, timeout, onTimeout,
}) => {
  useEffect(() => {
    const timer = setTimeout(onTimeout, timeout);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Button size="m" className={className}>{label}</Button>
  );
};

export default Toast;
