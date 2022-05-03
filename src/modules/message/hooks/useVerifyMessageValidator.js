import { useMemo } from 'react';
import verifyMessageValidator from '../utils/verifyMessageValidator';

const useVerifyMessageValidator = (inputs) =>
  useMemo(() => verifyMessageValidator(inputs), [inputs]);

export default useVerifyMessageValidator;
