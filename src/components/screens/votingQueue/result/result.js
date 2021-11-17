import React from 'react';

import { routes } from '@constants';
import Box from '@toolbox/box';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton } from '@toolbox/buttons';
import TransactionResult, { getBroadcastStatus } from '@shared/transactionResult';
import ToggleIcon from '../toggleIcon';
import statusMessages from './statusMessages';
import styles from './styles.css';

const Result = ({
  t, history, transactions, statusInfo,
}) => {
  const closeModal = () => {
    history.push(routes.wallet.path);
  };

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
