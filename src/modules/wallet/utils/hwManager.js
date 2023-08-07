import {
  getMembersAndSenderIndex,
  updateMultiSigRegSignatures,
} from 'src/modules/transaction/utils';

/**
 * Insert transaction signature at appropriate index for regular and multisignature accounts.
 * The signature insertion logic is copied from Lisk SDK https://github.com/LiskHQ/lisk-sdk/blob/2593d1fe70154a9209b713994a252c494cad7123/elements/lisk-transactions/src/sign.ts#L228-L297
 */
/* eslint-disable max-statements, complexity */
const updateTransactionSignatures = (
  wallet,
  senderAccount,
  transaction,
  signature,
  isParamsSigning,
  options
) => {
  const { mandatoryKeys, optionalKeys } = senderAccount;
  const isAccountMultisignature = mandatoryKeys.length + optionalKeys.length > 0;
  const currentAccountPubKey = Buffer.from(wallet.metadata.pubkey, 'hex');

  // Add signature when signing from a regular account
  if (!isAccountMultisignature && !isParamsSigning) {
    transaction.signatures[0] = signature;

    return transaction;
  }

  // Add params signature when registering multisignature account
  if (!isAccountMultisignature && isParamsSigning) {
    const { senderIndex, members } = getMembersAndSenderIndex(transaction, currentAccountPubKey);
    if (senderIndex >= 0) {
      updateMultiSigRegSignatures(transaction, members, senderIndex, signature);
    }

    return transaction;
  }

  // Add signature when signing from multisig accounts
  // Convert keys to buffer and sort them to ensure the signature's are inserted in correct order
  const keys = {
    mandatoryKeys: options.txInitiatorAccount.mandatoryKeys
      .map((k) => Buffer.from(k, 'hex'))
      .sort((publicKeyA, publicKeyB) => publicKeyA.compare(publicKeyB)),
    optionalKeys: options.txInitiatorAccount.optionalKeys
      .map((k) => Buffer.from(k, 'hex'))
      .sort((publicKeyA, publicKeyB) => publicKeyA.compare(publicKeyB)),
  };
  const accountKeys = keys.mandatoryKeys.concat(keys.optionalKeys);

  for (let i = 0; i < accountKeys.length; i += 1) {
    if (accountKeys[i].equals(currentAccountPubKey)) {
      transaction.signatures[i] = signature;
    } else if (transaction.signatures[i] === undefined) {
      transaction.signatures[i] = Buffer.alloc(0);
    }
  }

  return transaction;
};

export { updateTransactionSignatures };
