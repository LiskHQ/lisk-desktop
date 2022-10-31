import React, { useEffect } from 'react';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import Box from 'src/theme/box';
import Illustration from 'src/modules/common/components/illustration';
import BoxContent from 'src/theme/box/content';
import { isEmpty } from 'src/utils/helpers';
import EnterPasswordForm from 'src/modules/auth/components/EnterPasswordForm';
import { getDeviceType } from '@wallet/utils/hwManager';
import { useCurrentAccount } from '@account/hooks';
import styles from './txSignatureCollector.css';

const TxSignatureCollector = ({
  t,
  transactions,
  account,
  actionFunction,
  multisigTransactionSigned,
  rawTx,
  nextStep,
  prevStep,
  statusInfo,
  sender,
  signatureStatus,
  signatureSkipped,
  fees,
  selectedPriority,
}) => {
  const deviceType = getDeviceType(account.hwInfo?.deviceModel);
  const [currentAccount] = useCurrentAccount();

  const txVerification = (privateKey = undefined, publicKey = undefined) => {
    // console.log('actionFunction');
    /**
     * All multisignature transactions get signed using a unique action
     * Therefore there's no need to pass the action function, instead the
     * sender account is required.
     * 
     * @todo add test coverage for the multisigTransactionSigned action when the signature
     * collection process is refactored #4506 
     */
    // istanbul ignore next
    if (sender) {
      if (
        signatureStatus === signatureCollectionStatus.fullySigned
        || signatureStatus === signatureCollectionStatus.overSigned
      ) {
        // Skip the current member as all the required signature are collected
        signatureSkipped({ rawTx });
      } else {
        multisigTransactionSigned({
          rawTx,
          sender,
          privateKey,
        });
      }
    } else {
      /**
       * The action function must be wrapped in dispatch
       * and passed via the tx Summary screen.
       * It's called in this step so we can display the
       * HW pending screen. For ordinary login we don't display
       * the illustration.
       */
      actionFunction(
        {
          ...rawTx,
          selectedPriority,
          fees,
        },
        privateKey,
        publicKey,
      );
    }
  };

  const onEnterPasswordSuccess = ({ privateKey }) => {
    // console.log('onEnterPasswordSuccess');
    const { pubkey } = currentAccount.metadata;
    txVerification(privateKey, pubkey);
  };

  useEffect(() => {
    if (deviceType) {
      txVerification();
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction) || transactions.txSignatureError) {
      nextStep({ rawTx, statusInfo, sender });
    }
  }, [transactions.signedTransaction, transactions.txSignatureError]);

  if (!deviceType) {
    return (
      <div className={styles.container}>
        <TertiaryButton className={styles.backButton} onClick={prevStep}>
          <Icon name="arrowLeftTailed" />
        </TertiaryButton>
        <EnterPasswordForm
          title="Please provide your device password to sign a transaction."
          onEnterPasswordSuccess={onEnterPasswordSuccess}
        />
      </div>
    );
  }

  return (
    <Box width="medium" className={`${styles.wrapper} hwConfirmation`}>
      <BoxContent className={styles.content}>
        <Illustration name={deviceType} />
        <h5>
          {t('Please confirm the transaction on your {{deviceModel}}', {
            deviceModel: account.hwInfo.deviceModel,
          })}
        </h5>
      </BoxContent>
    </Box>
  );
};

export default TxSignatureCollector;
