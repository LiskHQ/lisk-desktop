import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import { secondPassphraseRemoved } from '@auth/store/action';
import Box from 'src/theme/box';
import Illustration from 'src/modules/common/components/illustration';
import BoxContent from 'src/theme/box/content';
import { isEmpty } from 'src/utils/helpers';
import { getDeviceType } from '@wallet/utils/hwManager';
import styles from './txSignatureCollector.css';

const TxSignatureCollector = ({
  t,
  transactions,
  account,
  actionFunction,
  multisigTransactionSigned,
  rawTx,
  nextStep,
  statusInfo,
  sender,
  transactionDoubleSigned,
  signatureStatus,
  signatureSkipped,
}) => {
  const deviceType = getDeviceType(account.hwInfo?.deviceModel);
  const dispatch = useDispatch();

  useEffect(() => {
    /**
     * All multisignature transactions get signed using the a unique action
     * Therefore there's no need to pass the action function, instead the
     * sender account is required.
     */
    if (sender) {
      if (
        signatureStatus === signatureCollectionStatus.fullySigned
        || signatureStatus === signatureCollectionStatus.overSigned
      ) {
        // Skip the current member as the all required signature are collected
        signatureSkipped({ rawTx });
      } else {
        multisigTransactionSigned({
          rawTx,
          sender,
        });
      }
    } else {
      /**
       * The action function must be wrapped in dispatch
       * and passed via the tx summary screen.
       * It's called in this step so we can display the
       * HW pending screen. For ordinary login we don't display
       * the illustration.
       */
      actionFunction({ ...rawTx, fee: rawTx.fee.value });
    }
    return () => {
      // Ensure second passphrase is removed to prevent automatically signing future transactions
      if (account?.secondPassphrase) {
        dispatch(secondPassphraseRemoved());
      }
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction)) {
      const hasSecondPass = !!account.secondPassphrase;
      const isDoubleSigned = !transactions.signedTransaction.signatures.some(
        (sig) => sig.length === 0,
      );
      if (!transactions.txSignatureError && hasSecondPass && !isDoubleSigned) {
        transactionDoubleSigned();
      } else if (!hasSecondPass || isDoubleSigned) {
        nextStep({ rawTx, statusInfo, sender });
      }
    }

    if (transactions.txSignatureError) {
      nextStep({ rawTx, statusInfo, sender });
    }
  }, [transactions.signedTransaction, transactions.txSignatureError]);

  if (!deviceType) {
    return <div />;
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
