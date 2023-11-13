import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cryptography } from '@liskhq/lisk-client';
import { TertiaryButton } from '@theme/buttons';
import { useCommandSchema } from '@network/hooks';
import Icon from '@theme/Icon';
import { isEmpty } from 'src/utils/helpers';
import EnterPasswordForm from '@auth/components/EnterPasswordForm';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import useNonceSync from '@auth/hooks/useNonceSync';
import HWSigning from '@hardwareWallet/components/HWSigning/HWSigning';
import { TRANSACTION_SIGNING_TYPES } from 'src/modules/wallet/configuration/constants';
import styles from './txSignatureCollector.css';
import { joinModuleAndCommand, fromTransactionJSON, encodeTransaction } from '../../utils';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';
import useTxInitiatorAccount from '../../hooks/useTxInitiatorAccount';

const isModuleCommandValid = (moduleCommand) => /^\w+:\w+$/g.test(moduleCommand);

// eslint-disable-next-line max-statements
const TxSignatureCollector = ({
  transactions,
  actionFunction,
  multisigTransactionSigned,
  formProps,
  transactionJSON,
  nextStep,
  prevStep,
  statusInfo,
  fees,
  selectedPriority,
  confirmText,
  type = TRANSACTION_SIGNING_TYPES.TRANSACTION,
}) => {
  const [currentAccount] = useCurrentAccount();
  const { moduleCommandSchemas, messagesSchemas } = useCommandSchema();
  const { t } = useTranslation();

  // here, we want to get the auth account details of the user presently wanting to sign the transaction
  const { data: account, isLoading: isGettingAuthData } = useAuth({
    config: { params: { address: currentAccount?.metadata.address } },
  });

  // here, we want to get the auth account details of the account that initiated the transaction.
  const { isLoading: isGettingTxInitiatorAccount, txInitiatorAccount } = useTxInitiatorAccount({
    senderPublicKey: transactionJSON.senderPublicKey,
  });

  const isTransactionAuthor = transactionJSON.senderPublicKey === currentAccount?.metadata.pubkey;
  const isAuthorAccountMultisignature =
    [...(account?.data?.mandatoryKeys || []), ...(account?.data?.optionalKeys || [])].length > 0;
  const moduleCommand = joinModuleAndCommand(transactionJSON);
  const isRegisterMultisignature =
    moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature;
  const { incrementNonce } = useNonceSync();
  const txVerification = (privateKey = undefined, publicKey = undefined) => {
    /**
     * Non-multisignature account
     *  - Transaction signature
     *  - Transaction parameter signatures (multisignature registration)
     * Multisignature account
     *  - Signature from author and participants
     */

    /**
     * All multisignature transactions get signed using a unique action
     * Therefore there's no need to pass the action function, instead the
     * sender account is required.
     * CHECK IF SENDER ACCOUNT IS A MULTISIG
     */
    // Transaction authored from sender account and current account is a non multisignature account
    if (
      isTransactionAuthor &&
      !(isAuthorAccountMultisignature && isModuleCommandValid(moduleCommand)) &&
      !isRegisterMultisignature
    ) {
      /**
       * The action function must be wrapped in dispatch
       * and passed via the tx Summary screen.
       * It's called in this step, so we can display the
       * HW pending screen. For ordinary login we don't display
       * the illustration.
       */

      return actionFunction(
        {
          ...formProps,
          selectedPriority,
          fees,
        },
        transactionJSON,
        privateKey,
        publicKey,
        txInitiatorAccount,
        moduleCommandSchemas
      );
    }

    return multisigTransactionSigned({
      formProps,
      transactionJSON,
      privateKey,
      txInitiatorAccount,
      moduleCommandSchemas,
      messagesSchemas,
      sender: { ...account.data }, // this is the account of the present user wanting to sign the transaction
    });
  };

  const onEnterPasswordSuccess = ({ privateKey }) => {
    if (type !== TRANSACTION_SIGNING_TYPES.MESSAGE) {
      const paramsSchema = moduleCommandSchemas[moduleCommand];
      const transaction = fromTransactionJSON(transactionJSON, paramsSchema);
      const buffer = encodeTransaction(transaction, paramsSchema);
      const transactionHex = cryptography.utils.hash(buffer).toString('hex');
      if (isTransactionAuthor) {
        incrementNonce(transactionHex);
      }
    }
    txVerification(privateKey, currentAccount?.metadata.pubkey);
  };

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction)) {
      nextStep({ formProps, transactionJSON, statusInfo, sender: currentAccount });
      return;
    }

    if (transactions.txSignatureError) {
      nextStep({ formProps, transactionJSON, statusInfo, sender: currentAccount });
    }

    if (
      isEmpty(transactions.signedTransaction) &&
      !transactions.txSignatureError &&
      !currentAccount?.crypto
    ) {
      txVerification('', currentAccount?.metadata.pubkey);
    }
  }, [transactions.signedTransaction, transactions.txSignatureError]);

  if (currentAccount?.hw) {
    return <HWSigning />;
  }

  return (
    <div className={styles.container}>
      <TertiaryButton className={styles.backButton} onClick={prevStep}>
        <Icon name="arrowLeftTailed" />
      </TertiaryButton>
      <EnterPasswordForm
        title={t('Please enter your account password to sign this {{type}}.', { type })}
        confirmText={confirmText}
        onEnterPasswordSuccess={onEnterPasswordSuccess}
        isDisabled={isGettingAuthData || isGettingTxInitiatorAccount}
      />
    </div>
  );
};
export default TxSignatureCollector;
