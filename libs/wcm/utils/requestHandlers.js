import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { getSdkError } from '@walletconnect/utils';
import { ERROR_CASES } from '../constants/lifeCycle';
import { LISK_SIGNING_METHODS } from '../constants/permissions';
import { signMessage, signTransaction } from './methods';

export async function approveLiskRequest(requestEvent, wallet) {
  const { params, id } = requestEvent;
  const { request } = params;

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
      throw new Error(getSdkError(ERROR_CASES.INVALID_METHOD).message);
  }
}

export function rejectLiskRequest(request) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError(ERROR_CASES.USER_REJECTED_METHODS).message);
}
