import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { transactionBroadcasted } from '../../../../actions/transactions';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxHeader from '../../../toolbox/box/header';

import styles from './styles.css';

const Result = ({
  t, transactionInfo, error,
}) => {
  const transactions = useSelector(state => state.transactions);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(!error ? 'pending' : 'fail');
  const success = status !== 'fail';

  const template = success ? {
    illustration: 'registerMultisignatureSuccess',
    message: t('You have successfully signed the transaction. You can download or copy the transaction and share it with members.'),
  } : {
    illustration: 'registerMultisignatureError',
    message: t('Oops, looks like something went wrong.'),
  };

  useEffect(() => {
    if (transactionInfo) {
      const confirmed = transactions.confirmed
        .filter(tx => tx.id === transactionInfo.id);
      const broadcastError = transactions.broadcastedTransactionsError
        .filter(tx => tx.transaction.id === transactionInfo.id);

      if (confirmed.length) setStatus('ok');
      if (broadcastError.length) setStatus('fail');
    }
  }, [transactions]);

  useEffect(() => {
    if (transactionInfo) dispatch(transactionBroadcasted(transactionInfo));
  }, [transactionInfo]);

  return (
    <section className={`${styles.wrapper} transaction-status`}>
      <Box className={styles.container}>
        <BoxHeader>
          <h1>{t('Register multisignature account')}</h1>
        </BoxHeader>
        <BoxContent className={styles.content}>
          <TransactionResult
            t={t}
            illustration={template.illustration}
            success={success}
            message={template.message}
            className={styles.content}
            error={JSON.stringify(error)}
          >
            {success && (
              <div className={styles.buttonsContainer}>
                <SecondaryButton>Copy</SecondaryButton>
                <PrimaryButton>
                  Download
                </PrimaryButton>
              </div>
            )}
          </TransactionResult>
        </BoxContent>
      </Box>
    </section>
  );
};

export default withTranslation()(Result);
