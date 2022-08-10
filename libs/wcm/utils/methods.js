import { transactions, cryptography } from '@liskhq/lisk-client';

export const signMessage = async (message, wallet) => {
  const msgBytes = cryptography.digestMessage(message);
  const signedMessage = cryptography.signDataWithPrivateKey(msgBytes, wallet.summary.privateKey);
  return { signature: signedMessage };
};

export const signTransaction = async (
  rawTx, networkIdentifier, schema, wallet,
) => {
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
    this.keypair.secretKey,
  );

  return { signature: res.signatures, id: res.id };
};
