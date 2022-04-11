import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import WalletListRepeater from '@wallet/list/repeater';
import WalletListManager from '@wallet/list/manager';
import styles from './wallets.css';

export const WalletsMonitor = ({ wallets, ...restProps}) => (
  <Box main isLoading={wallets.isLoading} className="accounts-box">
    <BoxHeader>
      <h1>{t('All accounts')}</h1>
    </BoxHeader>
    <BoxContent className={styles.content}>
      <WalletListRepeater {...restProps} />
    </BoxContent>
  </Box>
);

export default compose(
  WalletListManager(),
  withTranslation(),
)(WalletsMonitor);
