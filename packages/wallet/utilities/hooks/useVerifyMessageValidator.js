import { useMemo } from 'react';
import verifyMessageValidator from '../verifyMessageValidator';

const useVerifyMessageValidator = (inputs) => {
  return useMemo(() => verifyMessageValidator(inputs), [inputs]);
};

export default useVerifyMessageValidator;
