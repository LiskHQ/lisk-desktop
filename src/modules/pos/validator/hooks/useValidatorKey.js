import { useState } from 'react';
import { validatorKeyValidator } from '../utils/validators';

const useValidatorKeys = (keyName, message, initialValue) => {
  const [key, setKey] = useState({
    value: initialValue ?? '',
    error: false,
    message: '',
  });

  const setValue = (value) => {
    const isValid = validatorKeyValidator(keyName, value);
    setKey({
      value,
      error: !isValid,
      message: isValid ? '' : message,
    });
  };

  return [key, setValue];
};

export default useValidatorKeys;
