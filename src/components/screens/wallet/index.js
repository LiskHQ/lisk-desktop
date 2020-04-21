/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../utils/withData';
import Overview from './overview';
import Transactions from './transactions';
import { getAccount } from '../../../utils/api/account';
import { getTransactions } from '../../../utils/api/transactions';
import txFilters from '../../../constants/transactionFilters';

const Wallet = ({ transactions, t }) => {
  const account = useSelector(state => state.account);
  const activeToken = useSelector(state => state.settings.token.active);
  const { discreetMode } = useSelector(state => state.settings);
  console.log('transactions', transactions);

  return (
    <section>
      <Overview
        t={t}
        account={account.info[activeToken]}
        activeToken={activeToken}
        transactions={transactions.data}
        discreetMode={discreetMode}
      />
      <Transactions
        transactions={transactions}
        t={t}
      />
    </section>
  );
};

const apis = {
  detailAccount: {
    apiUtil: (liskAPIClient, params) => getAccount({ liskAPIClient, ...params }),
    autoload: true,
    getApiParams: state => ({
      token: state.settings.token.active,
      address: state.account.info[state.settings.token.active].address,
      networkConfig: state.network,
    }),
  },
  transactions: {
    apiUtil: (apiClient, params) => getTransactions(params),
    autoload: true,
    getApiParams: state => ({
      token: state.settings.token.active,
      address: state.account.info[state.settings.token.active].address,
      networkConfig: state.network,
    }),
    defaultData: [],
    defaultUrlSearchParams: {
      filters: {
        direction: txFilters.all,
      },
    },
    transformResponse: (response, oldData, urlSearchParams) => (
      urlSearchParams.offset
        ? [...oldData, ...response.data]
        : response.data
    ),
  },
};

const ComposedWallet = compose(
  withData(apis),
  withTranslation(),
)(Wallet);

export default ComposedWallet;
