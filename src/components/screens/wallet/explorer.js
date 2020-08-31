/* istanbul ignore file */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../utils/withData';
import Overview from './overview';
import { getAccount } from '../../../utils/api/account';
import { getTransactions } from '../../../utils/api/transactions';
import txFilters from '../../../constants/transactionFilters';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import DelegateTab from './delegateProfile';
import VotesTab from './votes';
import Transactions from './transactions';


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
  const { discreetMode } = useSelector(state => state.settings);

  useEffect(() => {
    account.loadData();
    transactions.loadData();
  }, [match.url]);

  return (
    <section>
      <Overview
        isWalletRoute={false}
        activeToken={activeToken}
        transactions={transactions.data}
        discreetMode={discreetMode}
        account={account.data}
        t={t}
      />
      <TabsContainer>
        <Transactions
          transactions={transactions}
          pending={[]}
          host={match.params.address}
          activeToken={activeToken}
          discreetMode={discreetMode}
          tabName={t('Transactions')}
          t={t}
        />
        {activeToken !== 'BTC' ? (
          <VotesTab
            history={history}
            address={match.params.address}
            tabName={t('Voting')}
          />
        ) : null}
        {account.data && account.data.isDelegate
          ? (
            <DelegateTab
              tabClassName="delegate-statistics"
              tabName={t('Delegate profile')}
              address={match.params.address}
            />
          )
          : null}
      </TabsContainer>
    </section>
  );
};

const apis = {
  account: {
    apiUtil: (network, params) => getAccount({ network, ...params }),
    defaultData: {},
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      address: props.match.params.address,
      network: state.network,
    }),
    transformResponse: response => response,
  },
  transactions: {
    apiUtil: (network, params) => getTransactions(transformParams(params)),
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      address: props.match.params.address,
      network: state.network,
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
