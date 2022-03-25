import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import withData from '@common/utilities/withData';
import { getAccounts } from '@wallet/utilities/api';
import { getNetworkStatus } from '@network/api';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import Table from '@basics/table';
import { DEFAULT_LIMIT } from '@common/configuration';
import styles from './accounts.css';
import header from './tableHeader';
import AccountRow from './accountRow';

export const AccountsPure = ({
  accounts,
  networkStatus,
  t,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    accounts.loadData({ offset: accounts.meta.count + accounts.meta.offset });
  };
  const supply = networkStatus.data.supply;
  const canLoadMore = accounts.meta ? accounts.meta.count === DEFAULT_LIMIT : false;

  return (
    <Box main isLoading={accounts.isLoading} className="accounts-box">
      <BoxHeader>
        <h1>{t('All accounts')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <Table
          data={accounts.data}
          isLoading={accounts.isLoading}
          row={AccountRow}
          loadData={handleLoadMore}
          header={header(t)}
          additionalRowProps={{ supply }}
          error={accounts.error}
          canLoadMore={canLoadMore}
        />
      </BoxContent>
    </Box>
  );
};

export default compose(
  withData(
    {
      accounts: {
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
    },
  ),
  withTranslation(),
)(AccountsPure);
