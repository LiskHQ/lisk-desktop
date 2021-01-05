/* istanbul ignore file */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import withData from '../../../utils/withData';
import Overview from './overview';
import { getAccount } from '../../../utils/api/account';
import { getTransactions } from '../../../utils/api/transaction';
import txFilters from '../../../constants/transactionFilters';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import DelegateTab from './delegateProfile';
import VotesTab from './votes';
import Transactions from './transactions';
import { selectSearchParamValue } from '../../../utils/searchParams';
import { toRawLsk } from '../../../utils/lsk';


/**
 * The implementation of this API endpoint and the ones implemented for Lisk Service
 * are different. this transformer adapts params temporarily before all the APIs
 * are unified. then we can remove this.
 *
 * @param {Object} params - All params and filters provided by WithFilters HOC
 */
const transformParams = params => Object.keys(params)
  .reduce((acc, item) => {
    if (item === 'amountFrom' || item === 'amountTo') {
      acc.filters[item] = toRawLsk(params[item]);
    } else if (item === 'dateFrom' || item === 'dateTo') {
      acc.filters[item] = params[item];
    } else {
      acc[item] = params[item];
    }

    return acc;
  }, { filters: {} });


const Wallet = ({
  transactions, t, account, history,
}) => {
  const activeToken = useSelector(state => state.settings.token.active);
  const { discreetMode } = useSelector(state => state.settings);

  useEffect(() => {
    account.loadData();
    transactions.loadData();
  }, [history.location.search]);

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
          host={selectSearchParamValue(history.location.search, 'address')}
          activeToken={activeToken}
          discreetMode={discreetMode}
          tabName={t('Transactions')}
          tabId="transactions"
          t={t}
        />
        {activeToken !== 'BTC' ? (
          <VotesTab
            history={history}
            address={selectSearchParamValue(history.location.search, 'address')}
            tabName={t('Voting')}
            tabId="voting"
          />
        ) : null}
        {account.data && account.data.isDelegate
          ? (
            <DelegateTab
              tabClassName="delegate-statistics"
              tabName={t('Delegate profile')}
              tabId="delegateProfile"
              address={selectSearchParamValue(history.location.search, 'address')}
            />
          )
          : null}
      </TabsContainer>
    </section>
  );
};

const apis = {
  account: {
    apiUtil: (network, { token, ...params }) => getAccount({ network, params }, token),
    defaultData: {},
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      address: selectSearchParamValue(props.history.location.search, 'address'),
      network: state.network,
    }),
    transformResponse: response => response,
  },
  transactions: {
    apiUtil: (network, { token, ...params }) =>
      getTransactions({ network, params: transformParams(params) }, token),
    getApiParams: (state, props) => ({
      token: state.settings.token.active,
      address: selectSearchParamValue(props.history.location.search, 'address'),
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
