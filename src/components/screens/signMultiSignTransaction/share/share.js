import React, { useEffect, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { useDispatch } from 'react-redux';

import { downloadJSON, transactionToJSON } from '@utils/transaction';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import TransactionResult from '@shared/transactionResult';
import { transactionBroadcasted } from '@actions';

import ProgressBar from '../progressBar';
import { CopyAndSendFooter, CopyFooter } from './footer';
import { isTransactionFullySigned } from '../helpers';
import styles from './styles.css';

const getTemplate = (t, status, errorMessage) => {
  switch (status) {
    case 'SIGN_SUCCEEDED':
      return {
        illustration: 'registerMultisignatureSuccess',
        message: t('You have successfully signed the transaction. You can download or copy the transaction and send it back to the initiator.'),
      };
    case 'SIGN_FAILED':
      return {
        illustration: 'registerMultisignatureError',
        message: t('Error signing the transaction: {{errorMessage}}', { errorMessage }),
      };
    case 'BROADCASTED':
      return {
        illustration: 'transactionSuccess',
        message: t("The transaction was broadcasted to the network. It will appear in sender account's wallet after confirmation."),
      };
    case 'BROADCAST_FAILED':
      return {
        illustration: 'transactionError',
        message: t('Error broadcasting the transaction: {{errorMessage}}', { errorMessage }),
      };
    default:
      return {
        illustration: 'registerMultisignatureSuccess',
        message: t('Pending transaction status.'),
      };
  }
};

// eslint-disable-next-line max-statements
const Share = ({
  t, transaction, senderAccount, error,
  broadcastedTransactionsError,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(error ? 'SIGN_FAILED' : 'SIGN_SUCCEEDED');
  const [errorMessage, setErrorMessage] = useState(error);
  const isFullySigned = isTransactionFullySigned(senderAccount, transaction);
  const success = !error && transaction;
  const template = getTemplate(t, status, errorMessage);

  const [copied, setCopied] = useState(false);

  const onDownload = () => {
    const id = transaction.id.toString('hex');
    downloadJSON(transaction, `tx-${id}`);
  };

  const onCopy = () => {
    copyToClipboard(transactionToJSON(transaction));
    setCopied(true);
  };

  const onSend = () => {
    dispatch(transactionBroadcasted(transaction));
    setStatus('BROADCASTED');
  };

  useEffect(() => {
    if (broadcastedTransactionsError.length) {
      setStatus('BROADCAST_FAILED');
      setErrorMessage(
        broadcastedTransactionsError[broadcastedTransactionsError.length - 1].error.message,
      );
    }
  }, [broadcastedTransactionsError]);

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>{t('Provide a signature for a transaction which belongs to a multisignature account.')}</p>
        </header>
        <BoxContent>
          <ProgressBar current={4} />
          <TransactionResult
            t={t}
            illustration={template.illustration}
            success={success}
            message={template.message}
            className={styles.content}
            error={error}
          />
        </BoxContent>
        {success && !isFullySigned && (
          <CopyFooter
            t={t}
            onCopy={onCopy}
            copied={copied}
            onDownload={onDownload}
          />
        )}
        {success && isFullySigned && (
          <CopyAndSendFooter
            t={t}
            onCopy={onCopy}
            copied={copied}
            onSend={onSend}
            onDownload={onDownload}
          />
        )}
      </Box>
    </section>
  );
};

export default Share;
