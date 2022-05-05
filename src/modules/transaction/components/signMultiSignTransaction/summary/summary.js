import React, { useMemo } from 'react';
import { isEmpty } from 'src/utils/helpers';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import BoxContent from 'src/theme/box/content';
import Box from 'src/theme/box';
import TransactionDetails from '@transaction/components/transactionDetails2';
import TransactionDetailsProvider from '@transaction/context';

import ProgressBar from '../progressBar';
import { showSignButton, getTransactionSignatureStatus } from '../helpers';
import { ActionBar, Feedback } from './footer';
import styles from '../styles.css';

const Summary = ({
  t,
  transaction,
  account,
  nextStep,
  history,
  error,
  senderAccount,
}) => {
  const isMember = useMemo(() => {
    if (senderAccount.data.keys) {
      return showSignButton(senderAccount.data, account, transaction);
    }
    return null;
  }, [senderAccount.data]);

  const signatureStatus = useMemo(() => {
    if (senderAccount.data.keys) {
      return getTransactionSignatureStatus(senderAccount.data, transaction);
    }
    return null;
  }, [senderAccount.data]);

  const onClick = () => {
    nextStep({
      rawTransaction: transaction,
      sender: senderAccount,
      signatureStatus,
    });
  };

  const nextButton = {
    title:
      signatureStatus === signatureCollectionStatus.fullySigned
        ? t('Continue')
        : t('Sign'),
    onClick,
  };

  const showFeedback = !isMember
    || signatureStatus === signatureCollectionStatus.fullySigned
    || signatureStatus === signatureCollectionStatus.occupiedByOptionals;

  if (isEmpty(senderAccount.data)) {
    return <div />;
  }

  return (
    <Box className={styles.boxContainer}>
      <header>
        <h1>{t('Sign multisignature transaction')}</h1>
        <p>
          {t(
            'Provide a signature for a transaction which belongs to a multisignature account.',
          )}
        </p>
      </header>
      <BoxContent>
        <ProgressBar current={2} />
        <TransactionDetailsProvider
          activeToken="LSK"
          error={error}
          transaction={transaction}
          account={senderAccount.data}
          schema={`${transaction.moduleAssetId}-preview`}
          containerStyle={`${styles.txDetails} ${
            showFeedback && isMember ? styles.small : ''
          }`}
        >
          <TransactionDetails />
        </TransactionDetailsProvider>
      </BoxContent>
      {isMember ? (
        <ActionBar t={t} history={history} nextButton={nextButton} />
      ) : null}
      {showFeedback ? (
        <Feedback t={t} isMember={isMember} signatureStatus={signatureStatus} />
      ) : null}
    </Box>
  );
};
export default Summary;
