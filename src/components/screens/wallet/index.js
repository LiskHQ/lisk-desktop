/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { parseSearchParams, addSearchParamsToUrl } from '../../../utils/searchParams';
import Overview from './overview';
import { getTransactions } from '../../../actions/transactions';
import txFilters from '../../../constants/transactionFilters';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import DelegateTab from './delegateProfile';
import VotesTab from './votes';
import Transactions from './transactions';
import { isEmpty } from '../../../utils/helpers';
import actionTypes from '../../../constants/actions';

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

/*
 * @todo This component should not load transactions.
 * We should move this logic to the tx tab component.
 * Since we will remove the tabs with the next release
 * We can move this logic then.
 */
// eslint-disable-next-line max-statements
const Wallet = ({ t, history }) => {
  const dispatch = useDispatch();
  const account = useSelector(state => state.account);
  const activeToken = useSelector(state => state.settings.token.active);
  const { discreetMode } = useSelector(state => state.settings);
  const isLoading = useSelector(
    state => state.loading.indexOf(actionTypes.getTransactions) > -1,
  );
  const { confirmed, pending, count } = useSelector(state => state.transactions);
  const transactions = {
    data: confirmed,
    loadData: (params) => {
      const modified = transformParams(params);
      modified.address = account.info[activeToken].address;
      dispatch(getTransactions(modified));
    },
    isLoading,
    error: false,
    meta: {
      count,
    },
  };

  useEffect(() => {
    if (!confirmed.length && account.info && !isEmpty(account.info)) {
      transactions.loadData({
        offset: 0,
        limit: 30,
        direction: txFilters.all,
      });
    }
  }, [account.info]);

  useEffect(() => {
    const params = parseSearchParams(history.location.search);
    if (params.recipient !== undefined) {
      addSearchParamsToUrl(history, { modal: 'send' });
    }
  }, []);


  if (!account || !account.info || isEmpty(account.info)) return (<div />);
  return (
    <section>
      <Overview
        isWalletRoute
        activeToken={activeToken}
        transactions={transactions.data}
        discreetMode={discreetMode}
        account={account.info[activeToken]}
        hwInfo={account.hwInfo}
        t={t}
      />
      <TabsContainer>
        <Transactions
          transactions={transactions}
          pending={pending || []}
          host={account.info[activeToken].address}
          activeToken={activeToken}
          discreetMode={discreetMode}
          tabName={t('Transactions')}
          t={t}
        />
        {activeToken !== 'BTC' ? (
          <VotesTab
            history={history}
            address={account.info[activeToken].address}
            tabName={t('Votes')}
          />
        ) : null}
        {account.info[activeToken].isDelegate
          ? (
            <DelegateTab
              tabClassName="delegate-statistics"
              tabName={t('Delegate profile')}
              address={account.info[activeToken].address}
            />
          )
          : null}
      </TabsContainer>
    </section>
  );
};

export default withTranslation()(Wallet);
