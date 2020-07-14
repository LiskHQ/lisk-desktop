import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import withResizeValues from '../../../../utils/withResizeValues';
import Table from '../../../toolbox/table';
import styles from './accounts.css';
import header from './tableHeader';
import AccountRow from './accountRow';
import withData from '../../../../utils/withData';
import liskServiceApi from '../../../../utils/api/lsk/liskService';

export const AccountsPure = ({
  accounts,
  networkStatus,
  t,
}) => {
  /* istanbul ignore next */
  const handleLoadMore = () => {
    accounts.loadData({ offset: accounts.data.length });
  };
  const supply = networkStatus.data.supply;
  const canLoadMore = accounts.meta ? accounts.meta.count === 30 : false;

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
        apiUtil: liskServiceApi.getTopAccounts,
        defaultData: [],
        autoload: true,
        transformResponse: (response, accounts, urlSearchParams) => (
          urlSearchParams.offset
            ? [...accounts, ...response.data]
            : response.data
        ),
      },
      networkStatus: {
        apiUtil: liskServiceApi.getNetworkStatus,
        defaultData: {},
        autoload: true,
        transformResponse: response => response,
      },
    },
  ),
  withResizeValues,
  withTranslation(),
)(AccountsPure);
