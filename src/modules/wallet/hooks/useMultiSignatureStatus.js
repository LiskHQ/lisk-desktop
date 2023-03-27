import { useMemo } from 'react';
import { getMultiSignatureStatus } from '../utils/multiSignatureStatus';

/**
 * A memorized hook for getMultiSignatureStatus
 *
 * @param {Object} data - The object containing, senderAccount, account, transactionJSON and currentAccount
 * @param {Object} data.senderAccount - sender's account
 * @param {Object} data.currentAccount - the currently selected encrypted account
 * @param {Object} daqta.transactionJSON - JSON formate of the transaction to be signed
 * @param {Object} daqta.account - user's account from redux
 * @returns {Object} padded string
 */
export const useMultiSignatureStatus = (props) =>
  useMemo(() => getMultiSignatureStatus(props), Object.values(props));
