import { transactions } from '@liskhq/lisk-client';
import { getSignedTransaction } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';
import { signMessageUsingHW } from 'src/modules/wallet/utils/signMessage';
import {
  getAccountKeys,
  getUnsignedBytes,
  insertSignature,
  MESSAGE_TAG_MULTISIG_REG,
} from 'src/modules/transaction/utils';
import { joinModuleAndCommand } from '../moduleCommand';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';

const createUnsignedMessage = (TAG, chainID, unsignedBytes) =>
  Buffer.concat([Buffer.from(TAG, 'utf8'), Buffer.from(chainID, 'hex'), unsignedBytes]).toString(
    'hex'
  );

const signTransaction = async (wallet, schema, chainID, transaction) => {
  const unsignedBytes = transactions.getSigningBytes(transaction, schema);
  const unsignedMessage = createUnsignedMessage(
    transactions.TAG_TRANSACTION,
    chainID,
    unsignedBytes
  );

  const signedTransaction = await getSignedTransaction(
    wallet.hw.path,
    wallet.metadata.accountIndex,
    unsignedMessage
  );
  let signature = signedTransaction?.signature;

  if (signature instanceof Uint8Array) {
    signature = Buffer.from(signature);
  }

  return signature;
};

const signRegisterMultisignatureParams = async (transaction, wallet, chainID, options) => {
  const currentAccountPubKey = Buffer.from(wallet.metadata.pubkey, 'hex');
  const unsignedBytes = getUnsignedBytes(transaction, options.messageSchema);
  const unsignedMessage = createUnsignedMessage(MESSAGE_TAG_MULTISIG_REG, chainID, unsignedBytes);

  const signature = await signMessageUsingHW({ account: wallet, message: unsignedMessage });
  const accountKeys = getAccountKeys(transaction.params);
  transaction.params.signatures = insertSignature(
    transaction.params.signatures,
    signature,
    accountKeys,
    currentAccountPubKey
  );

  return transaction;
};

/**
 * Insert transaction signature at appropriate index for regular and multisignature accounts.
 * The signature insertion logic is copied from Lisk SDK https://github.com/LiskHQ/lisk-sdk/blob/2593d1fe70154a9209b713994a252c494cad7123/elements/lisk-transactions/src/sign.ts#L228-L297
 */
/* eslint-disable max-statements, complexity */
const updateTransactionSignatures = (wallet, senderAccount, transaction, signature, options) => {
  const { mandatoryKeys, optionalKeys } = senderAccount;
  const isAccountMultisignature = mandatoryKeys.length + optionalKeys.length > 0;

  // Add signature when signing from a regular account
  if (!isAccountMultisignature) {
    transaction.signatures[0] = signature;

    return transaction;
  }

  // Add signature when signing from multisig accounts
  // Convert keys to buffer and sort them to ensure the signature's are inserted in correct order
  const accountKeys = getAccountKeys(options.txInitiatorAccount);
  const currentAccountPubKey = Buffer.from(wallet.metadata.pubkey, 'hex');
  transaction.signatures = insertSignature(
    transaction.signatures,
    signature,
    accountKeys,
    currentAccountPubKey
  );

  return transaction;
};

/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async ({
  wallet,
  schema,
  chainID,
  transaction,
  senderAccount,
  options,
}) => {
  const isRegisterMultisignature =
    joinModuleAndCommand(transaction) === MODULE_COMMANDS_NAME_MAP.registerMultisignature;
  const areAllMembersSigned =
    isRegisterMultisignature &&
    transaction.params.signatures.filter((sig) => sig.compare(Buffer.alloc(64)) === 0).length === 0;

  if (isRegisterMultisignature && !areAllMembersSigned) {
    transaction = await signRegisterMultisignatureParams(transaction, wallet, chainID, options);
  } else {
    const signature = await signTransaction(wallet, schema, chainID, transaction);
    transaction = updateTransactionSignatures(
      wallet,
      senderAccount,
      transaction,
      signature,
      options
    );
  }
  return transaction;
};

export { signTransactionByHW };
