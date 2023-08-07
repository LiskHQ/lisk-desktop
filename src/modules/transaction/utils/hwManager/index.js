import { transactions } from '@liskhq/lisk-client';
import { getSignedTransaction } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';
import { updateTransactionSignatures } from 'src/modules/wallet/utils/hwManager';
import { signMessageUsingHW } from 'src/modules/wallet/utils/signMessage';
import { joinModuleAndCommand } from '../moduleCommand';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';
import { getUnsignedBytes, MESSAGE_TAG_MULTISIG_REG } from '../transaction';

const createUnsignedMessage = (TAG, chainID, unsignedBytes) =>
  Buffer.concat([Buffer.from(TAG, 'utf8'), Buffer.from(chainID, 'hex'), unsignedBytes]).toString(
    'hex'
  );

const signMultiSignatureTransaction = async (wallet, schema, chainID, transaction) => {
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

/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
// eslint-disable-next-line max-statements
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

  let signature;
  let isParamsSigning = false;

  if (isRegisterMultisignature) {
    const areAllMembersSigned =
      transaction.params.signatures.filter((sig) => sig.compare(Buffer.alloc(64)) === 0).length ===
      0;

    if (!areAllMembersSigned) {
      const unsignedBytes = getUnsignedBytes(transaction, options.messageSchema);
      const unsignedMessage = createUnsignedMessage(
        MESSAGE_TAG_MULTISIG_REG,
        chainID,
        unsignedBytes
      );
      signature = await signMessageUsingHW({ account: wallet, message: unsignedMessage });
      isParamsSigning = true;
    }

    signature = await signMultiSignatureTransaction(wallet, schema, chainID, transaction);
  } else {
    signature = await signMultiSignatureTransaction(wallet, schema, chainID, transaction);
  }

  return updateTransactionSignatures(
    wallet,
    senderAccount,
    transaction,
    signature,
    isParamsSigning,
    options
  );
};

export { signTransactionByHW };
