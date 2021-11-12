import React, { useMemo } from 'react';
import { signTransaction } from '@utils/transaction';
import { isEmpty } from '@utils/helpers';
import BoxContent from '@toolbox/box/content';
import Box from '@toolbox/box';
import TransactionDetails from '@screens/transactionDetails/transactionDetails';

import ProgressBar from '../progressBar';
import {
  showSignButton, isTransactionFullySigned,
} from '../helpers';
import { ActionBar, Feedback } from './footer';
import styles from '../styles.css';

const ReviewSign = ({
  t,
  transaction,
  network,
  account,
  networkIdentifier,
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

  const isFullySigned = useMemo(() => {
    if (senderAccount.data.keys) {
      return isTransactionFullySigned(senderAccount.data, transaction);
    }
    return null;
  }, [senderAccount.data]);

  const onSignClick = () => {
    const [signedTx, err] = signTransaction(
      transaction,
      account.passphrase,
      networkIdentifier,
      senderAccount,
      isFullySigned,
      network,
    );
    nextStep({
      transaction: signedTx,
      error: err,
      senderAccount: senderAccount.data,
    });
  };

  const nextButton = {
    title: isFullySigned ? t('Continue') : t('Sign'),
    onClick: onSignClick,
  };

  const showFeedback = !isMember || isFullySigned;

  if (isEmpty(senderAccount.data)) {
    return <div />;
  }

  return (
    <Box className={styles.boxContainer}>
      <header>
        <h1>{t('Sign multisignature transaction')}</h1>
        <p>{t('Provide a signature for a transaction which belongs to a multisignature account.')}</p>
      </header>
      <BoxContent>
        <ProgressBar current={2} />
        <TransactionDetails
          t={t}
          activeToken="LSK"
          schema={`${transaction.moduleAssetId}-preview`}
          account={senderAccount.data}
          transaction={{
            data: transaction,
            error,
          }}
          containerStyle={styles.txDetails}
        />
      </BoxContent>
      {
        isMember ? (
          <ActionBar
            t={t}
            history={history}
            nextButton={nextButton}
          />
        ) : null
      }
      {
        showFeedback ? (
          <Feedback
            t={t}
            isMember={isMember}
            isFullySigned={isFullySigned}
          />
        ) : null
      }
    </Box>
  );
};
export default ReviewSign;
