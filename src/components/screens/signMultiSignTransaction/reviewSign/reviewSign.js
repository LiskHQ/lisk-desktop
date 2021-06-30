import React, { useMemo } from 'react';
import { transactions } from '@liskhq/lisk-client';
import { moduleAssetSchemas, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { createTransactionObject, flattenTransaction } from '@utils/transaction';
import { isEmpty } from '@utils/helpers';
import BoxContent from '@toolbox/box/content';
import Box from '@toolbox/box';
import TransactionDetails from '@screens/transactionDetails/transactionDetails';

import ProgressBar from '../progressBar';
import {
  getKeys, showSignButton, isTransactionFullySigned, findNonEmptySignatureIndices,
} from '../helpers';
import { ActionBar, Feedback } from './footer';
import styles from '../styles.css';

const ReviewSign = ({
  t,
  transaction,
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

  // eslint-disable-next-line max-statements
  const signTransaction = () => {
    let signedTransaction;
    let err;

    const isGroupRegistration = transaction.moduleAssetId
        === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

    const { mandatoryKeys, optionalKeys } = getKeys({
      senderAccount: senderAccount.data, transaction, isGroupRegistration,
    });

    const flatTransaction = flattenTransaction(transaction);
    const transactionObject = createTransactionObject(flatTransaction, transaction.moduleAssetId);
    const keys = {
      mandatoryKeys: mandatoryKeys.map(key => Buffer.from(key, 'hex')),
      optionalKeys: optionalKeys.map(key => Buffer.from(key, 'hex')),
    };

    const includeSender = transaction.moduleAssetId
      === MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

    try {
      signedTransaction = transactions.signMultiSignatureTransaction(
        moduleAssetSchemas[transaction.moduleAssetId],
        transactionObject,
        Buffer.from(networkIdentifier, 'hex'),
        account.passphrase,
        keys,
        includeSender,
      );

      // remove unnecessary signatures
      if (isFullySigned) {
        const emptySignatureIndices = findNonEmptySignatureIndices(transaction.signatures);
        emptySignatureIndices.forEach(index => {
          signedTransaction.signatures[index] = Buffer.from('');
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      err = e;
    }

    return [signedTransaction, err];
  };

  const onSignClick = () => {
    const [signedTx, err] = signTransaction();
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
