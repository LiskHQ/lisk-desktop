/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import withData from '../../../../utils/withData';
import MonitorAccounts from './accounts';
import liskServiceApi from '../../../../utils/api/lsk/liskService';
import NotAvailable from '../notAvailable';

const ComposedAccounts = compose(
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
  withTranslation(),
)(MonitorAccounts);

const AccountsMonitor = () => {
  const network = useSelector(state => state.network);

  return (
    liskServiceApi.getLiskServiceUrl(network) === null
      ? <NotAvailable />
      : <ComposedAccounts />
  );
};

export default AccountsMonitor;
