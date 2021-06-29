import React, { useEffect } from 'react';

import { routes } from '@constants';
import Box from '@toolbox/box';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton } from '@toolbox/buttons';
import { TransactionResult, getBroadcastStatus } from '@shared/transactionResult';
import ToggleIcon from '../toggleIcon';
import statusMessages from './statusMessages';
import styles from './styles.css';

const Result = ({
  t, history, locked, unlockable, error, transactionBroadcasted, transactions,
}) => {
  const closeModal = () => {
    history.push(routes.wallet.path);
  };

  useEffect(() => {
    if (!error) {
      const tx = transactions.signedTransaction;
      transactionBroadcasted(tx);
    }
  }, []);

  const status = getBroadcastStatus(transactions, false);
  const template = statusMessages(t, locked, unlockable)[status.code];

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
