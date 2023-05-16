import { transactions, cryptography, codec } from '@liskhq/lisk-client';
import { getSignedMessage, getSignedTransaction } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';
import { updateTransactionSignatures } from 'src/modules/wallet/utils/hwManager';
import { joinModuleAndCommand } from '../moduleCommand';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';
import { MESSAGE_TAG_MULTISIG_REG } from '../transaction';

const createUnsignedMessage = (TAG, chainID, unsignedBytes) =>
  Buffer.concat([Buffer.from(TAG, 'utf8'), Buffer.from(chainID, 'hex'), unsignedBytes]).toString(
    'hex'
  );

const createUnsignedBytes = (transaction, options) => {
  const message = {
    mandatoryKeys: transaction.params.mandatoryKeys,
    optionalKeys: transaction.params.optionalKeys,
    numberOfSignatures: transaction.params.numberOfSignatures,
    address: cryptography.address.getAddressFromPublicKey(transaction.senderPublicKey),
    nonce: transaction.nonce,
  };
  const { messageSchema } = options;

  return codec.codec.encode(messageSchema, message);
};

/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
// eslint-disable-next-line max-statements
const signTransactionByHW = async ({ wallet, schema, chainID, transaction, senderAccount, options }) => {
  const isMultisigReg = joinModuleAndCommand(transaction) === MODULE_COMMANDS_NAME_MAP.registerMultisignature;
  const signerPublicKey = Buffer.from(senderAccount.summary.publicKey, 'hex');
  const isSender =
    Buffer.isBuffer(transaction.senderPublicKey) &&
    signerPublicKey.equals(transaction.senderPublicKey);

  const isFullySigned = isMultisigReg && transactions.params.signatures.filter(
    (sig) => sig.compare(Buffer.alloc(64)) >= 0
  ).length;

  let unsignedMessage;

  if (isSender && isMultisigReg && !isFullySigned) {
    const unsignedBytes = createUnsignedBytes(transaction, options);
    unsignedMessage = createUnsignedMessage(
      MESSAGE_TAG_MULTISIG_REG,
      chainID,
      unsignedBytes
    );
    const { signature } = await getSignedMe(
      wallet.hw.path,
      wallet.metadata.accountIndex,
      unsignedMessage
    );
  } else {
    const unsignedBytes = transactions.getSigningBytes(transaction, schema);
    unsignedMessage = createUnsignedMessage(
      transactions.TAG_TRANSACTION,
      chainID,
      unsignedBytes
    );
    const { signature } = await getSignedTransaction(
      wallet.hw.path,
      wallet.metadata.accountIndex,
      unsignedMessage
    );
  }

  

  return updateTransactionSignatures(wallet, senderAccount, transaction, Buffer.from(signature));
};

export { signTransactionByHW, createUnsignedMessage };
