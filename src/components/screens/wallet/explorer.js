/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../utils/withData';
import Header from './header';
import { getAccount } from '../../../utils/api/account';
import { getTransactions } from '../../../utils/api/transactions';
import txFilters from '../../../constants/transactionFilters';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import DelegateTab from '../../shared/delegate';
import VotesTab from '../../shared/votes';
import WalletTab from './walletTab';


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


const Wallet = ({
  transactions, t, match, account, history,
}) => {
  const activeToken = useSelector(state => state.settings.token.active);
  const bookmarks = useSelector(state => state.bookmarks);
  const { discreetMode } = useSelector(state => state.settings);

  return (
    <section>
      <Header
        bookmarks={bookmarks}
        address={match.params.address}
        match={match}
        publicKey={account.data ? account.data.publicKey : ''}
        activeToken={activeToken}
        t={t}
      />
      <TabsContainer>
        <WalletTab
          t={t}
          host={match.params.address}
          activeToken={activeToken}
          transactions={transactions}
          discreetMode={discreetMode}
          account={account.data}
          tabName={t('Wallet')}
        />
        {activeToken !== 'BTC' ? (
          <VotesTab
            history={history}
            address={match.params.address}
            tabName={t('Votes')}
          />
        ) : null}
        {account.data.delegate
          ? (
            <DelegateTab
              tabClassName="delegate-statistics"
              tabName={t('Delegate')}
              account={match.params.address}
            />
          )
          : null}
      </TabsContainer>
    </section>
  );
};

const apis = {
  account: {
    apiUtil: (liskAPIClient, params) => getAccount({ liskAPIClient, ...params }),
    autoload: true,
    defaultData: {},
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      address: props.match.params.address,
      networkConfig: state.network,
    }),
    transformResponse: response => response,
  },
  transactions: {
    apiUtil: (apiClient, params) => getTransactions(transformParams(params)),
    autoload: true,
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      address: props.match.params.address,
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
