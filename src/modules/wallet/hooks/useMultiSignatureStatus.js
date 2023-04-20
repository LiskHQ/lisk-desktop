import { useMemo } from 'react';
import { getMultiSignatureStatus } from '../utils/multiSignatureStatus';

/**
 * A memorized hook for getMultiSignatureStatus
 */
export const useMultiSignatureStatus = (props) =>
  useMemo(() => getMultiSignatureStatus(props), Object.values(props));
