import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TertiaryButton } from '@theme/buttons';
import { useCommandSchema } from '@network/hooks';
import Icon from '@theme/Icon';
import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import Illustration from '@common/components/illustration';
import { isEmpty } from 'src/utils/helpers';
import EnterPasswordForm from '@auth/components/EnterPasswordForm';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import useHWStatus from '@hardwareWallet/hooks/useHWStatus';
import HWReconnect from '@hardwareWallet/components/HWReconnect/HWReconnect';
import styles from './txSignatureCollector.css';
import { joinModuleAndCommand } from '../../utils';
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
}) => {
  const [sender] = useCurrentAccount();
  const { moduleCommandSchemas } = useCommandSchema();
  const { t } = useTranslation();
  const { status } = useHWStatus();

  // here, we want to get the auth account details of the user presently wanting to sign the transaction
  const { data: account, isLoading: isGettingAuthData } = useAuth({
    config: { params: { address: sender.metadata.address } },
  });

  // here, we want to get the auth account details of the account that initiated the transaction.
  const { isLoading: isGettingTxInitiatorAccount, txInitiatorAccount } = useTxInitiatorAccount({
    transactionJSON,
  });

  const isTransactionAuthor = transactionJSON.senderPublicKey === sender.metadata.pubkey;
  const isAuthorAccountMultisignature =
    [...(account?.data?.mandatoryKeys || []), ...(account?.data?.optionalKeys || [])].length > 0;
  const moduleCommand = joinModuleAndCommand(transactionJSON);
  const isRegisterMultisignature =
    moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature;
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
       * It's called in this step so we can display the
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
      sender: { ...account.data }, // this is the account of the present user wanting to sign the transaction
    });
  };

  const onEnterPasswordSuccess = ({ privateKey }) =>
    txVerification(privateKey, sender.metadata.pubkey);

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction)) {
      // @TODO: more investigation needs to be done to know if this is needed
      // const isDoubleSigned = !transactions.signedTransaction.signatures.some(
      //   (sig) => sig.length === 0
      // );
      // if (!transactions.txSignatureError && isDoubleSigned) {
      //   transactionDoubleSigned(moduleCommandSchemas);
      //   return;
      // }
      nextStep({ formProps, transactionJSON, statusInfo, sender });
      return;
    }

    if (transactions.txSignatureError) {
      nextStep({ formProps, transactionJSON, statusInfo, sender });
    }

    if (
      isEmpty(transactions.signedTransaction) &&
      !transactions.txSignatureError &&
      !sender.encryptedPassphrase
    ) {
      txVerification('', sender.metadata.pubkey);
    }
  }, [transactions.signedTransaction, transactions.txSignatureError]);

  if (!sender.metadata.isHW) {
    return (
      <div className={styles.container}>
        <TertiaryButton className={styles.backButton} onClick={prevStep}>
          <Icon name="arrowLeftTailed" />
        </TertiaryButton>
        <EnterPasswordForm
          title={t('Please enter your account password to sign this transaction.')}
          confirmText={confirmText}
          onEnterPasswordSuccess={onEnterPasswordSuccess}
          isDisabled={isGettingAuthData || isGettingTxInitiatorAccount}
        />
      </div>
    );
  }

  if (status !== 'connected') {
    return <HWReconnect />;
  }

  const hwDeviceName = `${sender.hw?.brand.toLowerCase()}${sender.hw?.model.split(' ')[0]}`;

  return (
    <Box width="medium" className={`${styles.wrapper} hwConfirmation`}>
      <BoxContent className={styles.content}>
        <Illustration name={hwDeviceName} />
        <h5>
          {t('Please confirm the transaction on your {{deviceModel}}', {
            deviceModel: sender.hw?.model,
          })}
        </h5>
      </BoxContent>
    </Box>
  );
};
export default TxSignatureCollector;
