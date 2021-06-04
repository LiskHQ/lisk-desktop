import React, { useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';
import { useDispatch } from 'react-redux';

import { downloadJSON, transactionToJSON } from '@utils/transaction';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import TransactionResult from '@shared/transactionResult';
import { transactionBroadcasted } from '@actions';

import ProgressBar from '../progressBar';
import { CopyAndSendFooter, CopyFooter } from './footer';
import { showSendButton } from '../helpers';
import styles from './styles.css';

const getTemplate = (t, error, isBroadcasted) => {
  if (!error) {
    if (isBroadcasted) {
      return {
        illustration: 'registerMultisignatureSuccess',
        message: t('You have successfully sent the transaction. You can download or copy the transaction and send it back to the initiator.'),
      };
    }
    return {
      illustration: 'registerMultisignatureSuccess',
      message: t('You have successfully signed the transaction. You can download or copy the transaction and send it back to the initiator.'),
    };
  }

  return {
    illustration: 'registerMultisignatureError',
    message: t(`Error: ${error}`),
  };
};

const Share = ({
  t, transaction, senderAccount, error, isBroadcasted = false,
}) => {
  const dispatch = useDispatch();
  const isComplete = showSendButton(senderAccount, transaction);
  const success = !error && transaction;
  const template = getTemplate(t, error, isBroadcasted);

  const [copied, setCopied] = useState(false);

  const onDownload = () => {
    downloadJSON(transaction, `tx-${transaction.id}`);
  };

  const onCopy = () => {
    copyToClipboard(transactionToJSON(transaction));
    setCopied(true);
  };

  const onSend = () => {
    dispatch(transactionBroadcasted(transaction));
  };

  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Register multisignature account')}</h1>
          <p>{t('If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.')}</p>
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
        {success && !isComplete && (
          <CopyFooter
            t={t}
            onCopy={onCopy}
            copied={copied}
            onDownload={onDownload}
          />
        )}
        {success && isComplete && (
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
