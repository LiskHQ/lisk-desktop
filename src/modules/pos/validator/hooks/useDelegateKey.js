import { useState } from 'react';
import { delegateKeyValidator } from '../utils/validators';

const useDelegateKeys = (keyName, message, initialValue) => {
  const [key, setKey] = useState({
    value: initialValue ?? '',
    error: false,
    message: '',
  });

  const setValue = (value) => {
    const isValid = delegateKeyValidator(keyName, value);
    setKey({
      value,
      error: !isValid,
      message: isValid ? '' : message,
    });
  };

  return [key, setValue];
};

export default useDelegateKeys;
