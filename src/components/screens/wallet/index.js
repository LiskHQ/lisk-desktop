/* istanbul ignore file */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Overview from './overview';
import Header from './header';
import Transactions from './transactions';
import { getTransactions } from '../../../actions/transactions';
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


const Wallet = ({ t, match }) => {
  const dispatch = useDispatch();
  const account = useSelector(state => state.account);
  const activeToken = useSelector(state => state.settings.token.active);
  const bookmarks = useSelector(state => state.bookmarks);
  const { discreetMode } = useSelector(state => state.settings);
  const { confirmed, pending } = useSelector(state => state.transactions);
  const transactions = {
    data: confirmed,
    loadData: (params) => {
      const modified = transformParams(params);
      modified.address = account.info[activeToken].address;
      dispatch(getTransactions(modified));
    },
    isLoading: false,
    error: false,
  };

  useEffect(() => {
    if (!confirmed.length) {
      transactions.loadData({
        offset: 0,
        limit: 30,
        direction: txFilters.all,
      });
    }
  }, []);

  return (
    <section>
      <Header
        bookmarks={bookmarks}
        address={account.info[activeToken].address}
        match={match}
        publicKey={account.info[activeToken].publicKey || ''}
        activeToken={activeToken}
        t={t}
      />
      <Overview
        t={t}
        address={account.info[activeToken].address}
        balance={account.info[activeToken].balance || 0}
        activeToken={activeToken}
        transactions={confirmed}
        discreetMode={discreetMode}
      />
      <Transactions
        pending={pending}
        transactions={transactions}
        host={account.info[activeToken].address}
        activeToken={activeToken}
        t={t}
      />
    </section>
  );
};

export default withTranslation()(Wallet);
