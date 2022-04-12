import React from 'react';

import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import WalletListRepeater from '@wallet/list/repeater';
import styles from './wallets.css';

export const WalletsMonitor = ({ wallets, t, ...restProps}) => (
  <Box main isLoading={wallets.isLoading} className="accounts-box">
    <BoxHeader>
      <h1>{t('All accounts')}</h1>
    </BoxHeader>
    <BoxContent className={styles.content}>
      <WalletListRepeater wallets={wallets} t={t} {...restProps} />
    </BoxContent>
  </Box>
);

export default WalletsMonitor;
