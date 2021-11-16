import React, { useEffect } from 'react';

import { routes } from '@constants';
import { isEmpty } from '@utils/helpers';
import Box from '@toolbox/box';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton } from '@toolbox/buttons';
import { TransactionResult, getBroadcastStatus } from '@shared/transactionResult';
import ToggleIcon from '../toggleIcon';
import statusMessages from './statusMessages';
import styles from './styles.css';

const Result = ({
  t, history, transactions, statusInfo,
  resetTransactionResult, transactionBroadcasted,
}) => {
  const closeModal = () => {
    history.push(routes.wallet.path);
  };

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction) && !transactions.txSignatureError) {
      /**
       * Broadcast the successfully signed tx
       */
      transactionBroadcasted(transactions.signedTransaction);
    }

    return resetTransactionResult;
  }, []);

  const status = getBroadcastStatus(transactions, false); // @todo handle HW errors by #3661
  const template = statusMessages(t, statusInfo)[status.code];

  return (
    <section>
      <Box className={styles.container}>
        <header className={styles.header}>
          <ToggleIcon />
          <span className={styles.title}>{t('Voting confirmation')}</span>
        </header>
        <TransactionResult
          t={t}
          title={template.title}
          illustration="vote"
          status={status}
          message={template.message}
        />
        <BoxFooter direction="horizontal" className={styles.footer}>
          <PrimaryButton className="dialog-close-button" size="l" onClick={closeModal}>
            {t('Back to wallet')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Result;
