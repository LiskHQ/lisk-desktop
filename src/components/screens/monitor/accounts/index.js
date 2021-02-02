import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Table from '../../../toolbox/table';
import styles from './accounts.css';
import header from './tableHeader';
import AccountRow from './accountRow';
import withData from '../../../../utils/withData';
import { getAccounts } from '../../../../utils/api/account';
import { getNetworkStatus } from '../../../../utils/api/network';

export const AccountsPure = ({
  accounts,
  networkStatus,
  t,
}) => {
  console.log(accounts.meta);
  /* istanbul ignore next */
  const handleLoadMore = () => {
    accounts.loadData({ offset: accounts.meta.count + accounts.meta.offset });
  };
  const supply = networkStatus.data.supply;
  const canLoadMore = accounts.meta ? accounts.data.length < accounts.meta.total : false;

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
            limit: params.limit || 30,
            offset: params.offset || 0,
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
