import React from 'react';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import {
  statusMessages,
  getTransactionStatus,
} from '@transaction/configuration/statusConfig';

import ProgressBar from '../signMultisigView/progressBar';
import styles from './styles.css';

const Status = ({ sender, transactions, t }) => {
  const status = getTransactionStatus(
    sender.data,
    transactions,
    sender.data?.summary.publicKey,
  );
  const template = statusMessages(t)[status.code];

  return (
    <section>
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
          <ProgressBar current={4} />
          <TxBroadcaster
            message={template.message}
            title={template.title}
            illustration="signMultisignature"
            className={styles.content}
            status={status}
          />
        </BoxContent>
      </Box>
    </section>
  );
};

export default Status;
