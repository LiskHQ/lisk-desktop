import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import WalletList from '@wallet/components/walletList';
import styles from './accounts.css';

const Accounts = () => {
  const { t } = useTranslation();
  return (
    <Box main className="accounts-box">
      <BoxHeader>
        <h1>{t('All accounts')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <WalletList />
      </BoxContent>
    </Box>
  );
};

export default Accounts;
