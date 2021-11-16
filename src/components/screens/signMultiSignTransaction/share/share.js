import React, { useEffect, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';

import { downloadJSON, transactionToJSON } from '@utils/transaction';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import TransactionResult from '@shared/transactionResult';

import ProgressBar from '../progressBar';
import { CopyAndSendFooter, CopyFooter } from './footer';
import { isTransactionFullySigned } from '../helpers';
import statusMessages from './statusMessages';
import styles from './styles.css';

// eslint-disable-next-line max-statements
const Share = ({
  t, transaction, senderAccount,
  txBroadcastError, history, error,
  transactionBroadcasted, prevStep,
}) => {
  const [status, setStatus] = useState('PENDING');
  const [copied, setCopied] = useState(false);
  const isFullySigned = isTransactionFullySigned(senderAccount, transaction);
  const template = statusMessages(t, txBroadcastError?.error?.message || error)[status];

  const onDownload = () => {
    const id = transaction.id.toString('hex');
    downloadJSON(transaction, `tx-${id}`);
  };

  const onCopy = () => {
    copyToClipboard(transactionToJSON(transaction));
    setCopied(true);
  };

  const onSend = () => {
    transactionBroadcasted(transaction);
    setStatus('BROADCASTED');
  };

  useEffect(() => {
    if (txBroadcastError) {
      setStatus('BROADCAST_FAILED');
    }
  }, [txBroadcastError]);

  useEffect(() => {
    if (!error && transaction) {
      setStatus('SIGN_SUCCEEDED');
    } else if (error && transaction) {
      setStatus('SIGN_FAILED');
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
            message={template}
            illustration="signMultisignature"
            className={styles.content}
            status={{ code: status, message: error }}
          />
        </BoxContent>
        {status === 'SIGN_SUCCEEDED' && !isFullySigned && (
          <CopyFooter
            t={t}
            onCopy={onCopy}
            copied={copied}
            onDownload={onDownload}
            prevStep={prevStep}
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
            prevStep={prevStep}
          />
        )}
      </Box>
    </section>
  );
};

export default Share;
