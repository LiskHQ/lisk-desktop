/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../utils/withData';
import Overview from './overview';
import Header from './header';
import Transactions from './transactions';
import { getAccount } from '../../../utils/api/account';
import { getTransactions } from '../../../utils/api/transactions';
import txFilters from '../../../constants/transactionFilters';

const filterNames = ['message', 'dateFrom', 'dateTo', 'amountFrom', 'amountTo', 'direction'];
/**
 * The implementation of this API endpoint and the ones implemented for Lisk Service
 * are different. this transformer adapts params temporarily before all the APIs
 * are unified. then we can remove this.
 *
 * @param {Object} params - All params and filters provided by WithFilters HOC
 */
const transformParams = params => Object.keys(params)
  .reduce((acc, item) => {
    if (filterNames.includes(item)) acc.filters[item] = params[item];
    else acc[item] = params[item];

    if (typeof params.tab === 'number') acc.filters.direction = params.tab;
    return acc;
  }, { filters: {} });


const Wallet = ({ transactions, t, match }) => {
  const account = useSelector(state => state.account);
  const activeToken = useSelector(state => state.settings.token.active);
  const bookmarks = useSelector(state => state.bookmarks);
  const { discreetMode } = useSelector(state => state.settings);

  return (
    <section>
      <Header
        bookmarks={bookmarks}
        address={account.info[activeToken].address}
        match={match}
        account={account}
        activeToken={activeToken}
        t={t}
      />
      <Overview
        t={t}
        account={account.info[activeToken]}
        activeToken={activeToken}
        transactions={transactions.data}
        discreetMode={discreetMode}
      />
      <Transactions
        transactions={transactions}
        activeToken={activeToken}
        host={account.info[activeToken].address}
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
    apiUtil: (apiClient, params) => getTransactions(transformParams(params)),
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
