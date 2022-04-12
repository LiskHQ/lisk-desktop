import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import withData from '@common/utilities/withData';
import { getAccounts } from '@wallet/utilities/api';
import { getNetworkStatus } from '@network/utilities/api';
import { DEFAULT_LIMIT } from '@views/configuration';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import WalletListRepeater from '@wallet/list/repeater';
// import WalletListManager from '@wallet/list/manager';
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

/* export default compose(
  WalletListManager(),
  withTranslation(),
)(WalletsMonitor); */

export default compose(
  withData({
    wallets: {
      apiUtil: (network, params) => getAccounts({
        network,
        params: {
          ...params,
          limit: DEFAULT_LIMIT,
          offset: params.offset || 0,
          sort: 'balance:desc',
        },
      }),
      defaultData: [],
      autoload: true,
      transformResponse: (response, accounts, urlSearchParams) => (
        urlSearchParams.offset
          ? [...accounts, ...response.data]
          : response.data
      ),
    },
    networkStatus: {
      apiUtil: network => getNetworkStatus({ network }),
      defaultData: {},
      autoload: true,
      transformResponse: response => response,
    },
  }),
  withTranslation(),
)(WalletsMonitor);
