import React from 'react';

import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import WalletList from '@wallet/components/walletList';
import styles from './accounts.css';

const Accounts = ({ wallets, t, ...restProps }) => (
  <Box main isLoading={wallets.isLoading} className="accounts-box">
    <BoxHeader>
      <h1>{t('All accounts')}</h1>
    </BoxHeader>
    <BoxContent className={styles.content}>
      <WalletList wallets={wallets} t={t} {...restProps} />
    </BoxContent>
  </Box>
);

export default Accounts;
