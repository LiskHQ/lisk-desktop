import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { getSdkError } from '@walletconnect/utils';
import { useAccounts } from '@account/hooks/useAccounts';
import { LISK_SIGNING_METHODS } from '../data/chainConfig';
import { getWalletAddressFromParams } from './helpers';
import { signMessage, signTransaction } from './methods';

export async function approveLiskRequest(requestEvent) {
  const { params, id } = requestEvent;
  const { request } = params;
  // Access those from hooks
  const { accounts } = useAccounts();
  const liskAddresses = accounts.map(item => item.summary.address);
  // const { liskAddresses, liskWallets } = useLiskWallets();
  const wallet = getWalletAddressFromParams(liskAddresses, params);

  switch (request.method) {
    case LISK_SIGNING_METHODS.LISK_SIGN_MESSAGE: {
      const signedMessage = await signMessage(request.params.message, wallet);
      return formatJsonRpcResult(id, signedMessage);
    }

    case LISK_SIGNING_METHODS.LISK_SIGN_TRANSACTION: {
      const signedTransaction = await signTransaction(
        request.params.rawTx,
        request.params.networkIdentifier,
        request.params.schema,
        wallet,
      );

      return formatJsonRpcResult(id, signedTransaction);
    }

    default:
      throw new Error(getSdkError('INVALID_METHOD').message);
  }
}

export function rejectLiskRequest(request) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message);
}
