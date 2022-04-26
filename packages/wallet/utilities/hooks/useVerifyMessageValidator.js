import { useMemo } from 'react';
import verifyMessageValidator from '../verifyMessageValidator';

const useVerifyMessageValidator = (inputs) =>
  useMemo(() => verifyMessageValidator(inputs), [inputs]);

export default useVerifyMessageValidator;
