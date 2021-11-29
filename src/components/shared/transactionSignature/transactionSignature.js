import React, { useEffect } from 'react';
import Box from '@toolbox/box';
import Illustration from '@toolbox/illustration';
import BoxContent from '@toolbox/box/content';
import { isEmpty } from '@utils/helpers';
import styles from './transactionSignature.css';

const getDeviceType = (deviceModel = '') => {
  if (/ledger/i.test(deviceModel)) {
    return 'ledgerNano';
  }
  if (/trezor/i.test(deviceModel)) {
    return 'trezor';
  }
  return '';
};

const TransactionSignature = ({
  t, transactions, account, actionFunction, multisigTransactionSigned,
  rawTransaction, nextStep, statusInfo, sender, transactionDoubleSigned,
}) => {
  const deviceType = getDeviceType(account.hwInfo?.deviceModel);

  useEffect(() => {
    /**
     * All multisignature transactions get signed using the a unique action
     * Therefore there's no need to pass the action function, instead the
     * sender account is required.
     */
    if (sender) {
      multisigTransactionSigned({
        rawTransaction, sender,
      });
    } else {
      /**
       * The action function must be wrapped in dispatch
       * and passed via the tx summary screen.
       * It's called in this step so we can display the
       * HW pending screen. For ordinary login we don't display
       * the illustration.
       */
      actionFunction(rawTransaction);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction)) {
      const hasSecondPass = !!account.secondPassphrase;
      const isDoubleSigned = !transactions.signedTransaction.signatures.some(
        sig => sig.length === 0,
      );
      if (!transactions.txSignatureError && hasSecondPass && !isDoubleSigned) {
        transactionDoubleSigned();
      } else if (!hasSecondPass || isDoubleSigned) {
        nextStep({ rawTransaction, statusInfo, sender });
      }
    }

    if (transactions.txSignatureError) {
      nextStep({ rawTransaction, statusInfo, sender });
    }
  }, [transactions.signedTransaction, transactions.txSignatureError]);

  if (!deviceType) {
    return (<div />);
  }

  return (
    <Box width="medium" className={`${styles.wrapper} hwConfirmation`}>
      <BoxContent className={styles.content}>
        <Illustration name={deviceType} />
        <h5>
          {t('Please confirm the transaction on your {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel })}
        </h5>
      </BoxContent>
    </Box>
  );
};

export default TransactionSignature;
