/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import withData from '../../../../utils/withData';
import MonitorAccounts from './accounts';
import liskServiceApi from '../../../../utils/api/lsk/liskService';
import NotAvailable from '../notAvailable';

const BlocksMonitor = () => {
  const network = useSelector(state => state.network);

  return (
    network.name === 'Custom Node'
      ? <NotAvailable />
      : (compose(
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
      )(MonitorAccounts))
  );
};

export default BlocksMonitor;
