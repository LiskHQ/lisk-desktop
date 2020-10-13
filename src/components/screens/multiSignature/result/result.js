import React from 'react';

import { removeSearchParamsFromUrl } from '../../../../utils/searchParams';
import Box from '../../../toolbox/box';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import TransactionResult from '../../../shared/transactionResult';

import styles from './styles.css';

const Result = ({
  t, history, error,
}) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal']);
  };

  return (
    <section>
      <Box className={styles.container}>
        <header className={styles.header}>
          <span className={styles.title}>{t('Register multisignature account')}</span>
        </header>
        <TransactionResult
          t={t}
          title={t('Votes have been submitted')}
          illustration={error ? 'transactionError' : 'votingSuccess'}
          message=""
          success={!error}
        />
        <BoxFooter direction="horizontal" className={styles.footer}>
          <PrimaryButton size="l" onClick={closeModal}>
            {t('Download')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Result;
