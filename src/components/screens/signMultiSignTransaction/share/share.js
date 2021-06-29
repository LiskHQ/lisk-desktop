import React, { useEffect, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { useDispatch } from 'react-redux';

import { downloadJSON, transactionToJSON } from '@utils/transaction';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import { TransactionResult } from '@shared/transactionResult';
import { transactionBroadcasted } from '@actions';

import ProgressBar from '../progressBar';
import { CopyAndSendFooter, CopyFooter } from './footer';
import { isTransactionFullySigned } from '../helpers';
import statusMessages from './statusMessages';
import styles from './styles.css';

// eslint-disable-next-line max-statements
const Share = ({
  t, transaction, senderAccount, error,
  txBroadcastError, history,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('PENDING');
  const [errorMessage, setErrorMessage] = useState(error);
  const isFullySigned = isTransactionFullySigned(senderAccount, transaction);
  const template = statusMessages(t, errorMessage)[status];

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
    if (txBroadcastError) {
      setStatus('BROADCAST_FAILED');
      setErrorMessage(
        txBroadcastError.error.message,
      );
    }
  }, [txBroadcastError]);

  useEffect(() => {
    if (!error && transaction) {
      useState('SIGN_SUCCEEDED');
    } else if (error && transaction) {
      useState('SIGN_FAILED');
    }
  }, [transaction, error]);

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
            message={template.message}
            className={styles.content}
            status={status}
          />
        </BoxContent>
        {status === 'SIGN_SUCCEEDED' && !isFullySigned && (
          <CopyFooter
            t={t}
            onCopy={onCopy}
            copied={copied}
            onDownload={onDownload}
          />
        )}
        {status === 'SIGN_SUCCEEDED' && isFullySigned && (
          <CopyAndSendFooter
            t={t}
            onCopy={onCopy}
            copied={copied}
            onSend={onSend}
            onDownload={onDownload}
            history={history}
          />
        )}
      </Box>
    </section>
  );
};

export default Share;
