import React, { useEffect } from 'react';
import Box from '@toolbox/box';
import Illustration from '@toolbox/illustration';
import BoxContent from '@toolbox/box/content';
import { isEmpty } from '@utils/helpers';
import styles from './transactionSignature.css';

const TransactionSignature = ({
  t, transactions, account, actionFunction,
  rawTransaction, nextStep, statusInfo,
}) => {
  const deviceType = 'ledgerNano'; // @todo replace this by account.hwInfo.deviceType

  useEffect(() => {
    actionFunction(rawTransaction);
  }, []);

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction) || transactions.txSignatureError) {
      nextStep({ rawTransaction, statusInfo });
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
