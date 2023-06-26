/* istanbul ignore file */
// @todo Add test coverage by #4418
import { getSdkError } from '@walletconnect/utils';
import { transactions, cryptography } from '@liskhq/lisk-client';
import { ERROR_CASES } from '../constants/lifeCycle';
import { SIGNING_METHODS } from '../constants/permissions';
import { formatJsonRpcError, formatJsonRpcResult } from './jsonRPCFormat';

const signMessage = async (message, wallet) => {
  const msgBytes = cryptography.digestMessage(message);
  const signedMessage = cryptography.signDataWithPrivateKey(msgBytes, wallet.summary.privateKey);
  return { signature: signedMessage };
};

const signTransaction = async (rawTx, networkIdentifier, schema, wallet) => {
  const transaction = {
    moduleID: rawTx.moduleID,
    assetID: rawTx.assetID,
    nonce: BigInt(rawTx.nonce),
    fee: BigInt(rawTx.fee),
    senderPublicKey: wallet.summary.publicKey,
    asset: {
      data: rawTx.asset.data,
      amount: BigInt(rawTx.asset.amount),
      recipientAddress: cryptography.getAddressFromBase32Address(rawTx.asset.recipientAddress),
    },
  };
  const res = transactions.signTransactionWithPrivateKey(
    schema,
    transaction,
    Buffer.from(networkIdentifier),
    this.keypair.secretKey
  );

  return { signature: res.signatures, id: res.id };
};

export async function approveLiskRequest(requestEvent, wallet) {
  const { params, id } = requestEvent;
  const { request } = params;

  switch (request.method) {
    case SIGNING_METHODS.SIGN_MESSAGE.key: {
      const signedMessage = await signMessage(request.params.message, wallet);
      return formatJsonRpcResult(id, signedMessage);
    }

    case SIGNING_METHODS.SIGN_TRANSACTION.key: {
      const signedTransaction = await signTransaction(
        request.params.rawTx,
        request.params.networkIdentifier,
        request.params.schema,
        wallet
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
