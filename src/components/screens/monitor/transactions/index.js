/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import withData from '../../../../utils/withData';
import Transactions from './transactions';
import liskServiceApi from '../../../../utils/api/lsk/liskService';
import NotAvailable from '../notAvailable';

const ComposedTransactions = compose(
  withData({
    transactions: {
      apiUtil: liskServiceApi.getTransactions,
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response
      ),
    },
  }),
  withTranslation(),
)(Transactions);

const TransactionsMonitor = () => {
  const network = useSelector(state => state.network);

  return (
    liskServiceApi.getLiskServiceUrl(network) === null
      ? <NotAvailable />
      : <ComposedTransactions />
  );
};

export default TransactionsMonitor;
