import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { TertiaryButton } from 'src/theme/buttons';
// import { secondPassphraseRemoved } from '@auth/store/action';
import { useCommandSchema } from '@network/hooks';
import Icon from 'src/theme/Icon';
// import Box from 'src/theme/box';
// import Illustration from 'src/modules/common/components/illustration';
// import BoxContent from 'src/theme/box/content';
import { isEmpty } from 'src/utils/helpers';
import EnterPasswordForm from 'src/modules/auth/components/EnterPasswordForm';
import { useAuth } from '@auth/hooks/queries';
// import { getDeviceType } from '@wallet/utils/hwManager';
import { useCurrentAccount } from '@account/hooks';
import styles from './txSignatureCollector.css';
import { joinModuleAndCommand } from '../../utils';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';
import useTxInitiatorAccount from '../../hooks/useTxInitiatorAccount';

// eslint-disable-next-line max-statements
const TxSignatureCollector = ({
  // t,
  transactions,
  actionFunction,
  multisigTransactionSigned,
  formProps,
  transactionJSON,
  nextStep,
  prevStep,
  statusInfo,
  transactionDoubleSigned,
  fees,
  selectedPriority,
}) => {
  const [sender] = useCurrentAccount();
  const { moduleCommandSchemas } = useCommandSchema();

  // here, we want to get the auth account details of the user presently wanting to sign the transaction
  const { data: account, isLoading: isGettingAuthData } = useAuth({
    config: { params: { address: sender.metadata.address } },
  });

  // here, we want to get the auth account details of the account that initated the transaction.
  const { isLoading: isGettingTxInitiatorAccount, txInitiatorAccount } = useTxInitiatorAccount({
    transactionJSON,
  });

  // const deviceType = getDeviceType(account?.hwInfo?.deviceModel);
  // const dispatch = useDispatch();
  const isTransactionAuthor = transactionJSON.senderPublicKey === sender.metadata.pubkey;
  const isAuthorAccountMultisignature =
    [...(account?.data?.mandatoryKeys || []), ...(account?.data?.optionalKeys || [])].length > 0; // account.info.LSK.summary.isMultisignature;
  // const isSignerAccountMultisignature = sender.data?.keys.numberOfSignatures > 0;
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
    if (isTransactionAuthor && !isAuthorAccountMultisignature && !isRegisterMultisignature) {
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

    // Transaction authored from other account and current account is a non multisignature account
    // if (transactionJSON.senderPublicKey !== currentAccount.metadata.pubkey && !account.info.LSK.summary.isMultisignature) {
    //   // Skip the current member as all the required signature are collected
    //   return signatureSkipped({ formProps, transactionJSON, });
    // }

    // if (signatureStatus === signatureCollectionStatus.fullySigned || signatureStatus === signatureCollectionStatus.overSigned) {

    // }
  };

  const onEnterPasswordSuccess = ({ privateKey }) =>
    txVerification(privateKey, sender.metadata.pubkey);

  // TODO: Revisit this code, latest multisignature protocol covers old second passphrase scenarios.
  // We no longer need second passphrase logic as long as multisignature feature is working.

  // useEffect(() => {
  //   if (deviceType) {
  //     txVerification();
  //   }
  //   return () => {
  //     // Ensure second passphrase is removed to prevent automatically signing future transactions
  //     if (account?.secondPassphrase) {
  //       dispatch(secondPassphraseRemoved());
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction)) {
      // const hasSecondPass = !!account.secondPassphrase;
      const isDoubleSigned = !transactions.signedTransaction.signatures.some(
        (sig) => sig.length === 0
      );
      if (!transactions.txSignatureError && !isDoubleSigned) {
        transactionDoubleSigned();
        return;
      }
      nextStep({ formProps, transactionJSON, statusInfo, sender });
    }

    if (transactions.txSignatureError) {
      nextStep({ formProps, transactionJSON, statusInfo, sender });
    }
  }, [transactions.signedTransaction, transactions.txSignatureError]);

  // TODO: Resolve this issue during HW implementation

  // if (!deviceType) {
  return (
    <div className={styles.container}>
      <TertiaryButton className={styles.backButton} onClick={prevStep}>
        <Icon name="arrowLeftTailed" />
      </TertiaryButton>
      <EnterPasswordForm
        title="Please provide your device password to sign a transaction."
        onEnterPasswordSuccess={onEnterPasswordSuccess}
        isDisabled={isGettingAuthData || isGettingTxInitiatorAccount}
      />
    </div>
  );
  // }

  // return (
  //   <Box width="medium" className={`${styles.wrapper} hwConfirmation`}>
  //     <BoxContent className={styles.content}>
  //       <Illustration name={deviceType} />
  //       <h5>
  //         {t('Please confirm the transaction on your {{deviceModel}}', {
  //           deviceModel: account.hwInfo.deviceModel,
  //         })}
  //       </h5>
  //     </BoxContent>
  //   </Box>
  // );
};

export default TxSignatureCollector;
